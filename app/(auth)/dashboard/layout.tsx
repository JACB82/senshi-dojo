"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LogOut, Users, Home, Calendar, DollarSign, Trophy, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isStudent, setIsStudent] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setIsStudent(payload.role === "student");
    } catch {}
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    toast.success("Sesión cerrada");
    router.push("/login");
  };

  if (isStudent) {
    return <div className="p-8">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">

      {/* SIDEBAR */}
      <aside className={`${collapsed ? "w-20" : "w-64"} bg-zinc-900 border-r border-red-900 p-4 flex flex-col transition-all`}>

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => router.push("/dashboard")}>
          <img src="/images/senshi-dojo-logo.png" className="w-12 h-12 rounded-xl border border-yellow-400" />
          {!collapsed && <span className="text-white font-bold">SENSHI</span>}
        </div>

        {/* NAV */}
        <nav className="flex-1 space-y-2">
          {[
            { icon: Home, label: "Dashboard", path: "/dashboard" },
            { icon: Users, label: "Estudiantes", path: "/dashboard/students" },
            { icon: Calendar, label: "Clases", path: "/dashboard/classes" },
            { icon: DollarSign, label: "Pagos", path: "/dashboard/payments" },
            { icon: Trophy, label: "Torneos", path: "/dashboard/tournaments" },
            { icon: ImageIcon, label: "Noticias", path: "/dashboard/news" },
            { icon: DollarSign, label: "Finanzas", path: "/dashboard/finance" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => router.push(item.path)}
              className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-zinc-800 transition"
            >
              <item.icon className="text-red-500" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* LOGOUT */}
        <button onClick={logout} className="mt-auto flex items-center gap-2 text-red-400 hover:text-red-500">
          <LogOut /> {!collapsed && "Salir"}
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}