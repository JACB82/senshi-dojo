"use client";

import { useEffect, useState } from "react";
import { getClasses, enrollStudent } from "@/lib/api";
import { Calendar, UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function StudentDashboard() {
  const [classes, setClasses] = useState<any[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchClasses();

    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.userId); // 🔥 FIX REAL
    }
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await getClasses();
      setClasses(data);
    } catch {
      toast.error("Error cargando clases");
    }
  };

  const handleEnroll = async (class_id: number) => {
    if (!userId) return toast.error("Usuario no identificado");

    try {
      await enrollStudent(userId, class_id);
      toast.success("¡Inscripción exitosa!");
    } catch {
      toast.error("Error al inscribirte");
    }
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl mb-8">Clases disponibles</h1>

      <div className="grid gap-4">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-zinc-900 p-6 rounded-xl">
            <h2 className="text-xl">{cls.name}</h2>

            <button
              onClick={() => handleEnroll(cls.id)}
              className="mt-4 bg-red-600 px-4 py-2 rounded"
            >
              <UserPlus size={18} /> Inscribirme
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}