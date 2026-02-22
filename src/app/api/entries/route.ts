import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Entry from "@/models/Entry";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const entries = await Entry.find({ userId: (session.user as any).id })
            .select('title content language mood date')
            .sort({ date: -1 });

        // Return plain data
        const processedEntries = entries.map(entry => {
            const entryObj = entry.toObject();

            // Truncate content for list preview, but skip decryption
            if (entryObj.content && entryObj.content.length > 150) {
                entryObj.content = entryObj.content.substring(0, 150) + "...";
            }

            // Remove blocks for list view performance
            delete entryObj.blocks;

            return entryObj;
        });

        return NextResponse.json(processedEntries);
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { title, content, blocks, language, mood } = await req.json();

        if (!title || !content) {
            return NextResponse.json(
                { message: "Title and content are required" },
                { status: 400 }
            );
        }

        await dbConnect();

        const entry = await Entry.create({
            userId: (session.user as any).id,
            title,
            content,
            blocks: blocks || [{ type: 'text', content }],
            language: language || "en",
            mood: mood || "neutral",
            date: new Date(),
        });

        return NextResponse.json(entry, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
