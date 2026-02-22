"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, Languages, Heart, Feather, Sparkles, BookOpen, Star, ArrowRight } from "lucide-react";
import { useRef } from "react";

const FEATURES = [
  {
    icon: Shield,
    color: "text-peace",
    bg: "bg-peace/5 border-peace/20",
    title: "Encrypted Haven",
    desc: "Every word you write is locked in a multi-layered vault. Only you hold the key.",
  },
  {
    icon: Heart,
    color: "text-love",
    bg: "bg-love/5 border-love/20",
    title: "Emotional Archive",
    desc: "Tag every entry with a mood — Joy, Peace, Love, or Calm. Your feelings deserve color.",
  },
  {
    icon: Languages,
    color: "text-joy",
    bg: "bg-joy/5 border-joy/20",
    title: "Native Flow",
    desc: "Write in Telugu or English. Switch languages mid-thought without missing a beat.",
  },
  {
    icon: BookOpen,
    color: "text-reflection-blue",
    bg: "bg-reflection-blue/5 border-reflection-blue/20",
    title: "Calendar Timeline",
    desc: "Browse your memories by date. Every day you wrote leaves a soft glow on the calendar.",
  },
];

const MOODS = [
  { emoji: "✨", label: "Joy", color: "text-joy bg-joy/10 border-joy/30" },
  { emoji: "🌊", label: "Peace", color: "text-peace bg-peace/10 border-peace/30" },
  { emoji: "🌸", label: "Love", color: "text-love bg-love/10 border-love/30" },
  { emoji: "🔮", label: "Deep", color: "text-reflection-blue bg-reflection-blue/10 border-reflection-blue/30" },
  { emoji: "🌿", label: "Calm", color: "text-white/60 bg-white/5 border-white/20" },
];

