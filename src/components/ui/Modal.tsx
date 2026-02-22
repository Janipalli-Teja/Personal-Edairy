"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

export default function Modal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDestructive = false
}: ModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-midnight/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md premium-card p-10 md:p-12 overflow-hidden inner-glow border-white/[0.05] bg-charcoal/40 backdrop-blur-2xl"
                    >
                        {/* Detail: Ambient Glow */}
                        <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] opacity-20 ${isDestructive ? 'bg-red-500' : 'bg-reflection-blue'}`}></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`p-3 rounded-2xl ${isDestructive ? 'bg-red-500/10 text-red-400' : 'bg-reflection-blue/10 text-reflection-blue'}`}>
                                    <AlertTriangle size={20} />
                                </div>
                                <h2 className="text-xl font-black tracking-tight text-white uppercase tracking-[0.1em]">{title}</h2>
                            </div>

                            <p className="text-text-dim text-sm font-light leading-relaxed mb-12">
                                {message}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    onClick={onConfirm}
                                    className={`flex-1 py-4 rounded-full font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 ${isDestructive
                                            ? 'bg-red-500 text-white shadow-[0_10px_30px_rgba(239,68,68,0.2)] hover:bg-red-600'
                                            : 'bg-reflection-blue text-white shadow-[0_10px_30px_rgba(59,130,246,0.2)] hover:bg-blue-600'
                                        }`}
                                >
                                    {confirmText}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-4 rounded-full font-black text-[10px] uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/5 transition-all active:scale-95"
                                >
                                    {cancelText}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
