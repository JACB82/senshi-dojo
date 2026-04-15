// app/lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// ==================== TOKEN UTILS ====================
export function getToken() {
  return typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("guest");
  }
}

// ==================== CORE FETCH ====================
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text || `Error ${res.status}` };
    }

    if (!res.ok) {
      throw new Error(data.error || data.message || `Error ${res.status}`);
    }

    return data;

  } catch (error: any) {
    console.error(`API Error (${endpoint}):`, error.message);
    throw error;
  }
}

// ==================== AUTH ====================

// 🔒 SIN ROLE (seguro)
export const registerUser = (
  name: string,
  email: string,
  password: string
) =>
  apiFetch("/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

export const loginUser = (email: string, password: string) =>
  apiFetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

// ==================== STUDENTS ====================
export const getStudents = () => apiFetch("/students");

// ==================== CLASSES ====================
export const getClasses = () => apiFetch("/classes");

export const createClass = (
  name: string,
  description: string,
  date: string
) =>
  apiFetch("/classes", {
    method: "POST",
    body: JSON.stringify({ name, description, date }),
  });

// ==================== ENROLL ====================
export const enrollStudent = (
  student_id: number,
  class_id: number
) =>
  apiFetch("/enroll", {
    method: "POST",
    body: JSON.stringify({ student_id, class_id }),
  });

export const getClassStudents = (class_id: number) =>
  apiFetch(`/classes/${class_id}/students`);

// ==================== PAYMENTS ====================
export const createPayment = (
  student_id: number,
  amount: number
) =>
  apiFetch("/payments", {
    method: "POST",
    body: JSON.stringify({ student_id, amount }),
  });

export const getStudentPayments = (student_id: number) =>
  apiFetch(`/students/${student_id}/payments`);

// ==================== TOURNAMENTS ====================
export const getTournaments = () => apiFetch("/tournaments");

export const createTournament = (
  name: string,
  date: string
) =>
  apiFetch("/tournaments", {
    method: "POST",
    body: JSON.stringify({ name, date }),
  });

// ==================== MATCHES ====================
export const createMatch = (
  tournament_id: number,
  player1_id: number,
  player2_id: number
) =>
  apiFetch("/matches", {
    method: "POST",
    body: JSON.stringify({ tournament_id, player1_id, player2_id }),
  });

export const setMatchWinner = (
  match_id: number,
  winner_id: number
) =>
  apiFetch(`/matches/${match_id}/winner`, {
    method: "POST",
    body: JSON.stringify({ winner_id }),
  });