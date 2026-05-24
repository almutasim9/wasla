export type ApplicationStatus = "pending" | "approved" | "archived";
export type RegistrationType = "taxi" | "subscription";
export type AccountStatus = "active" | "suspended";

// ── Pipeline types ──
export type PipelineStage =
    | "new"
    | "interview_scheduled"
    | "under_inspection"
    | "needs_improvement"
    | "accepted"
    | "rejected";

export interface Interview {
    date: string;
    time: string;
    location: string;
    assignedTo?: string;
}

export interface InspectionReport {
    cleanliness: number;
    driverBehavior: number;
    acWorking: boolean;
    heatingWorking: boolean;
    seatbelts: boolean;
    lights: boolean;
    mirrors: boolean;
    tires: boolean;
    interiorPhoto?: string;
    exteriorPhoto?: string;
    notes: string;
    result: "pass" | "fail" | "needs_improvement";
    submittedAt: string;
}

export interface TimelineEvent {
    date: string;
    action: string;
    by?: string;
}

export interface PipelineApplication {
    id: string;
    fullName: string;
    phone: string;
    carBrand: string;
    carModel: string;
    modelYear: string;
    plateNumber: string;
    city: string;
    areaName: string;
    registrationTypes: RegistrationType[];
    stage: PipelineStage;
    interview?: Interview;
    inspection?: InspectionReport;
    timeline: TimelineEvent[];
    rejectionReason?: string;
    createdAt: string;
}

// ── Legacy types (kept for existing pages) ──
export interface CaptainApplication {
    id: string;
    fullName: string;
    phone: string;
    carBrand: string;
    carModel: string;
    modelYear: string;
    plateNumber: string;
    city: string;
    areaName: string;
    registrationTypes: RegistrationType[];
    status: ApplicationStatus;
    createdAt: string;
}

export interface Captain {
    id: string;
    fullName: string;
    phone: string;
    email: string;
    carBrand: string;
    carModel: string;
    modelYear: string;
    plateNumber: string;
    city: string;
    areaName: string;
    registrationTypes: RegistrationType[];
    accountStatus: AccountStatus;
    approvedAt: string;
    createdAt: string;
    passcode?: string;
}

