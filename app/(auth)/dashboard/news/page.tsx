// app/(auth)/dashboard/news/page.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { Sword, Image as ImageIcon, Plus } from "lucide-react";

export default function NewsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      toast.error("Título e imagen son obligatorios");
      return;
    }

    setIsLoading(true);

    try {
      await apiFetch("/news", {
        method: "POST",
        body: JSON.stringify({ title, description, imageUrl }),
      });

      toast.success("Noticia publicada correctamente");
      setTitle("");
      setDescription("");
      setImageUrl("");
    } catch (err: any) {
      toast.error(err.message || "Error al publicar noticia");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/senshi-dojo-bg.jpg')] bg-cover bg-center opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/95 to-black" />

      <div className="relative z-10 p-8 max-w-4xl mx-auto pt-12">
        <div className="flex items-center gap-6 mb-12">
          <Sword className="w-12 h-12 text-red-500" />
          <h1 className="text-5xl font-bold text-white tracking-widest">Noticias del Dojo</h1>
        </div>

        <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-700 rounded-3xl p-10">
          <h2 className="text-3xl font-semibold mb-8">Publicar Nueva Noticia</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Título de la noticia"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white focus:border-red-500 outline-none"
              required
            />

            <textarea
              placeholder="Descripción (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white focus:border-red-500 outline-none h-32 resize-none"
            />

            <input
              type="text"
              placeholder="URL de la imagen"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white focus:border-red-500 outline-none"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all"
            >
              <ImageIcon size={24} />
              {isLoading ? "Publicando..." : "Publicar Noticia"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}