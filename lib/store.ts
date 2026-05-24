"use client";

import { useEffect, useState } from "react";
import {
    mockApplications,
    mockCaptains,
    pipelineApplications,
    studentApplications,
    type Captain,
    type CaptainApplication,
    type PipelineApplication,
    type RegistrationType,
    type StudentApplication,
    type StudentGender,
    type StudentShift,
} from "@/lib/mock-data";

const keys = {
    captainApplications: "wasla:captain-applications",
    pipelineApplications: "wasla:pipeline-applications",
    captains: "wasla:captains",
    students: "wasla:students",
    subscriptions: "wasla:subscriptions",
    formSettings: "wasla:form-settings",
};

export type FormSettings = {
    student: {
        enabled: boolean;
        title: string;
        description: string;
        note: string;
        universities: string[];
        allowOtherUniversity: boolean;
    };
    captain: {
        enabled: boolean;
        title: string;
        description: string;
        note: string;
        carBrands: string[];
        allowOtherCarBrand: boolean;
        enabledRegistrationTypes: RegistrationType[];
    };
};

export const defaultFormSettings: FormSettings = {
    student: {
        enabled: true,
        title: "تسجيل طالب جديد",
        description: "عبّي بياناتك عشان نوفرلك أقصر طريق لجامعتك بأفضل سعر",
        note: "هذه المعلومات لتقييم سعر الاشتراك وتوفير أقصر طريق لإتمام الرحلة",
        universities: [
            "جامعة الموصل",
            "جامعة نينوى",
            "الجامعة التقنية الشمالية",
            "كلية المنصور الجامعة",
            "كلية النور الجامعة",
        ],
        allowOtherUniversity: true,
    },
    captain: {
        enabled: true,
        title: "طلب انضمام ككابتن",
        description: "عبّي بياناتك وراح نتواصل وياك بأقرب وقت",
        note: "هذه المعلومات تساعدنا بمراجعة المركبة وتحديد نوع الخدمة المناسبة",
        carBrands: [
            "تويوتا",
            "هيونداي",
            "كيا",
            "نيسان",
            "شيفروليه",
            "فورد",
            "هوندا",
            "ميتسوبيشي",
            "سوزوكي",
            "مرسيدس",
            "بي إم دبليو",
            "فولكس واجن",
            "رينو",
            "بيجو",
            "سايبا",
            "إيران خودرو",
            "جيلي",
            "شيري",
            "إم جي",
        ],
        allowOtherCarBrand: true,
        enabledRegistrationTypes: ["taxi", "subscription"],
    },
};

export type SubscriptionStatus = "active" | "paused" | "ended";

export interface Subscription {
    id: string;
    studentIds: string[];
    studentId?: string;
    studentPrices?: Record<string, number>;
    captainId: string;
    monthlyAmount: number;
    routeNote: string;
    status: SubscriptionStatus;
    startDate: string;
    createdAt: string;
}

const initialSubscriptions: Subscription[] = [
    {
        id: "sub1",
        studentIds: ["s1"],
        studentPrices: { s1: 50000 },
        captainId: "c1",
        monthlyAmount: 50000,
        routeNote: "الزهور إلى جامعة الموصل — صباحي",
        status: "active",
        startDate: "2026-02-22",
        createdAt: "2026-02-22",
    },
    {
        id: "sub2",
        studentIds: ["s2"],
        studentPrices: { s2: 50000 },
        captainId: "c2",
        monthlyAmount: 50000,
        routeNote: "المجموعة إلى كلية الهندسة — صباحي",
        status: "active",
        startDate: "2026-02-20",
        createdAt: "2026-02-20",
    },
    {
        id: "sub3",
        studentIds: ["s11"],
        studentPrices: { s11: 50000 },
        captainId: "c4",
        monthlyAmount: 50000,
        routeNote: "الحدباء إلى جامعة الموصل — صباحي",
        status: "active",
        startDate: "2026-03-04",
        createdAt: "2026-03-04",
    },
    {
        id: "sub4",
        studentIds: ["s12"],
        studentPrices: { s12: 50000 },
        captainId: "c2",
        monthlyAmount: 50000,
        routeNote: "الكرامة إلى جامعة نينوى — مسائي",
        status: "active",
        startDate: "2026-03-03",
        createdAt: "2026-03-03",
    },
    {
        id: "sub5",
        studentIds: ["s7"],
        studentPrices: { s7: 50000 },
        captainId: "c1",
        monthlyAmount: 50000,
        routeNote: "الرسالة إلى جامعة الموصل — متوقف لحين التجديد",
        status: "paused",
        startDate: "2026-02-17",
        createdAt: "2026-02-17",
    },
    {
        id: "sub6",
        studentIds: ["s13"],
        studentPrices: { s13: 50000 },
        captainId: "c4",
        monthlyAmount: 50000,
        routeNote: "الوحدة إلى التقنية الشمالية — اشتراك سابق",
        status: "ended",
        startDate: "2026-02-11",
        createdAt: "2026-02-11",
    },
];