// ── Pipeline mock data ──
export const pipelineApplications: PipelineApplication[] = [
    {
        id: "p1",
        fullName: "أحمد محمد العبيدي",
        phone: "07701234567",
        carBrand: "تويوتا",
        carModel: "كامري",
        modelYear: "2022",
        plateNumber: "12-34567",
        city: "الموصل",
        areaName: "الزهور",
        registrationTypes: ["subscription"],
        stage: "new",
        timeline: [
            { date: "2026-02-28", action: "تقديم طلب انضمام", by: "النظام" },
        ],
        createdAt: "2026-02-28",
    },
    {
        id: "p2",
        fullName: "عمر خالد الجبوري",
        phone: "07709876543",
        carBrand: "هيونداي",
        carModel: "سوناتا",
        modelYear: "2021",
        plateNumber: "23-45678",
        city: "الموصل",
        areaName: "المجموعة",
        registrationTypes: ["taxi", "subscription"],
        stage: "new",
        timeline: [
            { date: "2026-02-27", action: "تقديم طلب انضمام", by: "النظام" },
        ],
        createdAt: "2026-02-27",
    },
    {
        id: "p3",
        fullName: "زيد عبدالله الحديثي",
        phone: "07706665544",
        carBrand: "تويوتا",
        carModel: "كورولا",
        modelYear: "2024",
        plateNumber: "67-89012",
        city: "الموصل",
        areaName: "الكرامة",
        registrationTypes: ["taxi", "subscription"],
        stage: "interview_scheduled",
        interview: {
            date: "2026-03-03",
            time: "10:00",
            location: "مكتب وصلة — شارع النبي يونس",
            assignedTo: "محمد المشرف",
        },
        timeline: [
            { date: "2026-03-01", action: "تقديم طلب انضمام", by: "النظام" },
            {
                date: "2026-03-02",
                action: "جدولة مقابلة — 3 مارس 10:00 ص",
                by: "المدير",
            },
        ],
        createdAt: "2026-03-01",
    },
    {
        id: "p4",
        fullName: "سيف الدين طارق",
        phone: "07704443322",
        carBrand: "هيونداي",
        carModel: "أكسنت",
        modelYear: "2021",
        plateNumber: "78-90123",
        city: "الموصل",
        areaName: "المثنى",
        registrationTypes: ["subscription"],
        stage: "interview_scheduled",
        interview: {
            date: "2026-03-04",
            time: "14:00",
            location: "مكتب وصلة — شارع النبي يونس",
        },
        timeline: [
            { date: "2026-03-01", action: "تقديم طلب انضمام", by: "النظام" },
            {
                date: "2026-03-02",
                action: "جدولة مقابلة — 4 مارس 2:00 م",
                by: "المدير",
            },
        ],
        createdAt: "2026-03-01",
    },
    {
        id: "p5",
        fullName: "علي حسين النعيمي",
        phone: "07702221100",
        carBrand: "إم جي",
        carModel: "MG5",
        modelYear: "2025",
        plateNumber: "89-01234",
        city: "الموصل",
        areaName: "حي العربي",
        registrationTypes: ["taxi"],
        stage: "under_inspection",
        interview: {
            date: "2026-02-28",
            time: "11:00",
            location: "مكتب وصلة — شارع النبي يونس",
            assignedTo: "محمد المشرف",
        },
        timeline: [
            { date: "2026-02-28", action: "تقديم طلب انضمام", by: "النظام" },
            {
                date: "2026-02-28",
                action: "جدولة مقابلة — 28 فبراير 11:00 ص",
                by: "المدير",
            },
            { date: "2026-02-28", action: "المقابلة تمت — بانتظار التقييم", by: "محمد المشرف" },
        ],
        createdAt: "2026-02-28",
    },
    {
        id: "p6",
        fullName: "حسن علي الشمري",
        phone: "07705551234",
        carBrand: "كيا",
        carModel: "ريو",
        modelYear: "2023",
        plateNumber: "34-56789",
        city: "الموصل",
        areaName: "النبي يونس",
        registrationTypes: ["taxi"],
        stage: "accepted",
        interview: {
            date: "2026-02-24",
            time: "09:00",
            location: "مكتب وصلة — شارع النبي يونس",
            assignedTo: "محمد المشرف",
        },
        inspection: {
            cleanliness: 5,
            driverBehavior: 4,
            acWorking: true,
            heatingWorking: true,
            seatbelts: true,
            lights: true,
            mirrors: true,
            tires: true,
            notes: "سيارة ممتازة وسائق ملتزم",
            result: "pass",
            submittedAt: "2026-02-25",
        },
        timeline: [
            { date: "2026-02-23", action: "تقديم طلب انضمام", by: "النظام" },
            { date: "2026-02-23", action: "جدولة مقابلة — 24 فبراير 9:00 ص", by: "المدير" },
            { date: "2026-02-24", action: "المقابلة تمت", by: "محمد المشرف" },
            { date: "2026-02-25", action: "تقرير التقييم — ناجح ✅", by: "محمد المشرف" },
            { date: "2026-02-26", action: "تم القبول وإنشاء الحساب", by: "المدير" },
        ],
        createdAt: "2026-02-23",
    },
    {
        id: "p7",
        fullName: "يوسف سامي الراوي",
        phone: "07708887654",
        carBrand: "نيسان",
        carModel: "صني",
        modelYear: "2020",
        plateNumber: "45-67890",
        city: "الموصل",
        areaName: "الرسالة",
        registrationTypes: ["subscription"],
        stage: "accepted",
        interview: {
            date: "2026-02-22",
            time: "13:00",
            location: "مكتب وصلة",
        },
        inspection: {
            cleanliness: 4,
            driverBehavior: 5,
            acWorking: true,
            heatingWorking: true,
            seatbelts: true,
            lights: true,
            mirrors: true,
            tires: true,
            notes: "ممتاز",
            result: "pass",
            submittedAt: "2026-02-24",
        },
        timeline: [
            { date: "2026-02-21", action: "تقديم طلب انضمام", by: "النظام" },
            { date: "2026-02-22", action: "جدولة مقابلة", by: "المدير" },
            { date: "2026-02-22", action: "المقابلة تمت", by: "المدير" },
            { date: "2026-02-24", action: "تقرير التقييم — ناجح ✅", by: "المدير" },
            { date: "2026-02-25", action: "تم القبول", by: "المدير" },
        ],
        createdAt: "2026-02-21",
    },
    {
        id: "p8",
        fullName: "مصطفى كريم العاني",
        phone: "07703332211",
        carBrand: "شيفروليه",
        carModel: "أوبترا",
        modelYear: "2019",
        plateNumber: "56-78901",
        city: "الموصل",
        areaName: "الوحدة",
        registrationTypes: ["taxi"],
        stage: "rejected",
        rejectionReason: "السيارة لا تحتوي على عناصر أمان كافية والإطارات بحاجة تبديل",
        interview: {
            date: "2026-02-19",
            time: "10:00",
            location: "مكتب وصلة",
        },
        inspection: {
            cleanliness: 2,
            driverBehavior: 3,
            acWorking: false,
            heatingWorking: false,
            seatbelts: true,
            lights: true,
            mirrors: false,
            tires: false,
            notes: "السيارة بحاجة صيانة شاملة",
            result: "fail",
            submittedAt: "2026-02-20",
        },
        timeline: [
            { date: "2026-02-18", action: "تقديم طلب انضمام", by: "النظام" },
            { date: "2026-02-18", action: "جدولة مقابلة", by: "المدير" },
            { date: "2026-02-19", action: "المقابلة تمت", by: "المدير" },
            { date: "2026-02-20", action: "تقرير التقييم — راسب ❌", by: "المدير" },
            { date: "2026-02-20", action: "تم الرفض — السيارة لا تحتوي على عناصر أمان كافية", by: "المدير" },
        ],
        createdAt: "2026-02-18",
    },
    {
        id: "p9",
        fullName: "فراس جاسم الدليمي",
        phone: "07707778899",
        carBrand: "تويوتا",
        carModel: "كورولا",
        modelYear: "2020",
        plateNumber: "99-11223",
        city: "الموصل",
        areaName: "الصحة",
        registrationTypes: ["taxi", "subscription"],
        stage: "needs_improvement",
        interview: {
            date: "2026-02-26",
            time: "15:00",
            location: "مكتب وصلة",
            assignedTo: "محمد المشرف",
        },
        inspection: {
            cleanliness: 3,
            driverBehavior: 4,
            acWorking: true,
            heatingWorking: false,
            seatbelts: true,
            lights: true,
            mirrors: true,
            tires: false,
            notes: "التدفئة لا تعمل والإطارات بحاجة تبديل — يمكن إعادة التقييم بعد الإصلاح",
            result: "needs_improvement",
            submittedAt: "2026-02-27",
        },
        timeline: [
            { date: "2026-02-25", action: "تقديم طلب انضمام", by: "النظام" },
            { date: "2026-02-25", action: "جدولة مقابلة", by: "المدير" },
            { date: "2026-02-26", action: "المقابلة تمت", by: "محمد المشرف" },
            { date: "2026-02-27", action: "تقرير التقييم — بحاجة تحسين 🔧", by: "محمد المشرف" },
        ],
        createdAt: "2026-02-25",
    },
    {
        id: "p10",
        fullName: "كرار عبدالرحمن",
        phone: "07700001122",
        carBrand: "كيا",
        carModel: "سيراتو",
        modelYear: "2023",
        plateNumber: "10-20304",
        city: "الموصل",
        areaName: "الحدباء",
        registrationTypes: ["subscription"],
        stage: "new",
        timeline: [
            { date: "2026-03-02", action: "تقديم طلب انضمام", by: "النظام" },
        ],
        createdAt: "2026-03-02",
    },
];

