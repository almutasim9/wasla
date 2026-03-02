import Link from "next/link";

export default function HeroSection() {
    return (
        <section
            id="hero"
            className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28"
        >
            {/* Background decorative elements */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                {/* Gradient orbs */}
                <div className="absolute -top-24 -left-24 h-[480px] w-[480px] rounded-full bg-primary-200/40 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-secondary-200/30 blur-3xl" />
                {/* Subtle grid */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to left, #000 1px, transparent 1px), linear-gradient(to top, #000 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                {/* Badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-200 px-4 py-1.5 text-sm font-medium text-primary-700">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500"></span>
                    </span>
                    متاح الآن — سجل مجاناً
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-text-primary">
                    طريقك للجامعة
                    <br />
                    <span className="bg-gradient-to-l from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                        صار أسهل ومضمون
                    </span>
                </h1>

                {/* Sub-headline */}
                <p className="mt-6 mx-auto max-w-2xl text-lg sm:text-xl text-text-secondary leading-relaxed">
                    احجز مقعدك الشهري مع كباتن موثوقين، وتخلص من زحمة الصباح بأسعار
                    ثابتة.
                </p>

                {/* CTA Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/register/student"
                        id="cta-student"
                        className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary-600/25 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/30 transition-all duration-300 hover:-translate-y-0.5"
                    >
                        سجل معنا كطالب
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 rotate-180 transition-transform group-hover:-translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </Link>

                    <Link
                        href="/register/captain"
                        id="cta-captain"
                        className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-text-primary/10 bg-white px-8 py-4 text-base font-bold text-text-primary shadow-sm hover:border-secondary-500 hover:text-secondary-600 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    >
                        سجل معنا ككابتن
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 rotate-180 transition-transform group-hover:-translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </Link>
                </div>

                {/* Social proof */}
                <p className="mt-8 text-sm text-text-tertiary">
                    أكثر من <span className="font-bold text-text-secondary">٥٠٠+</span>{" "}
                    طالب سجلوا خلال الشهر الأول
                </p>
            </div>
        </section>
    );
}
