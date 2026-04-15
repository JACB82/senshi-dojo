"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch, getStudents } from "@/lib/api";

interface Class {
  id: number;
  name: string;
  date: string;
}

interface Student {
  id: number;
  name: string;
  attendance?: "present" | "absent";
}

export default function AttendancePage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar clases
  const fetchClasses = async () => {
    try {
      const data = await apiFetch("/classes");
      setClasses(data);
    } catch (err: any) {
      toast.error("Error cargando clases");
    }
  };

  // Cargar estudiantes inscritos en la clase
  const fetchStudents = async (classId: number) => {
    setLoading(true);
    try {
      const data: Student[] = await apiFetch(`/classes/${classId}/students`);
      setStudents(
        data.map((s) => ({ ...s, attendance: "absent" })) // por defecto absent
      );
    } catch (err: any) {
      toast.error("Error cargando estudiantes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Cambiar clase seleccionada
  const handleClassChange = (classId: string) => {
    const cls = classes.find((c) => c.id === Number(classId)) || null;
    setSelectedClass(cls);
    if (cls) fetchStudents(cls.id);
  };

  // Marcar asistencia
  const toggleAttendance = (studentId: number) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, attendance: s.attendance === "present" ? "absent" : "present" }
          : s
      )
    );
  };

  // Guardar asistencia
  const handleSave = async () => {
    if (!selectedClass) return;
    try {
      await apiFetch(`/classes/${selectedClass.id}/attendance`, {
        method: "POST",
        body: JSON.stringify({
          attendance: students.map((s) => ({
            student_id: s.id,
            status: s.attendance,
          })),
        }),
      });
      toast.success("Asistencia guardada");
    } catch (err: any) {
      toast.error(err.message || "Error guardando asistencia");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-6 relative">
      <h1 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: "'Sawarabi Mincho', serif" }}>
        Asistencia de Clases
      </h1>

      {/* Seleccionar Clase */}
      <div className="bg-zinc-900/90 border border-zinc-700 rounded-3xl p-6 mb-8 shadow-lg">
        <select
          value={selectedClass?.id || ""}
          onChange={(e) => handleClassChange(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none w-full"
        >
          <option value="">Selecciona una clase</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} - {new Date(c.date).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de Estudiantes */}
      {selectedClass && (
        <div className="bg-zinc-900/90 border border-zinc-700 rounded-3xl p-6 shadow-lg overflow-x-auto">
          {loading ? (
            <div className="text-white">Cargando estudiantes...</div>
          ) : (
            <>
              <table className="w-full text-left text-white">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="px-4 py-2">Estudiante</th>
                    <th className="px-4 py-2">Asistencia</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-b border-zinc-800 hover:bg-zinc-800 transition-colors">
                      <td className="px-4 py-2">{s.name}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => toggleAttendance(s.id)}
                          className={`px-3 py-1 rounded-full font-semibold ${
                            s.attendance === "present"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-red-600 hover:bg-red-700"
                          } transition-all`}
                        >
                          {s.attendance === "present" ? "Presente" : "Ausente"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={handleSave}
                className="mt-6 bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold text-lg transition-all shadow-md hover:shadow-yellow-400 hover:shadow-lg w-full"
              >
                Guardar Asistencia
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}