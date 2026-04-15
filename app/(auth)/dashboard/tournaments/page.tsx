"use client";

import { useEffect, useState } from "react";
import {
  getTournaments,
  createTournament,
  createMatch,
  setMatchWinner,
  getStudents
} from "@/lib/api";
import { toast } from "sonner";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const [selectedTournament, setSelectedTournament] = useState<number | null>(null);
  const [player1, setPlayer1] = useState<number | null>(null);
  const [player2, setPlayer2] = useState<number | null>(null);

  const [winners, setWinners] = useState<Record<number, number>>({});

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [tournamentsData, studentsData] = await Promise.all([
        getTournaments(),
        getStudents(),
      ]);

      setTournaments(tournamentsData);
      setStudents(studentsData);
    } catch {
      toast.error("Error cargando datos");
    }
  };

  // ===== CREAR TORNEO =====
  const handleCreateTournament = async () => {
    if (!name || !date) return toast.error("Completa todos los campos");

    try {
      // 🔥 FIX ISO DATE
      const isoDate = new Date(date).toISOString();

      await createTournament(name, isoDate);

      toast.success("Torneo creado");
      setName("");
      setDate("");
      fetchAll();
    } catch {
      toast.error("Error creando torneo");
    }
  };

  // ===== CREAR MATCH =====
  const handleCreateMatch = async () => {
    if (!selectedTournament || !player1 || !player2)
      return toast.error("Completa todos los campos");

    if (player1 === player2)
      return toast.error("Un jugador no puede pelear contra sí mismo");

    try {
      await createMatch(selectedTournament, player1, player2);
      toast.success("Pelea creada");

      setPlayer1(null);
      setPlayer2(null);

      fetchAll();
    } catch {
      toast.error("Error creando pelea");
    }
  };

  // ===== DEFINIR GANADOR =====
  const handleDefineWinner = async (matchId: number) => {
    const winnerId = winners[matchId];

    if (!winnerId) return toast.error("Selecciona un ganador");

    try {
      await setMatchWinner(matchId, winnerId);

      toast.success("Ganador definido");

      setWinners((prev) => {
        const copy = { ...prev };
        delete copy[matchId];
        return copy;
      });

      fetchAll();
    } catch {
      toast.error("Error definiendo ganador");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-white">
      <h1 className="text-4xl font-bold mb-10">🏆 Torneos</h1>

      {/* CREAR TORNEO */}
      <div className="bg-zinc-900 p-6 rounded-xl mb-10">
        <h2 className="text-xl mb-4">Crear torneo</h2>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-zinc-800 px-4 py-2 rounded"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-zinc-800 px-4 py-2 rounded"
          />

          <button
            onClick={handleCreateTournament}
            className="bg-red-600 px-6 py-2 rounded"
          >
            Crear
          </button>
        </div>
      </div>

      {/* LISTA */}
      {tournaments.map((t) => (
        <div key={t.id} className="bg-zinc-900 p-6 rounded-xl mb-6">
          <h3 className="text-xl mb-4">
            {t.name} - {new Date(t.date).toLocaleDateString()}
          </h3>

          {/* CREAR MATCH */}
          <div className="flex gap-4 mb-4">
            <select
              onChange={(e) => setSelectedTournament(t.id)}
              className="bg-zinc-800 px-3 py-2 rounded"
            >
              <option>Seleccionar torneo</option>
              <option value={t.id}>{t.name}</option>
            </select>

            <select
              value={player1 || ""}
              onChange={(e) => setPlayer1(Number(e.target.value))}
              className="bg-zinc-800 px-3 py-2 rounded"
            >
              <option value="">Jugador 1</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              value={player2 || ""}
              onChange={(e) => setPlayer2(Number(e.target.value))}
              className="bg-zinc-800 px-3 py-2 rounded"
            >
              <option value="">Jugador 2</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleCreateMatch}
              className="bg-red-600 px-6 py-2 rounded"
            >
              Crear pelea
            </button>
          </div>

          {/* MATCHES */}
          {t.matches?.map((m: any) => (
            <div key={m.id} className="flex items-center gap-4 mb-2">
              <span>{m.player1.name}</span>
              <span>vs</span>
              <span>{m.player2.name}</span>
              <span>→</span>
              <span>{m.winner?.name || "Sin ganador"}</span>

              <select
                value={winners[m.id] || ""}
                onChange={(e) =>
                  setWinners({
                    ...winners,
                    [m.id]: Number(e.target.value),
                  })
                }
                className="bg-zinc-800 px-2 py-1 rounded"
              >
                <option value="">Elegir ganador</option>
                <option value={m.player1.id}>{m.player1.name}</option>
                <option value={m.player2.id}>{m.player2.name}</option>
              </select>

              <button
                onClick={() => handleDefineWinner(m.id)}
                className="bg-green-600 px-3 py-1 rounded"
              >
                Guardar
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}