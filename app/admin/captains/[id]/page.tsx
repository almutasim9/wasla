"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { mockCaptains, type Captain } from "@/lib/mock-data";

const typeLabels: Record<string, string> = {
    taxi: "تكسي",
    subscription: "اشتراك",
};

export default function CaptainProfilePage() {
    const params = useParams();
    const captainId = params.id as string;

    const initialCaptain = mockCaptains.find((c) => c.id === captainId);
    const [captain, setCaptain] = useState<Captain | undefined>(initialCaptain);

    if (!captain) {
        return (
            <div className="text-center py-20">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-alt text-text-tertiary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                    </svg>
                </div>
                <p className="text-sm font-medium text-text-secondary mb-4">
                    لم يتم العثور على هذا الكابتن
                </p>
                <Link
                    href="/admin/captains"
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                    ← الرجوع للكباتن المعتمدين
                </Link>
            </div>
        );
    }

    const toggleStatus = () => {
        setCaptain((prev) =>
            prev
                ? {
                    ...prev,
                    accountStatus:
                        prev.accountStatus === "active" ? "suspended" : "active",
                }
                : prev
        );
    };

    return (
        <div>
            {/* Back link */}
            <Link
                href="/admin/captains"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary-600 transition-colors mb-6"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                الرجوع للكباتن المعتمدين
            </Link>

            {/* Profile header */}
            <div className="rounded-2xl bg-white border border-border shadow-sm p-5 sm:p-6 mb-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Avatar */}
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-2xl shadow-lg shadow-primary-500/25">
                        {captain.fullName.charAt(0)}
                    </div>

                    {/* Name and meta */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary">
                                {captain.fullName}
                            </h1>
                            <span
                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${captain.accountStatus === "active"
                                        ? "bg-secondary-50 text-secondary-700 border-secondary-200"
                                        : "bg-red-50 text-red-600 border-red-200"
                                    }`}
                            >
                                {captain.accountStatus === "active" ? "نشط" : "معلّق"}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-text-tertiary flex-wrap">
                            <span dir="ltr">{captain.phone}</span>
                            <span>•</span>
                            <span dir="ltr">{captain.email}</span>
                        </div>
                    </div>

                    {/* Action */}
                    <button
                        onClick={toggleStatus}
                        className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5 ${captain.accountStatus === "active"
                                ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                                : "bg-secondary-500 text-white shadow-sm hover:bg-secondary-600"
                            }`}
                    >
                        {captain.accountStatus === "active" ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                                تعليق الحساب
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                تفعيل الحساب
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Personal info */}
                <div className="rounded-2xl bg-white border border-border shadow-sm p-5">
                    <h2 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-100 text-primary-600 text-xs font-extrabold">
                            ١
                        </span>
                        المعلومات الشخصية
                    </h2>
                    <div className="space-y-3">
                        <ProfileField label="الاسم الكامل" value={captain.fullName} />
                        <ProfileField label="رقم الهاتف" value={captain.phone} dir="ltr" />
                        <ProfileField
                            label="البريد الإلكتروني"
                            value={captain.email}
                            dir="ltr"
                        />
                    </div>
                </div>

                {/* Vehicle info */}
                <div className="rounded-2xl bg-white border border-border shadow-sm p-5">
                    <h2 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-100 text-primary-600 text-xs font-extrabold">
                            ٢
                        </span>
                        معلومات السيارة
                    </h2>
                    <div className="space-y-3">
                        <ProfileField label="نوع السيارة" value={captain.carBrand} />
                        <ProfileField label="موديل السيارة" value={captain.carModel} />
                        <ProfileField label="سنة الموديل" value={captain.modelYear} />
                        <ProfileField label="رقم اللوحة" value={captain.plateNumber} />
                    </div>
                </div>

                {/* Location */}
                <div className="rounded-2xl bg-white border border-border shadow-sm p-5">
                    <h2 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-100 text-primary-600 text-xs font-extrabold">
                            ٣
                        </span>
                        الموقع
                    </h2>
                    <div className="space-y-3">
                        <ProfileField label="المدينة" value={captain.city} />
                        <ProfileField label="المنطقة" value={captain.areaName} />
                    </div>
                </div>

                {/* Registration */}
                <div className="rounded-2xl bg-white border border-border shadow-sm p-5">
                    <h2 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-100 text-primary-600 text-xs font-extrabold">
                            ٤
                        </span>
                        التسجيل والحالة
                    </h2>
                    <div className="space-y-3">
                        <ProfileField
                            label="نوع التسجيل"
                            value={captain.registrationTypes
                                .map((t) => typeLabels[t])
                                .join("، ")}
                        />
                        <ProfileField label="تاريخ التقديم" value={captain.createdAt} />
                        <ProfileField label="تاريخ الموافقة" value={captain.approvedAt} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileField({
    label,
    value,
    dir,
}: {
    label: string;
    value: string;
    dir?: string;
}) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <span className="text-xs font-medium text-text-tertiary">{label}</span>
            <span className="text-sm font-bold text-text-primary" dir={dir}>
                {value}
            </span>
        </div>
    );
}
