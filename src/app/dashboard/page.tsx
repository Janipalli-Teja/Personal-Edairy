"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DiaryCalendar from "@/components/diary/DiaryCalendar";
import { useToast } from "@/context/ToastContext";
import Modal from "@/components/ui/Modal";
import {
    Heart,
    Plus,
    LogOut,
    Feather,
    Calendar,
    ChevronRight,
    Pencil,
    Trash2
} from "lucide-react";


interface Entry {
    // ... existing Entry interface ...
    _id: string;
    title: string;
    content: string;
    language: string;
    date: string;
    mood?: "joy" | "peace" | "love" | "reflection" | "neutral";
}

const MOOD_CONFIG = {
    joy: { emoji: "✨", label: "Joy", glow: "rgba(255,222,89,0.08)", badge: "text-joy border-joy/30 bg-joy/5" },
    peace: { emoji: "🌊", label: "Peace", glow: "rgba(157,229,255,0.08)", badge: "text-peace border-peace/30 bg-peace/5" },
    love: { emoji: "🌸", label: "Love", glow: "rgba(255,145,145,0.08)", badge: "text-love border-love/30 bg-love/5" },
    reflection: { emoji: "🔮", label: "Deep", glow: "rgba(59,130,246,0.08)", badge: "text-reflection-blue border-reflection-blue/30 bg-reflection-blue/5" },
    neutral: { emoji: "🌿", label: "Calm", glow: "rgba(255,255,255,0.02)", badge: "text-text-dim border-white/10 bg-white/5" },
};

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const getLocalDateString = (date: Date | string) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(getLocalDateString(new Date()));
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchEntries();
        }
    }, [status, router]);

    const fetchEntries = async () => {
        try {
            const res = await fetch("/api/entries");
            const data = await res.json();
            if (Array.isArray(data)) {
                setEntries(data);
            }
        } catch (err) {
            console.error("Failed to fetch entries");
        } finally {
            setLoading(false);
        }
    };

    const deleteEntry = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setEntryToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!entryToDelete) return;

        try {
            const res = await fetch(`/api/entries/${entryToDelete}`, { method: "DELETE" });
            if (res.ok) {
                setEntries(entries.filter((e) => e._id !== entryToDelete));
                showToast("Memory has been released from the sanctuary", "success");
            } else {
                showToast("Failed to remove the memory", "error");
            }
        } catch (err) {
            showToast("An error occurred during removal", "error");
        } finally {
            setDeleteModalOpen(false);
            setEntryToDelete(null);
        }
    };

    // Group entries by date
    const [groupedEntries, setGroupedEntries] = useState<{ [key: string]: Entry[] }>({});

    useEffect(() => {
        const filtered = selectedDateFilter
            ? entries.filter(e => getLocalDateString(e.date) === selectedDateFilter)
            : entries;

        const groups = filtered.reduce((groups, entry) => {
            const date = new Date(entry.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            });
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(entry);
            return groups;
        }, {} as { [key: string]: Entry[] });
        setGroupedEntries(groups);
    }, [entries, selectedDateFilter]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-midnight flex flex-col items-center justify-center font-sans tracking-tight">
                <div className="w-16 h-[2px] bg-white/5 rounded-full overflow-hidden mb-8">
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="w-full h-full bg-white/40"
                    />
                </div>
                <div className="text-text-dim text-[10px] uppercase tracking-[0.5em] font-black">Opening Sanctuary...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-midnight text-text-main p-6 md:p-16 font-sans selection:bg-white/10 relative overflow-x-hidden">
            {/* Ambient detail: Top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-white/[0.015] blur-[100px] pointer-events-none -z-10"></div>

            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 md:mb-40">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Heart size={14} className="text-love/40" />
                            <span className="text-text-dim text-[10px] font-black uppercase tracking-[0.4em]">Personal Collection</span>
                        </div>
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter mb-4 text-white">
                            Inner Sanctuary
                        </h1>
                        <p className="text-text-dim text-[11px] font-medium uppercase tracking-[0.3em]">
                            The private reflections of <span className="text-white px-4 py-1.5 bg-white/5 border border-white/5 rounded-full ml-3">{session?.user?.name || "User"}</span>
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-8 items-center"
                    >
                        <button
                            onClick={() => router.push("/dashboard/new")}
                            className="group flex items-center gap-4 bg-reflection-blue text-white px-10 py-5 rounded-full font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                        >
                            <Plus size={20} />
                            <span>Record New Moment</span>
                        </button>
                        <button
                            onClick={() => signOut()}
                            className="text-text-dim hover:text-white transition-all p-3"
                            title="Exit Sanctuary"
                        >
                            <LogOut size={20} />
                        </button>
                    </motion.div>
                </header>

                {loading ? (
                    <div className="flex justify-center py-40">
                        <div className="w-8 h-[1px] bg-white/10 relative overflow-hidden">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-full h-full bg-white/60"
                            />
                        </div>
                    </div>
                ) : entries.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-48 premium-card border-dashed bg-transparent border-white/5"
                    >
                        <Feather size={48} className="text-white/[0.02] mb-10" />
                        <h2 className="text-3xl font-black tracking-tight text-white mb-6 text-center">Your sanctuary is empty.</h2>
                        <p className="text-text-dim mb-12 text-center max-w-sm font-light leading-relaxed text-lg">
                            The most precious moments are those we keep to ourselves. Ready to start your archive?
                        </p>
                        <button
                            onClick={() => router.push("/dashboard/new")}
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-12 py-5 rounded-full transition-all text-xs font-black uppercase tracking-[0.2em]"
                        >
                            Establish First Memory
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 relative">
                        {/* Entries Column */}
                        <div className="lg:col-span-8 space-y-12">
                            {selectedDateFilter && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center justify-between mb-8 group"
                                >
                                    <button
                                        onClick={() => setSelectedDateFilter(null)}
                                        className="flex items-center gap-4 text-text-dim hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.5em]"
                                    >
                                        <ChevronRight className="rotate-180 text-text-dim group-hover:text-white transition-colors" size={16} />
                                        <span>Back to All Memories</span>
                                    </button>
                                    <div className="sticker border-reflection-blue/20 text-reflection-blue bg-reflection-blue/5">
                                        Filtered: {selectedDateFilter}
                                    </div>
                                </motion.div>
                            )}

                            {Object.keys(groupedEntries).length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-48 premium-card border-dashed bg-transparent border-white/5"
                                >
                                    <Calendar size={48} className="text-white/[0.02] mb-10" />
                                    <h2 className="text-3xl font-black tracking-tight text-white mb-6 text-center">No memories on this day.</h2>
                                    <p className="text-text-dim mb-12 text-center max-w-sm font-light leading-relaxed text-lg">
                                        Perhaps this day was kept for the quiet moments between the lines.
                                    </p>
                                    <button
                                        onClick={() => setSelectedDateFilter(null)}
                                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-12 py-5 rounded-full transition-all text-xs font-black uppercase tracking-[0.2em]"
                                    >
                                        Return to Full Sanctuary
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="space-y-24 md:space-y-48">
                                    {Object.entries(groupedEntries).map(([date, dateEntries]) => (
                                        <div key={date} className="space-y-12 md:space-y-20">
                                            <div className="flex items-center gap-6 md:gap-10">
                                                <div className="h-[2px] w-12 bg-white/5"></div>
                                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-text-dim shrink-0">
                                                    {date}
                                                </h2>
                                                <div className="h-[px] w-full border-b border-dashed border-white/[0.03]"></div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                <AnimatePresence mode="popLayout">
                                                    {dateEntries.map((entry, index) => (
                                                        <motion.div
                                                            key={entry._id}
                                                            layout
                                                            initial={{ opacity: 0, y: 30 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95 }}
                                                            transition={{ delay: index * 0.1, duration: 0.6 }}
                                                            onClick={() => router.push(`/dashboard/view/${entry._id}`)}
                                                            className="group premium-card p-8 md:p-12 relative cursor-pointer overflow-hidden flex flex-col justify-between min-h-[300px] md:min-h-[340px] inner-glow border-white/[0.04]"
                                                            style={{ background: `radial-gradient(ellipse at top right, ${MOOD_CONFIG[entry.mood ?? 'neutral'].glow} 0%, transparent 60%)` }}
                                                        >
                                                            {/* Detailing: Background glow */}
                                                            <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/[0.02] rounded-full blur-[100px] group-hover:bg-white/[0.05] transition-all duration-700"></div>

                                                            <div className="relative z-10">
                                                                <div className="flex justify-between items-start mb-14">
                                                                    <div className="flex gap-5">
                                                                        <div className="sticker border-white/10 text-text-dim text-[9px] tracking-widest">
                                                                            {entry.language === "te" ? "తెలుగు" : "English"}
                                                                        </div>
                                                                        {entry.mood && entry.mood !== "neutral" && (
                                                                            <div className={`sticker flex items-center gap-1.5 border ${MOOD_CONFIG[entry.mood].badge}`}>
                                                                                <span>{MOOD_CONFIG[entry.mood].emoji}</span>
                                                                                <span>{MOOD_CONFIG[entry.mood].label}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                router.push(`/dashboard/edit/${entry._id}`);
                                                                            }}
                                                                            className="opacity-0 group-hover:opacity-100 p-2.5 text-text-dim hover:text-joy transition-all bg-white/5 rounded-full border border-white/5 active:scale-90"
                                                                        >
                                                                            <Pencil size={16} />
                                                                        </button>
                                                                        <button
                                                                            onClick={(e) => deleteEntry(entry._id, e)}
                                                                            className="opacity-0 group-hover:opacity-100 p-2.5 text-text-dim hover:text-red-500 transition-all bg-white/5 rounded-full border border-white/5 active:scale-90"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <h3 className="text-3xl md:text-5xl font-black text-white mb-6 md:mb-8 line-clamp-2 leading-[1.1] md:leading-[1] tracking-tight group-hover:text-white transition-colors duration-500">
                                                                    {entry.title}
                                                                </h3>
                                                                <p className="text-text-dim text-base md:text-lg line-clamp-2 leading-relaxed font-light group-hover:text-text-main/80 transition-all duration-500">
                                                                    {entry.content}
                                                                </p>
                                                            </div>

                                                            <div className="flex justify-between items-center relative z-10 pt-12 border-t border-white/[0.03] mt-4 shadow-[0_-20px_40px_-10px_rgba(0,0,0,0.3)] bg-charcoal/50 backdrop-blur-sm -mx-12 px-12 pb-2 rounded-b-3xl">
                                                                <div className="flex items-center gap-6 group/btn">
                                                                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:border-white/40 group-hover:bg-white/10">
                                                                        <ChevronRight size={16} className="text-text-dim group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                                                                    </div>
                                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim group-hover:text-white transition-colors">Untangle Moment</span>
                                                                </div>

                                                                <div suppressHydrationWarning className="text-[9px] text-text-dim/40 uppercase tracking-[0.4em] font-medium italic">
                                                                    {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Calendar Sidebar */}
                        <div className="lg:col-span-4 lg:block h-fit">
                            <DiaryCalendar
                                entryDates={entries.map(e => e.date)}
                                selectedDate={selectedDateFilter}
                                onDateSelect={setSelectedDateFilter}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Visual detailing footer spacer */}
            <div className="h-64"></div>

            {/* Mobile Floating Action Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => router.push("/dashboard/new")}
                className="sm:hidden fixed bottom-10 right-8 w-16 h-16 bg-reflection-blue text-white rounded-full shadow-[0_10px_30px_rgba(59,130,246,0.4)] flex items-center justify-center z-50 border border-white/10"
            >
                <Plus size={28} />
            </motion.button>

            {/* Premium Confirmation Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Release Memory?"
                message="Are you sure you want to permanently release this precious memory? This action cannot be undone."
                confirmText="Release Memory"
                cancelText="Keep Memory"
                isDestructive={true}
            />
        </div>
    );
}
