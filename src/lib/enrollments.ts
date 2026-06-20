// Demo enrollment store backed by localStorage. No backend.
export type PaymentStatus = "pendente" | "confirmado";

export type Enrollment = {
  id: string;
  reference: string;
  courseId: string;
  courseTitle: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  payment: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
};

const KEY = "ov_enrollments";

function read(): Enrollment[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(list: Enrollment[]) {
  window.localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("ov:enrollments"));
}

export function listEnrollments(): Enrollment[] {
  return read().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getEnrollment(reference: string): Enrollment | undefined {
  return read().find((e) => e.reference === reference);
}

export function makeReference(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  const stamp = Date.now().toString(36).slice(-4).toUpperCase();
  return `${prefix}-${stamp}${rand}`;
}

export function addEnrollment(
  data: Omit<Enrollment, "id" | "status" | "createdAt">,
): Enrollment {
  const list = read();
  const enrollment: Enrollment = {
    ...data,
    id: crypto.randomUUID(),
    status: "pendente",
    createdAt: new Date().toISOString(),
  };
  list.push(enrollment);
  write(list);
  return enrollment;
}

export function setStatus(reference: string, status: PaymentStatus) {
  const list = read();
  const found = list.find((e) => e.reference === reference);
  if (found) {
    found.status = status;
    write(list);
  }
}

export function toCSV(rows: Enrollment[]): string {
  const headers = [
    "Referência", "Curso", "Nome", "Email", "Telefone",
    "Pagamento", "Valor", "Status", "Data",
  ];
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [r.reference, r.courseTitle, r.name, r.email, r.phone, r.payment, r.amount, r.status, r.createdAt]
      .map(esc)
      .join(","),
  );
  return [headers.map(esc).join(","), ...lines].join("\n");
}
