"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTransliteration } from "@/hooks/useTransliteration";

interface TransliteratedTextAreaProps {
    value: string;
    onChange: (value: string) => void;
    language: "en" | "te";
    placeholder?: string;
    className?: string;
    rows?: number;
    onLanguageToggle?: () => void;
}

export default function TransliteratedTextArea({
    value,
    onChange,
    language,
    placeholder,
    className,
    rows = 15,
    onLanguageToggle,
}: TransliteratedTextAreaProps) {
    const [currentWord, setCurrentWord] = useState("");
    const [cursorPos, setCursorPos] = useState(0);
    const { suggestions, getSuggestions } = useTransliteration(language);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const [caretCoords, setCaretCoords] = useState({ top: 0, left: 0 });
    const [lastAppliedWord, setLastAppliedWord] = useState<{
        original: string;
        applied: string;
        pos: number;
        suffixLength: number;
    } | null>(null);

    const getCaretCoordinates = () => {
        if (!textAreaRef.current) return { top: 0, left: 0 };

        const textarea = textAreaRef.current;
        const textBeforeCaret = textarea.value.substring(0, textarea.selectionStart);

        // Create a mirror div to calculate position
        const mirror = document.createElement('div');
        const style = window.getComputedStyle(textarea);

        // Copy relevant styles for pixel-perfect match
        const properties = [
            'direction', 'boxSizing', 'width', 'height', 'overflowX', 'overflowY',
            'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
            'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
            'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'lineHeight', 'fontFamily',
            'textAlign', 'textTransform', 'textIndent', 'textDecoration', 'letterSpacing', 'wordSpacing', 'whiteSpace', 'wordBreak'
        ];

        properties.forEach(prop => {
            (mirror.style as any)[prop] = (style as any)[prop];
        });

        mirror.style.position = 'absolute';
        mirror.style.visibility = 'hidden';
        mirror.style.whiteSpace = 'pre-wrap';
        mirror.style.wordBreak = 'break-word';

        mirror.textContent = textBeforeCaret;

        const span = document.createElement('span');
        span.textContent = textarea.value.substring(textarea.selectionStart) || '.';
        mirror.appendChild(span);

        document.body.appendChild(mirror);
        const { offsetTop, offsetLeft } = span;
        document.body.removeChild(mirror);

        return {
            top: offsetTop - textarea.scrollTop,
            left: Math.min(offsetLeft, textarea.clientWidth - 200)
        };
    };

    useEffect(() => {
        if (language === "te" && currentWord.length > 0) {
            getSuggestions(currentWord);
            setShowSuggestions(true);
            setActiveSuggestionIndex(0);
            setCaretCoords(getCaretCoordinates());
        } else {
            setShowSuggestions(false);
        }
    }, [currentWord, getSuggestions, language]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (language === "en") return;

        // Number keys (1-5) selection for lightning speed
        if (showSuggestions && suggestions.length > 0) {
            const keyNum = parseInt(e.key);
            if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= Math.min(suggestions.length, 5)) {
                e.preventDefault();
                applySuggestion(suggestions[keyNum - 1]);
                return;
            }
        }

        if (e.key === "Tab" && suggestions.length > 0 && showSuggestions) {
            e.preventDefault();
            setActiveSuggestionIndex((prev) => (prev + 1) % Math.min(suggestions.length, 5));
        }

        if (e.key === " " || e.key === "Enter") {
            if (suggestions.length > 0 && showSuggestions) {
                e.preventDefault();
                applySuggestion(suggestions[activeSuggestionIndex], e.key === " " ? " " : "\n");
            } else {
                setCurrentWord("");
            }
        }

        if (e.key === "Backspace") {
            const currentPos = textAreaRef.current?.selectionStart || 0;
            // Undo logic: if the cursor is right after the last applied word, revert it
            if (lastAppliedWord && currentPos === lastAppliedWord.pos) {
                e.preventDefault();
                const textBeforeWord = value.substring(0, lastAppliedWord.pos - lastAppliedWord.applied.length - lastAppliedWord.suffixLength);
                const textAfterWord = value.substring(lastAppliedWord.pos);

                const newValue = textBeforeWord + lastAppliedWord.original + textAfterWord;
                onChange(newValue);
                setCurrentWord(lastAppliedWord.original);

                const newPos = textBeforeWord.length + lastAppliedWord.original.length;
                setLastAppliedWord(null);

                setTimeout(() => {
                    if (textAreaRef.current) {
                        textAreaRef.current.setSelectionRange(newPos, newPos);
                        textAreaRef.current.focus();
                    }
                }, 0);
                return;
            }
            setLastAppliedWord(null);
        }

        if (e.key === "Escape") {
            setShowSuggestions(false);
            setCurrentWord("");
        }

        // Quick toggle between languages: Ctrl + L
        if (e.ctrlKey && e.key.toLowerCase() === "l") {
            e.preventDefault();
            onLanguageToggle?.();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        const newCursorPos = e.target.selectionStart;
        setCursorPos(newCursorPos || 0);

        if (language === "te") {
            const textBeforeCursor = newValue.substring(0, newCursorPos || 0);
            const words = textBeforeCursor.split(/[\s\n,.!]+/);
            const lastWord = words[words.length - 1];
            setCurrentWord(lastWord);
        }

        onChange(newValue);
    };

    const applySuggestion = (suggestion: string, suffix: string = " ") => {
        const textBeforeWord = value.substring(0, cursorPos - currentWord.length);
        const textAfterWord = value.substring(cursorPos);
        const newValue = textBeforeWord + suggestion + suffix + textAfterWord;
        const newPos = textBeforeWord.length + suggestion.length + suffix.length;

        setLastAppliedWord({
            original: currentWord,
            applied: suggestion,
            pos: newPos,
            suffixLength: suffix.length
        });

        onChange(newValue);
        setCurrentWord("");
        setShowSuggestions(false);

        // Set cursor position after the applied suggestion
        setTimeout(() => {
            if (textAreaRef.current) {
                textAreaRef.current.focus();
                textAreaRef.current.setSelectionRange(newPos, newPos);
            }
        }, 0);
    };

    const handleSuggestionClick = (suggestion: string) => {
        applySuggestion(suggestion);
    };

    return (
        <div className="relative w-full">
            <textarea
                ref={textAreaRef}
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={rows}
                className={className || "w-full min-h-[500px] p-0 bg-transparent outline-none resize-none text-2xl font-light text-text-main/90 placeholder:text-white/40 focus:placeholder:text-white/60 scrollbar-hide leading-[1.8] py-6 transition-all"}
            />

            {showSuggestions && suggestions.length > 0 && (
                <div
                    style={{
                        top: caretCoords.top + (rows === 2 ? 40 : 60),
                        left: typeof window !== 'undefined' && window.innerWidth < 768
                            ? Math.max(10, Math.min(caretCoords.left, window.innerWidth - 300))
                            : caretCoords.left
                    }}
                    className="absolute z-50 bg-[#0a0a0a]/95 border border-white/[0.08] rounded-[1.5rem] md:rounded-[2rem] shadow-2xl p-3 md:p-5 flex gap-2 flex-wrap max-w-[calc(100vw-40px)] md:max-w-md backdrop-blur-3xl animate-float inner-glow ring-1 ring-white/5"
                >
                    {suggestions.slice(0, 5).map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`group relative flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all ${index === activeSuggestionIndex
                                ? "bg-white text-midnight scale-105 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                                : "bg-white/[0.03] text-text-dim hover:text-white hover:bg-white/[0.08]"
                                }`}
                        >
                            <span className={`flex items-center justify-center w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border text-[7px] md:text-[8px] transition-all ${index === activeSuggestionIndex ? 'border-midnight/20 text-midnight/40' : 'border-white/10 text-white/20'}`}>
                                {index + 1}
                            </span>
                            {suggestion}
                        </button>
                    ))}
                    <div className="absolute -top-1.5 left-6 w-3 h-3 bg-[#0a0a0a] border-l border-t border-white/[0.08] rotate-45 hidden md:block"></div>
                </div>
            )}
        </div>
    );
}
