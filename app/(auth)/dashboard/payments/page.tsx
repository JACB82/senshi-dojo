// app/(auth)/dashboard/payments/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getStudents, getStudentPayments, createPayment } from "@/lib/api";
import { DollarSign, Sword } from "lucide-react";
import { toast } from "sonner";

export default function PaymentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    fetchStudents();
    return () => clearTimeout(timer);
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      toast.error("Error cargando estudiantes");
    }
  };

  const handleStudentChange = async (id: string) => {
    const student = students.find((s) => s.id === Number(id)) || null;
    setSelectedStudent(student);
    if (student) {
      try {
        const data = await getStudentPayments(student.id);
        setPayments(data);
      } catch (error) {
        toast.error("Error cargando pagos");
      }
    }
  };

  const handleAddPayment = async () => {
    if (!selectedStudent || !amount) return toast.error("Ingresa un monto");
    try {
      await createPayment(selectedStudent.id, parseFloat(amount));
      toast.success("Pago registrado correctamente");
      setAmount("");
      const data = await getStudentPayments(selectedStudent.id);
      setPayments(data);
    } catch (error) {
      toast.error("Error registrando pago");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      <div className={`absolute inset-0 bg-[url('/images/senshi-dojo-bg.jpg')] bg-cover bg-center transition-opacity duration-1000 ${animate ? "opacity-90" : "opacity-60"}`} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/90 to-black" />

      <div className="relative z-10 p-8 max-w-7xl mx-auto pt-12">
        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 relative">
            <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-40 blur-xl"></div>
            <div className="relative w-full h-full bg-red-800 rounded-full flex items-center justify-center border-4 border-yellow-400 overflow-hidden">
              <img src="/images/senshi-dojo-logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-widest" style={{ fontFamily: "'Sawarabi Mincho', serif" }}>
            Gestión de Pagos
          </h1>
        </div>

        <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-700 rounded-3xl p-8">
          <select
            value={selectedStudent?.id || ""}
            onChange={(e) => handleStudentChange(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white focus:border-red-500 outline-none mb-6"
          >
            <option value="">Selecciona un estudiante</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {selectedStudent && (
            <div>
              <div className="flex gap-4 mb-8">
                <input
                  type="number"
                  placeholder="Monto del pago"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-white focus:border-red-500 outline-none"
                />
                <button onClick={handleAddPayment} className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-2xl font-semibold">Registrar Pago</button>
              </div>

              <h2 className="text-2xl font-semibold mb-6">Historial de Pagos</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-white">
                  <thead>
                    <tr className="border-b border-zinc-700">
                      <th className="px-4 py-3">Monto</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-b border-zinc-800 hover:bg-zinc-800 transition-colors">
                        <td className="px-4 py-3">${p.amount}</td>
                        <td className="px-4 py-3">{p.status}</td>
                        <td className="px-4 py-3">{new Date(p.created_at).toLocaleDateString('es-ES')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}