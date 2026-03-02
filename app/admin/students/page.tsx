"use client";

import { useState } from "react";
import Link from "next/link";
import {
    studentApplications,
    studentStageConfig,
    type StudentApplication,
    type StudentPipelineStage,
} from "@/lib/mock-data";

type TabFilter = "all" | "active" | "suspended" | "pending";

const tabs: { key: TabFilter; label: string }[] = [
    { key: "all", label: "الكل" },
    { key: "active", label: "فعّال" },
    { key: "pending", label: "قيد التسجيل" },
    { key: "suspended", label: "معلّق" },
];

const genderLabel = { male: "ذكر", female: "أنثى" };
const shiftLabel = { morning: "صباحي ☀️", evening: "مسائي 🌙" };

export default function StudentsPage() {
    const [students] = useState<StudentApplication[]>(studentApplications);
    const [activeTab, setActiveTab] = useState<TabFilter>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredStudents = students.filter((s) => {
        const matchesTab =
            activeTab === "all" ||
            (activeTab === "active" && s.status === "active") ||
            (activeTab === "suspended" && s.status === "suspended") ||
            (activeTab === "pending" && s.status === "pending");
        const matchesSearch =
            searchQuery === "" ||
            s.fullName.includes(searchQuery) ||
            s.phone.includes(searchQuery);
        return matchesTab && matchesSearch;
    });

    const tabCounts: Record<TabFilter, number> = {
        all: students.length,
        active: students.filter((s) => s.status === "active").length,
        pending: students.filter((s) => s.status === "pending").length,
        suspended: students.filter((s) => s.status === "suspended").length,
    };

    const statusConfig: Record<string, { text: string; cls: string }> = {
        active: { text: "فعّال", cls: "bg-green-50 text-green-700 border-green-200" },
        suspended: { text: "معلّق", cls: "bg-red-50 text-red-600 border-red-200" },
        pending: { text: "قيد التسجيل", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    };

    return (
        <div>
            {/* Page header */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                    🎓 قائمة الطلاب
                </h1>
                <p className="mt-1 text-text-secondary text-sm">
                    عرض جميع الطلاب المسجلين وإدارة ملفاتهم
                </p>
            </div>

            {/* Search */}
            <div className="mb-4">
                <div className="relative max-w-md">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary pointer-events-none"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="بحث بالاسم أو رقم الهاتف..."
                        className="w-full rounded-xl border border-border bg-white pr-10 pl-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${activeTab === tab.key
                            ? "bg-primary-600 text-white shadow-sm"
                            : "bg-white text-text-secondary border border-border hover:bg-surface-hover"
                            }`}
                    >
                        {tab.label}
                        <span
                            className={`inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-md text-[11px] font-bold ${activeTab === tab.key
                                ? "bg-white/20 text-white"
                                : "bg-surface-alt text-text-tertiary"
                                }`}
                        >
                            {tabCounts[tab.key]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Students list */}
            {filteredStudents.length === 0 ? (
                <div className="rounded-2xl bg-white border border-border p-12 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-alt text-2xl">
                        🎓
                    </div>
                    <p className="text-sm font-medium text-text-secondary">
                        {searchQuery ? "لا توجد نتائج للبحث" : "لا يوجد طلاب في هذا القسم"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStudents.map((student) => (
                        <Link
                            key={student.id}
                            href={`/admin/students/${student.id}`}
                            className="group rounded-2xl bg-white border border-border shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                        >
                            {/* Header */}
                            <div className="flex items-start gap-3 mb-4">
                                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-bold text-sm ${student.gender === "female"
                                    ? "bg-pink-100 text-pink-700"
                                    : "bg-blue-100 text-blue-700"
                                    }`}>
                                    {student.fullName.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-text-primary truncate group-hover:text-primary-600 transition-colors">
                                        {student.fullName}
                                    </p>
                                    <p className="text-xs text-text-tertiary mt-0.5" dir="ltr">
                                        {student.phone}
                                    </p>
                                </div>
                                <span
                                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold shrink-0 ${statusConfig[student.status]?.cls}`}
                                >
                                    {statusConfig[student.status]?.text}
                                </span>
                            </div>

                            {/* Details grid */}
                            <div className="space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-text-tertiary">🏫 الجامعة</span>
                                    <span className="font-medium text-text-primary truncate mr-2 max-w-[60%] text-left">{student.university}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-text-tertiary">📍 المنطقة</span>
                                    <span className="font-medium text-text-primary">{student.area}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-text-tertiary">⏰ الدوام</span>
                                    <span className="font-medium text-text-primary">{shiftLabel[student.shift]}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-text-tertiary">🧑 الجنس</span>
                                    <span className="font-medium text-text-primary">{genderLabel[student.gender]}</span>
                                </div>
                            </div>

                            {/* Pipeline stage badge */}
                            <div className="mt-4 pt-3 border-t border-border">
                                <span className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold ${studentStageConfig[student.stage].bgColor} ${studentStageConfig[student.stage].color} ${studentStageConfig[student.stage].borderColor}`}>
                                    {studentStageConfig[student.stage].emoji} {studentStageConfig[student.stage].label}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
