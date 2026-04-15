"use client";

import { useRouter } from "next/navigation";


export default function HomePage() {
  const router = useRouter();
  

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
  
      <span className="text-zinc-400 text-sm mb-2">
        Desliza
      </span>
      
      <div className="animate-bounce">
        <svg
          className="w-8 h-8 text-red-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          viewBox="0 0 24 24"
        >

        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>

      </div>


</div>
        
        {/* Fondo */}
        <div className="absolute inset-0 bg-[url('/images/senshi-dojo-bg.jpg')] bg-cover bg-center opacity-40" />
        
        {/* Overlay negro */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Contenido */}
        <div className="relative z-10 text-center px-6">
          <h1 className="text-6xl font-bold tracking-widest mb-4">
            SENSHI DOJO
          </h1>

          <p className="text-zinc-300 text-lg mb-8">
            Disciplina. Fuerza. Honor.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/login")}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-semibold"
            >
              Iniciar Sesión
            </button>

            <button
              onClick={() => router.push("/register")}
              className="border border-zinc-600 hover:border-red-500 px-6 py-3 rounded-xl"
            >
              Registrarse
            </button>

          </div>
             <button
              type="button"
              onClick={() => router.push("/guest")}
              className="w-full py-3 rounded-xl font-medium text-zinc-400 hover:text-white transition-all hover:bg-zinc-800/50"
              >
              Entrar como invitado
            </button>
        </div>
      </section>

      {/* EVENTOS */}
      <section className="py-20 px-6">
        <h2 className="text-4xl text-center mb-12">Eventos del Dojo</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
            >
              <div className="h-48 bg-[url('/images/senshi-dojo-bg.jpg')] bg-cover" />
              <div className="p-4">
                <h3 className="text-xl mb-2">Torneo #{i}</h3>
                <p className="text-zinc-400 text-sm">
                  Evento de combate y exhibición.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TIENDA */}
      <section className="py-20 px-6 bg-zinc-900">
        <h2 className="text-4xl text-center mb-8">Tienda</h2>

        <div className="flex justify-center">
          <button
            onClick={() => router.push("/shop")}
            className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl text-lg"
          >
            Ver Productos
          </button>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="py-20 px-6">
        <h2 className="text-4xl text-center mb-8">Contacto</h2>

        <div className="max-w-xl mx-auto text-center text-zinc-400">
          <p>Email: akasenshikarate@gmail.com</p>
          <p>Tel: +57 311 2461986</p>
          <p>Ubicación: Cl. 161a #7f-55 Usaquén, Bogotá, D.C., Bogotá, Bogotá, D.C., Colombia</p>
        </div>
      </section>

    </div>
  );
}