"use client";

import { useState } from "react";
import Link from "next/link";
import {
    studentApplications,
    studentStageConfig,
    type StudentApplication,
    type StudentPipelineStage,
} from "@/lib/mock-data";

/* stages in order for the main pipeline (exclude terminal states) */
const pipelineStages: StudentPipelineStage[] = [
    "new",
    "contacting",
    "confirmed",
    "awaiting_payment",
    "partial_payment",
    "active",
];
const terminalStages: StudentPipelineStage[] = ["no_response", "cancelled"];

export default function StudentPipelinePage() {
    const [students, setStudents] = useState<StudentApplication[]>(studentApplications);

    const moveStudent = (id: string, to: StudentPipelineStage) => {
        setStudents((prev) =>
            prev.map((s) => (s.id === id ? { ...s, stage: to } : s))
        );
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                        🎓 Pipeline تسجيل الطلاب
                    </h1>
                    <p className="mt-1 text-text-secondary text-sm">
                        تتبع رحلة الطالب من التسجيل إلى التفعيل
                    </p>
                </div>
                <Link
                    href="/admin/students/applications"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-border text-text-secondary px-4 py-2.5 text-sm font-bold hover:bg-surface-hover shadow-sm transition-all"
                >
                    📬 طلبات الطلاب
                </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-2.5 mb-5 overflow-x-auto pb-1 scrollbar-hide">
                {pipelineStages.map((stage) => {
                    const cfg = studentStageConfig[stage];
                    const count = students.filter((s) => s.stage === stage).length;
                    return (
                        <div key={stage} className={`shrink-0 inline-flex items-center gap-2 rounded-xl border ${cfg.borderColor} ${cfg.bgColor} px-3 py-2`}>
                            <span className={`text-base font-extrabold ${cfg.color}`}>{count}</span>
                            <span className={`text-[11px] font-medium ${cfg.color}`}>{cfg.emoji} {cfg.label}</span>
                        </div>
                    );
                })}
            </div>

            {/* Kanban board */}
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {pipelineStages.map((stage) => {
                    const cfg = studentStageConfig[stage];
                    const items = students.filter((s) => s.stage === stage);
                    return (
                        <div
                            key={stage}
                            className={`shrink-0 w-56 rounded-2xl border ${cfg.borderColor} bg-white/50`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                const id = e.dataTransfer.getData("studentId");
                                if (id) moveStudent(id, stage);
                            }}
                        >
                            {/* Column header */}
                            <div className={`px-3 py-3 border-b ${cfg.borderColor} flex items-center justify-between`}>
                                <span className={`text-xs font-bold ${cfg.color}`}>
                                    {cfg.emoji} {cfg.label}
                                </span>
                                <span className={`inline-flex h-5 min-w-5 px-1 items-center justify-center rounded-md text-[10px] font-bold ${cfg.bgColor} ${cfg.color}`}>
                                    {items.length}
                                </span>
                            </div>
                            {/* Cards */}
                            <div className="p-2 space-y-2 min-h-[120px]">
                                {items.map((student) => (
                                    <div
                                        key={student.id}
                                        draggable
                                        className="rounded-xl bg-white border border-border p-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
                                        onDragStart={(e) => e.dataTransfer.setData("studentId", student.id)}
                                    >
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${student.gender === "female" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700"}`}>
                                                {student.fullName.charAt(0)}
                                            </div>
                                            <p className="text-xs font-bold text-text-primary truncate">{student.fullName}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="text-[10px] text-text-tertiary">{student.university}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-[10px] text-text-tertiary" dir="ltr">{student.phone}</span>
                                            {student.contactAttempts > 0 && (
                                                <span className="text-[10px] text-text-tertiary">📞{student.contactAttempts}</span>
                                            )}
                                        </div>
                                        <Link href={`/admin/students/${student.id}`} className="mt-2 block text-center text-[10px] font-medium text-primary-600 hover:text-primary-700">
                                            عرض الملف →
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Terminal states */}
            <div className="mt-6">
                <h2 className="text-sm font-bold text-text-tertiary mb-3">الحالات المنتهية</h2>
                <div className="flex gap-3">
                    {terminalStages.map((stage) => {
                        const cfg = studentStageConfig[stage];
                        const items = students.filter((s) => s.stage === stage);
                        return (
                            <div key={stage} className={`flex-1 rounded-2xl border ${cfg.borderColor} bg-white/50`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    const id = e.dataTransfer.getData("studentId");
                                    if (id) moveStudent(id, stage);
                                }}
                            >
                                <div className={`px-3 py-3 border-b ${cfg.borderColor} flex items-center justify-between`}>
                                    <span className={`text-xs font-bold ${cfg.color}`}>{cfg.emoji} {cfg.label}</span>
                                    <span className={`inline-flex h-5 min-w-5 px-1 items-center justify-center rounded-md text-[10px] font-bold ${cfg.bgColor} ${cfg.color}`}>{items.length}</span>
                                </div>
                                <div className="p-2 space-y-2 min-h-[60px]">
                                    {items.map((student) => (
                                        <div key={student.id} className="flex items-center gap-2 rounded-xl bg-white border border-border p-2.5 opacity-60">
                                            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${student.gender === "female" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700"}`}>
                                                {student.fullName.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-text-primary truncate">{student.fullName}</p>
                                                <p className="text-[10px] text-text-tertiary">{student.phone}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
