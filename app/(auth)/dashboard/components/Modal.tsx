// app/(auth)/dashboard/components/Modal.tsx
"use client";

import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900/95 p-6 rounded-3xl w-full max-w-md border border-zinc-700">
        {children}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}