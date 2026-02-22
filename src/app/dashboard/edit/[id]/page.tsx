"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Save, Shield, Star, Image as ImageIcon, Plus, Trash2, Loader2, Sparkles } from "lucide-react";
import TransliteratedTextArea from "@/components/diary/TransliteratedTextArea";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useToast } from "@/context/ToastContext";

interface Block {
    id: string;
    type: "text" | "image";
    content: string;
}

interface Entry {
    _id: string;
    title: string;
    content: string;
    blocks: Block[];
    language: "en" | "te";
    date: string;
}

export default function EditEntry() {
    const [title, setTitle] = useState("");
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [language, setLanguage] = useState<"en" | "te">("en");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const router = useRouter();
    const params = useParams();
    const { showToast } = useToast();

    useEffect(() => {
        fetchEntry();
    }, [params.id]);

    const fetchEntry = async () => {
        try {
            const res = await fetch(`/api/entries/${params.id}`);
            if (res.ok) {
                const found = await res.json();
                setTitle(found.title);
                setLanguage(found.language);

                if (found.blocks && found.blocks.length > 0) {
                    setBlocks(found.blocks.map((b: any) => ({ ...b, id: Math.random().toString(36).substr(2, 9) })));
                } else {
                    setBlocks([{ id: Math.random().toString(36).substr(2, 9), type: "text", content: found.content }]);
                }
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            showToast("Could not retrieve the memory for editing.", "error");
        } finally {
            setLoading(false);
        }
    };

    const addTextBlock = (index: number) => {
        const newBlock: Block = { id: Math.random().toString(36).substr(2, 9), type: "text", content: "" };
        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, newBlock);
        setBlocks(newBlocks);
    };

    const removeBlock = (id: string) => {
        if (blocks.length === 1 && blocks[0].type === 'text') return;
        setBlocks(blocks.filter(b => b.id !== id));
    };

    const updateBlockContent = (id: string, content: string) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const blockId = Math.random().toString(36).substr(2, 9);
        setUploadingId(blockId);

        try {
            const url = await uploadToCloudinary(file);
            const newBlock: Block = { id: blockId, type: "image", content: url };
            const newBlocks = [...blocks];
            newBlocks.splice(index + 1, 0, newBlock);
            setBlocks(newBlocks);
        } catch (err) {
            showToast("Archiving image failed. Check your connection.", "error");
        } finally {
            setUploadingId(null);
        }
    };

    const handleUpdate = async () => {
        const finalContent = blocks
            .filter(b => b.type === "text")
            .map(b => b.content)
            .join("\n\n");

        if (!title || !finalContent) {
            showToast("Every memory needs a name and a story to be updated.", "info");
            return;
        }

        setSaving(true);

        try {
            const res = await fetch(`/api/entries/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content: finalContent,
                    blocks: blocks.map(({ type, content }) => ({ type, content })),
                    language
                }),
            });

            if (res.ok) {
                showToast("Memory successfully revisited and updated", "success");
                router.push(`/dashboard/view/${params.id}`);
            } else {
                showToast("The sanctuary could not update this memory.", "error");
            }
        } catch (err) {
            showToast("An error occurred during updating.", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-midnight flex flex-col items-center justify-center font-sans tracking-tight">
                <div className="w-12 h-12 border-2 border-white/5 border-t-white/20 rounded-full animate-spin mb-10"></div>
                <div className="text-text-dim text-[10px] uppercase tracking-[0.6em] font-black animate-pulse">Retrieving Reflection...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-midnight text-text-main p-6 md:p-16 font-sans relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] spotlight-glow pointer-events-none -z-10 opacity-30"></div>

            <div className="max-w-5xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-16 md:mb-24 pb-8 border-b border-white/[0.03]">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="group flex items-center gap-4 text-text-dim hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.5em]"
                    >
                        <ChevronRight className="rotate-180 text-text-dim" size={16} />
                        <span>Back to Menu</span>
                    </button>

                    <div className="flex items-center gap-8">
                        <div className="flex bg-white/5 p-1 rounded-full border border-white/5 backdrop-blur-md">
                            <button
                                onClick={() => setLanguage("en")}
                                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${language === "en" ? "bg-white text-midnight shadow-xl" : "text-text-dim hover:text-white"}`}
                            >
                                English
                            </button>
                            <button
                                onClick={() => setLanguage("te")}
                                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${language === "te" ? "bg-white text-midnight shadow-xl" : "text-text-dim hover:text-white"}`}
                            >
                                తెలుగు
                            </button>
                        </div>

                        <button
                            onClick={handleUpdate}
                            disabled={saving}
                            className="bg-reflection-blue text-white px-10 py-5 rounded-full font-black text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                        >
                            <div className="flex items-center gap-3">
                                {saving ? <Sparkles size={18} className="animate-spin" /> : <Save size={18} />}
                                <span>{saving ? "Updating..." : "Update Memory"}</span>
                            </div>
                        </button>
                    </div>
                </header>


                <main className="premium-card p-8 md:p-32 min-h-[75vh] relative overflow-hidden inner-glow border-white/[0.05]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] md:h-[400px] bg-white/[0.015] blur-[100px] pointer-events-none"></div>

                    <div className="relative z-10 space-y-16">
                        {/* Title */}
                        <div className="space-y-8">
                            <label className="text-text-dim text-xs uppercase tracking-[0.6em] font-black ml-1 opacity-50">Refine Title</label>
                            <TransliteratedTextArea
                                value={title}
                                onChange={setTitle}
                                language={language}
                                onLanguageToggle={() => setLanguage(l => l === "en" ? "te" : "en")}
                                rows={2}
                                className="w-full bg-transparent border-none outline-none text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter placeholder:text-white/40 text-white focus:placeholder:text-white/60 transition-all resize-none leading-[1.4] py-4 scrollbar-hide"
                            />
                        </div>

                        <div className="h-[2px] w-32 bg-white/5 rounded-full"></div>

                        {/* Block Editor */}
                        <div className="space-y-12">
                            <label className="text-text-dim text-xs uppercase tracking-[0.6em] font-black ml-1 opacity-50">Deepen Reflection</label>

                            <div className="space-y-8">
                                <AnimatePresence initial={false}>
                                    {blocks.map((block, index) => (
                                        <motion.div
                                            key={block.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="group relative"
                                        >
                                            {block.type === "text" ? (
                                                <div className="relative">
                                                    <TransliteratedTextArea
                                                        value={block.content}
                                                        onChange={(val: string) => updateBlockContent(block.id, val)}
                                                        language={language}
                                                        onLanguageToggle={() => setLanguage(l => l === "en" ? "te" : "en")}
                                                        placeholder="Write your soul here..."
                                                    />
                                                    {blocks.length > 1 && (
                                                        <button
                                                            onClick={() => removeBlock(block.id)}
                                                            className="absolute -right-12 top-0 p-2 text-white/5 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
                                                    <img src={block.content} alt="Memorable moment" className="w-full h-auto max-h-[600px] object-contain" />
                                                    <button
                                                        onClick={() => removeBlock(block.id)}
                                                        className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Action Bar - Always visible on mobile, hover-only on desktop */}
                                            <div className="flex items-center justify-center gap-4 mt-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => addTextBlock(index)}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] text-[9px] font-black uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/5 transition-all"
                                                >
                                                    <Plus size={10} />
                                                    Add Text
                                                </button>
                                                <label className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] text-[9px] font-black uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/5 transition-all cursor-pointer">
                                                    <ImageIcon size={10} />
                                                    Image
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleImageUpload(e, index)}
                                                    />
                                                </label>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {uploadingId && (
                                    <div className="flex flex-col items-center justify-center p-20 border border-dashed border-white/10 rounded-3xl bg-white/[0.02] animate-pulse">
                                        <Loader2 className="animate-spin text-reflection-blue mb-4" size={32} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-text-dim">Archiving Visual Memory...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-16 left-16 flex items-center gap-4 opacity-10 pointer-events-none">
                        <Shield size={12} className="text-text-dim" />
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-text-dim">Re-Securing Sanctuary</span>
                    </div>
                </main>
            </div>
        </div>
    );
}
