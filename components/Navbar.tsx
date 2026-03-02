"use client";

import { useState } from "react";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Brand */}
                    <a href="#" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white font-bold text-lg">
                            و
                        </div>
                        <span className="text-xl font-bold text-text-primary">وصلة</span>
                    </a>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-8">
                        <a
                            href="#features"
                            className="text-sm font-medium text-text-secondary hover:text-primary-600 transition-colors"
                        >
                            المميزات
                        </a>
                        <a
                            href="#how-it-works"
                            className="text-sm font-medium text-text-secondary hover:text-primary-600 transition-colors"
                        >
                            كيف تعمل
                        </a>
                        <a
                            href="#hero"
                            className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary-700 transition-all hover:shadow-md"
                        >
                            ابدأ الآن
                        </a>
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-text-secondary hover:bg-surface-hover transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            {mobileOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-60" : "max-h-0"
                    }`}
            >
                <div className="px-4 pb-4 pt-2 flex flex-col gap-3">
                    <a
                        href="#features"
                        className="text-sm font-medium text-text-secondary hover:text-primary-600 transition-colors py-2"
                    >
                        المميزات
                    </a>
                    <a
                        href="#how-it-works"
                        className="text-sm font-medium text-text-secondary hover:text-primary-600 transition-colors py-2"
                    >
                        كيف تعمل
                    </a>
                    <a
                        href="#hero"
                        className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary-700 transition-all"
                    >
                        ابدأ الآن
                    </a>
                </div>
            </div>
        </nav>
    );
}
