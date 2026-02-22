"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ChevronRight, Lock, Book, Heart } from "lucide-react";

export default function Login() {
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
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("The gateway did not recognize those credentials.");
            } else {
                router.push("/dashboard");
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
            <div className="absolute top-0 left-0 w-full h-[300px] bg-white/[0.01] blur-[100px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl relative z-10"
            >
                <div className="mb-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center mb-12"
                    >
                        <div className="w-20 h-20 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center text-text-dim shadow-2xl inner-glow">
                            <Lock size={28} strokeWidth={1.5} />
                        </div>
                    </motion.div>
                    <h1 className="text-6xl font-black tracking-tighter mb-6 text-white">
                        Enter Sanctuary
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-8 bg-white/5"></div>
                        <p className="text-text-dim text-[10px] uppercase tracking-[0.5em] font-black">
                            Your Private Archive
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
                    <form onSubmit={handleSubmit} className="space-y-10">
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
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-white/[0.02] border border-white/5 focus:border-white/20 rounded-2xl px-10 py-6 outline-none transition-all placeholder:text-white/40 text-sm font-light text-white"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 bg-white text-midnight rounded-full text-sm font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] disabled:opacity-50 mt-4"
                        >
                            {loading ? "Decrypting..." : "Unlock Haven"}
                        </button>
                    </form>

                    <div className="mt-16 text-center">
                        <p className="text-text-dim text-xs font-light tracking-wide">
                            Need a private sanctuary?{" "}
                            <Link href="/signup" className="text-white font-black hover:underline underline-offset-8 ml-4 uppercase tracking-[0.2em] text-[10px]">
                                Establish Haven
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>

            <footer className="absolute bottom-16 left-0 w-full text-center opacity-10 flex flex-col items-center gap-4">
                <div className="flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.5em]">
                    <Shield size={12} />
                    E-Dairy Encryption Active
                </div>
                <div className="flex items-center gap-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse delay-700"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse delay-1000"></div>
                </div>
            </footer>
        </div>
    );
}
