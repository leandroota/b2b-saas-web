"use client";

import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { CopilotChat } from "@/features/copilot/components/copilot-chat";
import { useAppStore } from "@/store/use-app-store";
import { cn } from "@/lib/utils";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isCopilotOpen } = useAppStore();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground h-screen overflow-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <div className="flex h-full w-full relative overflow-hidden">
              <Sidebar />
              <div className="flex flex-col flex-1 min-w-0 transition-all duration-500 ease-in-out">
                <Header />
                <main className="flex-1 overflow-y-auto bg-background/50">
                  {children}
                </main>
              </div>

              {/* Global AI Copilot Sidebar */}
              <aside
                className={cn(
                  "fixed inset-y-0 right-0 z-50 w-[400px] xl:w-[450px] transform transition-transform duration-500 ease-in-out border-l border-border bg-background shadow-2xl",
                  isCopilotOpen ? "translate-x-0" : "translate-x-full"
                )}
              >
                <CopilotChat />
              </aside>
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
