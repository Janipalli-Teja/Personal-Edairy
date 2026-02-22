import { useState, useCallback } from 'react';

export const useTransliteration = (language: 'en' | 'te') => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getSuggestions = useCallback(async (text: string) => {
        if (language === 'en' || !text.trim()) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(
                `https://www.google.com/inputtools/request?ime=transliteration_en_te&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8&app=jsapi&text=${encodeURIComponent(text)}`
            );
            const data = await response.json();
            if (data[0] === 'SUCCESS') {
                setSuggestions(data[1][0][1]);
            }
        } catch (error) {
            console.error('Transliteration error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [language]);

    return { suggestions, getSuggestions, isLoading };
};
