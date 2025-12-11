
'use client';

import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { UserProvider, useUser } from '@/context/user-context';
import { ThemeProvider, useTheme } from 'next-themes';
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

function AppThemeManager({ children }: { children: React.ReactNode }) {
    const { viewAsUser } = useUser();
    const { setTheme, theme } = useTheme();

    useEffect(() => {
        const root = document.documentElement;
        const currentTheme = theme || 'light';

        if (viewAsUser) {
            if (viewAsUser.theme) {
                setTheme(viewAsUser.theme);
            }

            const fontWeight = viewAsUser.fontWeight || 400;
            document.body.style.fontWeight = fontWeight.toString();

            if (fontWeight >= 700) {
                document.body.classList.add('bold-emphasis');
            } else {
                document.body.classList.remove('bold-emphasis');
            }

            const emphasisWeightMap: { [key: number]: number } = {
                100: 400, 300: 500, 400: 700, 500: 700, 700: 700
            };
            root.style.setProperty('--font-weight-emphasis', (emphasisWeightMap[fontWeight] || 500).toString());

            root.style.setProperty('--global-icon-weight', fontWeight.toString());
            root.style.setProperty('--global-icon-grade', (viewAsUser.iconGrade || 0).toString());
            root.style.setProperty('--global-icon-optical-size', (viewAsUser.iconOpticalSize || 24).toString());
            root.style.setProperty('--global-icon-fill', viewAsUser.iconFill ? '1' : '0');

            if (viewAsUser.iconFill) {
                document.body.classList.add('icon-fill-emphasis');
            } else {
                document.body.classList.remove('icon-fill-emphasis');
            }

            root.style.setProperty('--radius', `${viewAsUser.radius ?? 0.5}rem`);

            if (viewAsUser.primaryColor) {
                const match = viewAsUser.primaryColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
                if (match) {
                    root.style.setProperty('--primary', `${match[1]} ${match[2]}% ${match[3]}%`);
                }
            } else {
                const defaultPrimary = currentTheme === 'dark' ? '25 88% 55%' : '207 70% 53%';
                root.style.setProperty('--primary', defaultPrimary);
            }

            const foregroundColor = viewAsUser.highContrast 
                ? (currentTheme === 'dark' ? '210 7% 80%' : '210 7% 20%') 
                : (currentTheme === 'dark' ? '210 7% 60%' : '210 7% 40%');
            root.style.setProperty('--foreground', foregroundColor);

        } else {
            // Apply default styles when no user is being viewed
            const defaultPrimary = currentTheme === 'dark' ? '25 88% 55%' : '207 70% 53%';
            root.style.setProperty('--primary', defaultPrimary);

            const defaultForeground = currentTheme === 'dark' ? '210 7% 60%' : '210 7% 40%';
            root.style.setProperty('--foreground', defaultForeground);

            document.body.style.fontWeight = '400';
            document.body.classList.remove('bold-emphasis', 'icon-fill-emphasis');
            root.style.setProperty('--font-weight-emphasis', '500');
            root.style.setProperty('--global-icon-weight', '400');
            root.style.setProperty('--global-icon-grade', '0');
            root.style.setProperty('--global-icon-optical-size', '24');
            root.style.setProperty('--global-icon-fill', '0');
            root.style.setProperty('--radius', '0.5rem');
        }
    }, [viewAsUser, theme, setTheme]);
    
    return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Strm Agile</title>
        <meta name="description" content="Task and Calendar Management for agile teams." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body", "antialiased")}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <UserProvider>
            <AppThemeManager>
              {children}
            </AppThemeManager>
            <Toaster />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