type Identified = { id: string };

function mergeMissingById<T extends Identified>(current: T[], fallback: T[]) {
    const existing = new Set(current.map((item) => item.id));
    const missing = fallback.filter((item) => !existing.has(item.id));
    return missing.length ? [...current, ...missing] : current;
}

function readCollection<T>(key: string, fallback: T[]): T[] {
    if (typeof window === "undefined") return fallback;

    try {
        const raw = window.localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T[]) : fallback;
    } catch {
        return fallback;
    }
}

function writeCollection<T>(key: string, value: T[]) {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(key));
}

function readValue<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;

    try {
        const raw = window.localStorage.getItem(key);
        return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback;
    } catch {
        return fallback;
    }
}

function writeValue<T>(key: string, value: T) {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(key));
}

function mergeFormSettings(value: FormSettings): FormSettings {
    return {
        student: { ...defaultFormSettings.student, ...value.student },
        captain: { ...defaultFormSettings.captain, ...value.captain },
    };
}

export function useStoredCollection<T extends Identified>(
    key: string,
    fallback: T[],
    mergeFallback = false
) {
    const [items, setItems] = useState<T[]>(fallback);

    useEffect(() => {
        const sync = () => {
            const stored = readCollection(key, fallback);
            const next = mergeFallback ? mergeMissingById(stored, fallback) : stored;
            if (next !== stored) writeCollection(key, next);
            setItems(next);
        };
        sync();
        window.addEventListener(key, sync);
        window.addEventListener("storage", sync);

        return () => {
            window.removeEventListener(key, sync);
            window.removeEventListener("storage", sync);
        };
    }, [fallback, key, mergeFallback]);

    const updateItems = (updater: T[] | ((current: T[]) => T[])) => {
        setItems((current) => {
            const next =
                typeof updater === "function"
                    ? (updater as (current: T[]) => T[])(current)
                    : updater;
            writeCollection(key, next);
            return next;
        });
    };

    return [items, updateItems] as const;
}

export function useCaptainApplications() {
    return useStoredCollection<CaptainApplication>(
        keys.captainApplications,
        mockApplications
    );
}

export function usePipelineApplications() {
    return useStoredCollection<PipelineApplication>(
        keys.pipelineApplications,
        pipelineApplications
    );
}

export function useCaptains() {
    return useStoredCollection<Captain>(keys.captains, mockCaptains, true);
}

export function useStudents() {
    return useStoredCollection<StudentApplication>(keys.students, studentApplications, true);
}

export function useSubscriptions() {
    return useStoredCollection<Subscription>(
        keys.subscriptions,
        initialSubscriptions,
        true
    );
}

export function useFormSettings() {
    const [settings, setSettings] = useState<FormSettings>(defaultFormSettings);

    useEffect(() => {
        const sync = () =>
            setSettings(mergeFormSettings(readValue(keys.formSettings, defaultFormSettings)));
        sync();
        window.addEventListener(keys.formSettings, sync);
        window.addEventListener("storage", sync);

        return () => {
            window.removeEventListener(keys.formSettings, sync);
            window.removeEventListener("storage", sync);
        };
    }, []);

    const updateSettings = (
        updater: FormSettings | ((current: FormSettings) => FormSettings)
    ) => {
        setSettings((current) => {
            const next =
                typeof updater === "function"
                    ? (updater as (current: FormSettings) => FormSettings)(current)
                    : updater;
            writeValue(keys.formSettings, next);
            return next;
        });
    };

    return [settings, updateSettings] as const;
}

