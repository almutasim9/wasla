"use client";

import { useState } from "react";

interface ScheduleModalProps {
    captainName: string;
    onClose: () => void;
    onSchedule: (data: {
        date: string;
        time: string;
        location: string;
        assignedTo: string;
    }) => void;
}

export default function ScheduleModal({
    captainName,
    onClose,
    onSchedule,
}: ScheduleModalProps) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("مكتب وصلة — شارع النبي يونس");
    const [assignedTo, setAssignedTo] = useState("");

    const canSubmit = date && time && location;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-border overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border">
                    <h3 className="text-base font-bold text-text-primary">
                        📅 جدولة مقابلة
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-text-tertiary hover:bg-surface-hover transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                    {/* Captain name */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-alt">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 font-bold text-sm">
                            {captainName.charAt(0)}
                        </div>
                        <p className="text-sm font-bold text-text-primary">{captainName}</p>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1.5">
                                التاريخ <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full rounded-xl border border-border bg-surface-alt px-3 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1.5">
                                الوقت <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full rounded-xl border border-border bg-surface-alt px-3 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">
                            مكان المقابلة <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="مثال: مكتب وصلة — شارع النبي يونس"
                            className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Assigned to */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">
                            المقيّم المسؤول{" "}
                            <span className="text-text-tertiary text-xs">(اختياري)</span>
                        </label>
                        <input
                            type="text"
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value)}
                            placeholder="اسم المقيّم"
                            className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-2 p-5 border-t border-border bg-surface-alt/50">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-border bg-white px-4 py-3 text-sm font-bold text-text-secondary hover:bg-surface-hover transition-all"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={() =>
                            canSubmit && onSchedule({ date, time, location, assignedTo })
                        }
                        disabled={!canSubmit}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-violet-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        📅 جدولة المقابلة
                    </button>
                </div>
            </div>
        </div>
    );
}
