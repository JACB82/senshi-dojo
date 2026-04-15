"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch, getStudents } from "@/lib/api";

interface Student {
  id: number;
  name: string;
  age: number;
  belt: string;
  created_at: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStudent, setNewStudent] = useState({ name: "", age: "", belt: "blanco" });

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err: any) {
      toast.error("Error al cargar estudiantes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const student = await apiFetch("/students", {
        method: "POST",
        body: JSON.stringify({ ...newStudent, age: Number(newStudent.age) }),
      });
      toast.success("Alumno creado");
      setStudents([...students, student]);
      setNewStudent({ name: "", age: "", belt: "blanco" });
    } catch (err: any) {
      toast.error(err.message || "Error al crear alumno");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-6 relative">
      <h1 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: "'Sawarabi Mincho', serif" }}>
        Estudiantes
      </h1>

      {/* Formulario Crear */}
      <div className="bg-zinc-900/90 border border-zinc-700 rounded-3xl p-6 mb-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-white mb-4" style={{ fontFamily: "'Sawarabi Mincho', serif" }}>
          Crear Alumno
        </h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none placeholder-zinc-400"
            required
          />
          <input
            type="number"
            placeholder="Edad"
            value={newStudent.age}
            onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none placeholder-zinc-400"
            required
          />

          {/* 🔥 ACTUALIZACIÓN REAL DE CINTURONES */}
          <select
            value={newStudent.belt}
            onChange={(e) => setNewStudent({ ...newStudent, belt: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none"
          >
            <option value="blanco">Blanco</option>
            <option value="blanco_amarillo">Blanco-Amarillo</option>
            <option value="amarillo">Amarillo</option>
            <option value="amarillo_naranja">Amarillo-Naranja</option>
            <option value="naranja">Naranja</option>
            <option value="naranja_verde">Naranja-Verde</option>
            <option value="verde">Verde</option>
            <option value="verde_azul">Verde-Azul</option>
            <option value="azul">Azul</option>
            <option value="azul_marron">Azul-Marrón</option>
            <option value="marron">Marrón</option>
            <option value="negro">Negro</option>
          </select>

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold text-lg transition-all shadow-md hover:shadow-yellow-400 hover:shadow-lg"
          >
            Crear Alumno
          </button>
        </form>
      </div>

      {/* Lista de estudiantes */}
      <div className="bg-zinc-900/90 border border-zinc-700 rounded-3xl p-6 shadow-lg overflow-x-auto">
        {loading ? (
          <div className="text-white">Cargando...</div>
        ) : (
          <table className="w-full text-left text-white">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Edad</th>
                <th className="px-4 py-2">Cinturón</th>
                <th className="px-4 py-2">Registrado</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-zinc-800 hover:bg-zinc-800 transition-colors">
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.age}</td>
                  <td className="px-4 py-2 capitalize">{s.belt.replaceAll("_", " ")}</td>
                  <td className="px-4 py-2">{new Date(s.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}