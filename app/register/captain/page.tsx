"use client";

import { useState } from "react";
import Link from "next/link";
import { addCaptainRegistration, useFormSettings } from "@/lib/store";
import type { RegistrationType } from "@/lib/mock-data";

export default function CaptainApplyPage() {
    const [settings] = useFormSettings();
    const formSettings = settings.captain;
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        carBrand: "",
        customCarBrand: "",
        carModel: "",
        modelYear: "",
        plateNumber: "",
        city: "mosul",
        areaName: "",
        registrationTypes: [] as RegistrationType[],
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTypeToggle = (type: RegistrationType) => {
        if (!formSettings.enabledRegistrationTypes.includes(type)) return;
        setFormData((prev) => ({
            ...prev,
            registrationTypes: prev.registrationTypes.includes(type)
                ? prev.registrationTypes.filter((t) => t !== type)
                : [...prev.registrationTypes, type],
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            carBrand:
                formData.carBrand === "other"
                    ? formData.customCarBrand
                    : formData.carBrand,
        };
        addCaptainRegistration(payload);
        setSubmitted(true);
    };

    // Generate year options (current year down to 2000)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1999 }, (_, i) =>
        String(currentYear - i)
    );

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
                        {/* Success animation */}
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary-100">
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
                            تم إرسال طلبك بنجاح!
                        </h1>
                        <p className="text-text-secondary text-base leading-relaxed mb-2">
                            شكراً لك على تقديم طلب الانضمام. سيتم مراجعة طلبك والتواصل معك
                            قريباً.
                        </p>
                        <p className="text-text-tertiary text-sm mb-8">
                            رح نتواصل وياك على الرقم اللي سجلته خلال ٢٤-٤٨ ساعة.
                        </p>
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
                            تسجيل الكباتن مغلق حالياً
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
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-7 w-7"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                            {formSettings.title}
                        </h1>
                        <p className="mt-2 text-text-secondary text-sm sm:text-base">
                            {formSettings.description}
                        </p>
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
                            {/* ── Personal Info ── */}
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
                                    الاسم الكامل <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="مثال: أحمد محمد"
                                    className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-text-primary mb-1.5"
                                >
                                    رقم الهاتف <span className="text-red-500">*</span>
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

                            {/* ── Vehicle Info ── */}
                            <div className="pt-2 pb-4 border-b border-border">
                                <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-100 text-primary-600 text-xs font-extrabold">
                                        ٢
                                    </span>
                                    معلومات السيارة
                                </h2>
                            </div>

                            {/* Car brand */}
                            <div>
                                <label
                                    htmlFor="carBrand"
                                    className="block text-sm font-medium text-text-primary mb-1.5"
                                >
                                    نوع السيارة (البراند) <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="carBrand"
                                    name="carBrand"
                                    required
                                    value={formData.carBrand}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                                >
                                    <option value="" disabled>
                                        اختر نوع السيارة
                                    </option>
                                    {formSettings.carBrands.map((brand) => (
                                        <option key={brand} value={brand}>
                                            {brand}
                                        </option>
                                    ))}
                                    {formSettings.allowOtherCarBrand && (
                                        <option value="other">أخرى</option>
                                    )}
                                </select>
                            </div>

                            {/* Custom brand name (shows when "other" selected) */}
                            {formData.carBrand === "other" && (
                                <div className="animate-in fade-in">
                                    <label
                                        htmlFor="customCarBrand"
                                        className="block text-sm font-medium text-text-primary mb-1.5"
                                    >
                                        اكتب اسم النوع <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="customCarBrand"
                                        name="customCarBrand"
                                        type="text"
                                        required
                                        value={formData.customCarBrand}
                                        onChange={handleChange}
                                        placeholder="اكتب نوع السيارة"
                                        className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            )}

                            {/* Car model */}
                            <div>
                                <label
                                    htmlFor="carModel"
                                    className="block text-sm font-medium text-text-primary mb-1.5"
                                >
                                    موديل السيارة <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="carModel"
                                    name="carModel"
                                    type="text"
                                    required
                                    value={formData.carModel}
                                    onChange={handleChange}
                                    placeholder="مثال: كامري، سوناتا، ريو"
                                    className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Model year */}
                            <div>
                                <label
                                    htmlFor="modelYear"
                                    className="block text-sm font-medium text-text-primary mb-1.5"
                                >
                                    سنة الموديل <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="modelYear"
                                    name="modelYear"
                                    required
                                    value={formData.modelYear}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                                >
                                    <option value="" disabled>
                                        اختر السنة
                                    </option>
                                    {years.map((y) => (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Plate number */}
                            <div>
                                <label
                                    htmlFor="plateNumber"
                                    className="block text-sm font-medium text-text-primary mb-1.5"
                                >
                                    رقم اللوحة <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="plateNumber"
                                    name="plateNumber"
                                    type="text"
                                    required
                                    value={formData.plateNumber}
                                    onChange={handleChange}
                                    placeholder="رقم لوحة السيارة"
                                    className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* ── Location & Type ── */}
                            <div className="pt-2 pb-4 border-b border-border">
                                <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-100 text-primary-600 text-xs font-extrabold">
                                        ٣
                                    </span>
                                    الموقع ونوع التسجيل
                                </h2>
                            </div>

                            {/* City */}
                            <div>
                                <label
                                    htmlFor="city"
                                    className="block text-sm font-medium text-text-primary mb-1.5"
                                >
                                    المدينة
                                </label>
                                <select
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                                >
                                    <option value="mosul">الموصل</option>
                                </select>
                                <p className="mt-1 text-xs text-text-tertiary">
                                    حالياً متوفر فقط في الموصل
                                </p>
                            </div>

                            {/* Area name */}
                            <div>
                                <label
                                    htmlFor="areaName"
                                    className="block text-sm font-medium text-text-primary mb-1.5"
                                >
                                    اسم المنطقة <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="areaName"
                                    name="areaName"
                                    type="text"
                                    required
                                    value={formData.areaName}
                                    onChange={handleChange}
                                    placeholder="مثال: الزهور، المجموعة، النبي يونس"
                                    className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Registration type — multi-select chips */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-3">
                                    نوع التسجيل <span className="text-red-500">*</span>
                                    <span className="text-text-tertiary font-normal mr-1">
                                        (يمكن اختيار أكثر من نوع)
                                    </span>
                                </label>
                                <div className="flex gap-3">
                                    {/* Taxi chip */}
                                    {formSettings.enabledRegistrationTypes.includes("taxi") && (
                                        <button
                                            type="button"
                                            onClick={() => handleTypeToggle("taxi")}
                                            className={`flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3.5 text-sm font-bold transition-all duration-300 ${formData.registrationTypes.includes("taxi")
                                                ? "border-primary-500 bg-primary-50 text-primary-700 shadow-sm"
                                                : "border-border bg-white text-text-secondary hover:border-primary-300 hover:bg-primary-50/50"
                                            }`}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={1.5}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                                                />
                                            </svg>
                                            تكسي
                                            {formData.registrationTypes.includes("taxi") && (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={3}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    )}

                                    {/* Subscription chip */}
                                    {formSettings.enabledRegistrationTypes.includes("subscription") && (
                                        <button
                                            type="button"
                                            onClick={() => handleTypeToggle("subscription")}
                                            className={`flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3.5 text-sm font-bold transition-all duration-300 ${formData.registrationTypes.includes("subscription")
                                                ? "border-secondary-500 bg-secondary-50 text-secondary-700 shadow-sm"
                                                : "border-border bg-white text-text-secondary hover:border-secondary-300 hover:bg-secondary-50/50"
                                            }`}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={1.5}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                                                />
                                            </svg>
                                            اشتراك
                                            {formData.registrationTypes.includes("subscription") && (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={3}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={formData.registrationTypes.length === 0}
                                className="w-full mt-3 inline-flex items-center justify-center gap-2 rounded-2xl bg-secondary-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-secondary-500/25 hover:bg-secondary-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                            >
                                إرسال طلب الانضمام
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
                            أنت طالب؟{" "}
                            <Link
                                href="/register/student"
                                className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                            >
                                سجل كطالب بدلاً من ذلك
                            </Link>
                        </p>
                    </form>
                </div>
            </main>
        </div>
    );
}
