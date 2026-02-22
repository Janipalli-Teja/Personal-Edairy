"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

interface ToastProps {
    message: string;
    type: "success" | "error" | "info";
    onClose: () => void;
}

const CONFIG = {
    success: {
        icon: <CheckCircle2 size={18} className="text-joy" />,
        border: "border-joy/20",
        glow: "shadow-[0_0_20px_rgba(255,222,89,0.1)]",
        bg: "bg-joy/5"
    },
    error: {
        icon: <AlertCircle size={18} className="text-red-400" />,
        border: "border-red-500/20",
        glow: "shadow-[0_0_20px_rgba(239,68,68,0.1)]",
        bg: "bg-red-500/5"
    },
    info: {
        icon: <Info size={18} className="text-reflection-blue" />,
        border: "border-reflection-blue/20",
        glow: "shadow-[0_0_20px_rgba(59,130,246,0.1)]",
        bg: "bg-reflection-blue/5"
    }
};

export default function Toast({ message, type, onClose }: ToastProps) {
    const config = CONFIG[type];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className={`pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-xl ${config.border} ${config.bg} ${config.glow} min-w-[300px] max-w-md shadow-2xl`}
        >
            <div className="shrink-0">{config.icon}</div>
            <div className="flex-1 text-[11px] font-black uppercase tracking-[0.2em] text-white/90 leading-relaxed">
                {message}
            </div>
            <button
                onClick={onClose}
                className="p-1 text-white/20 hover:text-white transition-colors"
            >
                <X size={14} />
            </button>
        </motion.div>
    );
}