function uniqueId(prefix: string) {
    return `${prefix}${Date.now().toString(36)}${Math.random()
        .toString(36)
        .slice(2, 7)}`;
}

function today() {
    return new Date().toISOString().split("T")[0];
}

export type StudentRegistrationPayload = {
    fullName: string;
    gender: StudentGender;
    phone: string;
    area: string;
    landmark: string;
    university: string;
    universityLocation: string;
    shift: StudentShift;
};

export type CaptainRegistrationPayload = {
    fullName: string;
    phone: string;
    carBrand: string;
    carModel: string;
    modelYear: string;
    plateNumber: string;
    city: string;
    areaName: string;
    registrationTypes: RegistrationType[];
};

export function addStudentRegistration(payload: StudentRegistrationPayload) {
    const students = readCollection<StudentApplication>(keys.students, studentApplications);
    const createdAt = today();
    const student: StudentApplication = {
        id: uniqueId("s"),
        fullName: payload.fullName,
        gender: payload.gender,
        phone: payload.phone,
        area: payload.area,
        landmark: payload.landmark,
        university: payload.university,
        universityLocation: payload.universityLocation,
        shift: payload.shift,
        stage: "new",
        status: "pending",
        contactAttempts: 0,
        callLogs: [],
        payments: [],
        timeline: [{ date: createdAt, action: "تقديم طلب تسجيل طالب", by: "الموقع" }],
        createdAt,
    };

    writeCollection(keys.students, [student, ...students]);
    return student;
}

export function addCaptainRegistration(payload: CaptainRegistrationPayload) {
    const applications = readCollection<CaptainApplication>(
        keys.captainApplications,
        mockApplications
    );
    const createdAt = today();
    const application: CaptainApplication = {
        id: uniqueId("a"),
        ...payload,
        status: "pending",
        createdAt,
    };

    writeCollection(keys.captainApplications, [application, ...applications]);
    return application;
}

export function transferCaptainApplicationToPipeline(app: CaptainApplication) {
    const applications = readCollection<CaptainApplication>(
        keys.captainApplications,
        mockApplications
    );
    const pipeline = readCollection<PipelineApplication>(
        keys.pipelineApplications,
        pipelineApplications
    );

    const exists = pipeline.some((item) => item.id === `p-${app.id}`);
    const updatedApplications = applications.map((item) =>
        item.id === app.id ? { ...item, status: "approved" as const } : item
    );

    const pipelineItem: PipelineApplication = {
        id: `p-${app.id}`,
        fullName: app.fullName,
        phone: app.phone,
        carBrand: app.carBrand,
        carModel: app.carModel,
        modelYear: app.modelYear,
        plateNumber: app.plateNumber,
        city: app.city,
        areaName: app.areaName,
        registrationTypes: app.registrationTypes,
        stage: "new",
        timeline: [
            { date: app.createdAt, action: "تقديم طلب انضمام", by: "الموقع" },
            { date: today(), action: "تحويل الطلب إلى Pipeline الكباتن", by: "المدير" },
        ],
        createdAt: app.createdAt,
    };

    writeCollection(keys.captainApplications, updatedApplications);
    if (!exists) {
        writeCollection(keys.pipelineApplications, [pipelineItem, ...pipeline]);
    }
}

export function createCaptainFromPipeline(app: PipelineApplication) {
    const captains = readCollection<Captain>(keys.captains, mockCaptains);
    if (captains.some((captain) => captain.phone === app.phone)) return;

    const captain: Captain = {
        id: `c-${app.id}`,
        fullName: app.fullName,
        phone: app.phone,
        email: `${app.phone}@wasla.local`,
        carBrand: app.carBrand,
        carModel: app.carModel,
        modelYear: app.modelYear,
        plateNumber: app.plateNumber,
        city: app.city,
        areaName: app.areaName,
        registrationTypes: app.registrationTypes,
        accountStatus: "active",
        approvedAt: today(),
        createdAt: app.createdAt,
    };

    writeCollection(keys.captains, [captain, ...captains]);
}
