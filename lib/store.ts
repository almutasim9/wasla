"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
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
    studentApplications: "wasla:student-applications",
    studentPipelineApplications: "wasla:student-pipeline-applications",
    captains: "wasla:captains",
    students: "wasla:students",
    subscriptions: "wasla:subscriptions",
    formSettings: "wasla:form-settings",
    admins: "wasla:admins",
    currentAdmin: "wasla:current-admin",
};

const tableNames = {
    captainApplications: "captain_applications",
    pipelineApplications: "pipeline_applications",
    studentApplications: "student_applications",
    studentPipelineApplications: "student_pipeline",
    captains: "captains",
    students: "students",
    subscriptions: "subscriptions",
    formSettings: "form_settings",
    admins: "admins",
};

export type AdminUser = {
    id: string;
    fullName: string;
    email: string;
    password?: string;
    createdAt: string;
};

export const defaultAdmins: AdminUser[] = [];

const emptyCaptainApplications: CaptainApplication[] = [];
const emptyPipelineApplications: PipelineApplication[] = [];
const emptyStudentApplications: StudentApplication[] = [];
const emptyCaptains: Captain[] = [];
const emptyStudents: StudentApplication[] = [];

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

const initialSubscriptions: Subscription[] = [];

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

function logSupabaseWarning(action: string, tableName: string, error: unknown) {
    const message =
        typeof error === "object" && error !== null && "message" in error
            ? String((error as { message?: unknown }).message)
            : String(error);
    console.warn(`Supabase ${action} failed for ${tableName}: ${message}`);
}

function mergeFormSettings(value: FormSettings): FormSettings {
    return {
        student: { ...defaultFormSettings.student, ...value.student },
        captain: { ...defaultFormSettings.captain, ...value.captain },
    };
}

// -------------------------------------------------------------
// Supabase Cloud Synchronisation Helpers
// -------------------------------------------------------------

async function fetchCloudCollection<T extends Identified>(tableName: string, fallback: T[]): Promise<T[]> {
    try {
        const { data, error } = await supabase.from(tableName).select("*");
        if (error) {
            logSupabaseWarning("fetch", tableName, error);
            return fallback;
        }
        if (data && data.length > 0) {
            return data as T[];
        }

        return fallback;
    } catch (e) {
        logSupabaseWarning("network fetch", tableName, e);
        return fallback;
    }
}

async function saveCloudItem<T extends Identified>(tableName: string, item: T) {
    try {
        const { error } = await supabase.from(tableName).upsert(item);
        if (error) {
            logSupabaseWarning("save item", tableName, error);
            return false;
        }
        return true;
    } catch (e) {
        logSupabaseWarning("network save item", tableName, e);
        return false;
    }
}

async function saveCloudCollection<T extends Identified>(tableName: string, items: T[]) {
    try {
        const { error } = await supabase.from(tableName).upsert(items);
        if (error) {
            logSupabaseWarning("save collection", tableName, error);
            return false;
        }
        return true;
    } catch (e) {
        logSupabaseWarning("network save collection", tableName, e);
        return false;
    }
}

// -------------------------------------------------------------
// Synchronized React hooks
// -------------------------------------------------------------

export function useStoredCollection<T extends Identified>(
    key: string,
    tableName: string,
    fallback: T[],
    mergeFallback = false
) {
    const [items, setItems] = useState<T[]>(() => {
        return readCollection(key, fallback);
    });

    useEffect(() => {
        const sync = () => {
            const stored = readCollection(key, fallback);
            const next = mergeFallback ? mergeMissingById(stored, fallback) : stored;
            if (next !== stored) writeCollection(key, next);
            setItems(next);
        };
        sync();

        // Background sync from Supabase
        const syncWithCloud = async () => {
            const cloudItems = await fetchCloudCollection(tableName, fallback);
            writeCollection(key, cloudItems);
            setItems(cloudItems);
        };
        syncWithCloud();

        window.addEventListener(key, sync);
        window.addEventListener("storage", sync);

        return () => {
            window.removeEventListener(key, sync);
            window.removeEventListener("storage", sync);
        };
    }, [fallback, key, tableName, mergeFallback]);

    const updateItems = (updater: T[] | ((current: T[]) => T[])) => {
        setItems((current) => {
            const next =
                typeof updater === "function"
                    ? (updater as (current: T[]) => T[])(current)
                    : updater;
            writeCollection(key, next);
            
            // Push upsert to Supabase
            saveCloudCollection(tableName, next);

            return next;
        });
    };

    return [items, updateItems] as const;
}

export function useCaptainApplications() {
    return useStoredCollection<CaptainApplication>(
        keys.captainApplications,
        tableNames.captainApplications,
        emptyCaptainApplications
    );
}

export function usePipelineApplications() {
    return useStoredCollection<PipelineApplication>(
        keys.pipelineApplications,
        tableNames.pipelineApplications,
        emptyPipelineApplications
    );
}

