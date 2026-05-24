"use client";

import { useState } from "react";
import { defaultFormSettings, useFormSettings } from "@/lib/store";
import type { FormSettings } from "@/lib/store";
import type { RegistrationType } from "@/lib/mock-data";

type FormKey = "student" | "captain";

const registrationTypeLabels: Record<RegistrationType, string> = {
    taxi: "تكسي",
    subscription: "اشتراك",
};

function linesToList(value: string) {
    return value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
}

function listToLines(value: string[]) {
    return value.join("\n");
}

export default function FormsSettingsPage() {
    const [settings, setSettings] = useFormSettings();
    const [activeForm, setActiveForm] = useState<FormKey>("student");
    const [saved, setSaved] = useState(false);

    const updateStudent = (patch: Partial<FormSettings["student"]>) => {
        setSettings((current) => ({
            ...current,
            student: { ...current.student, ...patch },
        }));
        flashSaved();
    };

    const updateCaptain = (patch: Partial<FormSettings["captain"]>) => {
        setSettings((current) => ({
            ...current,
            captain: { ...current.captain, ...patch },
        }));
        flashSaved();
    };

    const resetCurrent = () => {
        setSettings((current) => ({
            ...current,
            [activeForm]: defaultFormSettings[activeForm],
        }));
        flashSaved();
    };

    const flashSaved = () => {
        setSaved(true);
        window.setTimeout(() => setSaved(false), 1200);
    };

    return (
        <div>
            <div className="mb-6 flex items-start justify-between gap-3 flex-wrap">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                        إعدادات فورمات التسجيل
                    </h1>
                    <p className="mt-1 text-sm text-text-secondary">
                        تحكم بتسجيل الطالب وتسجيل الكابتن من لوحة الإدارة
                    </p>
                </div>
                {saved && (
                    <span className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs font-bold text-green-700">
                        تم الحفظ
                    </span>
                )}
            </div>

            <div className="flex gap-2 mb-6">
                <TabButton
                    active={activeForm === "student"}
                    label="تسجيل الطالب"
                    onClick={() => setActiveForm("student")}
                />
                <TabButton
                    active={activeForm === "captain"}
                    label="تسجيل الكابتن"
                    onClick={() => setActiveForm("captain")}
                />
            </div>

            {activeForm === "student" ? (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                    <div className="xl:col-span-2 rounded-2xl bg-white border border-border shadow-sm p-5 space-y-5">
                        <ToggleRow
                            label="فتح تسجيل الطلاب"
                            checked={settings.student.enabled}
                            onChange={(enabled) => updateStudent({ enabled })}
                        />
                        <TextField
                            label="عنوان الفورم"
                            value={settings.student.title}
                            onChange={(title) => updateStudent({ title })}
                        />
                        <TextField
                            label="الوصف"
                            value={settings.student.description}
                            onChange={(description) => updateStudent({ description })}
                        />
                        <TextAreaField
                            label="الملاحظة الصفراء"
                            value={settings.student.note}
                            onChange={(note) => updateStudent({ note })}
                        />
                        <TextAreaField
                            label="قائمة الجامعات"
                            value={listToLines(settings.student.universities)}
                            onChange={(value) => updateStudent({ universities: linesToList(value) })}
                            rows={7}
                        />
                        <ToggleRow
                            label="السماح بخيار أخرى"
                            checked={settings.student.allowOtherUniversity}
                            onChange={(allowOtherUniversity) =>
                                updateStudent({ allowOtherUniversity })
                            }
                        />
                    </div>
                    <PreviewCard
                        title={settings.student.title}
                        description={settings.student.description}
                        enabled={settings.student.enabled}
                        items={settings.student.universities}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                    <div className="xl:col-span-2 rounded-2xl bg-white border border-border shadow-sm p-5 space-y-5">
                        <ToggleRow
                            label="فتح تسجيل الكباتن"
                            checked={settings.captain.enabled}
                            onChange={(enabled) => updateCaptain({ enabled })}
                        />
                        <TextField
                            label="عنوان الفورم"
                            value={settings.captain.title}
                            onChange={(title) => updateCaptain({ title })}
                        />
                        <TextField
                            label="الوصف"
                            value={settings.captain.description}
                            onChange={(description) => updateCaptain({ description })}
                        />
                        <TextAreaField
                            label="الملاحظة"
                            value={settings.captain.note}
                            onChange={(note) => updateCaptain({ note })}
                        />
                        <TextAreaField
                            label="أنواع السيارات"
                            value={listToLines(settings.captain.carBrands)}
                            onChange={(value) => updateCaptain({ carBrands: linesToList(value) })}
                            rows={8}
                        />
                        <ToggleRow
                            label="السماح بخيار أخرى"
                            checked={settings.captain.allowOtherCarBrand}
                            onChange={(allowOtherCarBrand) =>
                                updateCaptain({ allowOtherCarBrand })
                            }
                        />
                        <div>
                            <p className="text-xs font-bold text-text-secondary mb-2">
                                أنواع التسجيل المتاحة
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {(["taxi", "subscription"] as RegistrationType[]).map((type) => {
                                    const checked =
                                        settings.captain.enabledRegistrationTypes.includes(type);
                                    return (
                                        <button
                                            key={type}
                                            onClick={() =>
                                                updateCaptain({
                                                    enabledRegistrationTypes: checked
                                                        ? settings.captain.enabledRegistrationTypes.filter(
                                                            (item) => item !== type
                                                        )
                                                        : [
                                                            ...settings.captain.enabledRegistrationTypes,
                                                            type,
                                                        ],
                                                })
                                            }
                                            className={`rounded-xl border px-4 py-2.5 text-sm font-bold ${checked
                                                    ? "border-primary-300 bg-primary-50 text-primary-700"
                                                    : "border-border bg-white text-text-secondary hover:bg-surface-hover"
                                                }`}
                                        >
                                            {registrationTypeLabels[type]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <PreviewCard
                        title={settings.captain.title}
                        description={settings.captain.description}
                        enabled={settings.captain.enabled}
                        items={settings.captain.carBrands}
                    />
                </div>
            )}

            <button
                onClick={resetCurrent}
                className="mt-5 rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-bold text-text-secondary hover:bg-surface-hover"
            >
                إرجاع الإعدادات الافتراضية لهذا الفورم
            </button>
        </div>
    );
}

function TabButton({
    active,
    label,
    onClick,
}: {
    active: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`rounded-xl px-4 py-2.5 text-sm font-bold ${active
                    ? "bg-primary-600 text-white shadow-sm"
                    : "bg-white border border-border text-text-secondary hover:bg-surface-hover"
                }`}
        >
            {label}
        </button>
    );
}

function ToggleRow({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-alt p-3">
            <span className="text-sm font-bold text-text-primary">{label}</span>
            <button
                onClick={() => onChange(!checked)}
                className={`h-7 w-12 rounded-full p-1 transition-colors ${checked ? "bg-primary-600" : "bg-gray-300"
                    }`}
            >
                <span
                    className={`block h-5 w-5 rounded-full bg-white transition-transform ${checked ? "-translate-x-5" : "translate-x-0"
                        }`}
                />
            </button>
        </div>
    );
}

function TextField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div>
            <label className="block text-xs font-bold text-text-secondary mb-1.5">
                {label}
            </label>
            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
        </div>
    );
}

function TextAreaField({
    label,
    value,
    onChange,
    rows = 3,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
}) {
    return (
        <div>
            <label className="block text-xs font-bold text-text-secondary mb-1.5">
                {label}
            </label>
            <textarea
                value={value}
                rows={rows}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
        </div>
    );
}

function PreviewCard({
    title,
    description,
    enabled,
    items,
}: {
    title: string;
    description: string;
    enabled: boolean;
    items: string[];
}) {
    return (
        <div className="rounded-2xl bg-white border border-border shadow-sm p-5 h-fit">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-text-primary">معاينة سريعة</h2>
                <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${enabled
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-600 border-red-200"
                        }`}
                >
                    {enabled ? "مفتوح" : "مغلق"}
                </span>
            </div>
            <p className="text-lg font-extrabold text-text-primary">{title}</p>
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
            <div className="mt-4 space-y-2">
                {items.slice(0, 6).map((item) => (
                    <div key={item} className="rounded-xl bg-surface-alt px-3 py-2 text-xs font-bold text-text-secondary">
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}
