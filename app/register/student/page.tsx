"use client";

import { useState } from "react";
import Link from "next/link";
import { addStudentRegistration, useFormSettings } from "@/lib/store";
import type { StudentGender, StudentShift } from "@/lib/mock-data";

export default function StudentRegisterPage() {
    const [settings] = useFormSettings();
    const formSettings = settings.student;
    const [formData, setFormData] = useState({
        fullName: "",
        gender: "" as "" | "male" | "female",
        phone: "",
        area: "",
        landmark: "",
        university: "",
        customUniversity: "",
        universityLocation: "",
        shift: "" as "" | "morning" | "evening",
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.gender || !formData.shift) return;
        const payload = {
            ...formData,
            gender: formData.gender as StudentGender,
            shift: formData.shift as StudentShift,
            university:
                formData.university === "other"
                    ? formData.customUniversity
                    : formData.university,
        };
        addStudentRegistration(payload);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-surface-alt">
                <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white font-bold text-lg">
                                    و
                                </div>
                                <span className="text-xl font-bold text-text-primary">
                                    وصلة
                                </span>
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-md text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary-100 animate-bounce">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-secondary-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-3">
                            تم تسجيلك بنجاح! 🎉
                        </h1>
                        <p className="text-text-secondary text-base leading-relaxed mb-2">
                            شكراً لك على التسجيل في وصلة. سيتم مراجعة بياناتك والتواصل معك
                            لتأكيد الاشتراك.
                        </p>
                        <p className="text-text-tertiary text-sm mb-8">
                            رح نتواصل وياك على الرقم اللي سجلته خلال ٢٤ ساعة.
                        </p>

                        {/* Steps */}
                        <div className="rounded-2xl bg-white border border-border p-5 mb-8 text-right">
                            <h3 className="text-sm font-bold text-text-primary mb-4">📋 الخطوات القادمة:</h3>
                            <div className="space-y-3">
                                {[
                                    { step: "١", text: "سيتم تأكيد بياناتك" },
                                    { step: "٢", text: "تأكيد الدفع" },
                                    { step: "٣", text: "تفعيل الاشتراك والبدء بالرحلات" },
                                ].map((item) => (
                                    <div key={item.step} className="flex items-center gap-3">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 text-xs font-bold">
                                            {item.step}
                                        </div>
                                        <p className="text-sm text-text-secondary">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-600/25 hover:bg-primary-700 transition-all duration-300 hover:-translate-y-0.5"
                        >
                            الرجوع للرئيسية
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    if (!formSettings.enabled) {
        return (
            <div className="min-h-screen bg-surface-alt">
                <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white font-bold text-lg">
                                    و
                                </div>
                                <span className="text-xl font-bold text-text-primary">وصلة</span>
                            </Link>
                        </div>
                    </div>
                </header>
                <main className="pt-28 pb-16 px-4">
                    <div className="mx-auto max-w-md rounded-2xl bg-white border border-border p-8 text-center shadow-sm">
                        <h1 className="text-xl font-extrabold text-text-primary">
                            تسجيل الطلاب مغلق حالياً
                        </h1>
                        <p className="mt-2 text-sm text-text-secondary">
                            يرجى المحاولة لاحقاً أو التواصل مع إدارة وصلة.
                        </p>
                        <Link href="/" className="mt-6 inline-flex rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white">
                            الرجوع للرئيسية
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-alt">
            {/* Top bar */}
            <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white font-bold text-lg">
                                و
                            </div>
                            <span className="text-xl font-bold text-text-primary">وصلة</span>
                        </Link>
                        <Link
                            href="/"
                            className="text-sm font-medium text-text-secondary hover:text-primary-600 transition-colors"
                        >
                            الرجوع للرئيسية ←
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-xl">
                    {/* Heading */}
                    <div className="text-center mb-10">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-3xl">
                            🎓
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                            {formSettings.title}
                        </h1>
                        <p className="mt-2 text-text-secondary text-sm sm:text-base">
                            {formSettings.description}
                        </p>

                        {/* Info note */}
                        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200 p-3 text-right">
                            <span className="text-amber-500 text-sm mt-0.5">💡</span>
                            <p className="text-xs text-amber-700 leading-relaxed">
                                {formSettings.note}
                            </p>
                        </div>
                    </div>

                    {/* Form card */}
                    <form onSubmit={handleSubmit}>
                        <div className="rounded-3xl bg-white border border-border shadow-sm p-6 sm:p-8 space-y-5">
                            {/* ── Section 1: Personal Info ── */}
                            <div className="pb-4 border-b border-border">
                                <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-100 text-primary-600 text-xs font-extrabold">
                                        ١
                                    </span>
                                    المعلومات الشخصية
                                </h2>
                            </div>

                            {/* Full name */}
                            <div>
                                <label
                                    htmlFor="fullName"
                                    className="block text-sm font-medium text-text-primary mb-1.5"
                                >
                                    الاسم الثلاثي <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="مثال: أحمد محمد العبيدي"
                                    className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-3">
                                    الجنس <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, gender: "male" })}
                                        className={`flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3.5 text-sm font-bold transition-all duration-300 ${formData.gender === "male"
                                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                                            : "border-border bg-white text-text-secondary hover:border-blue-300 hover:bg-blue-50/50"
                                            }`}
                                    >
                                        <span className="text-lg">👨</span>
                                        ذكر
                                        {formData.gender === "male" && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, gender: "female" })}
                                        className={`flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3.5 text-sm font-bold transition-all duration-300 ${formData.gender === "female"
                                            ? "border-pink-500 bg-pink-50 text-pink-700 shadow-sm"
                                            : "border-border bg-white text-text-secondary hover:border-pink-300 hover:bg-pink-50/50"
                                            }`}
                                    >
                                        <span className="text-lg">👩</span>
                                        أنثى
                                        {formData.gender === "female" && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-text-primary mb-1.5"
                                >
                                    رقم المشترك أو رقم ولي الأمر <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="07xxxxxxxxx"
                                    dir="ltr"
                                    className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* ── Section 2: Location ── */}
                            <div className="pt-2 pb-4 border-b border-border">
                                <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-100 text-primary-600 text-xs font-extrabold">
                                        ٢
                                    </span>
                                    الموقع
                                </h2>
                            </div>

                            {/* Area */}
                            <div>
                                <label
                                    htmlFor="area"
                                    className="block text-sm font-medium text-text-primary mb-1.5"
                                >
                                    المنطقة <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="area"
                                    name="area"
                                    type="text"
                                    required
                                    value={formData.area}
                                    onChange={handleChange}
                                    placeholder="مثال: الزهور، المجموعة، النبي يونس"
                                    className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Landmark */}
                            <div>
                                <label
                                    htmlFor="landmark"
                                    className="block text-sm font-medium text-text-primary mb-1.5"
                                >
                                    أقرب نقطة دالة <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="landmark"
                                    name="landmark"
                                    type="text"
                                    required
                                    value={formData.landmark}
                                    onChange={handleChange}
                                    placeholder="مثال: قرب جامع الزهور، مقابل مستشفى السلام"
                                    className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                />
                                <p className="mt-1 text-xs text-text-tertiary">
                                    نقطة قريبة منك تساعد السائق على تحديد موقعك بسهولة
                                </p>
                            </div>

                            {/* ── Section 3: University ── */}
                            <div className="pt-2 pb-4 border-b border-border">
                                <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-100 text-primary-600 text-xs font-extrabold">
                                        ٣
                                    </span>
                                    بيانات الجامعة
                                </h2>
                            </div>

                            {/* University */}
                            <div>
                                <label
                                    htmlFor="university"
                                    className="block text-sm font-medium text-text-primary mb-1.5"
                                >
                                    الجامعة <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="university"
                                    name="university"
                                    required
                                    value={formData.university}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                                >
                                    <option value="" disabled>
                                        اختر جامعتك
                                    </option>
                                    {formSettings.universities.map((uni) => (
                                        <option key={uni} value={uni}>
                                            {uni}
                                        </option>
                                    ))}
                                    {formSettings.allowOtherUniversity && (
                                        <option value="other">أخرى</option>
                                    )}
                                </select>
                            </div>

                            {/* Custom university */}
                            {formData.university === "other" && (
                                <div>
                                    <label
                                        htmlFor="customUniversity"
                                        className="block text-sm font-medium text-text-primary mb-1.5"
                                    >
                                        اكتب اسم الجامعة <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="customUniversity"
                                        name="customUniversity"
                                        type="text"
                                        required
                                        value={formData.customUniversity}
                                        onChange={handleChange}
                                        placeholder="اسم الجامعة أو الكلية"
                                        className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            )}

                            {/* University location */}
                            <div>
                                <label
                                    htmlFor="universityLocation"
                                    className="block text-sm font-medium text-text-primary mb-1.5"
                                >
                                    موقع الجامعة <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="universityLocation"
                                    name="universityLocation"
                                    type="text"
                                    required
                                    value={formData.universityLocation}
                                    onChange={handleChange}
                                    placeholder="مثال: الساحل الأيسر — كلية الهندسة"
                                    className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Shift */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-3">
                                    الدوام <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, shift: "morning" })}
                                        className={`flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3.5 text-sm font-bold transition-all duration-300 ${formData.shift === "morning"
                                            ? "border-amber-500 bg-amber-50 text-amber-700 shadow-sm"
                                            : "border-border bg-white text-text-secondary hover:border-amber-300 hover:bg-amber-50/50"
                                            }`}
                                    >
                                        <span className="text-lg">☀️</span>
                                        صباحي
                                        {formData.shift === "morning" && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, shift: "evening" })}
                                        className={`flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3.5 text-sm font-bold transition-all duration-300 ${formData.shift === "evening"
                                            ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm"
                                            : "border-border bg-white text-text-secondary hover:border-indigo-300 hover:bg-indigo-50/50"
                                            }`}
                                    >
                                        <span className="text-lg">🌙</span>
                                        مسائي
                                        {formData.shift === "evening" && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={!formData.gender || !formData.shift}
                                className="w-full mt-3 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-primary-600/25 hover:bg-primary-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                            >
                                تسجيل الاشتراك
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 rotate-180"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Bottom link */}
                        <p className="mt-6 text-center text-sm text-text-tertiary">
                            أنت سائق؟{" "}
                            <Link
                                href="/register/captain"
                                className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                            >
                                سجل ككابتن بدلاً من ذلك
                            </Link>
                        </p>
                    </form>
                </div>
            </main>
        </div>
    );
}