export function useStudentApplications() {
    return useStoredCollection<StudentApplication>(
        keys.studentApplications,
        tableNames.studentApplications,
        emptyStudentApplications
    );
}

export function useStudentPipelineApplications() {
    return useStoredCollection<StudentApplication>(
        keys.studentPipelineApplications,
        tableNames.studentPipelineApplications,
        emptyStudentApplications
    );
}

export function useCaptains() {
    return useStoredCollection<Captain>(
        keys.captains,
        tableNames.captains,
        emptyCaptains,
        true
    );
}

export function useStudents() {
    return useStoredCollection<StudentApplication>(
        keys.students,
        tableNames.students,
        emptyStudents,
        true
    );
}

export function useAdmins() {
    return useStoredCollection<AdminUser>(
        keys.admins,
        tableNames.admins,
        defaultAdmins,
        true
    );
}

export function useCurrentAdmin() {
    const [current, setCurrent] = useState<AdminUser | null>(null);

    useEffect(() => {
        const sync = () => {
            if (typeof window === "undefined") return;
            const raw = window.localStorage.getItem(keys.currentAdmin);
            setCurrent(raw ? JSON.parse(raw) : null);
        };
        sync();
        window.addEventListener(keys.currentAdmin, sync);
        window.addEventListener("storage", sync);
        return () => {
            window.removeEventListener(keys.currentAdmin, sync);
            window.removeEventListener("storage", sync);
        };
    }, []);

    const updateCurrent = (val: AdminUser | null) => {
        if (typeof window === "undefined") return;
        if (val) {
            window.localStorage.setItem(keys.currentAdmin, JSON.stringify(val));
        } else {
            window.localStorage.removeItem(keys.currentAdmin);
        }
        window.dispatchEvent(new Event(keys.currentAdmin));
        setCurrent(val);
    };

    return [current, updateCurrent] as const;
}