// ── Legacy mock data ──
export const mockApplications: CaptainApplication[] = [
    {
        id: "1",
        fullName: "أحمد محمد العبيدي",
        phone: "07701234567",
        carBrand: "تويوتا",
        carModel: "كامري",
        modelYear: "2022",
        plateNumber: "12-34567",
        city: "الموصل",
        areaName: "الزهور",
        registrationTypes: ["subscription"],
        status: "pending",
        createdAt: "2026-02-28",
    },
    {
        id: "2",
        fullName: "عمر خالد الجبوري",
        phone: "07709876543",
        carBrand: "هيونداي",
        carModel: "سوناتا",
        modelYear: "2021",
        plateNumber: "23-45678",
        city: "الموصل",
        areaName: "المجموعة",
        registrationTypes: ["taxi", "subscription"],
        status: "pending",
        createdAt: "2026-02-27",
    },
    {
        id: "3",
        fullName: "مصطفى كريم العاني",
        phone: "07703332211",
        carBrand: "شيفروليه",
        carModel: "أوبترا",
        modelYear: "2019",
        plateNumber: "56-78901",
        city: "الموصل",
        areaName: "الوحدة",
        registrationTypes: ["taxi"],
        status: "archived",
        createdAt: "2026-02-20",
    },
    {
        id: "4",
        fullName: "زيد عبدالله الحديثي",
        phone: "07706665544",
        carBrand: "تويوتا",
        carModel: "كورولا",
        modelYear: "2024",
        plateNumber: "67-89012",
        city: "الموصل",
        areaName: "الكرامة",
        registrationTypes: ["taxi", "subscription"],
        status: "pending",
        createdAt: "2026-03-01",
    },
    {
        id: "5",
        fullName: "سيف الدين طارق",
        phone: "07704443322",
        carBrand: "هيونداي",
        carModel: "أكسنت",
        modelYear: "2021",
        plateNumber: "78-90123",
        city: "الموصل",
        areaName: "المثنى",
        registrationTypes: ["subscription"],
        status: "pending",
        createdAt: "2026-03-01",
    },
    {
        id: "6",
        fullName: "علي حسين النعيمي",
        phone: "07702221100",
        carBrand: "إم جي",
        carModel: "MG5",
        modelYear: "2025",
        plateNumber: "89-01234",
        city: "الموصل",
        areaName: "حي العربي",
        registrationTypes: ["taxi"],
        status: "pending",
        createdAt: "2026-02-28",
    },
];

