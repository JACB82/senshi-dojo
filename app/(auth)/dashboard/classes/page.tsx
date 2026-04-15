// app/(auth)/dashboard/classes/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getClasses, getClassStudents, createClass } from "@/lib/api";
import { Calendar, Sword } from "lucide-react";
import { toast } from "sonner";

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [newClass, setNewClass] = useState({ name: "", description: "", date: "" });
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    fetchClasses();
    return () => clearTimeout(timer);
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await getClasses();
      setClasses(data);
    } catch (error) {
      toast.error("Error cargando clases");
    }
  };

  const handleSelectClass = async (cls: any) => {
    setSelectedClass(cls);
    try {
      const students = await getClassStudents(cls.id);
      setEnrolledStudents(students);
    } catch (error) {
      toast.error("Error cargando estudiantes inscritos");
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClass(newClass.name, newClass.description, newClass.date);
      toast.success("Clase creada correctamente");
      setNewClass({ name: "", description: "", date: "" });
      fetchClasses();
    } catch (error) {
      toast.error("Error al crear clase");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      <div className={`absolute inset-0 bg-[url('/images/senshi-dojo-bg.jpg')] bg-cover bg-center transition-opacity duration-1000 ${animate ? "opacity-90" : "opacity-60"}`} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/90 to-black" />

      <div className="relative z-10 p-8 max-w-7xl mx-auto pt-12">
        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 relative">
            <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-40 blur-xl"></div>
            <div className="relative w-full h-full bg-red-800 rounded-full flex items-center justify-center border-4 border-yellow-400 overflow-hidden">
              <img src="/images/senshi-dojo-logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-widest" style={{ fontFamily: "'Sawarabi Mincho', serif" }}>
            Gestión de Clases
          </h1>
        </div>

        {/* Crear Clase */}
        <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-700 rounded-3xl p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6">Crear Nueva Clase</h2>
          <form onSubmit={handleCreateClass} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Nombre de la clase" value={newClass.name} onChange={(e) => setNewClass({ ...newClass, name: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4" required />
            <input type="text" placeholder="Descripción" value={newClass.description} onChange={(e) => setNewClass({ ...newClass, description: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4" />
            <input type="date" value={newClass.date} onChange={(e) => setNewClass({ ...newClass, date: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4" required />
            <button type="submit" className="bg-red-600 hover:bg-red-700 py-4 rounded-2xl font-semibold">Crear Clase</button>
          </form>
        </div>

        {/* Lista de Clases y Estudiantes inscritos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {classes.map((cls) => (
            <div key={cls.id} onClick={() => handleSelectClass(cls)} className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-700 hover:border-red-500 rounded-3xl p-8 cursor-pointer transition-all">
              <h3 className="text-2xl font-semibold text-white">{cls.name}</h3>
              <p className="text-zinc-400 mt-3">{cls.description || "Clase de entrenamiento"}</p>
              <p className="text-red-400 text-sm mt-6">
                {new Date(cls.date).toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          ))}
        </div>

        {selectedClass && (
          <div className="mt-12 bg-zinc-900/90 backdrop-blur-xl border border-zinc-700 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Estudiantes inscritos en: {selectedClass.name}</h2>
            {enrolledStudents.length === 0 ? (
              <p className="text-zinc-400">No hay estudiantes inscritos aún</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {enrolledStudents.map((s) => (
                  <div key={s.id} className="bg-zinc-950 p-5 rounded-2xl text-center">
                    <p className="font-medium text-lg">{s.student.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}