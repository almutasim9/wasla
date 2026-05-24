"use client";

import Link from "next/link";
import { stageConfig, type PipelineStage, studentStageConfig, type StudentPipelineStage } from "@/lib/mock-data";
import { useCaptainApplications, useCaptains, usePipelineApplications, useStudents } from "@/lib/store";

const stageOrder: PipelineStage[] = ["new", "interview_scheduled", "under_inspection", "needs_improvement", "accepted", "rejected"];

export default function AdminOverview() {
    const [mockApplications] = useCaptainApplications();
    const [mockCaptains] = useCaptains();
    const [pipelineApplications] = usePipelineApplications();
    const [studentApplications] = useStudents();
    const totalApps = mockApplications.length;
    const pending = mockApplications.filter((a) => a.status === "pending").length;
    const archived = mockApplications.filter(
        (a) => a.status === "archived"
    ).length;
    const activeCaptains = mockCaptains.filter(
        (c) => c.accountStatus === "active"
    ).length;

    const recentApps = [...mockApplications]
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

    const stats = [
        {
            label: "إجمالي الطلبات",
            value: totalApps,
            iconBg: "bg-primary-100",
            iconColor: "text-primary-600",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            ),
        },
        {
            label: "بانتظار المراجعة",
            value: pending,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: "كباتن نشطين",
            value: activeCaptains,
            iconBg: "bg-secondary-100",
            iconColor: "text-secondary-600",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
            ),
        },
        {
            label: "مؤرشف",
            value: archived,
            iconBg: "bg-gray-100",
            iconColor: "text-gray-500",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
            ),
        },
    ];

    const statusLabels: Record<string, { text: string; cls: string }> = {
        pending: {
            text: "بانتظار المراجعة",
            cls: "bg-amber-50 text-amber-700 border-amber-200",
        },
        approved: {
            text: "تمت الموافقة",
            cls: "bg-secondary-50 text-secondary-700 border-secondary-200",
        },
        archived: {
            text: "مؤرشف",
            cls: "bg-gray-100 text-gray-500 border-gray-200",
        },
    };

    return (
        <div>
            {/* Page header */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                    مرحبا بك 👋
                </h1>
                <p className="mt-1 text-text-secondary text-sm">
                    ملخص سريع عن حالة المنصة
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className="rounded-2xl bg-white border border-border p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}
                            >
                                {stat.icon}
                            </div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                            {stat.value}
                        </p>
                        <p className="text-xs font-medium text-text-tertiary mt-1">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <Link
                    href="/admin/applications"
                    className="rounded-2xl bg-white border border-border p-5 shadow-sm hover:shadow-md hover:border-primary-200 transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-text-primary">طلبات الانضمام</p>
                            <p className="text-xs text-text-tertiary">{pending} طلب بانتظار المراجعة</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-text-tertiary group-hover:text-primary-600 rotate-180 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </div>
                </Link>
                <Link
                    href="/admin/captains"
                    className="rounded-2xl bg-white border border-border p-5 shadow-sm hover:shadow-md hover:border-secondary-200 transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-text-primary">الكباتن المعتمدين</p>
                            <p className="text-xs text-text-tertiary">{activeCaptains} كابتن نشط</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-text-tertiary group-hover:text-secondary-600 rotate-180 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </div>
                </Link>
            </div>

            {/* Pipeline mini summary */}
            <Link
                href="/admin/pipeline"
                className="block rounded-2xl bg-white border border-border p-5 shadow-sm hover:shadow-md hover:border-violet-200 transition-all mb-8 group"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-text-primary">
                        🔄 Pipeline الكباتن
                    </h2>
                    <span className="text-xs font-medium text-violet-600 group-hover:text-violet-700 transition-colors">
                        عرض الكل ←
                    </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {stageOrder.map((stage) => {
                        const config = stageConfig[stage];
                        const count = pipelineApplications.filter(
                            (a) => a.stage === stage
                        ).length;
                        return (
                            <div
                                key={stage}
                                className={`rounded-xl ${config.bgColor} border ${config.borderColor} px-2.5 py-2 text-center`}
                            >
                                <p className={`text-sm font-extrabold ${config.color}`}>
                                    {count}
                                </p>
                                <p className={`text-[9px] font-medium ${config.color} mt-0.5`}>
                                    {config.emoji} {config.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </Link>

            {/* Student Pipeline mini summary */}
            <Link
                href="/admin/students/pipeline"
                className="block rounded-2xl bg-white border border-border p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all mb-8 group"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-text-primary">
                        🎓 Pipeline الطلاب
                    </h2>
                    <span className="text-xs font-medium text-emerald-600 group-hover:text-emerald-700 transition-colors">
                        عرض الكل ←
                    </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["new", "contacting", "awaiting_payment", "active"] as StudentPipelineStage[]).map((stage) => {
                        const config = studentStageConfig[stage];
                        const count = studentApplications.filter(
                            (s) => s.stage === stage
                        ).length;
                        return (
                            <div
                                key={stage}
                                className={`rounded-xl ${config.bgColor} border ${config.borderColor} px-2.5 py-2 text-center`}
                            >
                                <p className={`text-sm font-extrabold ${config.color}`}>
                                    {count}
                                </p>
                                <p className={`text-[9px] font-medium ${config.color} mt-0.5`}>
                                    {config.emoji} {config.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </Link>

            {/* Recent applications */}
            <div className="rounded-2xl bg-white border border-border shadow-sm">
                <div className="flex items-center justify-between p-5 border-b border-border">
                    <h2 className="text-base font-bold text-text-primary">
                        آخر الطلبات
                    </h2>
                    <Link
                        href="/admin/applications"
                        className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                    >
                        عرض الكل ←
                    </Link>
                </div>

                <div className="divide-y divide-border">
                    {recentApps.map((app) => (
                        <div
                            key={app.id}
                            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 p-4 sm:px-5 hover:bg-surface-alt/50 transition-colors"
                        >
                            <div className="flex items-center gap-3 sm:flex-1">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold text-sm">
                                    {app.fullName.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-text-primary">
                                        {app.fullName}
                                    </p>
                                    <p className="text-xs text-text-tertiary" dir="ltr">
                                        {app.phone}
                                    </p>
                                </div>
                            </div>
                            <div className="sm:flex-1 text-sm text-text-secondary mr-0 sm:mr-4">
                                {app.carBrand} {app.carModel} — {app.modelYear}
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-3 sm:flex-1">
                                <span
                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusLabels[app.status].cls
                                        }`}
                                >
                                    {statusLabels[app.status].text}
                                </span>
                                <span className="text-xs text-text-tertiary">
                                    {app.createdAt}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