export function useSubscriptions() {
    return useStoredCollection<Subscription>(
        keys.subscriptions,
        tableNames.subscriptions,
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

        // Background cloud sync
        const syncWithCloud = async () => {
            try {
                const { data, error } = await supabase
                    .from(tableNames.formSettings)
                    .select("*")
                    .eq("id", "global")
                    .single();
                if (error) {
                    console.error("Error fetching form settings from Supabase:", error);
                }
                if (data) {
                    const merged = mergeFormSettings(data as FormSettings);
                    writeValue(keys.formSettings, merged);
                    setSettings(merged);
                } else {
                    // Seed initial config
                    await supabase.from(tableNames.formSettings).upsert({ id: "global", ...defaultFormSettings });
                }
            } catch (e) {
                console.error("Error syncing form settings with cloud:", e);
            }
        };
        syncWithCloud();

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
            
            // Push update to Supabase
            supabase
                .from(tableNames.formSettings)
                .upsert({ id: "global", ...next })
                .then(({ error }) => {
                    if (error) console.error("Error saving form settings to Supabase:", error);
                });

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

function uuid() {
    return crypto.randomUUID();
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

export async function addStudentRegistration(payload: StudentRegistrationPayload) {
    const applications = readCollection<StudentApplication>(keys.studentApplications, []);
    const createdAt = today();
    const application: StudentApplication = {
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

    const saved = await saveCloudItem(tableNames.studentApplications, application);
    if (!saved) {
        throw new Error("تعذر حفظ طلب الطالب في Supabase");
    }
    writeCollection(keys.studentApplications, [application, ...applications]);
    return application;
}

export async function transferStudentApplicationToPipeline(app: StudentApplication) {
    const applications = readCollection<StudentApplication>(keys.studentApplications, []);
    const pipeline = readCollection<StudentApplication>(keys.studentPipelineApplications, []);
    const exists = pipeline.some((item) => item.id === `sp-${app.id}`);

    const updatedApplications = applications.map((item) =>
        item.id === app.id
            ? {
                ...item,
                timeline: [
                    ...item.timeline,
                    { date: today(), action: "تحويل الطلب إلى Pipeline الطلاب", by: "المدير" },
                ],
            }
            : item
    );

    const pipelineItem: StudentApplication = {
        ...app,
        id: `sp-${app.id}`,
        stage: "new",
        status: "pending",
        timeline: [
            ...app.timeline,
            { date: today(), action: "تحويل الطلب إلى Pipeline الطلاب", by: "المدير" },
        ],
    };

    if (!exists) {
        const saved = await saveCloudItem(tableNames.studentPipelineApplications, pipelineItem);
        if (!saved) {
            throw new Error("تعذر تحويل الطالب إلى Pipeline في Supabase");
        }
        writeCollection(keys.studentPipelineApplications, [pipelineItem, ...pipeline]);
    }

    writeCollection(keys.studentApplications, updatedApplications);
    const updatedApp = updatedApplications.find((item) => item.id === app.id);
    if (updatedApp) {
        saveCloudItem(tableNames.studentApplications, updatedApp);
    }

    return pipelineItem;
}

export async function createStudentAccount(app: StudentApplication, passcode?: string) {
    const students = readCollection<StudentApplication>(keys.students, []);
    const existingStudent = students.find((student) => student.phone === app.phone);
    if (existingStudent) return existingStudent;

    const student: StudentApplication = {
        ...app,
        id: uuid(),
        stage: "active",
        status: "active",
        passcode: passcode || generateRandomPasscode(),
        timeline: [
            ...app.timeline,
            { date: today(), action: "إنشاء حساب طالب معتمد", by: "المدير" },
        ],
    };

    const saved = await saveCloudItem(tableNames.students, student);
    if (!saved) {
        throw new Error("تعذر حفظ حساب الطالب في Supabase");
    }
    writeCollection(keys.students, [student, ...students]);
    return student;
}

export async function addCaptainRegistration(payload: CaptainRegistrationPayload) {
    const applications = readCollection<CaptainApplication>(
        keys.captainApplications,
        []
    );
    const createdAt = today();
    const application: CaptainApplication = {
        id: uniqueId("a"),
        ...payload,
        status: "pending",
        createdAt,
    };

    const saved = await saveCloudItem(tableNames.captainApplications, application);
    if (!saved) {
        throw new Error("تعذر حفظ طلب الكابتن في Supabase");
    }
    writeCollection(keys.captainApplications, [application, ...applications]);
    return application;
}

export function transferCaptainApplicationToPipeline(app: CaptainApplication) {
    const applications = readCollection<CaptainApplication>(
        keys.captainApplications,
        []
    );
    const pipeline = readCollection<PipelineApplication>(
        keys.pipelineApplications,
        []
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
    
    // Sync updated Application Status to Cloud
    const updatedApp = updatedApplications.find((item) => item.id === app.id);
    if (updatedApp) {
        saveCloudItem(tableNames.captainApplications, updatedApp);
    }

    if (!exists) {
        writeCollection(keys.pipelineApplications, [pipelineItem, ...pipeline]);
        // Sync Pipeline Application to Cloud
        saveCloudItem(tableNames.pipelineApplications, pipelineItem);
    }
}

export function generateRandomPasscode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // readable characters
    let code = "WSL-";
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export async function createCaptainFromPipeline(app: PipelineApplication, passcode?: string) {
    const captains = readCollection<Captain>(keys.captains, []);
    const existingCaptain = captains.find((captain) => captain.phone === app.phone);
    if (existingCaptain) return existingCaptain;

    const captain: Captain & { passcode?: string } = {
        id: uuid(),
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
        passcode: passcode || generateRandomPasscode(),
    };

    const saved = await saveCloudItem(tableNames.captains, captain);
    if (!saved) {
        throw new Error("تعذر حفظ حساب الكابتن في Supabase");
    }
    writeCollection(keys.captains, [captain, ...captains]);
    return captain;
}

export async function addAdminRegistration(payload: { fullName: string; email: string; password?: string }) {
    const admins = readCollection<AdminUser>(keys.admins, defaultAdmins);
    const createdAt = today();
    const admin: AdminUser = {
        id: uniqueId("admin"),
        fullName: payload.fullName,
        email: payload.email,
        password: payload.password || "admin123",
        createdAt,
    };
    const saved = await saveCloudItem(tableNames.admins, admin);
    if (!saved) {
        throw new Error("تعذر حفظ حساب المدير في Supabase");
    }
    writeCollection(keys.admins, [admin, ...admins]);
    return admin;
}

export function toggleCaptainStatus(id: string) {
    const captains = readCollection<Captain>(keys.captains, []);
    const updated = captains.map((c) => {
        if (c.id === id) {
            return {
                ...c,
                accountStatus: (c.accountStatus === "active" ? "suspended" : "active") as "active" | "suspended"
            };
        }
        return c;
    });
    writeCollection(keys.captains, updated);
    
    // Sync single updated captain status to Supabase Cloud
    const updatedCaptain = updated.find((c) => c.id === id);
    if (updatedCaptain) {
        saveCloudItem(tableNames.captains, updatedCaptain);
    }
}

export function toggleStudentStatus(id: string) {
    const students = readCollection<StudentApplication>(keys.students, []);
    const updated = students.map((s) => {
        if (s.id === id) {
            return {
                ...s,
                status: (s.status === "active" ? "suspended" : "active") as "active" | "suspended" | "pending"
            };
        }
        return s;
    });
    writeCollection(keys.students, updated);
    
    // Sync single updated student status to Supabase Cloud
    const updatedStudent = updated.find((s) => s.id === id);
    if (updatedStudent) {
        saveCloudItem(tableNames.students, updatedStudent);
    }
}
