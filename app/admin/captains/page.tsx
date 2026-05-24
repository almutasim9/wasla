"use client";

import { useState } from "react";
import Link from "next/link";
import {
    type AccountStatus,
} from "@/lib/mock-data";
import { useCaptains } from "@/lib/store";

const typeLabels: Record<string, string> = {
    taxi: "تكسي",
    subscription: "اشتراك",
};

const statusConfig: Record<AccountStatus, { text: string; cls: string }> = {
    active: {
        text: "نشط",
        cls: "bg-secondary-50 text-secondary-700 border-secondary-200",
    },
    suspended: {
        text: "معلّق",
        cls: "bg-red-50 text-red-600 border-red-200",
    },
};

export default function CaptainsPage() {
    const [captains, setCaptains] = useCaptains();
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = captains.filter(
        (c) =>
            searchQuery === "" ||
            c.fullName.includes(searchQuery) ||
            c.phone.includes(searchQuery)
    );

    const activeCaptains = captains.filter(
        (c) => c.accountStatus === "active"
    ).length;
    const suspendedCaptains = captains.filter(
        (c) => c.accountStatus === "suspended"
    ).length;

    const toggleStatus = (id: string) => {
        setCaptains((prev) =>
            prev.map((c) =>
                c.id === id
                    ? {
                        ...c,
                        accountStatus:
                            c.accountStatus === "active" ? "suspended" : "active",
                    }
                    : c
            )
        );
    };

    return (
        <div>
            {/* Page header */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                    الكباتن المعتمدين
                </h1>
                <p className="mt-1 text-text-secondary text-sm">
                    إدارة حسابات الكباتن اللي تم الموافقة عليهم
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="rounded-xl bg-white border border-border p-4 shadow-sm">
                    <p className="text-2xl font-extrabold text-text-primary">
                        {captains.length}
                    </p>
                    <p className="text-[11px] font-medium text-text-tertiary mt-0.5">
                        إجمالي الكباتن
                    </p>
                </div>
                <div className="rounded-xl bg-white border border-border p-4 shadow-sm">
                    <p className="text-2xl font-extrabold text-secondary-600">
                        {activeCaptains}
                    </p>
                    <p className="text-[11px] font-medium text-text-tertiary mt-0.5">
                        نشط
                    </p>
                </div>
                <div className="rounded-xl bg-white border border-border p-4 shadow-sm">
                    <p className="text-2xl font-extrabold text-red-500">
                        {suspendedCaptains}
                    </p>
                    <p className="text-[11px] font-medium text-text-tertiary mt-0.5">
                        معلّق
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="mb-5">
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

            {/* Captains list */}
            {filtered.length === 0 ? (
                <div className="rounded-2xl bg-white border border-border p-12 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-alt text-text-tertiary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-text-secondary">
                        {searchQuery ? "لا توجد نتائج للبحث" : "لا يوجد كباتن معتمدين بعد"}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((captain) => (
                        <div
                            key={captain.id}
                            className="rounded-2xl bg-white border border-border shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-3">
                                {/* Avatar */}
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold text-sm">
                                    {captain.fullName.charAt(0)}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-sm font-bold text-text-primary">
                                            {captain.fullName}
                                        </p>
                                        <span
                                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusConfig[captain.accountStatus].cls
                                                }`}
                                        >
                                            {statusConfig[captain.accountStatus].text}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 mt-1 text-xs text-text-tertiary flex-wrap">
                                        <span dir="ltr">{captain.phone}</span>
                                        <span>•</span>
                                        <span dir="ltr">{captain.email}</span>
                                    </div>

                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-text-secondary">
                                        <span>
                                            {captain.carBrand} {captain.carModel} — {captain.modelYear}
                                        </span>
                                        <span>•</span>
                                        <span>{captain.areaName}</span>
                                        <span>•</span>
                                        <span>
                                            {captain.registrationTypes
                                                .map((t) => typeLabels[t])
                                                .join("، ")}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <Link
                                        href={`/admin/captains/${captain.id}`}
                                        className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-[11px] font-bold text-text-secondary hover:bg-surface-hover transition-all"
                                    >
                                        التفاصيل
                                    </Link>
                                    <button
                                        onClick={() => toggleStatus(captain.id)}
                                        className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${captain.accountStatus === "active"
                                                ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                                                : "bg-secondary-50 text-secondary-700 border border-secondary-200 hover:bg-secondary-100"
                                            }`}
                                    >
                                        {captain.accountStatus === "active" ? "تعليق" : "تفعيل"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
