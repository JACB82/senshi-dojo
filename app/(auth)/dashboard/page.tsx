"use client";

import { useEffect, useState } from "react";
import { getStudents, getClasses } from "@/lib/api";
import { Users, Calendar, DollarSign, Trophy, UserCog, Eye } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    loadDashboardData();
    return () => clearTimeout(timer);
  }, []);

  const loadDashboardData = async () => {
    try {
      const studentsData = await getStudents();
      const classesData = await getClasses();

      setStudents(studentsData || []);
      setClasses(classesData || []);

      let income = 0;
      studentsData.forEach((s: any) => {
        s.payments?.forEach((p: any) => {
          income += Number(p.amount) || 0;
        });
      });

      setTotalIncome(income);
    } catch {
      toast.error("Error cargando dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">

      {/* Fondo DOJO */}
      <div className={`absolute inset-0 bg-[url('/images/senshi-dojo-bg.jpg')] bg-cover bg-center transition-opacity duration-1000 ${animate ? "opacity-90" : "opacity-60"}`} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/90 to-black" />

      <div className="relative z-10 p-8 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className={`flex justify-between items-center mb-14 transition-all duration-1000 ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 relative">
              <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-40 rounded-full"></div>
              <img src="/images/senshi-dojo-logo.png" className="relative rounded-full border-4 border-yellow-400" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white tracking-widest">SENSHI DOJO</h1>
              <p className="text-red-400">Panel del Maestro</p>
            </div>
          </div>

          <a href="/dashboard/admin/create-admin" className="bg-red-700 hover:bg-red-800 px-6 py-3 rounded-xl flex items-center gap-2">
            <UserCog /> Crear Admin
          </a>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "GUERREROS", value: students.length, icon: Users },
            { label: "CLASES", value: classes.length, icon: Calendar },
            { label: "INGRESOS", value: `$${totalIncome}`, icon: DollarSign },
            { label: "TORNEOS", value: "-", icon: Trophy },
          ].map((item, i) => (
            <div key={i} className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6 hover:border-red-500 transition">
              <div className="flex justify-between">
                <div>
                  <p className="text-red-400 text-sm">{item.label}</p>
                  <h2 className="text-3xl font-bold">{item.value}</h2>
                </div>
                <item.icon className="text-red-500" size={40} />
              </div>
            </div>
          ))}
        </div>

        {/* LISTA */}
        <div className="mt-10 bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Últimos Guerreros</h2>
            <a href="/dashboard/students" className="text-red-400 flex items-center gap-1">
              Ver <Eye size={18} />
            </a>
          </div>

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div className="space-y-3">
              {students.slice(0, 5).map((s: any) => (
                <div key={s.id} className="flex justify-between bg-zinc-950 p-4 rounded-xl border border-zinc-800 hover:border-red-500">
                  <div>
                    <p>{s.name}</p>
                    <p className="text-sm text-zinc-400">Cinturón {s.belt}</p>
                  </div>
                  <span className="text-sm text-zinc-500">
                    {new Date(s.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}