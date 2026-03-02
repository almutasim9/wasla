const steps = [
    {
        num: "١",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
        ),
        title: "ابحث عن مسارك",
        desc: "حدد نقطة انطلاقك وجامعتك، وراح نعرض لك الكباتن المتاحين على مسارك.",
    },
    {
        num: "٢",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
        ),
        title: "اختر كابتنك واشترك",
        desc: "شوف تقييمات الركاب، واختر الكابتن اللي يناسبك، واشترك شهرياً.",
    },
    {
        num: "٣",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>
        ),
        title: "استمتع بتوصيلتك اليومية",
        desc: "كل يوم، كابتنك يوصلك ويرجعك بدون ما تفكر بشي.",
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 sm:py-28">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* Section heading */}
                <div className="text-center mb-16">
                    <p className="text-sm font-bold uppercase tracking-widest text-primary-600 mb-3">
                        بكل بساطة
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
                        كيف تشتغل وصلة؟
                    </h2>
                    <p className="mt-4 text-text-secondary text-lg max-w-xl mx-auto">
                        ثلاث خطوات بسيطة تفصلك عن توصيلتك اليومية المريحة.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid gap-8 md:grid-cols-3">
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className="group relative text-center rounded-3xl bg-white border border-border p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Step number */}
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white text-2xl font-extrabold shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
                                {step.num}
                            </div>

                            {/* Icon */}
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                                {step.icon}
                            </div>

                            <h3 className="text-lg font-bold text-text-primary mb-2">
                                {step.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-text-secondary">
                                {step.desc}
                            </p>

                            {/* Connector line (hidden on last item and mobile) */}
                            {i < steps.length - 1 && (
                                <div className="hidden md:block absolute top-16 -left-4 w-8 border-t-2 border-dashed border-primary-200" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
