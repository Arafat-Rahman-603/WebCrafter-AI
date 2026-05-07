import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "../redux/ReduxProvider";
import FooterWrapper from "@/componentes/FooterWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "WebCrafter AI",
  description: "AI Powered Website Builder",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          <div className="flex-1 flex flex-col items-stretch w-full min-h-screen">
            <main className="flex-1 flex flex-col w-full h-full">
              {children}
            </main>
            <FooterWrapper />
          </div>
        </ReduxProvider>
      <script
          src="https://aether-ai-support.vercel.app/AetherAI.js"
          data-business-id="user_3DOvzYegtE9X4o0YzrpUjAF0ymN" >
      </script>
      </body>
    </html>
  );
}
