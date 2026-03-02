"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-surface-alt">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main area */}
            <div className="lg:mr-64">
                {/* Mobile top bar */}
                <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-lg border-b border-border px-4 h-14">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-sm">
                            و
                        </div>
                        <span className="text-base font-bold text-text-primary">
                            لوحة التحكم
                        </span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg text-text-secondary hover:bg-surface-hover transition-colors"
                        aria-label="فتح القائمة"
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
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </header>

                {/* Page content */}
                <main className="p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
