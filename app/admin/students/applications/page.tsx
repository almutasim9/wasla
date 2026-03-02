"use client";

import { useState } from "react";
import Link from "next/link";
import {
    studentApplications as initialStudents,
    studentStageConfig,
    type StudentApplication,
    type StudentPipelineStage,
    type CallResult,
    type PaymentMethod,
} from "@/lib/mock-data";

/* ── Call result labels ── */
const callResultLabels: Record<CallResult, { label: string; emoji: string }> = {
    answered: { label: "ردّ", emoji: "✅" },
    no_answer: { label: "لا رد", emoji: "📵" },
    busy: { label: "مشغول", emoji: "🔴" },
    wrong_number: { label: "رقم خاطئ", emoji: "❌" },
};

const paymentMethodLabels: Record<PaymentMethod, string> = {
    cash: "💵 كاش",
    card: "💳 ماستر كارد",
    e_wallet: "📱 محفظة إلكترونية",
};

/* ── Tab config ── */
type TabKey = "all" | "new" | "contacting" | "awaiting_payment" | "partial_payment" | "no_response" | "cancelled";
const tabs: { key: TabKey; label: string; stages: StudentPipelineStage[] }[] = [
    { key: "all", label: "الكل", stages: [] },
    { key: "new", label: "جديد", stages: ["new"] },
    { key: "contacting", label: "جاري الاتصال", stages: ["contacting"] },
    { key: "awaiting_payment", label: "بانتظار الدفع", stages: ["awaiting_payment", "confirmed"] },
    { key: "partial_payment", label: "دفع جزئي", stages: ["partial_payment"] },
    { key: "no_response", label: "لا رد", stages: ["no_response"] },
    { key: "cancelled", label: "ملغي", stages: ["cancelled"] },
];