export const mockCaptains: Captain[] = [
    {
        id: "c1",
        fullName: "حسن علي الشمري",
        phone: "07705551234",
        email: "hassan.shamri@email.com",
        carBrand: "كيا",
        carModel: "ريو",
        modelYear: "2023",
        plateNumber: "34-56789",
        city: "الموصل",
        areaName: "النبي يونس",
        registrationTypes: ["taxi"],
        accountStatus: "active",
        approvedAt: "2026-02-26",
        createdAt: "2026-02-25",
    },
    {
        id: "c2",
        fullName: "يوسف سامي الراوي",
        phone: "07708887654",
        email: "yousif.rawi@email.com",
        carBrand: "نيسان",
        carModel: "صني",
        modelYear: "2020",
        plateNumber: "45-67890",
        city: "الموصل",
        areaName: "الرسالة",
        registrationTypes: ["subscription"],
        accountStatus: "active",
        approvedAt: "2026-02-25",
        createdAt: "2026-02-24",
    },
    {
        id: "c4",
        fullName: "سالم يونس الحيالي",
        phone: "07709990011",
        email: "salem.hayali@email.com",
        carBrand: "هيونداي",
        carModel: "إلنترا",
        modelYear: "2023",
        plateNumber: "88-44556",
        city: "الموصل",
        areaName: "المجموعة",
        registrationTypes: ["subscription"],
        accountStatus: "active",
        approvedAt: "2026-03-01",
        createdAt: "2026-02-28",
    },
    {
        id: "c3",
        fullName: "محمد عادل السعدي",
        phone: "07701112233",
        email: "mohammad.saadi@email.com",
        carBrand: "تويوتا",
        carModel: "يارس",
        modelYear: "2022",
        plateNumber: "11-22334",
        city: "الموصل",
        areaName: "الدواسة",
        registrationTypes: ["taxi", "subscription"],
        accountStatus: "suspended",
        approvedAt: "2026-02-20",
        createdAt: "2026-02-18",
    },
];

// ── Pipeline stage config ──
export const stageConfig: Record<
    PipelineStage,
    { label: string; emoji: string; color: string; bgColor: string; borderColor: string }
> = {
    new: {
        label: "طلب جديد",
        emoji: "📩",
        color: "text-blue-700",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
    },
    interview_scheduled: {
        label: "مقابلة مجدولة",
        emoji: "📅",
        color: "text-violet-700",
        bgColor: "bg-violet-50",
        borderColor: "border-violet-200",
    },
    under_inspection: {
        label: "قيد التقييم",
        emoji: "📋",
        color: "text-orange-700",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
    },
    needs_improvement: {
        label: "بحاجة تحسين",
        emoji: "🔧",
        color: "text-yellow-700",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
    },
    accepted: {
        label: "مقبول",
        emoji: "✅",
        color: "text-green-700",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
    },
    rejected: {
        label: "مرفوض",
        emoji: "❌",
        color: "text-red-700",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
    },
};

