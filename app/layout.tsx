import "./globals.css";

export const metadata = {
  title: "CalorieAI",
  description: "Track your fitness with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
<body className="m-0 p-0 min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 text-black">
        {children}
      </body>
    </html>
  );
}