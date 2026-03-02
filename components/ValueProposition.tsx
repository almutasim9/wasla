const studentBenefits = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: "سعر شهري ثابت",
        desc: "ادفع مرة وحدة بالشهر بدون مفاجآت أو أسعار متغيرة.",
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
        title: "مقعد مضمون",
        desc: "لا تقلق من الأماكن — مقعدك محجوز كل يوم.",
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
        ),
        title: "كباتن موثوقين",
        desc: "جميع السائقين تم التحقق منهم ومقيّمين من الطلاب.",
    },
];

const captainBenefits = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
        ),
        title: "دخل شهري ثابت",
        desc: "اشتراكات شهرية تضمن لك دخل منتظم بدون عمولات كبيرة.",
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
        ),
        title: "رحلات يومية منظمة",
        desc: "مسارات واضحة ومحددة مسبقاً — بدون عشوائية.",
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
        ),
        title: "صفر كراسي فاضية",
        desc: "كل مقعد محجوز مسبقاً — أقصى استفادة من كل رحلة.",
    },
];

function BenefitCard({
    label,
    labelColor,
    benefits,
    accentBorder,
}: {
    label: string;
    labelColor: string;
    benefits: typeof studentBenefits;
    accentBorder: string;
}) {
    return (
        <div
            className={`relative rounded-3xl bg-white border border-border p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${accentBorder}`}
        >
            {/* Label badge */}
            <div
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold mb-6 ${labelColor}`}
            >
                {label}
            </div>

            <ul className="space-y-6">
                {benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-alt text-primary-600">
                            {b.icon}
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-text-primary">
                                {b.title}
                            </h3>
                            <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                                {b.desc}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function ValueProposition() {
    return (
        <section id="features" className="py-20 sm:py-28 bg-surface-alt">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* Section heading */}
                <div className="text-center mb-14">
                    <p className="text-sm font-bold uppercase tracking-widest text-primary-600 mb-3">
                        لماذا وصلة؟
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
                        منصة واحدة تخدم الجميع
                    </h2>
                    <p className="mt-4 text-text-secondary text-lg max-w-xl mx-auto">
                        سواء كنت طالب تبحث عن توصيلة يومية، أو كابتن تبحث عن دخل ثابت —
                        وصلة تجمعكم.
                    </p>
                </div>

                {/* Cards grid */}
                <div className="grid gap-8 md:grid-cols-2">
                    <BenefitCard
                        label="🎓 للطلاب"
                        labelColor="bg-primary-50 text-primary-700"
                        benefits={studentBenefits}
                        accentBorder="border-t-4 border-t-primary-500"
                    />
                    <BenefitCard
                        label="🚗 للكباتن"
                        labelColor="bg-secondary-50 text-secondary-700"
                        benefits={captainBenefits}
                        accentBorder="border-t-4 border-t-secondary-500"
                    />
                </div>
            </div>
        </section>
    );
}
