import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "وصلة — طريقك للجامعة صار أسهل",
  description:
    "احجز مقعدك الشهري مع كباتن موثوقين، وتخلص من زحمة الصباح بأسعار ثابتة. وصلة تربط طلاب الجامعات بسائقين يومياً عبر اشتراك شهري.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} font-[family-name:var(--font-tajawal)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
