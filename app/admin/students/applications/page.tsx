"use client";

import { useState } from "react";
import Link from "next/link";
import type { StudentApplication } from "@/lib/mock-data";
import {
    transferStudentApplicationToPipeline,
    useStudentApplications,
    useStudentPipelineApplications,
} from "@/lib/store";

const genderLabel = { male: "ذكر", female: "أنثى" };
const shiftLabel = { morning: "صباحي", evening: "مسائي" };

export default function StudentApplicationsPage() {
    const [applications, setApplications] = useStudentApplications();
    const [pipelineApplications] = useStudentPipelineApplications();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [toast, setToast] = useState<string | null>(null);
    const [toastTone, setToastTone] = useState<"success" | "error">("success");
    const [transferringId, setTransferringId] = useState<string | null>(null);

    const pipelineSourceIds = new Set(
        pipelineApplications.map((item) => item.id.replace(/^sp-/, ""))
    );

    const filteredApplications = applications.filter((app) => {
        const matchesSearch =
            searchQuery === "" ||
            app.fullName.includes(searchQuery) ||
            app.phone.includes(searchQuery) ||
            app.university.includes(searchQuery);
        return matchesSearch;
    });

    const pendingCount = applications.filter((app) => !pipelineSourceIds.has(app.id)).length;
    const transferredCount = applications.length - pendingCount;

    const handleTransfer = async (app: StudentApplication) => {
        setTransferringId(app.id);
        try {
            await transferStudentApplicationToPipeline(app);
        } catch {
            setToastTone("error");
            setToast("تعذر تحويل الطالب إلى Pipeline. تحقق من صلاحيات Supabase لجدول student_pipeline.");
            setTimeout(() => setToast(null), 5000);
            setTransferringId(null);
            return;
        }
        setApplications((prev) =>
            prev.map((item) =>
                item.id === app.id
                    ? {
                        ...item,
                        timeline: [
                            ...item.timeline,
                            {
                                date: new Date().toISOString().split("T")[0],
                                action: "تحويل الطلب إلى Pipeline الطلاب",
                                by: "المدير",
                            },
                        ],
                    }
                    : item
                )
        );
        setToastTone("success");
        setToast(`تم تحويل ${app.fullName} إلى Pipeline الطلاب`);
        setTimeout(() => setToast(null), 4000);
        setTransferringId(null);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                        📬 طلبات الطلاب
                    </h1>
                    <p className="mt-1 text-text-secondary text-sm">
                        الطلبات الواردة من فورمة التسجيل قبل تحويلها للمتابعة
                    </p>
                </div>
                <Link
                    href="/admin/students/pipeline"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 text-white px-4 py-2.5 text-sm font-bold hover:bg-primary-700 shadow-sm transition-all"
                >
                    Pipeline ←
                </Link>
            </div>

            {toast && (
                <div className={`mb-4 rounded-xl border px-4 py-3 text-sm font-bold ${toastTone === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-600"
                    }`}>
                    {toast}
                </div>
            )}

            <div className="flex gap-2.5 mb-5 overflow-x-auto pb-1 scrollbar-hide">
                <div className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-amber-700">
                    <span className="text-base font-extrabold">{pendingCount}</span>
                    <span className="text-[11px] font-medium">بانتظار التحويل</span>
                </div>
                <div className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-violet-700">
                    <span className="text-base font-extrabold">{transferredCount}</span>
                    <span className="text-[11px] font-medium">محوّل للبايب لاين</span>
                </div>
            </div>

            <div className="mb-4">
                <div className="relative max-w-md">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="بحث بالاسم أو رقم الهاتف أو الجامعة..."
                        className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {filteredApplications.length === 0 ? (
                <div className="rounded-2xl bg-white border border-border p-12 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-alt text-2xl">
                        📭
                    </div>
                    <p className="text-sm font-medium text-text-secondary">
                        {searchQuery ? "لا توجد نتائج للبحث" : "لا توجد طلبات طلاب حالياً"}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredApplications.map((app) => {
                        const isTransferred = pipelineSourceIds.has(app.id);
                        return (
                            <div
                                key={app.id}
                                className="rounded-2xl bg-white border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <button
                                    onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                                    className="w-full flex items-center gap-3 p-4 sm:p-5 text-right"
                                >
                                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-bold text-sm ${app.gender === "female" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700"}`}>
                                        {app.fullName.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-bold text-text-primary truncate">
                                                {app.fullName}
                                            </p>
                                            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${isTransferred ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                                                {isTransferred ? "محوّل للبايب لاين" : "بانتظار التحويل"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-text-tertiary">
                                            <span dir="ltr">{app.phone}</span>
                                            <span>{app.university}</span>
                                            <span>{app.area}</span>
                                        </div>
                                    </div>
                                    <span className="text-text-tertiary">{expandedId === app.id ? "⌃" : "⌄"}</span>
                                </button>

                                {expandedId === app.id && (
                                    <div className="border-t border-border bg-surface-alt/30 p-4 sm:p-5 space-y-4">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            <DetailItem label="الاسم" value={app.fullName} />
                                            <DetailItem label="رقم الهاتف" value={app.phone} dir="ltr" />
                                            <DetailItem label="الجنس" value={genderLabel[app.gender]} />
                                            <DetailItem label="المنطقة" value={app.area} />
                                            <DetailItem label="أقرب نقطة" value={app.landmark} />
                                            <DetailItem label="الجامعة" value={app.university} />
                                            <DetailItem label="موقع الجامعة" value={app.universityLocation} />
                                            <DetailItem label="الدوام" value={shiftLabel[app.shift]} />
                                            <DetailItem label="تاريخ الطلب" value={app.createdAt} />
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                disabled={isTransferred || transferringId === app.id}
                                                onClick={() => handleTransfer(app)}
                                                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${isTransferred || transferringId === app.id
                                                    ? "bg-gray-100 text-text-tertiary cursor-not-allowed"
                                                    : "bg-primary-600 text-white hover:bg-primary-700 shadow-sm"
                                                    }`}
                                            >
                                                {isTransferred ? "تم التحويل" : transferringId === app.id ? "جاري التحويل..." : "تحويل إلى Pipeline"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function DetailItem({ label, value, dir }: { label: string; value: string; dir?: "ltr" | "rtl" }) {
    return (
        <div>
            <p className="text-[11px] font-medium text-text-tertiary mb-1">{label}</p>
            <p dir={dir} className="text-sm font-bold text-text-primary break-words">
                {value}
            </p>
        </div>
    );
}
