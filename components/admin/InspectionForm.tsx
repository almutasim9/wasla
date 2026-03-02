"use client";

import { useState } from "react";
import type { InspectionReport } from "@/lib/mock-data";

interface InspectionFormProps {
    captainName: string;
    onClose: () => void;
    onSubmit: (report: InspectionReport) => void;
}

function StarRating({
    value,
    onChange,
    label,
}: {
    value: number;
    onChange: (v: number) => void;
    label: string;
}) {
    return (
        <div>
            <p className="text-sm font-medium text-text-primary mb-2">{label}</p>
            <div className="flex gap-1.5 flex-row-reverse justify-end">
                {[5, 4, 3, 2, 1].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        className={`text-xl transition-transform hover:scale-110 ${star <= value ? "text-amber-400" : "text-gray-200"
                            }`}
                    >
                        ★
                    </button>
                ))}
            </div>
        </div>
    );
}

function CheckItem({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${checked
                ? "bg-secondary-50 border-secondary-200 text-secondary-700"
                : "bg-red-50 border-red-200 text-red-600"
                }`}
        >
            <span className="text-base">{checked ? "✅" : "❌"}</span>
            {label}
        </button>
    );
}

export default function InspectionForm({
    captainName,
    onClose,
    onSubmit,
}: InspectionFormProps) {
    const [cleanliness, setCleanliness] = useState(0);
    const [driverBehavior, setDriverBehavior] = useState(0);
    const [acWorking, setAcWorking] = useState(true);
    const [heatingWorking, setHeatingWorking] = useState(true);
    const [seatbelts, setSeatbelts] = useState(true);
    const [lights, setLights] = useState(true);
    const [mirrors, setMirrors] = useState(true);
    const [tires, setTires] = useState(true);
    const [notes, setNotes] = useState("");
    const [result, setResult] = useState<
        "pass" | "fail" | "needs_improvement" | ""
    >("");
    const [improvementDetails, setImprovementDetails] = useState("");

    const canSubmit =
        cleanliness > 0 &&
        driverBehavior > 0 &&
        result !== "" &&
        (result !== "needs_improvement" || improvementDetails.trim() !== "");

    const handleSubmit = () => {
        if (!canSubmit) return;
        onSubmit({
            cleanliness,
            driverBehavior,
            acWorking,
            heatingWorking,
            seatbelts,
            lights,
            mirrors,
            tires,
            notes: result === "needs_improvement" ? `${notes}\n\n🔧 التحسينات المطلوبة: ${improvementDetails}`.trim() : notes,
            result: result as "pass" | "fail" | "needs_improvement",
            submittedAt: new Date().toISOString().split("T")[0],
        });
    };

    const resultOptions = [
        {
            key: "pass" as const,
            label: "ملائم للعمل",
            emoji: "✅",
            cls: "bg-secondary-50 border-secondary-300 text-secondary-700",
            activeCls: "ring-2 ring-secondary-500",
        },
        {
            key: "needs_improvement" as const,
            label: "بحاجة تحسين",
            emoji: "🔧",
            cls: "bg-yellow-50 border-yellow-300 text-yellow-700",
            activeCls: "ring-2 ring-yellow-500",
        },
        {
            key: "fail" as const,
            label: "غير ملائم",
            emoji: "❌",
            cls: "bg-red-50 border-red-300 text-red-600",
            activeCls: "ring-2 ring-red-500",
        },
    ];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-full max-w-lg max-h-[90vh] rounded-2xl bg-white shadow-2xl border border-border overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
                    <h3 className="text-base font-bold text-text-primary">
                        📋 تقرير التقييم
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-text-tertiary hover:bg-surface-hover transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Body — scrollable */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {/* Captain summary */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-alt">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700 font-bold text-sm">
                            {captainName.charAt(0)}
                        </div>
                        <p className="text-sm font-bold text-text-primary">{captainName}</p>
                    </div>

                    {/* Section 1: Ratings */}
                    <div>
                        <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-3">
                            التقييمات
                        </h4>
                        <div className="space-y-4 p-4 rounded-xl bg-surface-alt/50 border border-border">
                            <StarRating
                                label="نظافة السيارة"
                                value={cleanliness}
                                onChange={setCleanliness}
                            />
                            <StarRating
                                label="سلوك السائق"
                                value={driverBehavior}
                                onChange={setDriverBehavior}
                            />
                        </div>
                    </div>

                    {/* Section 2: Checklist */}
                    <div>
                        <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-3">
                            فحص السلامة
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            <CheckItem
                                label="التبريد"
                                checked={acWorking}
                                onChange={setAcWorking}
                            />
                            <CheckItem
                                label="التدفئة"
                                checked={heatingWorking}
                                onChange={setHeatingWorking}
                            />
                            <CheckItem
                                label="أحزمة الأمان"
                                checked={seatbelts}
                                onChange={setSeatbelts}
                            />
                            <CheckItem
                                label="الأضواء"
                                checked={lights}
                                onChange={setLights}
                            />
                            <CheckItem
                                label="المرايا"
                                checked={mirrors}
                                onChange={setMirrors}
                            />
                            <CheckItem
                                label="الإطارات"
                                checked={tires}
                                onChange={setTires}
                            />
                        </div>
                    </div>

                    {/* Section 3: Notes */}
                    <div>
                        <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-3">
                            ملاحظات
                        </h4>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            placeholder="أضف ملاحظات إضافية عن الكابتن أو السيارة..."
                            className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    {/* Section 4: Result */}
                    <div>
                        <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-3">
                            النتيجة النهائية <span className="text-red-500">*</span>
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                            {resultOptions.map((opt) => (
                                <button
                                    key={opt.key}
                                    type="button"
                                    onClick={() => setResult(opt.key)}
                                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-bold transition-all ${opt.cls
                                        } ${result === opt.key ? opt.activeCls : "opacity-70 hover:opacity-100"}`}
                                >
                                    <span className="text-lg">{opt.emoji}</span>
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {/* Improvement details — shown when needs_improvement */}
                        {result === "needs_improvement" && (
                            <div className="mt-3 p-3 rounded-xl bg-yellow-50 border border-yellow-200">
                                <label className="block text-sm font-bold text-yellow-700 mb-2">
                                    🔧 ما هي التحسينات المطلوبة؟ <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={improvementDetails}
                                    onChange={(e) => setImprovementDetails(e.target.value)}
                                    rows={3}
                                    placeholder="مثال: التدفئة لا تعمل، الإطارات بحاجة تبديل..."
                                    className="w-full rounded-xl border border-yellow-300 bg-white px-4 py-3 text-sm text-text-primary placeholder:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-2 p-5 border-t border-border bg-surface-alt/50 shrink-0">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-border bg-white px-4 py-3 text-sm font-bold text-text-secondary hover:bg-surface-hover transition-all"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        📋 إرسال التقرير
                    </button>
                </div>
            </div>
        </div>
    );
}
