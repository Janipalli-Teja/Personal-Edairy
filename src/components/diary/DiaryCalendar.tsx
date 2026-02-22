"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface DiaryCalendarProps {
    entryDates: string[]; // ISO Strings
    selectedDate?: string | null; // YYYY-MM-DD
    onDateSelect?: (date: string | null) => void;
}

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i); // 5 years back, 4 ahead

export default function DiaryCalendar({ entryDates, selectedDate, onDateSelect }: DiaryCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const monthName = MONTHS[currentDate.getMonth()];
    const year = currentDate.getFullYear();

    const prevMonth = () => {
        setShowMonthPicker(false);
        setShowYearPicker(false);
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };
    const nextMonth = () => {
        setShowMonthPicker(false);
        setShowYearPicker(false);
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const selectMonth = (monthIndex: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
        setShowMonthPicker(false);
    };

    const selectYear = (y: number) => {
        setCurrentDate(new Date(y, currentDate.getMonth(), 1));
        setShowYearPicker(false);
    };

    const getLocalDateString = (date: Date | string) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const activeDates = new Set(entryDates.map(date => getLocalDateString(date)));
    const today = getLocalDateString(new Date());

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`pad-${i}`} className="h-10 w-10" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasEntry = activeDates.has(dateString);
        const isToday = today === dateString;
        const isSelected = selectedDate === dateString;

        days.push(
            <div
                key={day}
                className="relative group flex items-center justify-center h-10 w-10 cursor-pointer"
                onClick={() => onDateSelect?.(isSelected ? null : dateString)}
            >
                {hasEntry && (
                    <motion.div
                        layoutId="active-glow"
                        className="absolute inset-0 bg-reflection-blue/20 rounded-full blur-[8px]"
                    />
                )}
                {isSelected && (
                    <motion.div
                        layoutId="selected-ring"
                        className="absolute inset-0 border-2 border-reflection-blue/60 rounded-full"
                    />
                )}
                <div className={`
                    relative z-10 w-8 h-8 flex items-center justify-center rounded-full text-[10px] font-black transition-all
                    ${hasEntry ? 'text-white border border-reflection-blue/40 bg-reflection-blue/10' : 'text-text-dim/40'}
                    ${isToday ? 'ring-1 ring-white/20' : ''}
                    ${isSelected ? 'bg-reflection-blue text-white ring-2 ring-white/40' : ''}
                `}>
                    {day}
                </div>
                {hasEntry && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-reflection-blue rounded-full shadow-[0_0_5px_#3b82f6]" />
                )}
            </div>
        );
    }

    return (
        <div className="premium-card p-8 w-full max-w-sm sticky top-16 bg-midnight/40 backdrop-blur-md border-white/[0.03]">

            {/* ── Header: Month/Year pickers + nav ── */}
            <div className="flex items-center justify-between mb-8 relative">
                <div className="flex items-center gap-2">
                    {/* Month selector */}
                    <div className="relative">
                        <button
                            onClick={() => { setShowMonthPicker(v => !v); setShowYearPicker(false); }}
                            className="text-white text-xs font-black uppercase tracking-[0.3em] hover:text-reflection-blue transition-colors px-1 py-0.5 rounded"
                        >
                            {monthName}
                        </button>
                        {showMonthPicker && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-8 left-0 z-50 bg-charcoal border border-white/10 rounded-2xl p-3 grid grid-cols-3 gap-1 shadow-2xl w-48"
                            >
                                {MONTHS.map((m, i) => (
                                    <button
                                        key={m}
                                        onClick={() => selectMonth(i)}
                                        className={`text-[9px] font-black uppercase tracking-widest px-2 py-2 rounded-xl transition-all ${i === currentDate.getMonth()
                                                ? "bg-reflection-blue text-white"
                                                : "text-text-dim hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        {m.slice(0, 3)}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    {/* Year selector */}
                    <div className="relative">
                        <button
                            onClick={() => { setShowYearPicker(v => !v); setShowMonthPicker(false); }}
                            className="text-text-dim text-[9px] font-medium tracking-widest hover:text-white transition-colors px-1 py-0.5 rounded"
                        >
                            {year}
                        </button>
                        {showYearPicker && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-8 left-0 z-50 bg-charcoal border border-white/10 rounded-2xl p-3 grid grid-cols-2 gap-1 shadow-2xl w-36"
                            >
                                {YEARS.map((y) => (
                                    <button
                                        key={y}
                                        onClick={() => selectYear(y)}
                                        className={`text-[9px] font-black tracking-widest px-2 py-2 rounded-xl transition-all ${y === currentDate.getFullYear()
                                                ? "bg-reflection-blue text-white"
                                                : "text-text-dim hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        {y}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Prev / Next arrows */}
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 text-text-dim hover:text-white transition-all bg-white/5 rounded-full border border-white/5">
                        <ChevronLeft size={14} />
                    </button>
                    <button onClick={nextMonth} className="p-2 text-text-dim hover:text-white transition-all bg-white/5 rounded-full border border-white/5">
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* Dismiss pickers on backdrop click */}
            {(showMonthPicker || showYearPicker) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => { setShowMonthPicker(false); setShowYearPicker(false); }}
                />
            )}

            {/* ── Day headers ── */}
            <div className="grid grid-cols-7 gap-y-4 mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={`${d}-${i}`} className="text-center text-[8px] font-black text-text-dim/30 uppercase tracking-widest">
                        {d}
                    </div>
                ))}
            </div>

            {/* ── Day grid ── */}
            <div className="grid grid-cols-7 gap-y-2">
                {days}
            </div>

            {/* ── Footer info ── */}
            <div className="mt-10 pt-6 border-t border-white/[0.03] space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-reflection-blue shadow-[0_0_5px_#3b82f6]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-dim">Recorded Entry</span>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/[0.03] rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <CalendarIcon size={12} className="text-text-dim" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-white">Consistency</span>
                        </div>
                        {selectedDate && (
                            <button
                                onClick={() => onDateSelect?.(null)}
                                className="text-[8px] text-reflection-blue hover:text-white transition-colors uppercase font-bold"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    <p className="text-[10px] text-text-dim font-light leading-relaxed">
                        {selectedDate ? (
                            <>Showing entries for <span className="text-white font-bold">{selectedDate}</span></>
                        ) : (
                            <>You have recorded thoughts on <span className="text-reflection-blue font-bold">{activeDates.size}</span> different days.</>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
