import type { Metadata } from "next";
import { El_Messiri, Scheherazade_New } from "next/font/google"; 
import "./globals.css";

const elMessiri = El_Messiri({ 
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"], 
});

const scheherazade = Scheherazade_New({ 
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "600", "700"], 
});

export const metadata: Metadata = {
  title: "noOrSpace | المساحة الأولى للمبدعين",
  description: "المساحة الأولى للمبدعين في المنطقة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${elMessiri.variable} ${scheherazade.variable} font-body min-h-screen flex flex-col bg-off-white`}>
        
        {/* The new nav and page content from page.tsx will be injected right here */}
        <div className="grow">{children}</div>
        
      </body>
    </html>
  );
}