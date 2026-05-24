"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
    stageConfig,
} from "@/lib/mock-data";
import { usePipelineApplications } from "@/lib/store";

const typeLabels: Record<string, string> = {
    taxi: "تكسي",
    subscription: "اشتراك",
};

export default function PipelineDetailPage() {
    const params = useParams();
    const appId = params.id as string;
    const [pipelineApplications] = usePipelineApplications();
    const app = pipelineApplications.find((a) => a.id === appId);

    if (!app) {
        return (
            <div className="text-center py-20">
                <p className="text-sm font-medium text-text-secondary mb-4">
                    لم يتم العثور على هذا الطلب
                </p>
                <Link
                    href="/admin/pipeline"
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                    ← الرجوع للـ Pipeline
                </Link>
            </div>
        );
    }

    const stage = stageConfig[app.stage];

    return (
        <div>
            {/* Back link */}
            <Link
                href="/admin/pipeline"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary-600 transition-colors mb-6"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                الرجوع للـ Pipeline
            </Link>

            {/* Header */}
            <div className="rounded-2xl bg-white border border-border shadow-sm p-5 sm:p-6 mb-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${stage.bgColor} ${stage.color} font-bold text-2xl`}
                    >
                        {app.fullName.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary">
                                {app.fullName}
                            </h1>
                            <span
                                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${stage.bgColor} ${stage.color} ${stage.borderColor}`}
                            >
                                {stage.emoji} {stage.label}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-text-tertiary flex-wrap">
                            <span dir="ltr">{app.phone}</span>
                            <span>•</span>
                            <span>
                                {app.carBrand} {app.carModel}
                            </span>
                            <span>•</span>
                            <span>{app.areaName}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left column — Details */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Application details */}
                    <div className="rounded-2xl bg-white border border-border shadow-sm p-5">
                        <h2 className="text-sm font-bold text-text-primary mb-4">
                            📄 بيانات الطلب
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <Field label="الاسم الكامل" value={app.fullName} />
                            <Field label="رقم الهاتف" value={app.phone} dir="ltr" />
                            <Field label="نوع السيارة" value={app.carBrand} />
                            <Field label="موديل السيارة" value={app.carModel} />
                            <Field label="سنة الموديل" value={app.modelYear} />
                            <Field label="رقم اللوحة" value={app.plateNumber} />
                            <Field label="المدينة" value={app.city} />
                            <Field label="المنطقة" value={app.areaName} />
                            <Field
                                label="نوع التسجيل"
                                value={app.registrationTypes
                                    .map((t) => typeLabels[t])
                                    .join("، ")}
                            />
                            <Field label="تاريخ التقديم" value={app.createdAt} />
                        </div>
                    </div>

                    {/* Interview details */}
                    {app.interview && (
                        <div className="rounded-2xl bg-white border border-border shadow-sm p-5">
                            <h2 className="text-sm font-bold text-text-primary mb-4">
                                📅 تفاصيل المقابلة
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="التاريخ" value={app.interview.date} />
                                <Field label="الوقت" value={app.interview.time} />
                                <Field label="المكان" value={app.interview.location} />
                                {app.interview.assignedTo && (
                                    <Field label="المقيّم" value={app.interview.assignedTo} />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Inspection report */}
                    {app.inspection && (
                        <div className="rounded-2xl bg-white border border-border shadow-sm p-5">
                            <h2 className="text-sm font-bold text-text-primary mb-4">
                                📋 تقرير التقييم
                            </h2>

                            {/* Ratings */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-[11px] font-medium text-text-tertiary mb-1">
                                        نظافة السيارة
                                    </p>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <span
                                                key={s}
                                                className={`text-lg ${s <= app.inspection!.cleanliness
                                                        ? "text-amber-400"
                                                        : "text-gray-200"
                                                    }`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[11px] font-medium text-text-tertiary mb-1">
                                        سلوك السائق
                                    </p>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <span
                                                key={s}
                                                className={`text-lg ${s <= app.inspection!.driverBehavior
                                                        ? "text-amber-400"
                                                        : "text-gray-200"
                                                    }`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Checklist */}
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                                {[
                                    { label: "التبريد", ok: app.inspection.acWorking },
                                    { label: "التدفئة", ok: app.inspection.heatingWorking },
                                    { label: "أحزمة", ok: app.inspection.seatbelts },
                                    { label: "أضواء", ok: app.inspection.lights },
                                    { label: "مرايا", ok: app.inspection.mirrors },
                                    { label: "إطارات", ok: app.inspection.tires },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className={`rounded-lg border px-2 py-1.5 text-center text-[10px] font-bold ${item.ok
                                                ? "bg-secondary-50 border-secondary-200 text-secondary-700"
                                                : "bg-red-50 border-red-200 text-red-600"
                                            }`}
                                    >
                                        {item.ok ? "✅" : "❌"} {item.label}
                                    </div>
                                ))}
                            </div>

                            {/* Notes + result */}
                            {app.inspection.notes && (
                                <div className="p-3 rounded-xl bg-surface-alt border border-border mb-3">
                                    <p className="text-[11px] font-medium text-text-tertiary mb-1">
                                        ملاحظات
                                    </p>
                                    <p className="text-sm text-text-primary">
                                        {app.inspection.notes}
                                    </p>
                                </div>
                            )}

                            <div
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${app.inspection.result === "pass"
                                        ? "bg-secondary-50 text-secondary-700 border-secondary-200"
                                        : app.inspection.result === "needs_improvement"
                                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                            : "bg-red-50 text-red-600 border-red-200"
                                    }`}
                            >
                                {app.inspection.result === "pass"
                                    ? "✅ ملائم للعمل"
                                    : app.inspection.result === "needs_improvement"
                                        ? "🔧 بحاجة تحسين"
                                        : "❌ غير ملائم"}
                            </div>
                        </div>
                    )}

                    {/* Rejection reason */}
                    {app.rejectionReason && (
                        <div className="rounded-2xl bg-red-50 border border-red-200 shadow-sm p-5">
                            <h2 className="text-sm font-bold text-red-700 mb-2">
                                ❌ سبب الرفض
                            </h2>
                            <p className="text-sm text-red-600">{app.rejectionReason}</p>
                        </div>
                    )}
                </div>

                {/* Right column — Timeline */}
                <div className="lg:col-span-1">
                    <div className="rounded-2xl bg-white border border-border shadow-sm p-5 sticky top-6">
                        <h2 className="text-sm font-bold text-text-primary mb-4">
                            📜 سجل النشاط
                        </h2>
                        <div className="relative">
                            {/* Vertical line */}
                            <div className="absolute right-3 top-0 bottom-0 w-0.5 bg-border" />

                            <div className="space-y-4">
                                {app.timeline.map((event, i) => (
                                    <div key={i} className="relative flex gap-3 pr-0">
                                        {/* Dot */}
                                        <div
                                            className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${i === app.timeline.length - 1
                                                    ? "bg-primary-600 border-primary-600"
                                                    : "bg-white border-border"
                                                }`}
                                        >
                                            <div
                                                className={`h-2 w-2 rounded-full ${i === app.timeline.length - 1
                                                        ? "bg-white"
                                                        : "bg-text-tertiary"
                                                    }`}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 pb-1 -mt-0.5">
                                            <p className="text-xs font-bold text-text-primary">
                                                {event.action}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] text-text-tertiary">
                                                    {event.date}
                                                </span>
                                                {event.by && (
                                                    <>
                                                        <span className="text-[10px] text-text-tertiary">
                                                            •
                                                        </span>
                                                        <span className="text-[10px] text-text-tertiary">
                                                            {event.by}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Field({
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
