import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Entry from "@/models/Entry";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const entry = await Entry.findOne({
            _id: id,
            userId: (session.user as any).id,
        });

        if (!entry) {
            return NextResponse.json({ message: "Entry not found" }, { status: 404 });
        }

        return NextResponse.json(entry);
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { title, content, blocks, language } = await req.json();

        await dbConnect();

        const updateData: any = {};
        if (title) updateData.title = title;
        if (content) updateData.content = content;
        if (blocks) updateData.blocks = blocks;
        if (language) updateData.language = language;

        const entry = await Entry.findOneAndUpdate(
            { _id: id, userId: (session.user as any).id },
            updateData,
            { new: true }
        );

        if (!entry) {
            return NextResponse.json({ message: "Entry not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Entry updated successfully" });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const entry = await Entry.findOneAndDelete({
            _id: id,
            userId: (session.user as any).id,
        });

        if (!entry) {
            return NextResponse.json({ message: "Entry not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Entry deleted successfully" });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
