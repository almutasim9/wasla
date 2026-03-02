export default function Footer() {
    return (
        <footer className="border-t border-border bg-white">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-sm">
                            و
                        </div>
                        <span className="text-lg font-bold text-text-primary">وصلة</span>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-sm text-text-secondary">
                        <a href="#features" className="hover:text-primary-600 transition-colors">
                            المميزات
                        </a>
                        <a href="#how-it-works" className="hover:text-primary-600 transition-colors">
                            كيف تعمل
                        </a>
                    </div>

                    {/* Copyright */}
                    <p className="text-sm text-text-tertiary">
                        © {new Date().getFullYear()} وصلة. جميع الحقوق محفوظة.
                    </p>
                </div>
            </div>
        </footer>
    );
}
