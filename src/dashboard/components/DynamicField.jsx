import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DynamicField = ({ field, value, onChange, error }) => {
    const { field_name, field_type, options } = field;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const baseInputClasses = `
        w-full bg-secondary/50 border rounded-2xl px-5 py-4 
        text-[12px] font-black uppercase tracking-widest 
        focus:outline-none transition-all duration-300
        ${error ? 'border-rose-500/50 focus:border-rose-500' : 'border-border focus:border-primary/50'}
    `;

    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
                {field_name}
            </label>

            <div className="relative group/df" ref={dropdownRef}>
                {field_type === 'select' ? (
                    <div className="relative">
                        <div
                            onClick={() => setIsOpen(!isOpen)}
                            className={`${baseInputClasses} flex items-center justify-between cursor-pointer group/field ${isOpen ? 'bg-secondary/80 border-primary/50' : ''}`}
                        >
                            <span className={value ? 'text-white' : 'text-muted-foreground'}>
                                {value ? value.toUpperCase() : `SELECT ${field_name.toUpperCase()}`}
                            </span>
                            <ChevronDown
                                className={`text-muted-foreground transition-transform duration-500 group-hover/field:text-primary ${isOpen ? 'rotate-180 text-primary' : ''}`}
                                size={16}
                            />
                        </div>

                        <AnimatePresence mode="wait">
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "circOut" }}
                                    className="absolute z-[100] top-[calc(100%+8px)] left-0 w-full bg-[#121418]/95 backdrop-blur-2xl border border-white/10 rounded-[24px] overflow-hidden shadow-2xl py-3"
                                >
                                    <div className="max-h-60 overflow-y-auto custom-scrollbar px-2 space-y-1">
                                        {options && options.map((opt, index) => (
                                            <motion.div
                                                key={index}
                                                whileHover={{ x: 4 }}
                                                onClick={() => {
                                                    onChange(opt);
                                                    setIsOpen(false);
                                                }}
                                                className={`
                                                    px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest 
                                                    cursor-pointer transition-all flex items-center justify-between group/item
                                                    ${value === opt
                                                        ? 'bg-primary text-white shadow-lg shadow-primary/20 font-bold'
                                                        : 'text-muted-foreground hover:bg-white/5 hover:text-white'}
                                                `}
                                            >
                                                <span>{opt.toUpperCase()}</span>
                                                {value === opt ? (
                                                    <Check size={14} className="text-white" />
                                                ) : (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover/item:bg-primary/50 transition-colors" />
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={`ENTER ${field_name.toUpperCase()}...`}
                        className={baseInputClasses}
                    />
                )}

                {/* Visual Accent */}
                {!isOpen && (
                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-primary scale-x-0 group-focus-within/df:scale-x-100 transition-transform duration-500 rounded-full" />
                )}
            </div>

            {error && (
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest ml-1 animate-pulse">
                    {error}
                </p>
            )}
        </div>
    );
};

export default DynamicField;
