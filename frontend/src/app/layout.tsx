import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import Providers from "@/components/shared/Providers";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prepwise",
  description: "An AI-powered platform for preparing for mock interviews",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${monaSans.className} antialiased bg-[url('/pattern.png')] bg-cover bg-center bg-no-repeat min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
