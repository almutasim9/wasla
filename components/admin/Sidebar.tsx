"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentAdmin } from "@/lib/store";

const captainSubItems = [
    {
        label: "Pipeline",
        href: "/admin/pipeline",
    },
    {
        label: "طلبات الانضمام",
        href: "/admin/applications",
    },
    {
        label: "الكباتن المعتمدين",
        href: "/admin/captains",
    },
];

const studentSubItems = [
    {
        label: "طلبات الطلاب",
        href: "/admin/students/applications",
    },
    {
        label: "Pipeline التسجيل",
        href: "/admin/students/pipeline",
    },
    {
        label: "قائمة الطلاب",
        href: "/admin/students",
    },
];

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
    const pathname = usePathname();
    const [currentAdmin, setCurrentAdmin] = useCurrentAdmin();
    const isCaptainSection =
        pathname.startsWith("/admin/applications") ||
        pathname.startsWith("/admin/captains") ||
        pathname.startsWith("/admin/pipeline");
    const isStudentSection = pathname.startsWith("/admin/students");
    const isOperationsSection = pathname.startsWith("/admin/operations");
    const isFormsSection = pathname.startsWith("/admin/forms");
    const [captainsOpen, setCaptainsOpen] = useState(isCaptainSection);
    const [studentsOpen, setStudentsOpen] = useState(isStudentSection);

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Brand */}
            <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white font-bold text-lg">
                    و
                </div>
                <div>
                    <span className="text-lg font-bold text-text-primary">وصلة</span>
                    <p className="text-[11px] text-text-tertiary font-medium -mt-0.5">
                        لوحة التحكم
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
                {/* Home */}
                <Link
                    href="/admin"
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${pathname === "/admin"
                        ? "bg-primary-50 text-primary-700 shadow-sm"
                        : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                        }`}
                >
                    <span
                        className={
                            pathname === "/admin" ? "text-primary-600" : "text-text-tertiary"
                        }
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                        </svg>
                    </span>
                    الرئيسية
                </Link>

                <Link
                    href="/admin/operations"
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isOperationsSection
                        ? "bg-primary-50 text-primary-700 shadow-sm"
                        : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                        }`}
                >
                    <span className={isOperationsSection ? "text-primary-600" : "text-text-tertiary"}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 12h9.75M10.5 18h9.75M3.75 6h.008v.008H3.75V6zm0 6h.008v.008H3.75V12zm0 6h.008v.008H3.75V18z" />
                        </svg>
                    </span>
                    العمليات
                </Link>

                <Link
                    href="/admin/forms"
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isFormsSection
                        ? "bg-primary-50 text-primary-700 shadow-sm"
                        : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                        }`}
                >
                    <span className={isFormsSection ? "text-primary-600" : "text-text-tertiary"}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2.25 5H6.75A2.25 2.25 0 014.5 18.75V5.25A2.25 2.25 0 016.75 3h5.379c.597 0 1.169.237 1.591.659l3.621 3.621c.422.422.659.994.659 1.591v9.879A2.25 2.25 0 0116.25 21z" />
                        </svg>
                    </span>
                    الفورمات
                </Link>

                {/* Accounts Management */}
                <Link
                    href="/admin/accounts"
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${pathname === "/admin/accounts"
                        ? "bg-primary-50 text-primary-700 shadow-sm"
                        : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                        }`}
                >
                    <span className={pathname === "/admin/accounts" ? "text-primary-600" : "text-text-tertiary"}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                        </svg>
                    </span>
                    إدارة الحسابات 🛡️
                </Link>

                {/* Captains group */}
                <div>
                    <button
                        onClick={() => setCaptainsOpen(!captainsOpen)}
                        className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isCaptainSection
                            ? "bg-primary-50 text-primary-700"
                            : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                            }`}
                    >
                        <span
                            className={
                                isCaptainSection ? "text-primary-600" : "text-text-tertiary"
                            }
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                        </span>
                        <span className="flex-1 text-right">الكباتن</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 text-text-tertiary transition-transform duration-200 ${captainsOpen ? "rotate-180" : ""
                                }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Sub items */}
                    {captainsOpen && (
                        <div className="mt-1 mr-4 border-r-2 border-border pr-3 space-y-0.5">
                            {captainSubItems.map((item) => {
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`block rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 ${isActive
                                            ? "text-primary-700 bg-primary-50/60"
                                            : "text-text-tertiary hover:text-text-primary hover:bg-surface-hover"
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Students group */}
                <div>
                    <button
                        onClick={() => setStudentsOpen(!studentsOpen)}
                        className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isStudentSection
                            ? "bg-primary-50 text-primary-700"
                            : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                            }`}
                    >
                        <span
                            className={
                                isStudentSection ? "text-primary-600" : "text-text-tertiary"
                            }
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                            </svg>
                        </span>
                        <span className="flex-1 text-right">الطلاب</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 text-text-tertiary transition-transform duration-200 ${studentsOpen ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {studentsOpen && (
                        <div className="mt-1 mr-4 border-r-2 border-border pr-3 space-y-0.5">
                            {studentSubItems.map((item) => {
                                const isActive = pathname === item.href || (item.href !== "/admin/students" && pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`block rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 ${isActive
                                            ? "text-primary-700 bg-primary-50/60"
                                            : "text-text-tertiary hover:text-text-primary hover:bg-surface-hover"
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </nav>

            {/* Bottom */}
            <div className="p-3 border-t border-border space-y-2">
                {currentAdmin && (
                    <div className="flex items-center gap-3 p-2 bg-surface-alt rounded-xl border border-border/50">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-md shadow-indigo-600/10 shrink-0">
                            {currentAdmin.fullName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-text-primary truncate">{currentAdmin.fullName}</p>
                            <p className="text-[10px] text-text-tertiary truncate font-medium">{currentAdmin.email}</p>
                        </div>
                    </div>
                )}
                
                <Link
                    href="/"
                    className="flex items-center gap-3 rounded-xl px-4 py-2 text-xs font-bold text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    الموقع الرئيسي
                </Link>

                <button
                    onClick={() => {
                        setCurrentAdmin(null);
                        onClose();
                    }}
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all text-right"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    تسجيل الخروج
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:right-0 lg:w-64 bg-white border-l border-border z-40">
                {sidebarContent}
            </aside>

            {/* Mobile overlay */}
            {open && (
                <div
                    className="lg:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Mobile sidebar */}
            <aside
                className={`lg:hidden fixed inset-y-0 right-0 z-50 w-72 bg-white border-l border-border shadow-2xl transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 p-1.5 rounded-lg text-text-secondary hover:bg-surface-hover transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {sidebarContent}
            </aside>
        </>
    );
}
