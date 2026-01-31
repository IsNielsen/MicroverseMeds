import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { GlobalAudioPlayer } from "@/components/shared/GlobalAudioPlayer";

export const metadata: Metadata = {
  title: "Microverse Meds - Gamified Medication Tracker",
  description: "Track your medications and grow your Life Tree",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <GlobalAudioPlayer src="/Music/playful-kids-200436.mp3" volume={0.4} />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'white',
              color: '#1f2937',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
      </body>
    </html>
  );
}
