"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { useCurrentAdmin, useAdmins } from "@/lib/store";


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentAdmin, setCurrentAdmin] = useCurrentAdmin();
    const [admins] = useAdmins();

    // Authentication form state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("يرجى ملء جميع الحقول المطلوبة.");
            return;
        }

        // Find existing admin matching credentials
        const found = admins.find(
            (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
        );
        if (found) {
            setCurrentAdmin(found);
        } else {
            setError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
        }
    };

    if (!currentAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-alt px-4 relative overflow-hidden">
                {/* Decorative background orbs */}
                <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary-200/40 blur-3xl -z-10 animate-pulse duration-[8000ms]" />
                <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-secondary-200/30 blur-3xl -z-10 animate-pulse duration-[6000ms]" />

                <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-border/80 rounded-3xl p-8 shadow-2xl transition-all duration-300">
                    <div className="text-center mb-8">
                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white font-extrabold text-2xl shadow-lg shadow-primary-600/20 mb-4">
                            وصلة
                        </div>
                        <h1 className="text-2xl font-extrabold text-text-primary">
                            تسجيل دخول المدراء
                        </h1>
                        <p className="mt-2 text-sm text-text-secondary">
                            أهلاً بك مجدداً في نظام إدارة منصة وصلة
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold text-center">
                                ⚠️ {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-text-secondary mb-1">
                                البريد الإلكتروني
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@wasla.com"
                                dir="ltr"
                                className="w-full rounded-xl border border-border bg-white/50 px-4 py-3 text-sm font-medium text-text-primary placeholder-text-tertiary focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-text-secondary mb-1">
                                كلمة المرور
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                dir="ltr"
                                className="w-full rounded-xl border border-border bg-white/50 px-4 py-3 text-sm font-medium text-text-primary placeholder-text-tertiary focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary-600/25 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/30 transition-all duration-200"
                        >
                            تسجيل الدخول
                        </button>
                    </form>
                </div>
            </div>
        );
    }

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
