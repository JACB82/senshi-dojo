// app/(auth)/dashboard/admin/create-admin/page.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { Sword, UserPlus, Shield } from "lucide-react";

export default function CreateAdminPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    setIsLoading(true);

    try {
      await apiFetch("/admin/create", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      toast.success("Administrador creado exitosamente", {
        description: "El nuevo admin puede iniciar sesión ahora",
      });

      // Limpiar formulario
      setName("");
      setEmail("");
      setPassword("");

    } catch (err: any) {
      toast.error(err.message || "Error al crear el administrador");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-10 w-full max-w-md shadow-2xl">
        
        {/* Icono y Título */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center border-4 border-yellow-500 mb-4">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white text-center">Crear Administrador</h1>
          <p className="text-zinc-400 text-center mt-2">Acceso restringido al equipo directivo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-zinc-400 text-sm block mb-2">Nombre completo</label>
            <input
              type="text"
              placeholder="Nombre del administrador"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white focus:border-red-500 outline-none placeholder-zinc-500"
              required
            />
          </div>

          <div>
            <label className="text-zinc-400 text-sm block mb-2">Correo electrónico</label>
            <input
              type="email"
              placeholder="admin@senshidojo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white focus:border-red-500 outline-none placeholder-zinc-500"
              required
            />
          </div>

          <div>
            <label className="text-zinc-400 text-sm block mb-2">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white focus:border-red-500 outline-none placeholder-zinc-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-3 mt-4"
          >
            <UserPlus size={24} />
            {isLoading ? "Creando Administrador..." : "Crear Administrador"}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500 mt-8">
          Esta acción solo debe realizarse por el dueño del Dojo
        </p>
      </div>
    </div>
  );
}