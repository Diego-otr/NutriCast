"use client";

import React from "react";

export interface ItemFormFieldProps {
  label: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  isTextArea?: boolean;
  rows?: number;
  className?: string;
}

export const ItemFormField: React.FC<ItemFormFieldProps> = ({
  label,
  placeholder = "Ingresar...",
  value = "",
  onChange,
  type = "text",
  isTextArea = false,
  rows = 3,
  className = "",
}) => {
  return (
    <div
      className={`px-5 py-3 flex flex-col gap-1.5 border-b border-[#1b3d30]/15 bg-[#c5f8df] ${className}`}
    >
      <label className="font-semibold text-base text-black tracking-wide">
        {label}
      </label>

      {isTextArea ? (
        <textarea
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 rounded-2xl border border-[#1b3d30]/35 bg-[#ffffff] text-black font-mono text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#368482] shadow-sm resize-none transition-all"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 rounded-full border border-[#1b3d30]/35 bg-[#ffffff] text-black font-mono text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#368482] shadow-sm transition-all"
        />
      )}
    </div>
  );
};
