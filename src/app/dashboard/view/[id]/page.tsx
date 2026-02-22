"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Heart, Trash2, Book, Sparkles, Shield, Bookmark, Calendar, Pencil } from "lucide-react";

interface Entry {
    _id: string;
    title: string;
    content: string;
    blocks?: Array<{ type: 'text' | 'image', content: string }>;
    language: string;
    date: string;
}

export default function ViewEntry() {
    const router = useRouter();
    const params = useParams() as { id: string };
    const [entry, setEntry] = useState<Entry | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEntry();
    }, [params.id]);

    const fetchEntry = async () => {
        try {
            const res = await fetch(`/api/entries/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setEntry(data);
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            console.error("Failed to fetch entry");
        } finally {
            setLoading(false);
        }
    };

    const deleteEntry = async () => {
        if (!confirm("Are you sure you want to permanently delete this memory?")) return;

        try {
            const res = await fetch(`/api/entries/${params.id}`, { method: "DELETE" });
            if (res.ok) {
                router.push("/dashboard");
            }
        } catch (err) {
            console.error("Failed to delete entry");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-midnight flex flex-col items-center justify-center font-sans tracking-tight">
                <div className="w-12 h-12 border-2 border-white/5 border-t-white/20 rounded-full animate-spin mb-10"></div>
                <div className="text-text-dim text-[10px] uppercase tracking-[0.6em] font-black animate-pulse">Illuminating Reflection...</div>
            </div>
        );
    }

    if (!entry) return null;

    return (
        <div className="min-h-screen bg-midnight text-text-main p-6 md:p-16 font-sans relative overflow-hidden flex flex-col items-center selection:bg-white/10">
            {/* Massive atmospheric spotlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] spotlight-glow pointer-events-none -z-10 opacity-70"></div>

            <div className="max-w-4xl w-full relative z-10">
                <header className="flex items-center justify-between mb-16 md:mb-32 pb-8 border-b border-white/[0.03]">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="group flex items-center gap-5 text-text-dim hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.5em]"
                    >
                        <ChevronRight className="rotate-180" size={16} />
                        <span className="group-hover:translate-x-1 transition-transform">Back to Menu</span>
                    </button>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push(`/dashboard/edit/${params.id}`)}
                            className="p-4 text-white/10 hover:text-joy hover:bg-white/5 transition-all rounded-full border border-transparent hover:border-joy/10 active:scale-95"
                        >
                            <Pencil size={20} />
                        </button>
                        <button
                            onClick={deleteEntry}
                            className="p-4 text-white/10 hover:text-red-500 hover:bg-white/5 transition-all rounded-full border border-transparent hover:border-red-500/10 active:scale-95"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </header>

                <main className="flex flex-col items-center text-center px-4 mb-48">
                    {/* Entry Metadata Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16 md:mb-24"
                    >
                        <div className="sticker border-joy/30 text-joy bg-joy/5 flex items-center gap-3">
                            <Sparkles size={10} fill="currentColor" />
                            Precious Moment
                        </div>
                        <div className="sticker border-white/10 text-white/30 lowercase italic font-light px-6">
                            {entry.language === "te" ? "telugu heart" : "english flow"}
                        </div>
                        <div className="sticker border-white/5 bg-white/[0.03] text-text-dim px-6">
                            <Calendar size={10} className="inline mr-2 -mt-0.5" />
                            {new Date(entry.date).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                    </motion.div>

                    {/* The Title Spotlight */}
                    <div className="relative mb-24 group">
                        <div className="absolute -inset-10 bg-white/[0.01] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="text-4xl sm:text-5xl md:text-[11rem] font-black tracking-tighter leading-[0.9] md:leading-[0.85] text-white drop-shadow-2xl"
                        >
                            {entry.title}
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="h-[2px] w-24 md:w-32 mb-16 md:mb-24 rounded-full"
                    ></motion.div>

                    {/* The Content: Focus Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 1 }}
                        className="max-w-3xl w-full premium-card p-8 md:p-24 bg-midnight/50 backdrop-blur-sm inner-glow border-white/[0.02] shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                    >
                        <div className="space-y-12 text-left">
                            {entry.blocks && entry.blocks.length > 0 ? (
                                entry.blocks.map((block, i) => (
                                    <div key={i}>
                                        {block.type === 'text' ? (
                                            <p className="text-xl md:text-4xl font-light leading-[1.6] text-white/90 whitespace-pre-wrap tracking-tight">
                                                {block.content}
                                            </p>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="my-12 rounded-3xl overflow-hidden border border-white/5 bg-white/[0.02] shadow-2xl"
                                            >
                                                <img
                                                    src={block.content}
                                                    alt="Memory block"
                                                    className="w-full h-auto max-h-[800px] object-contain"
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-xl md:text-4xl font-light leading-[1.6] text-white/90 whitespace-pre-wrap tracking-tight">
                                    {entry.content}
                                </p>
                            )}
                        </div>

                        {/* Internal Detailing: Sign-off */}
                        <div className="mt-24 pt-12 border-t border-white/[0.03] flex justify-between items-center opacity-20">
                            <div className="flex items-center gap-3">
                                <Shield size={12} />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Vaulted</span>
                            </div>
                            <Bookmark size={14} />
                        </div>
                    </motion.div>

                    {/* Atmospheric Final Touch */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="pt-48 opacity-10 hover:opacity-50 transition-opacity duration-1000"
                    >
                        <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-text-dim/50 shadow-2xl">
                            <Book size={24} />
                        </div>
                    </motion.div>
                </main>
            </div>

            <footer className="w-full max-w-4xl py-12 border-t border-white/[0.02] text-center mt-auto">
                <div className="text-text-dim/20 text-[9px] uppercase tracking-[0.7em] font-black mb-2">
                    A Private Sanctuary for Human Reflection
                </div>
                <div className="text-text-dim/10 text-[8px] uppercase tracking-[0.3em]">
                    Forever Encrypted • Recorded 2026
                </div>
            </footer>
        </div>
    );
}
