"use client";

import { useState } from "react";
import Link from "next/link";
import {
    type CaptainApplication,
    type ApplicationStatus,
} from "@/lib/mock-data";
import { transferCaptainApplicationToPipeline, useCaptainApplications } from "@/lib/store";

type TabFilter = "all" | "pending" | "transferred" | "archived";

const tabs: { key: TabFilter; label: string }[] = [
    { key: "all", label: "الكل" },
    { key: "pending", label: "بانتظار المراجعة" },
    { key: "transferred", label: "محوّل للPipeline" },
    { key: "archived", label: "مؤرشف" },
];

const statusConfig: Record<ApplicationStatus, { text: string; cls: string }> = {
    pending: {
        text: "بانتظار المراجعة",
        cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
    approved: {
        text: "محوّل للPipeline",
        cls: "bg-violet-50 text-violet-700 border-violet-200",
    },
    archived: {
        text: "مؤرشف",
        cls: "bg-gray-100 text-gray-500 border-gray-200",
    },
};

const typeLabels: Record<string, string> = {
    taxi: "تكسي",
    subscription: "اشتراك",
};


export default function ApplicationsPage() {
    const [applications, setApplications] =
        useCaptainApplications();
    const [activeTab, setActiveTab] = useState<TabFilter>("all");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [toast, setToast] = useState<string | null>(null);

    const filteredApps = applications.filter((a) => {
        const matchesTab =
            activeTab === "all" ||
            (activeTab === "transferred" ? a.status === "approved" : a.status === activeTab);
        const matchesSearch =
            searchQuery === "" ||
            a.fullName.includes(searchQuery) ||
            a.phone.includes(searchQuery);
        return matchesTab && matchesSearch;
    });

    const updateStatus = (id: string, newStatus: ApplicationStatus) => {
        setApplications((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
    };

    const handleTransferToPipeline = (app: CaptainApplication) => {
        transferCaptainApplicationToPipeline(app);
        setApplications((prev) =>
            prev.map((a) => (a.id === app.id ? { ...a, status: "approved" } : a))
        );
        setToast(`تم تحويل ${app.fullName} إلى Pipeline الكباتن`);
        setTimeout(() => setToast(null), 4000);
    };

    const tabCounts: Record<TabFilter, number> = {
        all: applications.length,
        pending: applications.filter((a) => a.status === "pending").length,
        transferred: applications.filter((a) => a.status === "approved").length,
        archived: applications.filter((a) => a.status === "archived").length,
    };

    return (
        <div>
            {/* Page header */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                    طلبات الانضمام
                </h1>
                <p className="mt-1 text-text-secondary text-sm">
                    راجع طلبات الانضمام وأدِر حالتها
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
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
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

            {/* Applications list */}
            {filteredApps.length === 0 ? (
                <div className="rounded-2xl bg-white border border-border p-12 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-alt text-text-tertiary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-text-secondary">
                        {searchQuery
                            ? "لا توجد نتائج للبحث"
                            : "لا توجد طلبات في هذا القسم"}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredApps.map((app) => (
                        <div
                            key={app.id}
                            className="rounded-2xl bg-white border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                        >
                            {/* Card header */}
                            <button
                                onClick={() =>
                                    setExpandedId(expandedId === app.id ? null : app.id)
                                }
                                className="w-full flex items-center gap-3 p-4 sm:p-5 text-right"
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold text-sm">
                                    {app.fullName.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-sm font-bold text-text-primary truncate">
                                            {app.fullName}
                                        </p>
                                        <span
                                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusConfig[app.status].cls}`}
                                        >
                                            {statusConfig[app.status].text}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-text-tertiary">
                                        <span dir="ltr">{app.phone}</span>
                                        <span>•</span>
                                        <span>
                                            {app.carBrand} {app.carModel}
                                        </span>
                                        <span>•</span>
                                        <span>{app.areaName}</span>
                                    </div>
                                </div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-5 w-5 text-text-tertiary transition-transform duration-200 shrink-0 ${expandedId === app.id ? "rotate-180" : ""
                                        }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Expanded detail */}
                            {expandedId === app.id && (
                                <div className="border-t border-border bg-surface-alt/30 p-4 sm:p-5 space-y-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        <DetailItem label="الاسم" value={app.fullName} />
                                        <DetailItem label="رقم الهاتف" value={app.phone} dir="ltr" />
                                        <DetailItem label="نوع السيارة" value={app.carBrand} />
                                        <DetailItem label="موديل السيارة" value={app.carModel} />
                                        <DetailItem label="سنة الموديل" value={app.modelYear} />
                                        <DetailItem label="رقم اللوحة" value={app.plateNumber} />
                                        <DetailItem label="المدينة" value={app.city} />
                                        <DetailItem label="المنطقة" value={app.areaName} />
                                        <DetailItem
                                            label="نوع التسجيل"
                                            value={app.registrationTypes
                                                .map((t) => typeLabels[t])
                                                .join("، ")}
                                        />
                                        <DetailItem label="تاريخ التقديم" value={app.createdAt} />
                                    </div>

                                    <div className="flex gap-2 pt-2 border-t border-border flex-wrap">
                                        {app.status === "pending" && (
                                            <button
                                                onClick={() => handleTransferToPipeline(app)}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-violet-700 transition-all hover:-translate-y-0.5"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                                                </svg>
                                                تحويل إلى Pipeline
                                            </button>
                                        )}
                                        {app.status === "approved" && (
                                            <Link
                                                href="/admin/pipeline"
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-violet-50 border border-violet-200 px-4 py-2.5 text-xs font-bold text-violet-700 shadow-sm hover:bg-violet-100 transition-all"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                </svg>
                                                عرض في Pipeline
                                            </Link>
                                        )}
                                        {app.status === "pending" && (
                                            <button
                                                onClick={() => updateStatus(app.id, "archived")}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-border px-4 py-2.5 text-xs font-bold text-text-secondary shadow-sm hover:bg-surface-hover transition-all"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                                </svg>
                                                أرشفة
                                            </button>
                                        )}
                                        {app.status === "archived" && (
                                            <button
                                                onClick={() => updateStatus(app.id, "pending")}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-border px-4 py-2.5 text-xs font-bold text-text-secondary shadow-sm hover:bg-surface-hover transition-all"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                                                </svg>
                                                استعادة
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Toast notification */}
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg animate-[fadeIn_0.3s_ease-out]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {toast}
                    <Link href="/admin/pipeline" className="mr-2 underline text-white/80 hover:text-white text-xs">
                        عرض Pipeline ←
                    </Link>
                </div>
            )}
        </div>
    );
}

function DetailItem({
    label,
    value,
    dir,
}: {
    label: string;
    value: string;
    dir?: string;
}) {
    return (
        <div>
            <p className="text-[11px] font-medium text-text-tertiary mb-0.5">
                {label}
            </p>
            <p className="text-sm font-bold text-text-primary" dir={dir}>
                {value}
            </p>
        </div>
    );
}
