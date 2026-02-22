"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Sparkles, Book, Feather, Heart } from "lucide-react";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/login");
            } else {
                setError(data.message || "Failed to establish haven.");
            }
        } catch (err) {
            setError("A connection error occurred. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-midnight text-text-main flex items-center justify-center p-6 font-sans relative overflow-hidden selection:bg-white/10">
            {/* Immersive background depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] spotlight-glow pointer-events-none opacity-40"></div>
            <div className="absolute bottom-0 right-0 w-full h-[300px] bg-white/[0.01] blur-[100px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl relative z-10"
            >
                <div className="mb-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex justify-center mb-12"
                    >
                        <div className="w-20 h-20 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center text-text-dim shadow-2xl inner-glow animate-float">
                            <Sparkles size={28} strokeWidth={1.5} className="text-joy/50" />
                        </div>
                    </motion.div>
                    <h1 className="text-6xl font-black tracking-tighter mb-6 text-white">
                        Initial Haven
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-8 bg-white/5"></div>
                        <p className="text-text-dim text-[10px] uppercase tracking-[0.5em] font-black">
                            Begin Your Reflection Journey
                        </p>
                        <div className="h-px w-8 bg-white/5"></div>
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 mb-12 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <div className="premium-card p-12 md:p-16 inner-glow border-white/[0.05]">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-text-dim ml-4">Public Designation (Name)</label>
                            <input
                                type="text"
                                placeholder="What should we call you?"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full bg-white/[0.02] border border-white/5 focus:border-white/20 rounded-2xl px-10 py-6 outline-none transition-all placeholder:text-white/40 text-sm font-light text-white"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-text-dim ml-4">Authorized Identifier</label>
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-white/[0.02] border border-white/5 focus:border-white/20 rounded-2xl px-10 py-6 outline-none transition-all placeholder:text-white/40 text-sm font-light text-white"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-text-dim ml-4">Private Passcode</label>
                            <input
                                type="password"
                                placeholder="Create a secure gateway"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-white/[0.02] border border-white/5 focus:border-white/20 rounded-2xl px-10 py-6 outline-none transition-all placeholder:text-white/40 text-sm font-light text-white"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 bg-white text-midnight rounded-full text-sm font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] disabled:opacity-50 mt-6"
                        >
                            <div className="flex items-center justify-center gap-3">
                                {loading ? <Sparkles size={18} className="animate-spin" /> : <Feather size={18} />}
                                <span>{loading ? "Establishing..." : "Start Sanctuary"}</span>
                            </div>
                        </button>
                    </form>

                    <div className="mt-16 text-center">
                        <p className="text-text-dim text-xs font-light tracking-wide">
                            Already have an archive?{" "}
                            <Link href="/login" className="text-white font-black hover:underline underline-offset-8 ml-4 uppercase tracking-[0.2em] text-[10px]">
                                Enter Archive
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>

            <footer className="absolute bottom-16 left-0 w-full text-center opacity-10 flex flex-col items-center gap-4">
                <div className="flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.5em]">
                    <Shield size={12} />
                    Absolute Privacy Guaranteed
                </div>
            </footer>
        </div>
    );
}