export default function StudentApplicationsPage() {
    const [students, setStudents] = useState<StudentApplication[]>(initialStudents);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabKey>("all");

    /* ── Modal state ── */
    const [callModal, setCallModal] = useState<{ open: boolean; studentId: string }>({ open: false, studentId: "" });
    const [paymentModal, setPaymentModal] = useState<{ open: boolean; studentId: string }>({ open: false, studentId: "" });
    const [callForm, setCallForm] = useState({ result: "answered" as CallResult, note: "", employee: "" });
    const [paymentForm, setPaymentForm] = useState({ amount: "", method: "cash" as PaymentMethod, transactionId: "", note: "", employee: "" });

    /* ── Filter by active tab ── */
    const activeStages = tabs.find((t) => t.key === activeTab)?.stages ?? [];
    const displayed = activeTab === "all"
        ? students.filter((s) => s.stage !== "active")
        : students.filter((s) => activeStages.includes(s.stage));
    const sorted = [...displayed].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    /* ── Count helpers ── */
    const countStage = (...stages: StudentPipelineStage[]) => students.filter((s) => stages.includes(s.stage)).length;

    /* ── Actions ── */
    const updateStudent = (id: string, updater: (s: StudentApplication) => StudentApplication) => {
        setStudents((prev) => prev.map((s) => (s.id === id ? updater(s) : s)));
    };

    const handleLogCall = () => {
        const { studentId } = callModal;
        const today = new Date().toISOString().split("T")[0];
        updateStudent(studentId, (s) => {
            const newCallLogs = [...s.callLogs, { date: today, result: callForm.result, note: callForm.note, employee: callForm.employee || "الموظف" }];
            const newAttempts = s.contactAttempts + 1;
            let newStage: StudentPipelineStage = s.stage === "new" ? "contacting" : s.stage;
            let newTimeline = [...s.timeline];

            if (callForm.result === "answered") {
                newStage = "confirmed";
                newTimeline.push({ date: today, action: `📞 اتصال — تأكيد البيانات`, by: callForm.employee || "الموظف" });
            } else if (callForm.result === "no_answer" && newAttempts >= 3) {
                newStage = "no_response";
                newTimeline.push({ date: today, action: `📞 محاولة اتصال — لا رد (${newAttempts})`, by: callForm.employee || "الموظف" });
                newTimeline.push({ date: today, action: "🔴 تحويل لغير متجاوب", by: callForm.employee || "الموظف" });
            } else {
                newTimeline.push({ date: today, action: `📞 محاولة اتصال — ${callResultLabels[callForm.result].label}`, by: callForm.employee || "الموظف" });
            }

            return { ...s, stage: newStage, contactAttempts: newAttempts, callLogs: newCallLogs, timeline: newTimeline };
        });
        setCallModal({ open: false, studentId: "" });
        setCallForm({ result: "answered", note: "", employee: "" });
    };

    const handleLogPayment = () => {
        const { studentId } = paymentModal;
        const student = students.find((s) => s.id === studentId);
        if (!student) return;
        const today = new Date().toISOString().split("T")[0];
        const totalAmount = 50000;
        const amountPaid = Number(paymentForm.amount);
        const previouslyPaid = student.payments.reduce((sum, p) => sum + p.amountPaid, 0);
        const totalPaid = previouslyPaid + amountPaid;
        const isFull = totalPaid >= totalAmount;

        updateStudent(studentId, (s) => {
            const newPayment = {
                date: today,
                amountPaid,
                totalAmount,
                method: paymentForm.method,
                status: isFull ? "full" as const : "partial" as const,
                transactionId: paymentForm.transactionId || undefined,
                note: paymentForm.note || undefined,
                employee: paymentForm.employee || "الموظف",
            };
            const methodLabel = paymentMethodLabels[paymentForm.method];
            const newTimeline = [...s.timeline, {
                date: today,
                action: isFull
                    ? `${methodLabel} — ${amountPaid.toLocaleString()} د.ع (مكتمل)`
                    : `💰 دفع جزئي — ${amountPaid.toLocaleString()} د.ع`,
                by: paymentForm.employee || "الموظف",
            }];

            let newStage: StudentPipelineStage = isFull ? "active" : "partial_payment";
            if (isFull) {
                newTimeline.push({ date: today, action: "✅ تفعيل الاشتراك", by: paymentForm.employee || "الموظف" });
            }

            return { ...s, stage: newStage, status: isFull ? "active" : s.status, payments: [...s.payments, newPayment], timeline: newTimeline };
        });
        setPaymentModal({ open: false, studentId: "" });
        setPaymentForm({ amount: "", method: "cash", transactionId: "", note: "", employee: "" });
    };

    const handleCancel = (id: string) => {
        const today = new Date().toISOString().split("T")[0];
        updateStudent(id, (s) => ({
            ...s,
            stage: "cancelled" as StudentPipelineStage,
            timeline: [...s.timeline, { date: today, action: "❌ إلغاء الطلب", by: "المدير" }],
        }));
    };

    const handleMoveToPayment = (id: string) => {
        const today = new Date().toISOString().split("T")[0];
        updateStudent(id, (s) => ({
            ...s,
            stage: "awaiting_payment" as StudentPipelineStage,
            timeline: [...s.timeline, { date: today, action: "⏳ بانتظار الدفع", by: "المدير" }],
        }));
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">📬 طلبات الطلاب</h1>
                    <p className="mt-1 text-text-secondary text-sm">إدارة الطلبات الواردة من الموقع</p>
                </div>
                <Link href="/admin/students/pipeline" className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 text-white px-4 py-2.5 text-sm font-bold hover:bg-primary-700 shadow-sm transition-all">
                    Pipeline ←
                </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-2.5 mb-5 overflow-x-auto pb-1 scrollbar-hide">
                {[
                    { label: "جديد", count: countStage("new"), color: "blue" },
                    { label: "جاري الاتصال", count: countStage("contacting"), color: "cyan" },
                    { label: "بانتظار الدفع", count: countStage("awaiting_payment", "confirmed"), color: "orange" },
                    { label: "دفع جزئي", count: countStage("partial_payment"), color: "amber" },
                    { label: "لا رد", count: countStage("no_response"), color: "gray" },
                    { label: "ملغي", count: countStage("cancelled"), color: "red" },
                ].map((s) => (
                    <div key={s.label} className={`shrink-0 inline-flex items-center gap-2 rounded-xl border border-${s.color}-200 bg-${s.color}-50 px-3 py-2`}>
                        <span className={`text-base font-extrabold text-${s.color}-700`}>{s.count}</span>
                        <span className={`text-[11px] font-medium text-${s.color}-700`}>{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
                {tabs.map((tab) => {
                    const count = tab.key === "all"
                        ? students.filter((s) => s.stage !== "active").length
                        : students.filter((s) => tab.stages.includes(s.stage)).length;
                    return (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                            className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${activeTab === tab.key
                                ? "bg-primary-600 text-white shadow-sm"
                                : "bg-white border border-border text-text-secondary hover:bg-surface-hover"
                                }`}
                        >
                            {tab.label}
                            <span className={`inline-flex h-5 min-w-5 px-1 items-center justify-center rounded-md text-[10px] font-bold ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-surface-alt text-text-tertiary"}`}>{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* Applications list */}
            {sorted.length === 0 ? (
                <div className="text-center py-16 text-text-tertiary">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-sm font-medium">لا توجد طلبات في هذا القسم</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {sorted.map((student) => (
                        <ApplicationCard
                            key={student.id}
                            student={student}
                            expanded={expandedId === student.id}
                            onToggle={() => setExpandedId((p) => (p === student.id ? null : student.id))}
                            onOpenCallModal={() => { setCallModal({ open: true, studentId: student.id }); }}
                            onOpenPaymentModal={() => { setPaymentModal({ open: true, studentId: student.id }); }}
                            onCancel={() => handleCancel(student.id)}
                            onMoveToPayment={() => handleMoveToPayment(student.id)}
                        />
                    ))}
                </div>
            )}

            {/* ── Call Modal ── */}
            {callModal.open && (
                <Modal title="📞 تسجيل نتيجة الاتصال" onClose={() => setCallModal({ open: false, studentId: "" })}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">النتيجة</label>
                            <div className="grid grid-cols-2 gap-2">
                                {(Object.entries(callResultLabels) as [CallResult, { label: string; emoji: string }][]).map(([key, val]) => (
                                    <button key={key} type="button" onClick={() => setCallForm((f) => ({ ...f, result: key }))}
                                        className={`flex items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2.5 text-xs font-bold transition-all ${callForm.result === key
                                            ? "border-primary-500 bg-primary-50 text-primary-700"
                                            : "border-border bg-white text-text-secondary hover:border-primary-300"
                                            }`}>
                                        <span>{val.emoji}</span> {val.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1.5">اسم الموظف</label>
                            <input type="text" value={callForm.employee} onChange={(e) => setCallForm((f) => ({ ...f, employee: e.target.value }))} placeholder="مثال: أحمد" className="w-full rounded-xl border border-border bg-surface-alt px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1.5">ملاحظة</label>
                            <textarea value={callForm.note} onChange={(e) => setCallForm((f) => ({ ...f, note: e.target.value }))} placeholder="تفاصيل المكالمة..." rows={2} className="w-full rounded-xl border border-border bg-surface-alt px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" />
                        </div>
                        <button onClick={handleLogCall} className="w-full rounded-xl bg-primary-600 text-white py-3 text-sm font-bold hover:bg-primary-700 transition-all shadow-sm">
                            تسجيل الاتصال
                        </button>
                    </div>
                </Modal>
            )}

            {/* ── Payment Modal ── */}
            {paymentModal.open && (
                <Modal title="💳 تسجيل دفعة" onClose={() => setPaymentModal({ open: false, studentId: "" })}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">طريقة الدفع</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(Object.entries(paymentMethodLabels) as [PaymentMethod, string][]).map(([key, val]) => (
                                    <button key={key} type="button" onClick={() => setPaymentForm((f) => ({ ...f, method: key }))}
                                        className={`flex items-center justify-center rounded-xl border-2 px-2 py-2.5 text-xs font-bold transition-all ${paymentForm.method === key
                                            ? "border-primary-500 bg-primary-50 text-primary-700"
                                            : "border-border bg-white text-text-secondary hover:border-primary-300"
                                            }`}>
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1.5">المبلغ (د.ع)</label>
                            <input type="number" value={paymentForm.amount} onChange={(e) => setPaymentForm((f) => ({ ...f, amount: e.target.value }))} placeholder="50000" dir="ltr" className="w-full rounded-xl border border-border bg-surface-alt px-4 py-2.5 text-sm text-left focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                        </div>
                        {paymentForm.method !== "cash" && (
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">رقم العملية</label>
                                <input type="text" value={paymentForm.transactionId} onChange={(e) => setPaymentForm((f) => ({ ...f, transactionId: e.target.value }))} placeholder="TXN-XXXX" dir="ltr" className="w-full rounded-xl border border-border bg-surface-alt px-4 py-2.5 text-sm text-left focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1.5">اسم الموظف</label>
                            <input type="text" value={paymentForm.employee} onChange={(e) => setPaymentForm((f) => ({ ...f, employee: e.target.value }))} placeholder="مثال: أحمد" className="w-full rounded-xl border border-border bg-surface-alt px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1.5">ملاحظة (اختياري)</label>
                            <input type="text" value={paymentForm.note} onChange={(e) => setPaymentForm((f) => ({ ...f, note: e.target.value }))} placeholder="دفعة أولى..." className="w-full rounded-xl border border-border bg-surface-alt px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                        </div>
                        <button onClick={handleLogPayment} disabled={!paymentForm.amount} className="w-full rounded-xl bg-green-600 text-white py-3 text-sm font-bold hover:bg-green-700 transition-all shadow-sm disabled:opacity-50">
                            تأكيد الدفع
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

/* ── Application Card ── */
function ApplicationCard({
    student, expanded, onToggle, onOpenCallModal, onOpenPaymentModal, onCancel, onMoveToPayment,
}: {
    student: StudentApplication; expanded: boolean; onToggle: () => void;
    onOpenCallModal: () => void; onOpenPaymentModal: () => void;
    onCancel: () => void; onMoveToPayment: () => void;
}) {
    const stageConfig = studentStageConfig[student.stage];

    /* ── Context-aware action buttons ── */
    const renderActions = () => {
        switch (student.stage) {
            case "new":
                return (
                    <>
                        <ActionBtn onClick={onOpenCallModal} color="primary" icon="📞" label="بدء اتصال" />
                        <ActionBtn onClick={onCancel} color="red" icon="❌" label="إلغاء" />
                    </>
                );
            case "contacting":
                return (
                    <>
                        <ActionBtn onClick={onOpenCallModal} color="primary" icon="📞" label={`إعادة اتصال (${student.contactAttempts})`} />
                        <ActionBtn onClick={onCancel} color="red" icon="❌" label="إلغاء" />
                    </>
                );
            case "confirmed":
                return (
                    <>
                        <ActionBtn onClick={onMoveToPayment} color="orange" icon="⏳" label="تحويل لبانتظار الدفع" />
                        <ActionBtn onClick={onOpenPaymentModal} color="green" icon="💰" label="تسجيل دفعة" />
                    </>
                );
            case "awaiting_payment":
                return (
                    <>
                        <ActionBtn onClick={onOpenPaymentModal} color="green" icon="💰" label="تسجيل دفعة" />
                        <ActionBtn onClick={onOpenCallModal} color="primary" icon="📞" label="متابعة" />
                        <ActionBtn onClick={onCancel} color="red" icon="❌" label="إلغاء" />
                    </>
                );
            case "partial_payment":
                return (
                    <>
                        <ActionBtn onClick={onOpenPaymentModal} color="green" icon="💰" label="تسجيل دفعة متبقية" />
                        <ActionBtn onClick={onOpenCallModal} color="primary" icon="📞" label="متابعة" />
                    </>
                );
            case "no_response":
                return (
                    <>
                        <ActionBtn onClick={onOpenCallModal} color="primary" icon="📞" label="إعادة محاولة" />
                        <ActionBtn onClick={onCancel} color="red" icon="❌" label="إلغاء" />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`rounded-2xl bg-white border shadow-sm transition-all ${expanded ? "border-primary-200 shadow-md" : "border-border hover:shadow-md"}`}>
            <button onClick={onToggle} className="w-full flex items-center gap-3 p-4 sm:p-5 text-right">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${student.gender === "female" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700"}`}>
                    {student.fullName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-text-primary">{student.fullName}</p>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${stageConfig.color} ${stageConfig.bgColor} ${stageConfig.borderColor}`}>
                            {stageConfig.emoji} {stageConfig.label}
                        </span>
                        {student.contactAttempts > 0 && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-surface-alt px-1.5 py-0.5 text-[10px] font-medium text-text-tertiary">
                                📞 {student.contactAttempts}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-text-tertiary">
                        <span dir="ltr">{student.phone}</span>
                        <span>•</span>
                        <span>{student.university}</span>
                        <span>•</span>
                        <span>{student.createdAt}</span>
                    </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-text-tertiary transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {expanded && (
                <div className="px-4 sm:px-5 pb-5 border-t border-border pt-4 space-y-4">
                    {/* Details grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <InfoItem label="الجنس" value={student.gender === "male" ? "👨 ذكر" : "👩 أنثى"} />
                        <InfoItem label="المنطقة" value={`📍 ${student.area}`} />
                        <InfoItem label="أقرب نقطة دالة" value={student.landmark} />
                        <InfoItem label="الجامعة" value={`🏫 ${student.university}`} />
                        <InfoItem label="موقع الجامعة" value={student.universityLocation} />
                        <InfoItem label="الدوام" value={student.shift === "morning" ? "☀️ صباحي" : "🌙 مسائي"} />
                    </div>

                    {/* Call logs */}
                    {student.callLogs.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-text-primary mb-2">📞 سجل الاتصالات ({student.callLogs.length})</p>
                            <div className="space-y-1.5">
                                {student.callLogs.map((log, i) => (
                                    <div key={i} className="flex items-center gap-2 rounded-lg bg-surface-alt px-3 py-2 text-xs">
                                        <span>{callResultLabels[log.result].emoji}</span>
                                        <span className="font-medium text-text-primary">{callResultLabels[log.result].label}</span>
                                        <span className="text-text-tertiary">— {log.note}</span>
                                        <span className="mr-auto text-text-tertiary text-[10px]">{log.date} • {log.employee}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Payments */}
                    {student.payments.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-text-primary mb-2">💰 سجل الدفع</p>
                            <div className="space-y-1.5">
                                {student.payments.map((p, i) => (
                                    <div key={i} className="flex items-center gap-2 rounded-lg bg-surface-alt px-3 py-2 text-xs">
                                        <span>{p.status === "full" ? "✅" : "🟡"}</span>
                                        <span className="font-bold text-text-primary">{p.amountPaid.toLocaleString()} د.ع</span>
                                        <span className="text-text-secondary">{paymentMethodLabels[p.method]}</span>
                                        {p.transactionId && <span className="text-text-tertiary" dir="ltr">#{p.transactionId}</span>}
                                        <span className="mr-auto text-text-tertiary text-[10px]">{p.date} • {p.employee}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                        <Link href={`/admin/students/${student.id}`} className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-border px-3.5 py-2 text-xs font-bold text-text-secondary hover:bg-surface-hover transition-all">
                            👤 عرض الملف
                        </Link>
                        {renderActions()}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Reusable components ── */
function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl bg-surface-alt p-2.5">
            <p className="text-[10px] font-medium text-text-tertiary mb-0.5">{label}</p>
            <p className="text-sm font-bold text-text-primary">{value}</p>
        </div>
    );
}

function ActionBtn({ onClick, color, icon, label }: { onClick: () => void; color: string; icon: string; label: string }) {
    const colors: Record<string, string> = {
        primary: "bg-primary-600 hover:bg-primary-700 text-white",
        green: "bg-green-600 hover:bg-green-700 text-white",
        orange: "bg-orange-500 hover:bg-orange-600 text-white",
        red: "bg-white border border-red-300 text-red-600 hover:bg-red-50",
    };
    return (
        <button onClick={(e) => { e.stopPropagation(); onClick(); }} className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all shadow-sm ${colors[color] ?? colors.primary}`}>
            {icon} {label}
        </button>
    );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-2xl bg-white border border-border shadow-xl p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-extrabold text-text-primary">{title}</h3>
                    <button onClick={onClose} className="text-text-tertiary hover:text-text-primary text-lg">✕</button>
                </div>
                {children}
            </div>
        </div>
    );
}