const STATS = [
  { value: "256-bit", label: "Encryption" },
  { value: "2", label: "Languages" },
  { value: "∞", label: "Memories" },
  { value: "100%", label: "Private" },
];

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="min-h-screen bg-midnight text-text-main font-sans selection:bg-white/10 overflow-x-hidden">

      {/* ─── Ambient Background Lights ─── */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[10%] w-[700px] h-[700px] rounded-full bg-reflection-blue/[0.04] blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-love/[0.04] blur-[150px]" />
        <div className="absolute top-[50%] left-[-10%] w-[500px] h-[500px] rounded-full bg-peace/[0.03] blur-[150px]" />
      </div>

      {/* ─── Navbar ─── */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 backdrop-blur-md border-b border-white/[0.04] bg-midnight/60"
      >
        <div className="flex items-center gap-3">
          <Feather size={16} className="text-text-dim" />
          <span className="font-black tracking-tight text-white text-sm">E-Dairy</span>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/login" className="text-text-dim hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors">Sign In</Link>
          <Link href="/signup" className="bg-white text-midnight px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity">
            Get Started
          </Link>
        </div>
      </motion.nav>

      {/* ─── Hero ─── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-32 overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="flex flex-col items-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="sticker border-white/10 bg-white/[0.04] mb-10 flex items-center gap-3 animate-float"
          >
            <Sparkles size={10} className="text-joy" />
            <span>Your Private Digital Diary</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-[clamp(4rem,14vw,12rem)] font-black tracking-tighter leading-none mb-6"
          >
            <span className="text-white">E</span>
            <span className="text-text-dim/30">-</span>
            <span className="text-white">Dairy</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-lg md:text-2xl text-text-main/50 max-w-xl mx-auto leading-relaxed font-light mb-14"
          >
            A quiet place to{" "}
            <span className="text-white font-medium italic">archive your soul</span>.
            Write freely. Feel deeply. Stay private.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-5 items-center"
          >
            <Link
              href="/signup"
              className="group flex items-center gap-3 bg-reflection-blue text-white px-10 py-5 rounded-full text-sm font-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(59,130,246,0.3)] hover:shadow-[0_0_70px_rgba(59,130,246,0.5)]"
            >
              <span>Start Writing Free</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-3 text-text-dim hover:text-white px-8 py-5 transition-all text-[11px] font-bold uppercase tracking-[0.2em]"
            >
              <Feather size={14} />
              <span>Continue Writing</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-text-dim/40 text-[9px] uppercase tracking-[0.5em] font-black">Discover</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-[1px] h-8 bg-gradient-to-b from-white/10 to-transparent"
          />
        </motion.div>
      </section>

      {/* ─── Stats Bar ─── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-y border-white/[0.04] py-10 px-6"
      >
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">{s.value}</div>
              <div className="text-[10px] text-text-dim uppercase tracking-widest font-bold">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ─── Features ─── */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="sticker inline-flex border-white/10 bg-white/[0.03] mb-6 mx-auto">
              <Star size={10} className="text-text-dim" />
              <span className="ml-2">Everything you need</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
              Built for the <span className="italic text-text-dim/60">reflective mind</span>
            </h2>
            <p className="text-text-dim text-lg font-light max-w-lg mx-auto">
              Every feature crafted to make writing feel effortless and intimate.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card p-10 inner-glow group hover:scale-[1.02] transition-transform duration-500"
              >
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-8 ${f.bg}`}>
                  <f.icon size={20} className={f.color} />
                </div>
                <h3 className="text-white font-black text-lg tracking-tight mb-3">{f.title}</h3>
                <p className="text-text-dim text-sm leading-relaxed font-light">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Mood Preview Section ─── */}
      <section className="py-32 px-6 border-t border-white/[0.03]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="sticker inline-flex border-white/10 bg-white/[0.03] mb-6 mx-auto">
              <Heart size={10} className="text-love/60" />
              <span className="ml-2">Emotional Archive</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-5">
              How did you feel today?
            </h2>
            <p className="text-text-dim text-lg font-light max-w-md mx-auto mb-16">
              Select a mood for each entry. Your diary becomes a living tapestry of your emotions.
            </p>

            {/* Mood Pills */}
            <div className="flex flex-wrap gap-4 justify-center mb-16">
              {MOODS.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-full border text-sm font-black ${m.color}`}
                >
                  <span className="text-lg">{m.emoji}</span>
                  <span>{m.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Mock Entry Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="premium-card p-10 text-left max-w-lg mx-auto inner-glow"
              style={{ background: "radial-gradient(ellipse at top right, rgba(255,222,89,0.08) 0%, transparent 60%)" }}
            >
              <div className="flex gap-3 mb-6">
                <span className="sticker border-white/10 text-text-dim">English</span>
                <span className="sticker border-joy/30 text-joy bg-joy/5 flex items-center gap-1">✨ Joy</span>
              </div>
              <h4 className="text-2xl font-black text-white mb-3 tracking-tight">A beautiful morning walk</h4>
              <p className="text-text-dim text-sm font-light leading-relaxed">
                I woke up early and stepped outside. The cool air and silence reminded me how much beauty exists in the ordinary...
              </p>
              <div className="mt-8 pt-6 border-t border-white/[0.04] text-[9px] text-text-dim/40 uppercase tracking-[0.4em]">
                07:42 AM · February 21, 2026
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-40 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="w-16 h-[1px] bg-white/10 mx-auto mb-16" />
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
            Your story<br />
            <span className="text-text-dim/40 italic">deserves a home.</span>
          </h2>
          <p className="text-text-dim text-lg font-light mb-12">
            Join the sanctuary. No ads. No tracking. Just you and your words.
          </p>
          <Link
            href="/signup"
            className="group inline-flex items-center gap-3 bg-reflection-blue text-white px-14 py-6 rounded-full text-base font-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_60px_rgba(59,130,246,0.3)]"
          >
            <span>Begin Your Journey</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="mt-8 text-text-dim/30 text-xs">Free forever. No credit card required.</div>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/[0.04] py-12 px-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <Feather size={12} className="text-text-dim/30" />
            <span className="font-black text-text-dim/30 text-xs tracking-tight">E-Dairy</span>
          </div>
          <div className="text-text-dim/20 text-[10px] uppercase tracking-[0.6em]">
            The Digital Art of Self-Reflection · 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
