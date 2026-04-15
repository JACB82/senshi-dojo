// app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { Sword, Calendar, Award, UserPlus, ChevronDown, Image as ImageIcon } from "lucide-react";

export default function GuestPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center bg-[radial-gradient(at_center,#4f0000_0%,#000000_70%)]">
        <div className="absolute inset-0 bg-[url('/images/senshi-dojo-bg.jpg')] bg-cover bg-center opacity-40" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="flex justify-center mb-6">
            <div className="w-28 h-28 bg-red-600 rounded-full flex items-center justify-center border-4 border-yellow-500 shadow-2xl overflow-hidden">
              <img src="/images/senshi-dojo-logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold tracking-tighter mb-4">
            SENSHI <span className="text-red-500">DOJO</span>
          </h1>
          <p className="text-2xl md:text-3xl text-zinc-300 mb-8 font-light">
            Disciplina • Respeto • Honor
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/register")}
              className="bg-red-600 hover:bg-red-700 transition-all px-10 py-4 rounded-2xl text-lg font-semibold flex items-center justify-center gap-3 group"
            >
              <UserPlus className="group-hover:rotate-12 transition" />
              UNIRME AL DOJO
            </button>

            <button
              onClick={() => router.push("/login")}
              className="border border-zinc-400 hover:border-white transition-all px-10 py-4 rounded-2xl text-lg font-semibold"
            >
              Ya soy alumno
            </button>
          </div>
        </div>

        {/* Indicador de scroll elegante */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <p className="text-zinc-400 text-sm tracking-widest">DESCUBRE MÁS</p>
          <ChevronDown className="w-9 h-9 text-red-500" strokeWidth={3} />
        </div>
      </div>

      {/* Clase de Cortesía */}
      <div className="py-20 px-6 bg-zinc-900">
        <div className="max-w-5xl mx-auto text-center">
          <Calendar className="w-16 h-16 mx-auto mb-6 text-red-500" />
          <h2 className="text-4xl font-bold mb-4">Clase de Cortesía Gratis</h2>
          <p className="text-zinc-400 max-w-md mx-auto mb-10">
            Vive la experiencia real del dojo durante 60 minutos. Sin compromiso.
          </p>
          <button 
            onClick={() => router.push("/register")}
            className="bg-red-600 hover:bg-red-700 px-12 py-4 rounded-2xl text-xl font-semibold transition-all hover:scale-105"
          >
            Reservar Clase Gratuita
          </button>
        </div>
      </div>

      {/* Galería */}
      <div className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <ImageIcon className="w-10 h-10 text-red-500 inline mr-3" />
            <h2 className="text-4xl font-bold inline">Galería del Dojo</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65",
              "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c",
              "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
              "https://images.unsplash.com/photo-1517849845537-4d257902454a",
              "https://images.unsplash.com/photo-1584466977773-e625c9a8b3d3",
            ].map((img, i) => (
              <div key={i} className="group relative overflow-hidden rounded-3xl aspect-video bg-zinc-900">
                <img 
                  src={img} 
                  alt={`Galería ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-black py-24 text-center">
        <Award className="w-20 h-20 mx-auto mb-6 text-yellow-500" />
        <h2 className="text-5xl font-bold mb-6">¿Estás listo para comenzar tu camino?</h2>
        <p className="text-xl text-zinc-400 mb-10 max-w-md mx-auto">
          Únete a la familia Senshi Dojo y transforma tu disciplina y espíritu.
        </p>
        <button
          onClick={() => router.push("/register")}
          className="bg-red-600 hover:bg-red-700 px-16 py-5 rounded-2xl text-xl font-bold transition-all hover:scale-105"
        >
          EMPEZAR HOY
        </button>
      </div>
    </div>
  );
}