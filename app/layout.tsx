import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import "./styles/_keyframe-animations.scss";
import "./styles/_variables.scss";
import ReactQueryProvider from "@/contexts/ReactQueryProvider";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Article Management Web App",
  description:
    "A web-based article management system with role-based access. User interface is fully responsive, built using Next.js, Tailwind CSS, and integrated REST API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} font-archivo antialiased bg-white`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
