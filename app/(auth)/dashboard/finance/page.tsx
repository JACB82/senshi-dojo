"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

interface MonthlyReport {
  id: number;
  month: number;
  year: number;
  total: number;
}

export default function FinancePage() {
  const [currentTotal, setCurrentTotal] = useState(0);
  const [history, setHistory] = useState<MonthlyReport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const monthData = await apiFetch("/finance/month");
      const historyData = await apiFetch("/finance/history");

      setCurrentTotal(monthData.total || 0);
      setHistory(historyData);
    } catch (err: any) {
      toast.error("Error cargando datos financieros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCloseMonth = async () => {
    try {
      await apiFetch("/finance/close-month", {
        method: "POST",
      });

      toast.success("Mes cerrado correctamente");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Error cerrando mes");
    }
  };

  const getMonthName = (month: number) => {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril",
      "Mayo", "Junio", "Julio", "Agosto",
      "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return months[month - 1];
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <h1
        className="text-4xl font-bold text-white mb-6"
        style={{ fontFamily: "'Sawarabi Mincho', serif" }}
      >
        Finanzas
      </h1>

      {/* CARD INGRESO ACTUAL */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 mb-6 shadow-lg">
        <h2 className="text-xl text-zinc-400 mb-2">Ingresos del mes</h2>
        <p className="text-4xl font-bold text-green-400">
          ${currentTotal.toLocaleString()}
        </p>

        <button
          onClick={handleCloseMonth}
          className="mt-4 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl font-semibold transition-all"
        >
          Cerrar mes
        </button>
      </div>

      {/* HISTORIAL */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 shadow-lg">
        <h2 className="text-2xl text-white mb-4">Historial mensual</h2>

        {loading ? (
          <p className="text-white">Cargando...</p>
        ) : history.length === 0 ? (
          <p className="text-zinc-400">No hay registros aún</p>
        ) : (
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="px-4 py-2 text-left">Mes</th>
                <th className="px-4 py-2 text-left">Año</th>
                <th className="px-4 py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr
                  key={h.id}
                  className="border-b border-zinc-800 hover:bg-zinc-800 transition"
                >
                  <td className="px-4 py-2">{getMonthName(h.month)}</td>
                  <td className="px-4 py-2">{h.year}</td>
                  <td className="px-4 py-2 text-green-400">
                    ${h.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}