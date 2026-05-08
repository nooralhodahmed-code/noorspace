import { createClient } from "@/utils/supabase/server";
import "./globals.css";

export const metadata = {
  title: "noOrSpace",
  description: "The ultimate space for creators",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="bg-offwhite text-slate-text min-h-screen">
        {children}
      </body>
    </html>
  );
}