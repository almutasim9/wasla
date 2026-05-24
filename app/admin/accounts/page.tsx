"use client";

import { useState, useEffect } from "react";
import {
    useAdmins,
    useCaptains,
    useStudents,
    useCurrentAdmin,
    usePipelineApplications,
    addAdminRegistration,
    addStudentRegistration,
    addCaptainRegistration,
    toggleCaptainStatus,
    toggleStudentStatus,
    createCaptainFromPipeline,
    generateRandomPasscode,
} from "@/lib/store";
import type { RegistrationType, StudentGender, StudentShift, PipelineApplication } from "@/lib/mock-data";

type RoleFilter = "all" | "admin" | "captain" | "student";

export default function AccountsPage() {
    const [currentAdmin] = useCurrentAdmin();
    const [admins] = useAdmins();
    const [captains, setCaptains] = useCaptains();
    const [students, setStudents] = useStudents();
    const [pipelineApplications, setPipelineApplications] = usePipelineApplications();

    // Filters & Search
    const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Modal control
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [isCaptainModalOpen, setIsCaptainModalOpen] = useState(false);

    // Hybrid Tab Selection ("pipeline" | "manual")
    const [studentTab, setStudentTab] = useState<"pipeline" | "manual">("pipeline");
    const [captainTab, setCaptainTab] = useState<"pipeline" | "manual">("pipeline");

    // Selected pipeline leads
    const [selectedStudentLeadId, setSelectedStudentLeadId] = useState("");
    const [selectedCaptainLeadId, setSelectedCaptainLeadId] = useState("");

    // Searchable dropdown states
    const [studentSearchQuery, setStudentSearchQuery] = useState("");
    const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);

    const [captainSearchQuery, setCaptainSearchQuery] = useState("");
    const [isCaptainDropdownOpen, setIsCaptainDropdownOpen] = useState(false);

    // Click outside listener for dropdowns
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(".student-autocomplete-container")) {
                setIsStudentDropdownOpen(false);
            }
            if (!target.closest(".captain-autocomplete-container")) {
                setIsCaptainDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Success Screen State (Shows after any account creation/activation)
    const [createdAccount, setCreatedAccount] = useState<{
        name: string;
        phone: string;
        passcode: string;
        role: "student" | "captain" | "admin";
    } | null>(null);

    // Form inputs
    const [adminName, setAdminName] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPassword, setAdminPassword] = useState("");

    const [studentName, setStudentName] = useState("");
    const [studentPhone, setStudentPhone] = useState("");
    const [studentGender, setStudentGender] = useState<StudentGender>("male");
    const [studentArea, setStudentArea] = useState("");
    const [studentLandmark, setStudentLandmark] = useState("");
    const [studentUniversity, setStudentUniversity] = useState("");
    const [studentUniLocation, setStudentUniLocation] = useState("");
    const [studentShift, setStudentShift] = useState<StudentShift>("morning");

    const [captainName, setCaptainName] = useState("");
    const [captainPhone, setCaptainPhone] = useState("");
    const [captainCarBrand, setCaptainCarBrand] = useState("");
    const [captainCarModel, setCaptainCarModel] = useState("");
    const [captainModelYear, setCaptainModelYear] = useState("");
    const [captainPlate, setCaptainPlate] = useState("");
    const [captainCity, setCaptainCity] = useState("الموصل");
    const [captainArea, setCaptainArea] = useState("");
    const [captainRegTypes, setCaptainRegTypes] = useState<RegistrationType[]>(["subscription"]);

    // Toast/Notifications
    const [toastMessage, setToastMessage] = useState("");

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 4000);
    };

    // Submitting Forms & Activation

    // 1. ADD ADMIN
    const handleAddAdmin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!adminName || !adminEmail || !adminPassword) return;

        addAdminRegistration({
            fullName: adminName,
            email: adminEmail,
            password: adminPassword,
        });

        const credentials = {
            name: adminName,
            phone: adminEmail,
            passcode: adminPassword,
            role: "admin" as const,
        };

        setAdminName("");
        setAdminEmail("");
        setAdminPassword("");
        setIsAdminModalOpen(false);
        setCreatedAccount(credentials);
        showToast("تم إنشاء حساب المدير الجديد بنجاح ✅");
    };

    // 2. ACTIVATE STUDENT (FROM PIPELINE OR MANUAL)
    const handleActivateStudent = (e: React.FormEvent) => {
        e.preventDefault();

        if (studentTab === "pipeline") {
            const lead = students.find((s) => s.id === selectedStudentLeadId);
            if (!lead) return;

            const code = generateRandomPasscode();

            // Update student stage and status in store
            setStudents((prev) =>
                prev.map((s) => {
                    if (s.id === lead.id) {
                        return {
                            ...s,
                            stage: "active" as const,
                            status: "active" as const,
                            passcode: code,
                            timeline: [
                                ...s.timeline,
                                {
                                    date: new Date().toISOString().split("T")[0],
                                    action: "تفعيل الحساب واعتماده يدوياً بالرمز السري العشوائي",
                                    by: "المدير",
                                },
                            ],
                        };
                    }
                    return s;
                })
            );

            setCreatedAccount({
                name: lead.fullName,
                phone: lead.phone,
                passcode: code,
                role: "student",
            });
            setSelectedStudentLeadId("");
            setStudentSearchQuery("");
            setIsStudentDropdownOpen(false);
            setIsStudentModalOpen(false);
            showToast("تم تفعيل حساب الطالب المعتمد بنجاح 🎓");
        } else {
            // Manual
            if (!studentName || !studentPhone || !studentArea || !studentUniversity) return;

            const code = generateRandomPasscode();

            const newStudent = addStudentRegistration({
                fullName: studentName,
                phone: studentPhone,
                gender: studentGender,
                area: studentArea,
                landmark: studentLandmark,
                university: studentUniversity,
                universityLocation: studentUniLocation || "الحرم الرئيسي",
                shift: studentShift,
            });

            // Make it active immediately
            setStudents((prev) =>
                prev.map((s) => {
                    if (s.id === newStudent.id) {
                        return {
                            ...s,
                            stage: "active" as const,
                            status: "active" as const,
                            passcode: code,
                        };
                    }
                    return s;
                })
            );

            setCreatedAccount({
                name: studentName,
                phone: studentPhone,
                passcode: code,
                role: "student",
            });

            setStudentName("");
            setStudentPhone("");
            setStudentArea("");
            setStudentLandmark("");
            setStudentUniversity("");
            setStudentUniLocation("");
            setIsStudentModalOpen(false);
            showToast("تم تسجيل وتفعيل حساب الطالب بنجاح 🎓");
        }
    };

    // 3. ACTIVATE CAPTAIN (FROM PIPELINE OR MANUAL)
    const handleActivateCaptain = (e: React.FormEvent) => {
        e.preventDefault();

        if (captainTab === "pipeline") {
            const lead = pipelineApplications.find((a) => a.id === selectedCaptainLeadId);
            if (!lead) return;

            const code = generateRandomPasscode();

            // Update lead stage to accepted in pipeline
            setPipelineApplications((prev) =>
                prev.map((a) => {
                    if (a.id === lead.id) {
                        return {
                            ...a,
                            stage: "accepted" as const,
                            timeline: [
                                ...a.timeline,
                                {
                                    date: new Date().toISOString().split("T")[0],
                                    action: "تم القبول وتفعيل حساب الدخول",
                                    by: "المدير",
                                },
                            ],
                        };
                    }
                    return a;
                })
            );

            // Create account
            createCaptainFromPipeline(lead, code);

            // Force captains hook sync
            setCaptains((current) => {
                const exists = current.some((c) => c.phone === lead.phone);
                if (exists) return current;
                return [
                    {
                        id: `c-${lead.id}`,
                        fullName: lead.fullName,
                        phone: lead.phone,
                        email: `${lead.phone}@wasla.local`,
                        carBrand: lead.carBrand,
                        carModel: lead.carModel,
                        modelYear: lead.modelYear,
                        plateNumber: lead.plateNumber,
                        city: lead.city,
                        areaName: lead.areaName,
                        registrationTypes: lead.registrationTypes,
                        accountStatus: "active" as const,
                        approvedAt: new Date().toISOString().split("T")[0],
                        createdAt: lead.createdAt,
                        passcode: code,
                    },
                    ...current,
                ];
            });

            setCreatedAccount({
                name: lead.fullName,
                phone: lead.phone,
                passcode: code,
                role: "captain",
            });

            setSelectedCaptainLeadId("");
            setCaptainSearchQuery("");
            setIsCaptainDropdownOpen(false);
            setIsCaptainModalOpen(false);
            showToast("تم تفعيل حساب الكابتن بنجاح 🚗");
        } else {
            // Manual
            if (!captainName || !captainPhone || !captainCarBrand || !captainPlate) return;

            const code = generateRandomPasscode();

            const app = addCaptainRegistration({
                fullName: captainName,
                phone: captainPhone,
                carBrand: captainCarBrand,
                carModel: captainCarModel,
                modelYear: captainModelYear,
                plateNumber: captainPlate,
                city: captainCity,
                areaName: captainArea,
                registrationTypes: captainRegTypes,
            });

            const pipelineItem: PipelineApplication = {
                ...app,
                id: `p-${app.id}`,
                stage: "accepted" as const,
                timeline: [{ date: app.createdAt, action: "تسجيل يدوي وتفعيل فوري", by: "المدير" }],
            };

            setPipelineApplications((prev) => [pipelineItem, ...prev]);

            // Create account
            createCaptainFromPipeline(pipelineItem, code);

            // Force captains hook sync
            setCaptains((current) => {
                const exists = current.some((c) => c.phone === app.phone);
                if (exists) return current;
                return [
                    {
                        id: `c-p-${app.id}`,
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
                        accountStatus: "active" as const,
                        approvedAt: new Date().toISOString().split("T")[0],
                        createdAt: app.createdAt,
                        passcode: code,
                    },
                    ...current,
                ];
            });

            setCreatedAccount({
                name: captainName,
                phone: captainPhone,
                passcode: code,
                role: "captain",
            });

            setCaptainName("");
            setCaptainPhone("");
            setCaptainCarBrand("");
            setCaptainCarModel("");
            setCaptainModelYear("");
            setCaptainPlate("");
            setCaptainArea("");
            setIsCaptainModalOpen(false);
            showToast("تم تسجيل وتفعيل حساب الكابتن بنجاح 🚗");
        }
    };

    // Flattening and normalizing users list for display
    const unifiedAccounts = [
        ...admins.map((a) => ({
            id: a.id,
            name: a.fullName,
            role: "admin" as const,
            identifier: a.email,
            createdAt: a.createdAt,
            status: "active" as const,
            details: "مسؤول النظام",
            passcode: a.password || "admin123",
        })),
        ...captains.map((c) => ({
            id: c.id,
            name: c.fullName,
            role: "captain" as const,
            identifier: c.phone,
            createdAt: c.createdAt,
            status: c.accountStatus,
            details: `${c.carBrand} — لوحة ${c.plateNumber}`,
            passcode: c.passcode || "غير محدد",
        })),
        ...students.map((s) => ({
            id: s.id,
            name: s.fullName,
            role: "student" as const,
            identifier: s.phone,
            createdAt: s.createdAt,
            status: s.status === "pending" ? ("pending" as const) : s.status === "suspended" ? ("suspended" as const) : ("active" as const),
            details: `${s.university} — ${s.area}`,
            passcode: s.passcode || "غير محدد",
        })),
    ];

    // Filter accounts based on query and tabs
    const filteredAccounts = unifiedAccounts.filter((account) => {
        const matchesRole = roleFilter === "all" || account.role === roleFilter;
        const matchesSearch =
            account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            account.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
            account.details.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRole && matchesSearch;
    });

    const handleToggleStatus = (id: string, role: "admin" | "captain" | "student") => {
        if (role === "captain") {
            toggleCaptainStatus(id);
            setCaptains((current) =>
                current.map((c) => (c.id === id ? { ...c, accountStatus: c.accountStatus === "active" ? "suspended" : "active" } : c))
            );
            showToast("تم تحديث حالة حساب الكابتن بنجاح 🔄");
        } else if (role === "student") {
            toggleStudentStatus(id);
            setStudents((current) =>
                current.map((s) => (s.id === id ? { ...s, status: s.status === "active" ? "suspended" : "active" } : s))
            );
            showToast("تم تحديث حالة حساب الطالب بنجاح 🔄");
        }
    };

    // Filter leads available for account creation
    const activeCaptainPhones = new Set(captains.map((c) => c.phone));
    const availableCaptainLeads = pipelineApplications.filter((app) => !activeCaptainPhones.has(app.phone));

    const availableStudentLeads = students.filter((s) => s.status === "pending" || s.stage !== "active");

    const filteredStudentLeads = availableStudentLeads.filter((s) => {
        if (!studentSearchQuery) return true;
        if (selectedStudentLeadId === s.id) return true;
        const query = studentSearchQuery.toLowerCase();
        return (
            s.fullName.toLowerCase().includes(query) ||
            s.phone.includes(query) ||
            s.university.toLowerCase().includes(query)
        );
    });

    const filteredCaptainLeads = availableCaptainLeads.filter((c) => {
        if (!captainSearchQuery) return true;
        if (selectedCaptainLeadId === c.id) return true;
        const query = captainSearchQuery.toLowerCase();
        return (
            c.fullName.toLowerCase().includes(query) ||
            c.phone.includes(query) ||
            c.carBrand.toLowerCase().includes(query) ||
            (c.carModel && c.carModel.toLowerCase().includes(query))
        );
    });

    // Copy WhatsApp invitation message
    const copyWhatsAppMessage = () => {
        if (!createdAccount) return;
        let text = "";
        if (createdAccount.role === "student") {
            text = `أهلاً بك يا ${createdAccount.name} في منصة وصلة! 🎓\nتم تفعيل اشتراكك وحسابك بنجاح.\n\nبيانات تسجيل الدخول للطلاب:\nرقم الهاتف: ${createdAccount.phone}\nكلمة المرور المؤقتة: ${createdAccount.passcode}\n\nطريقك للجامعة صار أسهل وأسرع! 🚀`;
        } else if (createdAccount.role === "captain") {
            text = `أهلاً بك كابتن ${createdAccount.name} في عائلة كباتن وصلة! 🚕\nتم تفعيل حسابك واعتماد مركبتك بنجاح للبدء في العمل.\n\nبيانات تسجيل الدخول للكباتن:\nرقم الهاتف: ${createdAccount.phone}\nكلمة المرور المؤقتة: ${createdAccount.passcode}\n\nنتمنى لك رحلات سعيدة وموفقة! 🚀`;
        } else {
            text = `أهلاً بك يا ${createdAccount.name} كمدير نظام في وصلة! 🛡️\nتم إنشاء حساب الإدارة الخاص بك بنجاح.\n\nبيانات الدخول:\nالبريد الإلكتروني: ${createdAccount.phone}\nكلمة المرور: ${createdAccount.passcode}`;
        }
        navigator.clipboard.writeText(text);
        showToast("تم نسخ رسالة الترحيب الحافظة بنجاح 📋");
    };

    return (
        <div className="space-y-6">
            {/* Toast notification */}
            {toastMessage && (
                <div className="fixed top-5 left-5 z-50 p-4 rounded-2xl bg-white border border-border shadow-2xl animate-bounce flex items-center gap-3">
                    <span className="text-lg">🛎️</span>
                    <p className="text-sm font-bold text-text-primary">{toastMessage}</p>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">🛡️ إدارة الحسابات</h1>
                    <p className="mt-1 text-sm text-text-secondary">شاشة موحدة للتحكم بالمدراء، الكباتن، والطلاب وتعديل حالاتهم</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setIsAdminModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700 transition-all hover:-translate-y-0.5"
                    >
                        ➕ إضافة مدير
                    </button>
                    <button
                        onClick={() => {
                            setCaptainTab("pipeline");
                            setSelectedCaptainLeadId("");
                            setCaptainSearchQuery("");
                            setIsCaptainDropdownOpen(false);
                            setIsCaptainModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/10 hover:bg-emerald-700 transition-all hover:-translate-y-0.5"
                    >
                        🚕 اعتماد وتفعيل كابتن 🚀
                    </button>
                    <button
                        onClick={() => {
                            setStudentTab("pipeline");
                            setSelectedStudentLeadId("");
                            setStudentSearchQuery("");
                            setIsStudentDropdownOpen(false);
                            setIsStudentModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/10 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
                    >
                        🎓 اعتماد وتفعيل طالب 🚀
                    </button>
                </div>
            </div>

            {/* Quick stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-white border border-border p-4 shadow-sm text-right">
                    <p className="text-xs font-medium text-text-tertiary">إجمالي الحسابات</p>
                    <p className="text-2xl font-extrabold text-text-primary mt-1">{unifiedAccounts.length}</p>
                </div>
                <div className="rounded-2xl bg-white border border-indigo-100 p-4 shadow-sm text-right">
                    <p className="text-xs font-medium text-indigo-500">المدراء</p>
                    <p className="text-2xl font-extrabold text-indigo-700 mt-1">{admins.length}</p>
                </div>
                <div className="rounded-2xl bg-white border border-emerald-100 p-4 shadow-sm text-right">
                    <p className="text-xs font-medium text-emerald-500">الكباتن</p>
                    <p className="text-2xl font-extrabold text-emerald-700 mt-1">{captains.length}</p>
                </div>
                <div className="rounded-2xl bg-white border border-blue-100 p-4 shadow-sm text-right">
                    <p className="text-xs font-medium text-blue-500">الطلاب</p>
                    <p className="text-2xl font-extrabold text-blue-700 mt-1">{students.length}</p>
                </div>
            </div>

            {/* Filters and search box */}
            <div className="rounded-2xl bg-white border border-border p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary">🔍</span>
                    <input
                        type="text"
                        placeholder="ابحث عن اسم، بريد إلكتروني، هاتف، تفاصيل..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-border bg-white pr-9 pl-4 py-2 text-sm font-medium text-text-primary focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-surface-alt p-1 rounded-xl border border-border gap-1 overflow-x-auto self-start md:self-auto">
                    {[
                        { id: "all", label: "الكل" },
                        { id: "admin", label: "المدراء 🛡️" },
                        { id: "captain", label: "الكباتن 🚕" },
                        { id: "student", label: "الطلاب 🎓" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setRoleFilter(tab.id as RoleFilter)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                                roleFilter === tab.id
                                    ? "bg-white text-primary-700 shadow-sm border border-border/50"
                                    : "text-text-secondary hover:text-text-primary"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Accounts Table */}
            <div className="rounded-2xl bg-white border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-surface-alt border-b border-border text-xs font-bold text-text-secondary">
                                <th className="p-4">الاسم والمستوى</th>
                                <th className="p-4">رقم التواصل / البريد</th>
                                <th className="p-4">الرمز السري</th>
                                <th className="p-4">التفاصيل / الملاحظة</th>
                                <th className="p-4">الحالة</th>
                                <th className="p-4 text-center">الإجراء التشغيلي</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-sm">
                            {filteredAccounts.map((account) => {
                                const isSelf = account.role === "admin" && account.id === currentAdmin?.id;
                                return (
                                    <tr key={account.id} className="hover:bg-surface-alt/50 transition-colors">
                                        {/* Avatar & Name */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-sm ${
                                                        account.role === "admin"
                                                            ? "bg-indigo-100 text-indigo-700"
                                                            : account.role === "captain"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-blue-100 text-blue-700"
                                                    }`}
                                                >
                                                    {account.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-text-primary flex items-center gap-1.5">
                                                        {account.name}
                                                        {isSelf && (
                                                            <span className="rounded bg-indigo-50 border border-indigo-150 px-1 py-0.5 text-[9px] font-bold text-indigo-600">
                                                                أنت
                                                            </span>
                                                        )}
                                                    </p>
                                                    <span className="text-[10px] font-medium text-text-tertiary">
                                                        {account.role === "admin"
                                                            ? "🛡️ مدير النظام"
                                                            : account.role === "captain"
                                                            ? "🚕 كابتن معتمد"
                                                            : "🎓 طالب جامعة"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Identifier */}
                                        <td className="p-4 font-medium text-text-secondary" dir="ltr">
                                            {account.identifier}
                                        </td>

                                        {/* Passcode (Secured display) */}
                                        <td className="p-4 font-bold text-xs select-all text-indigo-600" dir="ltr">
                                            {account.passcode}
                                        </td>

                                        {/* Details */}
                                        <td className="p-4 text-xs font-medium text-text-secondary">
                                            {account.details}
                                        </td>

                                        {/* Status */}
                                        <td className="p-4">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                                                    account.status === "active"
                                                        ? "bg-green-50 text-green-700 border-green-200"
                                                        : account.status === "pending"
                                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                                        : "bg-red-50 text-red-600 border-red-200"
                                                }`}
                                            >
                                                {account.status === "active"
                                                    ? "نشط"
                                                    : account.status === "pending"
                                                    ? "معلق (جديد)"
                                                    : "معطل / معلق"}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="p-4 text-center">
                                            {account.role === "admin" ? (
                                                <span className="text-xs text-text-tertiary font-medium">غير قابل للتعطيل</span>
                                            ) : (
                                                <button
                                                    onClick={() => handleToggleStatus(account.id, account.role)}
                                                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold shadow-sm transition-all hover:-translate-y-0.5 ${
                                                        account.status === "active"
                                                            ? "bg-white border-red-200 text-red-600 hover:bg-red-50"
                                                            : "bg-white border-green-200 text-green-700 hover:bg-green-50"
                                                    }`}
                                                >
                                                    {account.status === "active" ? "🚫 تجميد الحساب" : "✅ تفعيل الحساب"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}

                            {filteredAccounts.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-text-tertiary">
                                        لا توجد حسابات مطابقة لبحثك الحالي
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── MODAL 1: ADD ADMIN ── */}
            {isAdminModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-white border border-border rounded-3xl p-6 shadow-2xl relative">
                        <button
                            onClick={() => setIsAdminModalOpen(false)}
                            className="absolute top-4 left-4 p-1.5 rounded-lg text-text-secondary hover:bg-surface-hover transition-colors"
                        >
                            ✕
                        </button>
                        <h2 className="text-lg font-bold text-text-primary mb-4 text-right">🛡️ إضافة مدير نظام جديد</h2>
                        <form onSubmit={handleAddAdmin} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-text-secondary mb-1">الاسم الكامل</label>
                                <input
                                    type="text"
                                    required
                                    value={adminName}
                                    onChange={(e) => setAdminName(e.target.value)}
                                    placeholder="مثال: يوسف خالد"
                                    className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-primary focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary mb-1">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    required
                                    value={adminEmail}
                                    onChange={(e) => setAdminEmail(e.target.value)}
                                    placeholder="name@wasla.com"
                                    dir="ltr"
                                    className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-primary focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary mb-1">كلمة المرور</label>
                                <input
                                    type="password"
                                    required
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    placeholder="••••••••"
                                    dir="ltr"
                                    className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-primary focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-700 transition-all"
                            >
                                إنشاء حساب المدير
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ── MODAL 2: HYBRID STUDENT ACTIVATION / REGISTRATION ── */}
            {isStudentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-white border border-border rounded-3xl p-6 shadow-2xl relative my-8">
                        <button
                            onClick={() => setIsStudentModalOpen(false)}
                            className="absolute top-4 left-4 p-1.5 rounded-lg text-text-secondary hover:bg-surface-hover transition-colors"
                        >
                            ✕
                        </button>
                        <h2 className="text-lg font-bold text-text-primary mb-4 text-right">🎓 تفعيل حساب طالب جديد</h2>

                        {/* Modal Hybrid Tabs */}
                        <div className="flex bg-surface-alt p-1 rounded-xl border border-border gap-1 mb-5">
                            <button
                                type="button"
                                onClick={() => setStudentTab("pipeline")}
                                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                                    studentTab === "pipeline"
                                        ? "bg-white text-primary-700 shadow-sm border border-border/50"
                                        : "text-text-secondary hover:text-text-primary"
                                }`}
                            >
                                اعتماد طلب معتمد في النظام 🔄
                            </button>
                            <button
                                type="button"
                                onClick={() => setStudentTab("manual")}
                                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                                    studentTab === "manual"
                                        ? "bg-white text-primary-700 shadow-sm border border-border/50"
                                        : "text-text-secondary hover:text-text-primary"
                                }`}
                            >
                                إدخال بيانات جديدة يدوياً 📝
                            </button>
                        </div>

                        <form onSubmit={handleActivateStudent} className="space-y-4">
                            {studentTab === "pipeline" ? (
                                <div className="space-y-4 text-right">
                                    <div className="student-autocomplete-container relative">
                                        <label className="block text-xs font-bold text-text-secondary mb-1">
                                            اختر استمارة الطالب المعتمد
                                        </label>
                                        <div className="relative text-right">
                                            <input
                                                type="text"
                                                required
                                                placeholder="-- ابحث بالاسم، الهاتف، أو الجامعة --"
                                                value={studentSearchQuery}
                                                onChange={(e) => {
                                                    setStudentSearchQuery(e.target.value);
                                                    setIsStudentDropdownOpen(true);
                                                    if (selectedStudentLeadId) {
                                                        setSelectedStudentLeadId("");
                                                    }
                                                }}
                                                onFocus={() => setIsStudentDropdownOpen(true)}
                                                className="w-full rounded-xl border border-border pr-4 pl-10 py-2.5 text-sm font-medium text-text-primary focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                                            />
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary flex items-center gap-1">
                                                {studentSearchQuery ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setStudentSearchQuery("");
                                                            setSelectedStudentLeadId("");
                                                        }}
                                                        className="hover:text-text-primary p-1 rounded-md transition-colors text-xs font-bold"
                                                    >
                                                        ✕
                                                    </button>
                                                ) : (
                                                    "🔍"
                                                )}
                                            </span>
                                        </div>

                                        {isStudentDropdownOpen && (
                                            <div className="absolute z-50 mt-1.5 w-full max-h-60 overflow-y-auto bg-white border border-border shadow-2xl rounded-2xl p-1 text-right divide-y divide-border/40 scrollbar-thin">
                                                {filteredStudentLeads.length > 0 ? (
                                                    filteredStudentLeads.map((s) => (
                                                        <button
                                                            key={s.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedStudentLeadId(s.id);
                                                                setStudentSearchQuery(`${s.fullName} (${s.phone})`);
                                                                setIsStudentDropdownOpen(false);
                                                            }}
                                                            className={`w-full text-right px-4 py-2.5 text-xs font-semibold rounded-xl flex flex-col gap-0.5 transition-all text-text-primary hover:bg-blue-50/70 ${
                                                                selectedStudentLeadId === s.id ? "bg-blue-50 text-blue-700 font-bold" : ""
                                                            }`}
                                                        >
                                                            <span className="font-bold text-sm text-text-primary">{s.fullName}</span>
                                                            <span className="text-[10px] text-text-tertiary flex items-center gap-3 mt-0.5">
                                                                <span>📞 {s.phone}</span>
                                                                <span>🏫 {s.university}</span>
                                                            </span>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-center text-xs text-text-tertiary font-bold">
                                                        لا توجد نتائج مطابقة لبحثك 🔍
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Preview lead data */}
                                    {selectedStudentLeadId && (
                                        (() => {
                                            const lead = students.find((s) => s.id === selectedStudentLeadId);
                                            if (!lead) return null;
                                            return (
                                                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
                                                    <p className="text-xs font-bold text-blue-800">📋 ملخص بيانات الاستمارة:</p>
                                                    <div className="grid grid-cols-2 gap-2 text-xs text-blue-900 font-medium">
                                                        <p>👤 الاسم: {lead.fullName}</p>
                                                        <p>📞 الهاتف: {lead.phone}</p>
                                                        <p>🏫 الجامعة: {lead.university}</p>
                                                        <p>📍 السكن: {lead.area}</p>
                                                        <p> دوام: {lead.shift === "morning" ? "صباحي ☀️" : "مسائي 🌙"}</p>
                                                    </div>
                                                </div>
                                            );
                                        })()
                                    )}

                                    <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100">
                                        <p className="text-xs font-bold text-indigo-800 flex items-center gap-1.5">
                                            🔑 كلمة المرور (توليد عشوائي):
                                        </p>
                                        <p className="text-[10px] text-indigo-700 font-medium mt-1">
                                            سيقوم النظام تلقائياً بتوليد رمز مرور قوي وعشوائي ومقاوم للاختراق للطالب فور الضغط على التفعيل.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary mb-1">اسم الطالب الكامل</label>
                                            <input
                                                type="text"
                                                required
                                                value={studentName}
                                                onChange={(e) => setStudentName(e.target.value)}
                                                placeholder="الاسم الكامل"
                                                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-primary focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary mb-1">رقم الهاتف</label>
                                            <input
                                                type="tel"
                                                required
                                                value={studentPhone}
                                                onChange={(e) => setStudentPhone(e.target.value)}
                                                placeholder="078XXXXXXXX"
                                                dir="ltr"
                                                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-primary focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary mb-1">الجنس</label>
                                            <select
                                                value={studentGender}
                                                onChange={(e) => setStudentGender(e.target.value as StudentGender)}
                                                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-primary focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                                            >
                                                <option value="male">ذكر</option>
                                                <option value="female">أنثى</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary mb-1">فترة الدوام</label>
                                            <select
                                                value={studentShift}
                                                onChange={(e) => setStudentShift(e.target.value as StudentShift)}
                                                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-primary focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                                            >
                                                <option value="morning">صباحي ☀️</option>
                                                <option value="evening">مسائي 🌙</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary mb-1">المنطقة السكنية</label>
                                            <input
                                                type="text"
                                                required
                                                value={studentArea}
                                                onChange={(e) => setStudentArea(e.target.value)}
                                                placeholder="مثال: المجموعة"
                                                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-primary focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary mb-1">أقرب نقطة دالة</label>
                                            <input
                                                type="text"
                                                value={studentLandmark}
                                                onChange={(e) => setStudentLandmark(e.target.value)}
                                                placeholder="جامع / مدرسة"
                                                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-primary focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary mb-1">الجامعة والكلية</label>
                                            <input
                                                type="text"
                                                required
                                                value={studentUniversity}
                                                onChange={(e) => setStudentUniversity(e.target.value)}
                                                placeholder="مثال: جامعة الموصل"
                                                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-primary focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary mb-1">الموقع المحدد للجامعة</label>
                                            <input
                                                type="text"
                                                value={studentUniLocation}
                                                onChange={(e) => setStudentUniLocation(e.target.value)}
                                                placeholder="كليات العلوم الإنسانية"
                                                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-primary focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={studentTab === "pipeline" && !selectedStudentLeadId}
                                className={`w-full inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-bold text-white shadow-lg transition-all ${
                                    studentTab === "pipeline" && !selectedStudentLeadId
                                        ? "bg-slate-300 text-slate-500 cursor-not-allowed opacity-60"
                                        : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5"
                                }`}
                            >
                                {studentTab === "pipeline" ? "تفعيل حساب الطالب 🚀" : "تسجيل وتفعيل الحساب فوراً 🎓"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ── MODAL 3: HYBRID CAPTAIN ACTIVATION / REGISTRATION ── */}
            {isCaptainModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-white border border-border rounded-3xl p-6 shadow-2xl relative my-8">
                        <button
                            onClick={() => setIsCaptainModalOpen(false)}
                            className="absolute top-4 left-4 p-1.5 rounded-lg text-text-secondary hover:bg-surface-hover transition-colors"
                        >
                            ✕
                        </button>
                        <h2 className="text-lg font-bold text-text-primary mb-4 text-right">🚕 تفعيل حساب كابتن جديد</h2>

                        {/* Modal Hybrid Tabs */}
                        <div className="flex bg-surface-alt p-1 rounded-xl border border-border gap-1 mb-5">
                            <button
                                type="button"
                                onClick={() => setCaptainTab("pipeline")}
                                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                                    captainTab === "pipeline"
                                        ? "bg-white text-primary-700 shadow-sm border border-border/50"
                                        : "text-text-secondary hover:text-text-primary"
                                }`}
                            >
                                اعتماد طلب معتمد في النظام 🔄
                            </button>
                            <button
                                type="button"
                                onClick={() => setCaptainTab("manual")}
                                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                                    captainTab === "manual"
                                        ? "bg-white text-primary-700 shadow-sm border border-border/50"
                                        : "text-text-secondary hover:text-text-primary"
                                }`}
                            >
                                إدخال بيانات جديدة يدوياً 📝
                            </button>
                        </div>

                        <form onSubmit={handleActivateCaptain} className="space-y-4">
                            {captainTab === "pipeline" ? (
                                <div className="space-y-4 text-right">
                                    <div className="captain-autocomplete-container relative">
                                        <label className="block text-xs font-bold text-text-secondary mb-1">
                                            اختر استمارة الكابتن المعتمد
                                        </label>
                                        <div className="relative text-right">
                                            <input
                                                type="text"
                                                required
                                                placeholder="-- ابحث بالاسم، الهاتف، أو ماركة المركبة --"
                                                value={captainSearchQuery}
                                                onChange={(e) => {
                                                    setCaptainSearchQuery(e.target.value);
                                                    setIsCaptainDropdownOpen(true);
                                                    if (selectedCaptainLeadId) {
                                                        setSelectedCaptainLeadId("");
                                                    }
                                                }}
                                                onFocus={() => setIsCaptainDropdownOpen(true)}
                                                className="w-full rounded-xl border border-border pr-4 pl-10 py-2.5 text-sm font-medium text-text-primary focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                                            />
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary flex items-center gap-1">
                                                {captainSearchQuery ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setCaptainSearchQuery("");
                                                            setSelectedCaptainLeadId("");
                                                        }}
                                                        className="hover:text-text-primary p-1 rounded-md transition-colors text-xs font-bold"
                                                    >
                                                        ✕
                                                    </button>
                                                ) : (
                                                    "🔍"
                                                )}
                                            </span>
                                        </div>

                                        {isCaptainDropdownOpen && (
                                            <div className="absolute z-50 mt-1.5 w-full max-h-60 overflow-y-auto bg-white border border-border shadow-2xl rounded-2xl p-1 text-right divide-y divide-border/40 scrollbar-thin">
                                                {filteredCaptainLeads.length > 0 ? (
                                                    filteredCaptainLeads.map((lead) => (
                                                        <button
                                                            key={lead.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedCaptainLeadId(lead.id);
                                                                setCaptainSearchQuery(`${lead.fullName} (${lead.phone})`);
                                                                setIsCaptainDropdownOpen(false);
                                                            }}
                                                            className={`w-full text-right px-4 py-2.5 text-xs font-semibold rounded-xl flex flex-col gap-0.5 transition-all text-text-primary hover:bg-emerald-50/70 ${
                                                                selectedCaptainLeadId === lead.id ? "bg-emerald-50 text-emerald-700 font-bold" : ""
                                                            }`}
                                                        >
                                                            <span className="font-bold text-sm text-text-primary">{lead.fullName}</span>
                                                            <span className="text-[10px] text-text-tertiary flex items-center gap-3 mt-0.5">
                                                                <span>📞 {lead.phone}</span>
                                                                <span>🚗 {lead.carBrand} {lead.carModel}</span>
                                                            </span>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-center text-xs text-text-tertiary font-bold">
                                                        لا توجد نتائج مطابقة لبحثك 🔍
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Preview lead data */}
                                    {selectedCaptainLeadId && (
                                        (() => {
                                            const lead = pipelineApplications.find((a) => a.id === selectedCaptainLeadId);
                                            if (!lead) return null;
                                            return (
                                                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                                                    <p className="text-xs font-bold text-emerald-800">📋 ملخص بيانات استمارة الكابتن:</p>
                                                    <div className="grid grid-cols-2 gap-2 text-xs text-emerald-900 font-medium">
                                                        <p>👤 الاسم: {lead.fullName}</p>
                                                        <p>📞 الهاتف: {lead.phone}</p>
                                                        <p>🚗 المركبة: {lead.carBrand} {lead.carModel}</p>
                                                        <p>🔢 رقم اللوحة: {lead.plateNumber}</p>
                                                        <p>📍 السكن والمدينة: {lead.areaName} ({lead.city})</p>
                                                    </div>
                                                </div>
                                            );
                                        })()
                                    )}

                                    <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100">
                                        <p className="text-xs font-bold text-indigo-800 flex items-center gap-1.5">
                                            🔑 كلمة المرور (توليد عشوائي):
                                        </p>
                                        <p className="text-[10px] text-indigo-700 font-medium mt-1">
                                            سيقوم النظام تلقائياً بتوليد رمز مرور قوي وعشوائي ومقاوم للاختراق للكابتن فور الضغط على التفعيل.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary mb-1">اسم الكابتن الكامل</label>
                                            <input
                                                type="text"
                                                required
                                                value={captainName}
                                                onChange={(e) => setCaptainName(e.target.value)}
                                                placeholder="الاسم الكامل"
                                                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-primary focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary mb-1">رقم الهاتف</label>
                                            <input
                                                type="tel"
                                                required
                                                value={captainPhone}
                                                onChange={(e) => setCaptainPhone(e.target.value)}
                                                placeholder="077XXXXXXXX"
                                                dir="ltr"
                                                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-primary focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary mb-1">ماركة المركبة</label>
                                            <input
                                                type="text"
                                                required
                                                value={captainCarBrand}
                                                onChange={(e) => setCaptainCarBrand(e.target.value)}
                                                placeholder="مثال: هيونداي"
                                                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-primary focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary mb-1">الموديل</label>
                                            <input
                                                type="text"
                                                value={captainCarModel}
                                                onChange={(e) => setCaptainCarModel(e.target.value)}
                                                placeholder="سوناتا"
                                                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-primary focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary mb-1">سنة الصنع</label>
                                            <input
                                                type="text"
                                                value={captainModelYear}
                                                onChange={(e) => setCaptainModelYear(e.target.value)}
                                                placeholder="2022"
                                                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-primary focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary mb-1">رقم اللوحة</label>
                                            <input
                                                type="text"
                                                required
                                                value={captainPlate}
                                                onChange={(e) => setCaptainPlate(e.target.value)}
                                                placeholder="لوحة المركبة"
                                                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-primary focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary mb-1">المدينة</label>
                                            <input
                                                type="text"
                                                value={captainCity}
                                                onChange={(e) => setCaptainCity(e.target.value)}
                                                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-primary focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary mb-1">منطقة العمل</label>
                                            <input
                                                type="text"
                                                value={captainArea}
                                                onChange={(e) => setCaptainArea(e.target.value)}
                                                placeholder="مثال: المجموعة"
                                                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-primary focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all text-right"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-text-secondary mb-2">نوع التسجيل المعتمد</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 text-sm font-bold text-text-primary">
                                                <input
                                                    type="checkbox"
                                                    checked={captainRegTypes.includes("subscription")}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setCaptainRegTypes([...captainRegTypes, "subscription"]);
                                                        } else {
                                                            setCaptainRegTypes(captainRegTypes.filter((t) => t !== "subscription"));
                                                        }
                                                    }}
                                                    className="rounded border-border text-primary-600 focus:ring-primary-500"
                                                />
                                                نقل اشتراك شهري
                                            </label>
                                            <label className="flex items-center gap-2 text-sm font-bold text-text-primary">
                                                <input
                                                    type="checkbox"
                                                    checked={captainRegTypes.includes("taxi")}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setCaptainRegTypes([...captainRegTypes, "taxi"]);
                                                        } else {
                                                            setCaptainRegTypes(captainRegTypes.filter((t) => t !== "taxi"));
                                                        }
                                                    }}
                                                    className="rounded border-border text-primary-600 focus:ring-primary-500"
                                                />
                                                تكسي يومي طلب خاص
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={captainTab === "pipeline" && !selectedCaptainLeadId}
                                className={`w-full inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-bold text-white shadow-lg transition-all ${
                                    captainTab === "pipeline" && !selectedCaptainLeadId
                                        ? "bg-slate-300 text-slate-500 cursor-not-allowed opacity-60"
                                        : "bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5"
                                }`}
                            >
                                {captainTab === "pipeline" ? "تفعيل حساب الكابتن 🚀" : "تسجيل وتفعيل الحساب فوراً 🚕"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ── MODAL 4: SUCCESS CREDENTIALS & WHATSAPP CARD ── */}
            {createdAccount && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-white border-2 border-primary-100 rounded-3xl p-6 shadow-2xl relative text-right animate-pulse-once">
                        <button
                            onClick={() => setCreatedAccount(null)}
                            className="absolute top-4 left-4 p-1.5 rounded-lg text-text-secondary hover:bg-surface-hover transition-colors"
                        >
                            ✕
                        </button>

                        <div className="text-center mb-5">
                            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-150 text-green-700 text-2xl mb-3 animate-ping-once">
                                🎉
                            </div>
                            <h3 className="text-lg font-extrabold text-text-primary">تم تفعيل وإنشاء الحساب بنجاح!</h3>
                            <p className="text-xs text-text-secondary mt-1">
                                الحساب الآن نشط ومستعد بالكامل لتسجيل الدخول
                            </p>
                        </div>

                        <div className="bg-surface-alt rounded-2xl p-4 border border-border space-y-3 mb-5">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-text-secondary">المستوى:</span>
                                <span className={`px-2 py-0.5 rounded-md font-bold ${
                                    createdAccount.role === "student"
                                        ? "bg-blue-50 text-blue-700"
                                        : createdAccount.role === "captain"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-indigo-50 text-indigo-700"
                                }`}>
                                    {createdAccount.role === "student" ? "🎓 طالب" : createdAccount.role === "captain" ? "🚕 كابتن" : "🛡️ مدير النظام"}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-text-secondary">الاسم الكامل:</span>
                                <span className="font-bold text-text-primary">{createdAccount.name}</span>
                            </div>

                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-text-secondary">رقم الهاتف / المعرّف:</span>
                                <span className="font-mono font-bold text-text-primary" dir="ltr">{createdAccount.phone}</span>
                            </div>

                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-text-secondary">الرمز السري العشوائي 🔑:</span>
                                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded select-all border border-indigo-100">{createdAccount.passcode}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={copyWhatsAppMessage}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-green-600/10 hover:bg-green-700 transition-all"
                            >
                                📋 نسخ رسالة الترحيب للواتساب
                            </button>
                            <button
                                onClick={() => setCreatedAccount(null)}
                                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-bold text-text-secondary hover:bg-surface-hover transition-all"
                            >
                                إغلاق النافذة
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
