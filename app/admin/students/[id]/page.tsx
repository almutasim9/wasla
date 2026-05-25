"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
    studentStageConfig,
    type StudentApplication,
    type StudentPipelineStage,
} from "@/lib/mock-data";
import {
    useStudentPipelineApplications,
    useStudents,
} from "@/lib/store";

const genderLabel = { male: "ذكر", female: "أنثى" };
const shiftLabel = { morning: "صباحي ☀️", evening: "مسائي 🌙" };
const statusConfig: Record<string, { text: string; cls: string; dot: string }> = {
    active: { text: "فعّال", cls: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
    suspended: { text: "معلّق", cls: "bg-red-50 text-red-600 border-red-200", dot: "bg-red-500" },
    pending: { text: "قيد التسجيل", cls: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
};

const callResultLabels: Record<string, { label: string; emoji: string }> = {
    answered: { label: "ردّ", emoji: "✅" },
    no_answer: { label: "لا رد", emoji: "📵" },
    busy: { label: "مشغول", emoji: "🔴" },
    wrong_number: { label: "رقم خاطئ", emoji: "❌" },
};

const paymentMethodLabels: Record<string, string> = {
    cash: "💵 كاش",
    card: "💳 ماستر كارد",
    e_wallet: "📱 محفظة إلكترونية",
};

/* Journey stepper stages (in order) */
const journeySteps: { stage: StudentPipelineStage; label: string; emoji: string }[] = [
    { stage: "new", label: "طلب جديد", emoji: "📩" },
    { stage: "contacting", label: "اتصال", emoji: "📞" },
    { stage: "confirmed", label: "تأكيد", emoji: "✔️" },
    { stage: "awaiting_payment", label: "دفع", emoji: "💳" },
    { stage: "active", label: "فعّال", emoji: "✅" },
];

function getStepIndex(stage: StudentPipelineStage): number {
    const idx = journeySteps.findIndex((s) => s.stage === stage);
    if (idx >= 0) return idx;
    if (stage === "partial_payment") return 3; // same level as awaiting_payment
    return -1; // terminal states
}

export default function StudentProfilePage() {
    const params = useParams();
    const studentId = String(params.id);
    const [studentPipelineApplications, setStudentPipelineApplications] = useStudentPipelineApplications();
    const [students, setStudents] = useStudents();
    const pipelineStudent = studentPipelineApplications.find((s) => s.id === studentId);
    const accountStudent = students.find(
        (s) => s.id === studentId || (pipelineStudent && s.phone === pipelineStudent.phone)
    );
    const student = (accountStudent ?? pipelineStudent) as StudentApplication | undefined;
    const isAccount = Boolean(accountStudent);

    const handleMarkReady = () => {
        if (!student) return;
        setStudentPipelineApplications((prev) =>
            prev.map((s) => {
                if (s.id === student.id) {
                    return {
                        ...s,
                        stage: "active" as const,
                        status: "active" as const,
                        timeline: [
                            ...s.timeline,
                            {
                                date: new Date().toISOString().split("T")[0],
                                action: "اعتماد الطالب وتجهيزه لإنشاء الحساب",
                                by: "المدير",
                            },
                        ],
                    };
                }
                return s;
            })
        );
    };

    const handleSuspend = () => {
        if (!student) return;
        setStudents((prev) =>
            prev.map((s) => {
                if (s.id === student.id) {
                    return {
                        ...s,
                        status: "suspended" as const,
                        timeline: [
                            ...s.timeline,
                            {
                                date: new Date().toISOString().split("T")[0],
                                action: "🚫 تجميد الحساب يدوياً",
                                by: "المدير",
                            },
                        ],
                    };
                }
                return s;
            })
        );
    };

    if (!student) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="text-center">
                    <p className="text-5xl mb-4">🔍</p>
                    <h2 className="text-lg font-bold text-text-primary mb-1">الطالب غير موجود</h2>
                    <p className="text-sm text-text-secondary mb-4">لم يتم العثور على الطالب المطلوب</p>
                    <Link
                        href="/admin/students/pipeline"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-700 transition-all"
                    >
                        ← العودة لقائمة الطلاب
                    </Link>
                </div>
            </div>
        );
    }

    const sc = statusConfig[student.status];
    const stg = studentStageConfig[student.stage];
    const currentStepIdx = getStepIndex(student.stage);
    const isTerminal = student.stage === "no_response" || student.stage === "cancelled";
    const totalPaid = student.payments.reduce((sum, p) => sum + p.amountPaid, 0);
    const totalAmount = student.payments[0]?.totalAmount ?? 50000;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <Link
                href={isAccount ? "/admin/students" : "/admin/students/pipeline"}
                className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-primary transition-colors mb-4"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                {isAccount ? "العودة لقائمة الطلاب" : "العودة لـ Pipeline الطلاب"}
            </Link>

            {/* Header card */}
            <div className="rounded-2xl bg-white border border-border shadow-sm p-6 mb-6">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold ${student.gender === "female"
                        ? "bg-pink-100 text-pink-700"
                        : "bg-blue-100 text-blue-700"
                        }`}>
                        {student.fullName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-xl font-extrabold text-text-primary">
                                {student.fullName}
                            </h1>
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${sc.cls}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                                {sc.text}
                            </span>
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${stg.bgColor} ${stg.color} ${stg.borderColor}`}>
                                {stg.emoji} {stg.label}
                            </span>
                        </div>
                        <p className="text-sm text-text-tertiary mt-1" dir="ltr">
                            {student.phone} · {genderLabel[student.gender]} · {shiftLabel[student.shift]}
                        </p>
                    </div>

                    {/* Quick Action Button */}
                    <div className="mr-auto flex gap-2">
                        {!isAccount && student.stage !== "active" ? (
                            <button
                                onClick={handleMarkReady}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-green-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-green-600/10 hover:bg-green-700 transition-all hover:-translate-y-0.5"
                            >
                                ✅ اعتماد الطالب وتجهيزه للحساب
                            </button>
                        ) : isAccount ? (
                            <button
                                onClick={handleSuspend}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-bold text-red-600 shadow-sm hover:bg-red-50 transition-all hover:-translate-y-0.5"
                            >
                                🚫 تجميد الحساب
                            </button>
                        ) : (
                            <Link
                                href="/admin/accounts"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-primary-600/10 hover:bg-primary-700 transition-all hover:-translate-y-0.5"
                            >
                                جاهز - إنشاء الحساب من إدارة الحسابات
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Journey Stepper ── */}
            <div className="rounded-2xl bg-white border border-border shadow-sm p-5 mb-6">
                <h3 className="text-sm font-bold text-text-primary mb-4">🗺️ رحلة التسجيل</h3>
                {isTerminal ? (
                    <div className={`flex items-center gap-3 p-4 rounded-xl ${stg.bgColor} border ${stg.borderColor}`}>
                        <span className="text-2xl">{stg.emoji}</span>
                        <div>
                            <p className={`text-sm font-bold ${stg.color}`}>{stg.label}</p>
                            <p className="text-xs text-text-tertiary">تم إنهاء الطلب</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-0">
                        {journeySteps.map((step, i) => {
                            const isCompleted = i < currentStepIdx;
                            const isCurrent = i === currentStepIdx;
                            return (
                                <div key={step.stage} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all ${isCompleted
                                            ? "border-green-500 bg-green-100 text-green-700"
                                            : isCurrent
                                                ? "border-primary-500 bg-primary-100 text-primary-700 ring-4 ring-primary-100"
                                                : "border-gray-200 bg-gray-50 text-gray-400"
                                            }`}>
                                            {isCompleted ? "✓" : step.emoji}
                                        </div>
                                        <p className={`mt-1.5 text-[10px] font-bold text-center ${isCurrent ? "text-primary-700" : isCompleted ? "text-green-700" : "text-text-tertiary"}`}>
                                            {step.label}
                                        </p>
                                    </div>
                                    {i < journeySteps.length - 1 && (
                                        <div className={`h-0.5 flex-1 -mt-4 ${i < currentStepIdx ? "bg-green-400" : "bg-gray-200"}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content — 2 cols */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal info */}
                    <Section title="البيانات الشخصية" emoji="👤">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <DetailItem label="الاسم الثلاثي" value={student.fullName} />
                            <DetailItem label="الجنس" value={genderLabel[student.gender]} />
                            <DetailItem label="رقم الهاتف" value={student.phone} dir="ltr" />
                            <DetailItem label="تاريخ التسجيل" value={student.createdAt} />
                        </div>
                    </Section>

                    {/* Location info */}
                    <Section title="بيانات الموقع" emoji="📍">
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem label="المنطقة" value={student.area} />
                            <DetailItem label="أقرب نقطة دالة" value={student.landmark} />
                        </div>
                    </Section>

                    {/* University info */}
                    <Section title="بيانات الجامعة" emoji="🏫">
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem label="الجامعة" value={student.university} />
                            <DetailItem label="موقع الجامعة" value={student.universityLocation} />
                            <DetailItem label="الدوام" value={shiftLabel[student.shift]} />
                        </div>
                    </Section>

                    {/* Call logs */}
                    {student.callLogs.length > 0 && (
                        <Section title={`سجل الاتصالات (${student.callLogs.length})`} emoji="📞">
                            <div className="space-y-2">
                                {student.callLogs.map((log, i) => (
                                    <div key={i} className="flex items-start gap-3 rounded-xl bg-surface-alt p-3">
                                        <span className="text-lg mt-0.5">{callResultLabels[log.result]?.emoji ?? "📞"}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-xs font-bold text-text-primary">{callResultLabels[log.result]?.label ?? log.result}</p>
                                                <span className="text-[10px] text-text-tertiary">{log.date} • {log.employee}</span>
                                            </div>
                                            {log.note && <p className="text-xs text-text-secondary mt-0.5">{log.note}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Payments */}
                    {student.payments.length > 0 && (
                        <Section title="سجل الدفع" emoji="💰">
                            {/* Payment summary */}
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-alt mb-4">
                                <div className="flex-1">
                                    <p className="text-[10px] text-text-tertiary mb-0.5">المدفوع</p>
                                    <p className="text-lg font-extrabold text-text-primary">{totalPaid.toLocaleString()} د.ع</p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-text-tertiary mb-0.5">الإجمالي</p>
                                    <p className="text-lg font-extrabold text-text-primary">{totalAmount.toLocaleString()} د.ع</p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-text-tertiary mb-0.5">المتبقي</p>
                                    <p className={`text-lg font-extrabold ${totalPaid >= totalAmount ? "text-green-600" : "text-orange-600"}`}>
                                        {(totalAmount - totalPaid).toLocaleString()} د.ع
                                    </p>
                                </div>
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${totalPaid >= totalAmount ? "bg-green-100" : "bg-orange-100"}`}>
                                    {totalPaid >= totalAmount ? "✅" : "⏳"}
                                </div>
                            </div>

                            {/* Payment records */}
                            <div className="space-y-2">
                                {student.payments.map((p, i) => (
                                    <div key={i} className="flex items-center gap-3 rounded-xl bg-surface-alt p-3">
                                        <span className="text-lg">{p.status === "full" ? "✅" : "🟡"}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-xs font-bold text-text-primary">{p.amountPaid.toLocaleString()} د.ع</p>
                                                <span className="text-[10px] text-text-secondary">{paymentMethodLabels[p.method] ?? p.method}</span>
                                                {p.transactionId && <span className="text-[10px] text-text-tertiary" dir="ltr">#{p.transactionId}</span>}
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] text-text-tertiary">{p.date} • {p.employee}</span>
                                                {p.note && <span className="text-[10px] text-text-secondary">— {p.note}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Captain assignment — placeholder */}
                    <Section title="الكابتن المعيّن" emoji="🚗">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-alt border border-dashed border-border">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 text-lg">
                                ?
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-tertiary">لم يتم التعيين بعد</p>
                                <p className="text-xs text-text-tertiary">سيتم ربط الكابتن من قسم العمليات</p>
                            </div>
                        </div>
                    </Section>
                </div>

                {/* Timeline sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 rounded-2xl bg-white border border-border shadow-sm p-5">
                        <h3 className="text-sm font-bold text-text-primary mb-4">📜 سجل النشاط</h3>
                        <div className="space-y-0">
                            {student.timeline.map((event, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className={`h-2.5 w-2.5 rounded-full shrink-0 mt-1.5 ${i === 0 ? "bg-primary-500" : "bg-gray-200"}`} />
                                        {i < student.timeline.length - 1 && (
                                            <div className="w-px flex-1 bg-gray-200 my-1" />
                                        )}
                                    </div>
                                    <div className="pb-4">
                                        <p className="text-xs font-bold text-text-primary leading-tight">
                                            {event.action}
                                        </p>
                                        <p className="text-[10px] text-text-tertiary mt-0.5">
                                            {event.date} {event.by && `· ${event.by}`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl bg-white border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-surface-alt/50">
                <h3 className="text-sm font-bold text-text-primary">{emoji} {title}</h3>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

function DetailItem({ label, value, dir }: { label: string; value: string; dir?: string }) {
    return (
        <div>
            <p className="text-[11px] font-medium text-text-tertiary mb-0.5">{label}</p>
            <p className="text-sm font-bold text-text-primary" dir={dir}>{value}</p>
        </div>
    );
}