// ── Student types ──
export type StudentGender = "male" | "female";
export type StudentShift = "morning" | "evening";
export type StudentPipelineStage =
    | "new"
    | "contacting"
    | "confirmed"
    | "awaiting_payment"
    | "partial_payment"
    | "active"
    | "no_response"
    | "cancelled";
export type StudentStatus = "active" | "suspended" | "pending";
export type CallResult = "answered" | "no_answer" | "busy" | "wrong_number";
export type PaymentMethod = "cash" | "card" | "e_wallet";
export type PaymentStatus = "partial" | "full";

export interface CallLog {
    date: string;
    result: CallResult;
    note: string;
    employee: string;
}

export interface PaymentRecord {
    date: string;
    amountPaid: number;
    totalAmount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId?: string;
    note?: string;
    employee: string;
}

export interface StudentApplication {
    id: string;
    fullName: string;
    gender: StudentGender;
    phone: string;
    area: string;
    landmark: string;
    university: string;
    universityLocation: string;
    shift: StudentShift;
    stage: StudentPipelineStage;
    status: StudentStatus;
    contactAttempts: number;
    callLogs: CallLog[];
    payments: PaymentRecord[];
    timeline: TimelineEvent[];
    createdAt: string;
    passcode?: string;
}

// ── Student mock data ──
export const studentApplications: StudentApplication[] = [
    {
        id: "s1",
        fullName: "محمد أحمد الجبوري",
        gender: "male",
        phone: "07801234567",
        area: "الزهور",
        landmark: "قرب جامع الزهور الكبير",
        university: "جامعة الموصل",
        universityLocation: "الساحل الأيسر — المجموعة الثقافية",
        shift: "morning",
        stage: "active",
        status: "active",
        contactAttempts: 1,
        callLogs: [
            { date: "2026-02-20", result: "answered", note: "تم التأكيد — كل البيانات صحيحة", employee: "أحمد" },
        ],
        payments: [
            { date: "2026-02-21", amountPaid: 50000, totalAmount: 50000, method: "cash", status: "full", employee: "أحمد" },
        ],
        timeline: [
            { date: "2026-02-20", action: "تقديم طلب تسجيل", by: "النظام" },
            { date: "2026-02-20", action: "📞 اتصال — تأكيد البيانات", by: "أحمد" },
            { date: "2026-02-21", action: "💰 استلام الدفع — 50,000 د.ع كاش", by: "أحمد" },
            { date: "2026-02-22", action: "✅ تفعيل الاشتراك", by: "أحمد" },
        ],
        createdAt: "2026-02-20",
    },
    {
        id: "s2",
        fullName: "زينب علي الحديثي",
        gender: "female",
        phone: "07809876543",
        area: "المجموعة",
        landmark: "مقابل مستشفى السلام",
        university: "جامعة الموصل",
        universityLocation: "الساحل الأيسر — كلية الهندسة",
        shift: "morning",
        stage: "active",
        status: "active",
        contactAttempts: 2,
        callLogs: [
            { date: "2026-02-18", result: "no_answer", note: "لا رد — المحاولة الأولى", employee: "محمد" },
            { date: "2026-02-18", result: "answered", note: "ردّت ولية الأمر — تأكيد البيانات", employee: "محمد" },
        ],
        payments: [
            { date: "2026-02-19", amountPaid: 50000, totalAmount: 50000, method: "card", status: "full", transactionId: "TXN-20260219-001", employee: "محمد" },
        ],
        timeline: [
            { date: "2026-02-18", action: "تقديم طلب تسجيل", by: "النظام" },
            { date: "2026-02-18", action: "📞 محاولة اتصال — لا رد", by: "محمد" },
            { date: "2026-02-18", action: "📞 اتصال — تأكيد البيانات", by: "محمد" },
            { date: "2026-02-19", action: "💳 دفع إلكتروني — 50,000 د.ع", by: "محمد" },
            { date: "2026-02-20", action: "✅ تفعيل الاشتراك", by: "محمد" },
        ],
        createdAt: "2026-02-18",
    },
    {
        id: "s3",
        fullName: "عمر حسين الراوي",
        gender: "male",
        phone: "07804443322",
        area: "الكرامة",
        landmark: "قرب سوق الكرامة",
        university: "جامعة نينوى",
        universityLocation: "الساحل الأيمن — حي الحرية",
        shift: "evening",
        stage: "awaiting_payment",
        status: "pending",
        contactAttempts: 1,
        callLogs: [
            { date: "2026-03-01", result: "answered", note: "تم التأكيد — أبلغته بالمبلغ المطلوب", employee: "أحمد" },
        ],
        payments: [],
        timeline: [
            { date: "2026-02-28", action: "تقديم طلب تسجيل", by: "النظام" },
            { date: "2026-03-01", action: "📞 اتصال — تأكيد البيانات", by: "أحمد" },
            { date: "2026-03-01", action: "⏳ بانتظار الدفع", by: "أحمد" },
        ],
        createdAt: "2026-02-28",
    },
    {
        id: "s4",
        fullName: "نور الهدى كريم",
        gender: "female",
        phone: "07807778899",
        area: "الدواسة",
        landmark: "قرب مدرسة الدواسة الابتدائية",
        university: "الجامعة التقنية الشمالية",
        universityLocation: "الساحل الأيسر — المجموعة",
        shift: "morning",
        stage: "partial_payment",
        status: "pending",
        contactAttempts: 1,
        callLogs: [
            { date: "2026-03-01", result: "answered", note: "تم التأكيد", employee: "أحمد" },
        ],
        payments: [
            { date: "2026-03-01", amountPaid: 25000, totalAmount: 50000, method: "cash", status: "partial", note: "دفعة أولى — المتبقي 25,000", employee: "أحمد" },
        ],
        timeline: [
            { date: "2026-03-01", action: "تقديم طلب تسجيل", by: "النظام" },
            { date: "2026-03-01", action: "📞 اتصال — تأكيد البيانات", by: "أحمد" },
            { date: "2026-03-01", action: "💰 دفع جزئي — 25,000 د.ع كاش", by: "أحمد" },
        ],
        createdAt: "2026-03-01",
    },
    {
        id: "s5",
        fullName: "حسن سامي النعيمي",
        gender: "male",
        phone: "07802221100",
        area: "النبي يونس",
        landmark: "شارع النبي يونس — قرب الجسر القديم",
        university: "جامعة الموصل",
        universityLocation: "الساحل الأيسر — كلية الطب",
        shift: "morning",
        stage: "new",
        status: "pending",
        contactAttempts: 0,
        callLogs: [],
        payments: [],
        timeline: [
            { date: "2026-03-02", action: "تقديم طلب تسجيل", by: "النظام" },
        ],
        createdAt: "2026-03-02",
    },
    {
        id: "s6",
        fullName: "فاطمة خالد الشمري",
        gender: "female",
        phone: "07805556677",
        area: "حي العربي",
        landmark: "مقابل حديقة حي العربي",
        university: "جامعة نينوى",
        universityLocation: "الساحل الأيمن — حي الحرية",
        shift: "evening",
        stage: "contacting",
        status: "pending",
        contactAttempts: 2,
        callLogs: [
            { date: "2026-03-02", result: "no_answer", note: "لا رد — المحاولة الأولى", employee: "محمد" },
            { date: "2026-03-02", result: "busy", note: "الخط مشغول", employee: "محمد" },
        ],
        payments: [],
        timeline: [
            { date: "2026-03-02", action: "تقديم طلب تسجيل", by: "النظام" },
            { date: "2026-03-02", action: "📞 محاولة اتصال — لا رد", by: "محمد" },
            { date: "2026-03-02", action: "📞 محاولة اتصال — مشغول", by: "محمد" },
        ],
        createdAt: "2026-03-02",
    },
    {
        id: "s7",
        fullName: "يوسف عادل الطائي",
        gender: "male",
        phone: "07808889900",
        area: "الرسالة",
        landmark: "قرب مول الرسالة",
        university: "جامعة الموصل",
        universityLocation: "الساحل الأيسر — كلية العلوم",
        shift: "morning",
        stage: "active",
        status: "suspended",
        contactAttempts: 1,
        callLogs: [
            { date: "2026-02-15", result: "answered", note: "تم التأكيد", employee: "أحمد" },
        ],
        payments: [
            { date: "2026-02-16", amountPaid: 50000, totalAmount: 50000, method: "e_wallet", status: "full", transactionId: "ZC-20260216-042", note: "زين كاش", employee: "أحمد" },
        ],
        timeline: [
            { date: "2026-02-15", action: "تقديم طلب تسجيل", by: "النظام" },
            { date: "2026-02-15", action: "📞 اتصال — تأكيد البيانات", by: "أحمد" },
            { date: "2026-02-16", action: "📱 دفع زين كاش — 50,000 د.ع", by: "أحمد" },
            { date: "2026-02-17", action: "✅ تفعيل الاشتراك", by: "أحمد" },
            { date: "2026-02-28", action: "⏸️ تعليق — عدم تجديد الدفع", by: "المدير" },
        ],
        createdAt: "2026-02-15",
    },
    {
        id: "s8",
        fullName: "سارة ماجد العبيدي",
        gender: "female",
        phone: "07801112233",
        area: "المثنى",
        landmark: "قرب ساحة المثنى",
        university: "الجامعة التقنية الشمالية",
        universityLocation: "الساحل الأيسر — المجموعة",
        shift: "evening",
        stage: "new",
        status: "pending",
        contactAttempts: 0,
        callLogs: [],
        payments: [],
        timeline: [
            { date: "2026-03-02", action: "تقديم طلب تسجيل", by: "النظام" },
        ],
        createdAt: "2026-03-02",
    },
    {
        id: "s9",
        fullName: "علي حسام الدليمي",
        gender: "male",
        phone: "07803334455",
        area: "الوحدة",
        landmark: "قرب مدرسة الوحدة المتوسطة",
        university: "جامعة الموصل",
        universityLocation: "الساحل الأيسر — كلية الآداب",
        shift: "morning",
        stage: "no_response",
        status: "pending",
        contactAttempts: 3,
        callLogs: [
            { date: "2026-02-25", result: "no_answer", note: "لا رد — المحاولة الأولى", employee: "محمد" },
            { date: "2026-02-26", result: "no_answer", note: "لا رد — المحاولة الثانية", employee: "أحمد" },
            { date: "2026-02-27", result: "no_answer", note: "لا رد — المحاولة الثالثة. تحويل لغير متجاوب", employee: "أحمد" },
        ],
        payments: [],
        timeline: [
            { date: "2026-02-24", action: "تقديم طلب تسجيل", by: "النظام" },
            { date: "2026-02-25", action: "📞 محاولة اتصال — لا رد (1)", by: "محمد" },
            { date: "2026-02-26", action: "📞 محاولة اتصال — لا رد (2)", by: "أحمد" },
            { date: "2026-02-27", action: "📞 محاولة اتصال — لا رد (3)", by: "أحمد" },
            { date: "2026-02-27", action: "🔴 تحويل لغير متجاوب", by: "أحمد" },
        ],
        createdAt: "2026-02-24",
    },
    {
        id: "s10",
        fullName: "هبة أحمد العاني",
        gender: "female",
        phone: "07806667788",
        area: "الشفاء",
        landmark: "قرب صيدلية الشفاء",
        university: "جامعة نينوى",
        universityLocation: "الساحل الأيمن — حي الحرية",
        shift: "morning",
        stage: "cancelled",
        status: "pending",
        contactAttempts: 1,
        callLogs: [
            { date: "2026-02-27", result: "answered", note: "ردّت — ألغت الطلب بسبب تغيير الخطط", employee: "محمد" },
        ],
        payments: [],
        timeline: [
            { date: "2026-02-26", action: "تقديم طلب تسجيل", by: "النظام" },
            { date: "2026-02-27", action: "📞 اتصال — ألغت الطلب", by: "محمد" },
            { date: "2026-02-27", action: "❌ إلغاء الطلب", by: "محمد" },
        ],
        createdAt: "2026-02-26",
    },
    {
        id: "s11",
        fullName: "رغد باسم الجبوري",
        gender: "female",
        phone: "07809998877",
        area: "الحدباء",
        landmark: "قرب جامع الحدباء",
        university: "جامعة الموصل",
        universityLocation: "الساحل الأيسر — المجموعة الثقافية",
        shift: "morning",
        stage: "active",
        status: "active",
        contactAttempts: 1,
        callLogs: [
            { date: "2026-03-03", result: "answered", note: "تم التأكيد وتفعيل الاشتراك قبل الدفع", employee: "العمليات" },
        ],
        payments: [],
        timeline: [
            { date: "2026-03-03", action: "تقديم طلب تسجيل", by: "النظام" },
            { date: "2026-03-03", action: "📞 اتصال — تأكيد البيانات", by: "العمليات" },
            { date: "2026-03-04", action: "✅ تفعيل الاشتراك — بانتظار الدفع", by: "العمليات" },
        ],
        createdAt: "2026-03-03",
    },
    {
        id: "s12",
        fullName: "مصعب نزار العبادي",
        gender: "male",
        phone: "07807770022",
        area: "الكرامة",
        landmark: "قرب سوق الكرامة الشعبي",
        university: "جامعة نينوى",
        universityLocation: "الساحل الأيمن — حي الحرية",
        shift: "evening",
        stage: "active",
        status: "active",
        contactAttempts: 1,
        callLogs: [
            { date: "2026-03-02", result: "answered", note: "تم التأكيد", employee: "العمليات" },
        ],
        payments: [
            { date: "2026-03-03", amountPaid: 20000, totalAmount: 50000, method: "cash", status: "partial", note: "دفعة أولى", employee: "العمليات" },
        ],
        timeline: [
            { date: "2026-03-02", action: "تقديم طلب تسجيل", by: "النظام" },
            { date: "2026-03-02", action: "📞 اتصال — تأكيد البيانات", by: "العمليات" },
            { date: "2026-03-03", action: "💰 دفع جزئي — 20,000 د.ع", by: "العمليات" },
            { date: "2026-03-03", action: "✅ تفعيل الاشتراك", by: "العمليات" },
        ],
        createdAt: "2026-03-02",
    },
    {
        id: "s13",
        fullName: "مريم سعد الدليمي",
        gender: "female",
        phone: "07804445566",
        area: "الوحدة",
        landmark: "قرب مدرسة الوحدة",
        university: "الجامعة التقنية الشمالية",
        universityLocation: "الساحل الأيسر — المجموعة",
        shift: "morning",
        stage: "active",
        status: "active",
        contactAttempts: 1,
        callLogs: [
            { date: "2026-02-10", result: "answered", note: "تم التأكيد للشهر التجريبي", employee: "العمليات" },
        ],
        payments: [
            { date: "2026-02-11", amountPaid: 50000, totalAmount: 50000, method: "e_wallet", status: "full", transactionId: "ZC-20260211-118", employee: "العمليات" },
        ],
        timeline: [
            { date: "2026-02-10", action: "تقديم طلب تسجيل", by: "النظام" },
            { date: "2026-02-11", action: "📱 دفع كامل — 50,000 د.ع", by: "العمليات" },
            { date: "2026-03-01", action: "إنهاء الاشتراك بناءً على طلب الطالب", by: "العمليات" },
        ],
        createdAt: "2026-02-10",
    },
];

// ── Student pipeline stage config ──
export const studentStageConfig: Record<
    StudentPipelineStage,
    { label: string; emoji: string; color: string; bgColor: string; borderColor: string }
> = {
    new: {
        label: "طلب جديد",
        emoji: "📩",
        color: "text-blue-700",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
    },
    contacting: {
        label: "جاري الاتصال",
        emoji: "📞",
        color: "text-cyan-700",
        bgColor: "bg-cyan-50",
        borderColor: "border-cyan-200",
    },
    confirmed: {
        label: "تم التأكيد",
        emoji: "✔️",
        color: "text-violet-700",
        bgColor: "bg-violet-50",
        borderColor: "border-violet-200",
    },
    awaiting_payment: {
        label: "بانتظار الدفع",
        emoji: "⏳",
        color: "text-orange-700",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
    },
    partial_payment: {
        label: "دفع جزئي",
        emoji: "💰",
        color: "text-amber-700",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
    },
    active: {
        label: "فعّال",
        emoji: "✅",
        color: "text-green-700",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
    },
    no_response: {
        label: "لا رد",
        emoji: "🔇",
        color: "text-gray-700",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
    },
    cancelled: {
        label: "ملغي",
        emoji: "❌",
        color: "text-red-700",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
    },
};
