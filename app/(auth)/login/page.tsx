// app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Sword } from "lucide-react";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);
    console.log("🔄 Intentando login con:", { email });

    try {
      // Añadimos timeout de 8 segundos
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Tiempo de espera agotado - El backend no responde")), 8000)
      );

      const data = await Promise.race([loginUser(email, password), timeoutPromise]);

      console.log("✅ Respuesta recibida:", data);

      if (!data.token) {
        toast.error("No se recibió token del servidor");
        return;
      }

      localStorage.setItem("token", data.token);
      toast.success("¡Bienvenido de nuevo al Dojo! 🥋");

      const payload = JSON.parse(atob(data.token.split(".")[1]));
      
      if (payload.role === "admin") router.push("/dashboard");
      else if (payload.role === "instructor") router.push("/dashboard/instructor");
      else router.push("/dashboard/student");

    } catch (err: any) {
      console.error("❌ Error en login:", err);
      if (err.message.includes("Tiempo de espera")) {
        toast.error("El servidor no responde. Verifica que el backend esté corriendo en http://localhost:3001");
      } else {
        toast.error(err.message || "Usuario o contraseña incorrectos");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-zinc-950">
      <div className={`absolute inset-0 bg-[url('/images/senshi-dojo-bg.jpg')] bg-cover bg-center transition-opacity duration-1000 ${animate ? "opacity-100" : "opacity-90"}`} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className={`text-center mb-10 transition-all duration-1000 ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>
          <div className="mx-auto w-24 h-24 relative mb-4">
            <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-40 blur-xl animate-pulse"></div>
            <div className="relative w-full h-full bg-red-800 rounded-full flex items-center justify-center border-4 border-yellow-400 overflow-hidden">
              <img src="/images/senshi-dojo-logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-white tracking-widest" style={{ fontFamily: "'Sawarabi Mincho', serif" }}>
            SENSHI DOJO
          </h1>
          <p className="text-red-400 mt-1 text-lg" style={{ fontFamily: "'Sawarabi Mincho', serif" }}>
            Camino del Guerrero
          </p>
        </div>

        <div className={`bg-zinc-900/90 border border-zinc-700 rounded-3xl p-8 shadow-lg transition-all duration-1000 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h2 className="text-3xl font-semibold text-white text-center mb-6">Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 py-3.5 rounded-xl font-semibold text-lg transition-all mt-2"
            >
              {isLoading ? "Entrando al Dojo..." : "INICIAR SESIÓN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}