import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
variable: "--font-geist-sans",
subsets: ["latin"],
});

const geistMono = Geist_Mono({
variable: "--font-geist-mono",
subsets: ["latin"],
});

export const metadata: Metadata = {
title: "Calorie AI",
description: "AI Health App",
};

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
<html lang="en">
<body
className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-blue-50 via-white to-green-50 text-black`}
>

{/* 🔥 HEADER */}
<header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">

<h1 className="text-xl font-bold">
Calorie AI
</h1>

<nav className="flex gap-4">

<Link href="/dashboard" className="px-3 py-1 rounded hover:bg-gray-100">
Dashboard
</Link>

<Link href="/scan" className="px-3 py-1 rounded hover:bg-gray-100">
Scan
</Link>

<Link href="/profile" className="px-3 py-1 rounded hover:bg-gray-100">
Profile
</Link>

</nav>

</header>

{/* PAGE CONTENT */}
<main className="p-6">
{children}
</main>

</body>
</html>
);
}