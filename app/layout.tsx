import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import type { Metadata } from "next";
import Provider from './sign-up/[[...sign-up]]/provider';

export const metadata: Metadata = {
  title: "TestAgent — AI-Powered Test Automation",
  description: "Connect your GitHub repository. AI generates comprehensive test cases and executes them in real cloud browsers automatically.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">

        <body style={{ margin: 0, padding: 0, background: '#09090b' }}>

          <Provider>
            {children}

          </Provider>

        </body>
      </html>
    </ClerkProvider>
  );
}
