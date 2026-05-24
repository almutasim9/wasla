"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Captain, StudentApplication } from "@/lib/mock-data";
import {
    useCaptains,
    useStudents,
    useSubscriptions,
    type Subscription,
} from "@/lib/store";

type TabKey = "link" | "active" | "unassigned_students" | "empty_subscriptions";

const tabs: { key: TabKey; label: string }[] = [
    { key: "link", label: "ربط الاشتراك" },
    { key: "active", label: "الاشتراكات النشطة" },
    { key: "unassigned_students", label: "طلاب بلا كابتن" },
    { key: "empty_subscriptions", label: "اشتراكات بلا طلاب" },
];

const statusConfig = {
    active: "bg-green-50 text-green-700 border-green-200",
    paused: "bg-amber-50 text-amber-700 border-amber-200",
    ended: "bg-gray-100 text-gray-600 border-gray-200",
};

function today() {
    return new Date().toISOString().split("T")[0];
}

function uniqueId() {
    return `sub${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function money(value: number) {
    return `${value.toLocaleString()} د.ع`;
}

function getStudentIds(subscription: Subscription) {
    return subscription.studentIds ?? (subscription.studentId ? [subscription.studentId] : []);
}

function paidTotal(student: StudentApplication) {
    return student.payments.reduce((sum, payment) => sum + payment.amountPaid, 0);
}

function getStudentPrice(subscription: Subscription, studentId: string) {
    return subscription.studentPrices?.[studentId] ?? subscription.monthlyAmount;
}

export default function OperationsPage() {
    const [students] = useStudents();
    const [captains] = useCaptains();
    const [subscriptions, setSubscriptions] = useSubscriptions();
    const [activeTab, setActiveTab] = useState<TabKey>("link");

    const [captainId, setCaptainId] = useState("");
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [studentPrices, setStudentPrices] = useState<Record<string, string>>({});
    const [areaFilter, setAreaFilter] = useState("");
    const [universityFilter, setUniversityFilter] = useState("");
    const [monthlyAmount, setMonthlyAmount] = useState("50000");
    const [routeNote, setRouteNote] = useState("");

    const approvedStudents = useMemo(
        () => students.filter((student) => student.status === "active" && student.stage === "active"),
        [students]
    );
    const approvedCaptains = useMemo(
        () => captains.filter((captain) => captain.accountStatus === "active"),
        [captains]
    );

    const assignedStudentIds = useMemo(() => {
        const ids = new Set<string>();
        subscriptions.forEach((subscription) => {
            if (subscription.status === "ended") return;
            getStudentIds(subscription).forEach((id) => ids.add(id));
        });
        return ids;
    }, [subscriptions]);

    const activeSubscriptions = subscriptions.filter(
        (subscription) => subscription.status !== "ended" && getStudentIds(subscription).length > 0
    );
    const emptySubscriptions = subscriptions.filter(
        (subscription) => subscription.status !== "ended" && getStudentIds(subscription).length === 0
    );
    const captainsWithoutStudents = approvedCaptains.filter((captain) => {
        const related = subscriptions.filter(
            (subscription) =>
                subscription.status !== "ended" && subscription.captainId === captain.id
        );
        return related.length === 0 || related.every((subscription) => getStudentIds(subscription).length === 0);
    });
    const unassignedStudents = approvedStudents.filter(
        (student) => !assignedStudentIds.has(student.id)
    );

    const areas = [...new Set(approvedStudents.map((student) => student.area))];
    const universities = [...new Set(approvedStudents.map((student) => student.university))];
    const filteredStudents = unassignedStudents.filter((student) => {
        const matchesArea = !areaFilter || student.area === areaFilter;
        const matchesUniversity = !universityFilter || student.university === universityFilter;
        return matchesArea && matchesUniversity;
    });

    const selectedCaptain = approvedCaptains.find((captain) => captain.id === captainId);

    const toggleStudent = (id: string) => {
        setSelectedStudentIds((current) => {
            if (current.includes(id)) {
                setStudentPrices((prices) => {
                    const next = { ...prices };
                    delete next[id];
                    return next;
                });
                return current.filter((item) => item !== id);
            }
            if (current.length >= 4) return current;
            setStudentPrices((prices) => ({
                ...prices,
                [id]: prices[id] || monthlyAmount,
            }));
            return [...current, id];
        });
    };

    const updateStudentPrice = (id: string, value: string) => {
        setStudentPrices((current) => ({ ...current, [id]: value }));
    };

    const createSubscription = () => {
        const amount = Number(monthlyAmount);
        if (!captainId || !amount || amount <= 0) return;

        setSubscriptions((current) => [
            {
                id: uniqueId(),
                captainId,
                studentIds: selectedStudentIds,
                studentPrices: Object.fromEntries(
                    selectedStudentIds.map((id) => [id, Number(studentPrices[id] || amount)])
                ),
                monthlyAmount: amount,
                routeNote: routeNote.trim() || "اشتراك جديد",
                status: "active",
                startDate: today(),
                createdAt: today(),
            },
            ...current,
        ]);

        setCaptainId("");
        setSelectedStudentIds([]);
        setStudentPrices({});
        setAreaFilter("");
        setUniversityFilter("");
        setMonthlyAmount("50000");
        setRouteNote("");
    };

    const addStudentsToSubscription = (
        subscriptionId: string,
        ids: string[],
        prices: Record<string, number>
    ) => {
        setSubscriptions((current) =>
            current.map((subscription) => {
                if (subscription.id !== subscriptionId) return subscription;
                const existingIds = getStudentIds(subscription);
                const nextIds = [...existingIds, ...ids.filter((id) => !existingIds.includes(id))].slice(0, 4);
                const nextPrices = { ...(subscription.studentPrices ?? {}) };
                ids.forEach((id) => {
                    nextPrices[id] = prices[id] ?? subscription.monthlyAmount;
                });
                return { ...subscription, studentIds: nextIds, studentPrices: nextPrices };
            })
        );
    };

    const updateStatus = (id: string, status: Subscription["status"]) => {
        setSubscriptions((current) =>
            current.map((subscription) =>
                subscription.id === id ? { ...subscription, status } : subscription
            )
        );
    };

    const stats = {
        active: activeSubscriptions.length,
        unassigned: unassignedStudents.length,
        empty: emptySubscriptions.length + captainsWithoutStudents.length,
        seats: activeSubscriptions.reduce((sum, sub) => sum + (4 - getStudentIds(sub).length), 0),
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">العمليات</h1>
                <p className="mt-1 text-sm text-text-secondary">
                    ربط الطلاب بالكباتن وإدارة سيارات الاشتراكات بسعة ٤ طلاب لكل سيارة
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                <Stat label="اشتراكات نشطة" value={stats.active} />
                <Stat label="طلاب بلا كابتن" value={stats.unassigned} />
                <Stat label="اشتراكات بلا طلاب" value={stats.empty} />
                <Stat label="مقاعد متاحة" value={stats.seats} />
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${activeTab === tab.key
                                ? "bg-primary-600 text-white shadow-sm"
                                : "bg-white border border-border text-text-secondary hover:bg-surface-hover"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "link" && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                    <div className="rounded-2xl bg-white border border-border shadow-sm p-5">
                        <h2 className="text-sm font-bold text-text-primary mb-4">اختيار الكابتن</h2>
                        <select
                            value={captainId}
                            onChange={(event) => setCaptainId(event.target.value)}
                            className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">اختر كابتن معتمد</option>
                            {approvedCaptains.map((captain) => (
                                <option key={captain.id} value={captain.id}>
                                    {captain.fullName} — {captain.carBrand} {captain.carModel}
                                </option>
                            ))}
                        </select>

                        {selectedCaptain && (
                            <div className="mt-4 rounded-xl bg-surface-alt p-3">
                                <p className="text-sm font-bold text-text-primary">{selectedCaptain.fullName}</p>
                                <p className="mt-1 text-xs text-text-tertiary">
                                    {selectedCaptain.phone} — {selectedCaptain.areaName}
                                </p>
                            </div>
                        )}

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-text-secondary mb-1.5">السعر الافتراضي</label>
                                <input
                                    type="number"
                                    value={monthlyAmount}
                                    onChange={(event) => setMonthlyAmount(event.target.value)}
                                    dir="ltr"
                                    className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary mb-1.5">عدد الطلاب</label>
                                <div className="rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm font-bold text-text-primary">
                                    {selectedStudentIds.length} / 4
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-xs font-bold text-text-secondary mb-1.5">ملاحظة خط السير</label>
                            <textarea
                                value={routeNote}
                                onChange={(event) => setRouteNote(event.target.value)}
                                rows={3}
                                placeholder="مثال: الزهور + المجموعة إلى جامعة الموصل"
                                className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                            />
                        </div>

                        <button
                            onClick={createSubscription}
                            disabled={!captainId || !monthlyAmount}
                            className="mt-4 w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            إنشاء الاشتراك
                        </button>
                    </div>

                    <div className="xl:col-span-2 rounded-2xl bg-white border border-border shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-border">
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                <h2 className="text-sm font-bold text-text-primary">اختيار الطلاب</h2>
                                <span className="text-xs font-bold text-primary-600">الحد الأعلى ٤ طلاب</span>
                            </div>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <FilterSelect label="المنطقة" value={areaFilter} onChange={setAreaFilter} options={areas} />
                                <FilterSelect label="الجامعة" value={universityFilter} onChange={setUniversityFilter} options={universities} />
                            </div>
                        </div>

                        <div className="divide-y divide-border">
                            {filteredStudents.length === 0 ? (
                                <div className="p-10 text-center text-sm font-medium text-text-secondary">
                                    لا يوجد طلاب مطابقين للفلتر أو كل الطلاب مربوطين
                                </div>
                            ) : (
                                filteredStudents.map((student) => (
                                <StudentPickRow
                                    key={student.id}
                                    student={student}
                                    selected={selectedStudentIds.includes(student.id)}
                                    price={studentPrices[student.id] || monthlyAmount}
                                    disabled={!selectedStudentIds.includes(student.id) && selectedStudentIds.length >= 4}
                                    onToggle={() => toggleStudent(student.id)}
                                    onPriceChange={(value) => updateStudentPrice(student.id, value)}
                                />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "active" && (
                <div className="space-y-4">
                    {activeSubscriptions.length === 0 ? (
                        <EmptyState text="لا توجد اشتراكات نشطة تحتوي طلاب" />
                    ) : (
                        activeSubscriptions.map((subscription) => (
                            <SubscriptionCard
                                key={subscription.id}
                                subscription={subscription}
                                students={students}
                                captains={captains}
                                onStatusChange={updateStatus}
                            />
                        ))
                    )}
                </div>
            )}

            {activeTab === "unassigned_students" && (
                <div className="rounded-2xl bg-white border border-border shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-border">
                        <h2 className="text-sm font-bold text-text-primary">الطلاب المعتمدين بدون كابتن</h2>
                    </div>
                    <div className="divide-y divide-border">
                        {unassignedStudents.length === 0 ? (
                            <EmptyState text="كل الطلاب المعتمدين لديهم كابتن" />
                        ) : (
                            unassignedStudents.map((student) => (
                                <StudentInfoRow key={student.id} student={student} />
                            ))
                        )}
                    </div>
                </div>
            )}

            {activeTab === "empty_subscriptions" && (
                <div className="space-y-4">
                    {emptySubscriptions.map((subscription) => (
                        <EmptySubscriptionCard
                            key={subscription.id}
                            subscription={subscription}
                            captains={captains}
                            availableStudents={unassignedStudents}
                            onAddStudents={addStudentsToSubscription}
                        />
                    ))}
                    {captainsWithoutStudents
                        .filter((captain) => !emptySubscriptions.some((subscription) => subscription.captainId === captain.id))
                        .map((captain) => (
                            <div key={captain.id} className="rounded-2xl bg-white border border-border shadow-sm p-5">
                                <p className="text-sm font-extrabold text-text-primary">{captain.fullName}</p>
                                <p className="mt-1 text-xs text-text-tertiary">
                                    كابتن معتمد ولا يوجد لديه طلاب حالياً
                                </p>
                            </div>
                        ))}
                    {emptySubscriptions.length === 0 && captainsWithoutStudents.length === 0 && (
                        <EmptyState text="لا توجد اشتراكات أو كباتن بلا طلاب" />
                    )}
                </div>
            )}
        </div>
    );
}

function Stat({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-xl bg-white border border-border p-4 shadow-sm">
            <p className="text-xl font-extrabold text-primary-600">{value}</p>
            <p className="mt-0.5 text-[11px] font-medium text-text-tertiary">{label}</p>
        </div>
    );
}

function FilterSelect({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: string[];
}) {
    return (
        <div>
            <label className="block text-xs font-bold text-text-secondary mb-1.5">{label}</label>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-xl border border-border bg-surface-alt px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
                <option value="">الكل</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

function StudentPickRow({
    student,
    selected,
    price,
    disabled,
    onToggle,
    onPriceChange,
}: {
    student: StudentApplication;
    selected: boolean;
    price: string;
    disabled: boolean;
    onToggle: () => void;
    onPriceChange: (value: string) => void;
}) {
    return (
        <div
            className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 transition-colors ${selected ? "bg-primary-50" : "hover:bg-surface-alt"} ${disabled ? "opacity-40" : ""}`}
        >
            <button
                onClick={onToggle}
                disabled={disabled}
                className="flex flex-1 items-center gap-3 text-right disabled:cursor-not-allowed"
            >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${selected ? "bg-primary-600 text-white" : "bg-surface-alt text-text-secondary"}`}>
                    {selected ? "✓" : student.fullName.charAt(0)}
                </span>
                <span className="flex-1 min-w-0">
                    <span className="block text-sm font-bold text-text-primary">{student.fullName}</span>
                    <span className="block text-xs text-text-tertiary">
                        {student.area} — {student.university} — {student.shift === "morning" ? "صباحي" : "مسائي"}
                    </span>
                </span>
            </button>
            {selected && (
                <div className="sm:w-40">
                    <label className="mb-1 block text-[10px] font-bold text-text-tertiary">
                        سعر الطالب
                    </label>
                    <input
                        type="number"
                        value={price}
                        onChange={(event) => onPriceChange(event.target.value)}
                        dir="ltr"
                        className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            )}
        </div>
    );
}

function SubscriptionCard({
    subscription,
    students,
    captains,
    onStatusChange,
}: {
    subscription: Subscription;
    students: StudentApplication[];
    captains: Captain[];
    onStatusChange: (id: string, status: Subscription["status"]) => void;
}) {
    const captain = captains.find((item) => item.id === subscription.captainId);
    const linkedStudents = getStudentIds(subscription)
        .map((id) => students.find((student) => student.id === id))
        .filter(Boolean) as StudentApplication[];
    const paid = linkedStudents.reduce((sum, student) => {
        const price = getStudentPrice(subscription, student.id);
        return sum + Math.min(paidTotal(student), price);
    }, 0);
    const expected = linkedStudents.reduce(
        (sum, student) => sum + getStudentPrice(subscription, student.id),
        0
    );
    const remaining = Math.max(expected - paid, 0);

    return (
        <div className="rounded-2xl bg-white border border-border shadow-sm p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-sm font-extrabold text-text-primary">
                            {captain?.fullName ?? "كابتن غير معروف"}
                        </h2>
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusConfig[subscription.status]}`}>
                            {subscription.status === "active" ? "نشط" : subscription.status === "paused" ? "متوقف" : "منتهي"}
                        </span>
                        <span className="inline-flex rounded-full bg-surface-alt px-2 py-0.5 text-[10px] font-bold text-text-secondary">
                            {linkedStudents.length} / 4 طلاب
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-text-tertiary">{subscription.routeNote}</p>
                </div>
                <button
                    onClick={() => onStatusChange(subscription.id, subscription.status === "active" ? "paused" : "active")}
                    className="rounded-xl border border-border bg-white px-3 py-2 text-xs font-bold text-text-secondary hover:bg-surface-hover"
                >
                    {subscription.status === "active" ? "إيقاف مؤقت" : "تفعيل"}
                </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
                <AccountBox label="المطلوب" value={money(expected)} />
                <AccountBox label="المدفوع" value={money(paid)} />
                <AccountBox label="المتبقي" value={money(remaining)} danger={remaining > 0} />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {linkedStudents.map((student) => (
                    <Link
                        key={student.id}
                        href={`/admin/students/${student.id}`}
                        className="rounded-xl bg-surface-alt p-3 hover:bg-surface-hover transition-colors"
                    >
                        <p className="text-sm font-bold text-text-primary">{student.fullName}</p>
                        <p className="mt-1 text-xs text-text-tertiary">
                            {student.area} — السعر {money(getStudentPrice(subscription, student.id))} — المدفوع {money(Math.min(paidTotal(student), getStudentPrice(subscription, student.id)))}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function StudentInfoRow({ student }: { student: StudentApplication }) {
    return (
        <Link href={`/admin/students/${student.id}`} className="block p-4 hover:bg-surface-alt transition-colors">
            <p className="text-sm font-bold text-text-primary">{student.fullName}</p>
            <p className="mt-1 text-xs text-text-tertiary">
                {student.phone} — {student.area} — {student.university}
            </p>
        </Link>
    );
}

function EmptySubscriptionCard({
    subscription,
    captains,
    availableStudents,
    onAddStudents,
}: {
    subscription: Subscription;
    captains: Captain[];
    availableStudents: StudentApplication[];
    onAddStudents: (
        subscriptionId: string,
        ids: string[],
        prices: Record<string, number>
    ) => void;
}) {
    const [selected, setSelected] = useState<string[]>([]);
    const [prices, setPrices] = useState<Record<string, string>>({});
    const captain = captains.find((item) => item.id === subscription.captainId);

    const toggle = (id: string) => {
        setSelected((current) => {
            if (current.includes(id)) {
                setPrices((currentPrices) => {
                    const next = { ...currentPrices };
                    delete next[id];
                    return next;
                });
                return current.filter((item) => item !== id);
            }
            if (current.length >= 4) return current;
            setPrices((currentPrices) => ({
                ...currentPrices,
                [id]: currentPrices[id] || String(subscription.monthlyAmount),
            }));
            return [...current, id];
        });
    };

    return (
        <div className="rounded-2xl bg-white border border-border shadow-sm p-5">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                <div>
                    <p className="text-sm font-extrabold text-text-primary">{captain?.fullName ?? "كابتن غير معروف"}</p>
                    <p className="mt-1 text-xs text-text-tertiary">{subscription.routeNote}</p>
                </div>
                <button
                    onClick={() => {
                        onAddStudents(
                            subscription.id,
                            selected,
                            Object.fromEntries(
                                selected.map((id) => [
                                    id,
                                    Number(prices[id] || subscription.monthlyAmount),
                                ])
                            )
                        );
                        setSelected([]);
                        setPrices({});
                    }}
                    disabled={selected.length === 0}
                    className="rounded-xl bg-primary-600 px-4 py-2 text-xs font-bold text-white hover:bg-primary-700 disabled:opacity-50"
                >
                    إضافة الطلاب
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {availableStudents.slice(0, 8).map((student) => (
                    <div
                        key={student.id}
                        className={`rounded-xl border p-3 ${selected.includes(student.id)
                                ? "border-primary-300 bg-primary-50 text-primary-700"
                                : "border-border bg-surface-alt text-text-primary hover:bg-surface-hover"
                            }`}
                    >
                        <button
                            onClick={() => toggle(student.id)}
                            className="w-full text-right text-sm font-bold"
                        >
                            {student.fullName}
                        </button>
                        {selected.includes(student.id) && (
                            <input
                                type="number"
                                value={prices[student.id] || String(subscription.monthlyAmount)}
                                onChange={(event) =>
                                    setPrices((current) => ({
                                        ...current,
                                        [student.id]: event.target.value,
                                    }))
                                }
                                dir="ltr"
                                className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-left focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function AccountBox({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
    return (
        <div className="rounded-xl bg-surface-alt p-3 text-center">
            <p className={`text-sm font-extrabold ${danger ? "text-red-500" : "text-text-primary"}`}>{value}</p>
            <p className="mt-0.5 text-[10px] font-medium text-text-tertiary">{label}</p>
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="rounded-2xl bg-white border border-border p-12 text-center">
            <p className="text-sm font-medium text-text-secondary">{text}</p>
        </div>
    );
}
