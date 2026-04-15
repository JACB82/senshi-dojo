"use client";

export default function DashboardLayout({ title, children }: any) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <h1 className="text-4xl mb-6">{title}</h1>
      {children}
    </div>
  );
}