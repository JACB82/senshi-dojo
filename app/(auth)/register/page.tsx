// app/register/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      // 🔐 NO se envía role
      await registerUser(name, email, password);

      toast.success("¡Registro exitoso! Ahora puedes iniciar sesión");

      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      toast.error(err.message || "Error al registrar usuario");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-zinc-950">
      
      {/* Fondo animado */}
      <div
        className={`absolute inset-0 bg-[url('/images/senshi-dojo-bg.jpg')] bg-cover bg-center transition-all duration-1000 ease-out ${
          animate ? "opacity-100 scale-100" : "opacity-90 scale-105"
        }`}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />

      <div className="relative z-10 w-full max-w-md px-6">
        
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="mx-auto w-24 h-24 relative mb-4">
            <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-40 blur-xl"></div>
            <div className="relative w-full h-full bg-red-800 rounded-full flex items-center justify-center border-4 border-yellow-400 overflow-hidden">
              <img
                src="/images/senshi-dojo-logo.png"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-white tracking-widest" style={{ fontFamily: "'Sawarabi Mincho', serif" }}>
            SENSHI DOJO
          </h1>
          <p className="text-red-400 mt-1 text-lg" style={{ fontFamily: "'Sawarabi Mincho', serif" }}>
            Camino del Guerrero
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900/90 border border-zinc-700 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-semibold text-white text-center mb-6">
            Crear Cuenta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-5 py-3.5 text-white focus:border-red-500 outline-none"
              required
            />

            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-5 py-3.5 text-white focus:border-red-500 outline-none"
              required
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-5 py-3.5 text-white focus:border-red-500 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar contraseña"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-5 py-3.5 text-white focus:border-red-500 outline-none"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 py-4 rounded-2xl font-semibold text-lg transition-all shadow-md hover:shadow-yellow-400 hover:shadow-lg"
            >
              {isLoading ? "Creando cuenta..." : "REGISTRARSE"}
            </button>

          </form>
        </div>

        <p className="text-center text-zinc-400 text-sm mt-8">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-red-400 hover:underline">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
}