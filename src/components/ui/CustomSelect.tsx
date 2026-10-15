import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export interface CustomSelectOption {
  value: string | number;
  label: string;
  sublabel?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface CustomSelectProps {
  value: string | number;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'subtle' | 'form';
  icon?: React.ReactNode;
  prefixLabel?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  id?: string;
  name?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  className = '',
  menuClassName = '',
  size = 'md',
  variant = 'default',
  icon,
  prefixLabel,
  searchable,
  searchPlaceholder,
  id,
}: CustomSelectProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-enable search if more than 8 options unless explicitly disabled
  const shouldEnableSearch = searchable !== undefined ? searchable : options.length > 8;

  const selectedOption = useMemo(() => {
    return options.find(opt => String(opt.value) === String(value));
  }, [options, value]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter(opt =>
      opt.label.toLowerCase().includes(q) ||
      (opt.sublabel && opt.sublabel.toLowerCase().includes(q))
    );
  }, [options, searchQuery]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      if (shouldEnableSearch) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      }
    }
  }, [isOpen, shouldEnableSearch]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (val: string | number, optDisabled?: boolean) => {
    if (optDisabled) return;
    onChange(String(val));
    setIsOpen(false);
  };

  // Size styling classes
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-xs min-h-[34px]',
    md: 'py-2.5 px-4 text-xs sm:text-sm min-h-[42px]',
    lg: 'py-3.5 px-5 text-sm sm:text-base min-h-[50px]',
  }[size];

  // Variant styling classes
  const variantClasses = {
    default: 'bg-white border-[#e8dcd8] text-[#4a1c24] hover:border-[#a0525f]/60 hover:shadow-sm focus:border-[#a0525f]',
    subtle: 'bg-[#FCF8F9] border-[#e8dcd8]/70 text-[#4a1c24] hover:bg-[#FDF5F6] hover:border-[#a0525f]/50',
    form: 'bg-[#FCF8F9] border-[#e8dcd8] text-[#4a1c24] hover:bg-white focus:bg-white focus:border-[#a0525f] focus:ring-2 focus:ring-[#a0525f]/15',
  }[variant];

  return (
    <div
      ref={containerRef}
      className={`relative inline-block w-full select-none ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      id={id}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-xl border transition-all duration-200 outline-none cursor-pointer ${sizeClasses} ${variantClasses} ${
          disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
        } ${isOpen ? 'border-[#a0525f] ring-2 ring-[#a0525f]/15 shadow-sm' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0 truncate">
          {icon && <span className="text-[#a0525f] shrink-0">{icon}</span>}
          {prefixLabel && (
            <span className="text-gray-400 font-normal shrink-0 text-xs sm:text-sm">
              {prefixLabel}
            </span>
          )}
          <span className={`truncate font-medium ${selectedOption ? 'text-[#4a1c24]' : 'text-gray-400'}`}>
            {selectedOption ? selectedOption.label : (placeholder || (isRTL ? 'اختر...' : 'Select...'))}
          </span>
          {selectedOption?.sublabel && (
            <span className="text-xs text-gray-400 font-normal shrink-0">
              {selectedOption.sublabel}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-[#a0525f] shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-[#a0525f]' : 'text-[#4a1c24]/50'
          }`}
        />
      </button>

      {/* Dropdown Menu Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute z-50 mt-1.5 w-full bg-white/98 backdrop-blur-md rounded-2xl border border-[#e8dcd8] shadow-xl shadow-[#4a1c24]/8 py-1.5 overflow-hidden ${menuClassName}`}
            style={{ maxHeight: '360px' }}
          >
            {/* Search Input for Long Lists */}
            {shouldEnableSearch && (
              <div className="p-2 border-b border-[#e8dcd8]/60 relative">
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute start-3 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder || (isRTL ? 'بحث...' : 'Search...')}
                    className="w-full bg-[#fdfaf8] border border-[#e8dcd8] rounded-xl py-1.5 ps-8 pe-7 text-xs text-[#4a1c24] placeholder-gray-400 focus:outline-none focus:border-[#a0525f] focus:bg-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute end-2 text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options List */}
            <div
              ref={listRef}
              className="max-h-[260px] overflow-y-auto py-1 custom-select-scrollbar"
              role="listbox"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = String(option.value) === String(value);
                  return (
                    <div
                      key={String(option.value)}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(option.value, option.disabled)}
                      className={`flex items-center justify-between px-3.5 py-2.5 mx-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
                        option.disabled
                          ? 'opacity-40 cursor-not-allowed text-gray-400'
                          : isSelected
                          ? 'bg-[#fcf5f6] text-[#a0525f] font-bold shadow-2xs'
                          : 'text-[#4a1c24] hover:bg-[#fdfaf8] hover:text-[#a0525f]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {option.icon && (
                          <span className={`shrink-0 ${isSelected ? 'text-[#a0525f]' : 'text-gray-400'}`}>
                            {option.icon}
                          </span>
                        )}
                        <span className="truncate">{option.label}</span>
                        {option.sublabel && (
                          <span className="text-[11px] text-gray-400 font-normal shrink-0">
                            {option.sublabel}
                          </span>
                        )}
                      </div>

                      {isSelected && (
                        <Check className="w-4 h-4 text-[#a0525f] shrink-0" strokeWidth={2.5} />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-6 px-4 text-center text-xs text-gray-400">
                  {isRTL ? 'لا توجد نتائج مطابقة' : 'No matching results'}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-select-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-select-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-select-scrollbar::-webkit-scrollbar-thumb {
          background: #e8dcd8;
          border-radius: 9999px;
        }
        .custom-select-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0525f;
        }
      `}</style>
    </div>
  );
}
