"use client";

import { useState } from "react";
import Link from "next/link";
import {
    stageConfig,
    type PipelineApplication,
    type PipelineStage,
    type InspectionReport,
} from "@/lib/mock-data";
import ScheduleModal from "@/components/admin/ScheduleModal";
import InspectionForm from "@/components/admin/InspectionForm";
import { createCaptainFromPipeline, usePipelineApplications } from "@/lib/store";

const stageOrder: PipelineStage[] = [
    "new",
    "interview_scheduled",
    "under_inspection",
    "needs_improvement",
    "accepted",
    "rejected",
];

export default function PipelinePage() {
    const [apps, setApps] = usePipelineApplications();
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null);

    // Modals
    const [scheduleTarget, setScheduleTarget] = useState<PipelineApplication | null>(null);
    const [inspectionTarget, setInspectionTarget] = useState<PipelineApplication | null>(null);
    const [rejectTarget, setRejectTarget] = useState<PipelineApplication | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    const getStageApps = (stage: PipelineStage) =>
        apps.filter((a) => a.stage === stage);

    const moveToStage = (id: string, newStage: PipelineStage) => {
        setApps((prev) =>
            prev.map((a) => {
                if (a.id !== id) return a;
                const event = {
                    date: new Date().toISOString().split("T")[0],
                    action: `نقل إلى: ${stageConfig[newStage].label}`,
                    by: "المدير",
                };
                const updated = { ...a, stage: newStage, timeline: [...a.timeline, event] };
                if (newStage === "accepted") createCaptainFromPipeline(updated);
                return updated;
            })
        );
    };

    const handleDragStart = (id: string) => setDraggedId(id);
    const handleDragOver = (e: React.DragEvent, stage: PipelineStage) => {
        e.preventDefault();
        setDragOverStage(stage);
    };
    const handleDragLeave = () => setDragOverStage(null);

    const handleDrop = (targetStage: PipelineStage) => {
        if (!draggedId) return;
        const app = apps.find((a) => a.id === draggedId);
        if (!app || app.stage === targetStage) {
            setDraggedId(null);
            setDragOverStage(null);
            return;
        }

        if (targetStage === "interview_scheduled") {
            setScheduleTarget(app);
        } else if (targetStage === "rejected") {
            setRejectTarget(app);
            setRejectReason("");
        } else {
            moveToStage(draggedId, targetStage);
        }

        setDraggedId(null);
        setDragOverStage(null);
    };

    const handleSchedule = (data: {
        date: string;
        time: string;
        location: string;
        assignedTo: string;
    }) => {
        if (!scheduleTarget) return;
        setApps((prev) =>
            prev.map((a) => {
                if (a.id !== scheduleTarget.id) return a;
                return {
                    ...a,
                    stage: "interview_scheduled" as PipelineStage,
                    interview: {
                        date: data.date,
                        time: data.time,
                        location: data.location,
                        assignedTo: data.assignedTo || undefined,
                    },
                    timeline: [
                        ...a.timeline,
                        {
                            date: new Date().toISOString().split("T")[0],
                            action: `جدولة مقابلة — ${data.date} ${data.time}`,
                            by: "المدير",
                        },
                    ],
                };
            })
        );
        setScheduleTarget(null);
    };

    const handleInspectionSubmit = (report: InspectionReport) => {
        if (!inspectionTarget) return;
        const nextStage: PipelineStage =
            report.result === "pass"
                ? "accepted"
                : report.result === "needs_improvement"
                    ? "needs_improvement"
                    : "rejected";
        const resultLabel =
            report.result === "pass"
                ? "ناجح ✅"
                : report.result === "needs_improvement"
                    ? "بحاجة تحسين 🔧"
                    : "راسب ❌";

        setApps((prev) =>
            prev.map((a) => {
                if (a.id !== inspectionTarget.id) return a;
                const updated = {
                    ...a,
                    stage: nextStage,
                    inspection: report,
                    timeline: [
                        ...a.timeline,
                        {
                            date: new Date().toISOString().split("T")[0],
                            action: `تقرير التقييم — ${resultLabel}`,
                            by: "المدير",
                        },
                    ],
                };
                if (nextStage === "accepted") createCaptainFromPipeline(updated);
                return updated;
            })
        );
        setInspectionTarget(null);
    };

    const handleReject = () => {
        if (!rejectTarget) return;
        setApps((prev) =>
            prev.map((a) => {
                if (a.id !== rejectTarget.id) return a;
                return {
                    ...a,
                    stage: "rejected" as PipelineStage,
                    rejectionReason: rejectReason,
                    timeline: [
                        ...a.timeline,
                        {
                            date: new Date().toISOString().split("T")[0],
                            action: `تم الرفض — ${rejectReason || "بدون سبب"}`,
                            by: "المدير",
                        },
                    ],
                };
            })
        );
        setRejectTarget(null);
        setRejectReason("");
    };

    // Stats
    const totalApps = apps.length;
    const acceptedCount = getStageApps("accepted").length;
    const rejectedCount = getStageApps("rejected").length;
    const acceptanceRate =
        acceptedCount + rejectedCount > 0
            ? Math.round((acceptedCount / (acceptedCount + rejectedCount)) * 100)
            : 0;

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                    Pipeline الكباتن
                </h1>
                <p className="mt-1 text-text-secondary text-sm">
                    تتبع رحلة الكابتن من التسجيل إلى القبول
                </p>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="rounded-xl bg-white border border-border p-3 shadow-sm">
                    <p className="text-lg font-extrabold text-text-primary">{totalApps}</p>
                    <p className="text-[10px] font-medium text-text-tertiary">إجمالي الطلبات</p>
                </div>
                <div className="rounded-xl bg-white border border-border p-3 shadow-sm">
                    <p className="text-lg font-extrabold text-secondary-600">{acceptedCount}</p>
                    <p className="text-[10px] font-medium text-text-tertiary">مقبول</p>
                </div>
                <div className="rounded-xl bg-white border border-border p-3 shadow-sm">
                    <p className="text-lg font-extrabold text-red-500">{rejectedCount}</p>
                    <p className="text-[10px] font-medium text-text-tertiary">مرفوض</p>
                </div>
                <div className="rounded-xl bg-white border border-border p-3 shadow-sm">
                    <p className="text-lg font-extrabold text-primary-600">{acceptanceRate}%</p>
                    <p className="text-[10px] font-medium text-text-tertiary">نسبة القبول</p>
                </div>
            </div>

            {/* Kanban board */}
            <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
                <div className="flex gap-4 min-w-[1100px]">
                    {stageOrder.map((stage) => {
                        const config = stageConfig[stage];
                        const stageApps = getStageApps(stage);
                        const isOver = dragOverStage === stage;

                        return (
                            <div
                                key={stage}
                                onDragOver={(e) => handleDragOver(e, stage)}
                                onDragLeave={handleDragLeave}
                                onDrop={() => handleDrop(stage)}
                                className={`flex-1 min-w-[180px] rounded-2xl border-2 border-dashed transition-all duration-200 ${isOver
                                        ? `${config.borderColor} ${config.bgColor}`
                                        : "border-transparent"
                                    }`}
                            >
                                {/* Column header */}
                                <div
                                    className={`rounded-xl ${config.bgColor} ${config.borderColor} border p-3 mb-3`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold flex items-center gap-1.5">
                                            <span>{config.emoji}</span>
                                            <span className={config.color}>{config.label}</span>
                                        </span>
                                        <span
                                            className={`inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-md text-[11px] font-bold ${config.bgColor} ${config.color}`}
                                        >
                                            {stageApps.length}
                                        </span>
                                    </div>
                                </div>

                                {/* Cards */}
                                <div className="space-y-2.5">
                                    {stageApps.map((app) => (
                                        <div
                                            key={app.id}
                                            draggable
                                            onDragStart={() => handleDragStart(app.id)}
                                            className={`rounded-xl bg-white border border-border shadow-sm p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all group ${draggedId === app.id ? "opacity-40 scale-95" : ""
                                                }`}
                                        >
                                            {/* Name + avatar */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <div
                                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.bgColor} ${config.color} font-bold text-xs`}
                                                >
                                                    {app.fullName.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-text-primary truncate">
                                                        {app.fullName}
                                                    </p>
                                                    <p className="text-[10px] text-text-tertiary" dir="ltr">
                                                        {app.phone}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Car + area */}
                                            <div className="text-[10px] text-text-secondary mb-2">
                                                {app.carBrand} {app.carModel} — {app.areaName}
                                            </div>

                                            {/* Interview badge */}
                                            {app.interview && stage === "interview_scheduled" && (
                                                <div className="text-[10px] bg-violet-50 text-violet-700 rounded-lg px-2 py-1 mb-2 font-medium">
                                                    📅 {app.interview.date} — {app.interview.time}
                                                </div>
                                            )}

                                            {/* Rejection reason */}
                                            {app.rejectionReason && stage === "rejected" && (
                                                <div className="text-[10px] bg-red-50 text-red-600 rounded-lg px-2 py-1 mb-2 font-medium">
                                                    السبب: {app.rejectionReason.substring(0, 50)}...
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex gap-1.5 pt-1 border-t border-border mt-1">
                                                <Link
                                                    href={`/admin/pipeline/${app.id}`}
                                                    className="text-[10px] font-bold text-primary-600 hover:text-primary-700 transition-colors"
                                                >
                                                    التفاصيل
                                                </Link>

                                                {stage === "new" && (
                                                    <button
                                                        onClick={() => setScheduleTarget(app)}
                                                        className="text-[10px] font-bold text-violet-600 hover:text-violet-700 transition-colors mr-auto"
                                                    >
                                                        جدولة
                                                    </button>
                                                )}

                                                {stage === "under_inspection" && (
                                                    <button
                                                        onClick={() => setInspectionTarget(app)}
                                                        className="text-[10px] font-bold text-orange-600 hover:text-orange-700 transition-colors mr-auto"
                                                    >
                                                        رفع تقرير
                                                    </button>
                                                )}

                                                {stage === "rejected" && (
                                                    <button
                                                        onClick={() => {
                                                            setScheduleTarget(app);
                                                        }}
                                                        className="text-[10px] font-bold text-secondary-600 hover:text-secondary-700 transition-colors mr-auto"
                                                    >
                                                        إعادة تقييم
                                                    </button>
                                                )}

                                                {stage === "needs_improvement" && (
                                                    <button
                                                        onClick={() => {
                                                            setScheduleTarget(app);
                                                        }}
                                                        className="text-[10px] font-bold text-secondary-600 hover:text-secondary-700 transition-colors mr-auto"
                                                    >
                                                        إعادة جدولة
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {stageApps.length === 0 && (
                                        <div
                                            className={`rounded-xl border-2 border-dashed ${config.borderColor} p-4 text-center`}
                                        >
                                            <p className="text-[11px] text-text-tertiary font-medium">
                                                لا توجد طلبات
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Schedule Modal */}
            {scheduleTarget && (
                <ScheduleModal
                    captainName={scheduleTarget.fullName}
                    onClose={() => setScheduleTarget(null)}
                    onSchedule={handleSchedule}
                />
            )}

            {/* Inspection Form */}
            {inspectionTarget && (
                <InspectionForm
                    captainName={inspectionTarget.fullName}
                    onClose={() => setInspectionTarget(null)}
                    onSubmit={handleInspectionSubmit}
                />
            )}

            {/* Reject Modal */}
            {rejectTarget && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setRejectTarget(null)}
                    />
                    <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-border overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-border">
                            <h3 className="text-base font-bold text-text-primary">
                                ❌ سبب الرفض
                            </h3>
                            <button
                                onClick={() => setRejectTarget(null)}
                                className="p-1 rounded-lg text-text-tertiary hover:bg-surface-hover transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700 font-bold text-sm">
                                    {rejectTarget.fullName.charAt(0)}
                                </div>
                                <p className="text-sm font-bold text-text-primary">
                                    {rejectTarget.fullName}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">
                                    سبب الرفض
                                </label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    rows={3}
                                    placeholder="اكتب سبب رفض هذا الطلب..."
                                    className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 p-5 border-t border-border bg-surface-alt/50">
                            <button
                                onClick={() => setRejectTarget(null)}
                                className="flex-1 rounded-xl border border-border bg-white px-4 py-3 text-sm font-bold text-text-secondary hover:bg-surface-hover transition-all"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleReject}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-red-600 transition-all"
                            >
                                ❌ تأكيد الرفض
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
