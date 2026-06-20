export type Course = {
  id: string;
  title: string;
  category: string;
  level: "Iniciante" | "Intermédio" | "Avançado";
  instructor: string;
  lessons: number;
  hours: number;
  rating: number;
  students: number;
  price: number;
  progress?: number;
  color: string;
  summary: string;
  startDate: string;
  bank: BankDetails;
};

export type BankDetails = {
  bankName: string;
  accountHolder: string;
  iban: string;
  account: string;
  reference: string;
};

export const courses: Course[] = [
  {
    id: "ia-fundamentos",
    title: "Fundamentos de Inteligência Artificial",
    category: "Inteligência Artificial",
    level: "Iniciante",
    instructor: "Dra. Mariana Lopes",
    lessons: 42,
    hours: 18,
    rating: 4.9,
    students: 3120,
    price: 45000,
    progress: 68,
    color: "from-amber-400 to-orange-600",
    summary:
      "Domine os conceitos centrais de IA, machine learning e redes neuronais com projetos práticos.",
    startDate: "2026-07-15T09:00:00",
    bank: {
      bankName: "Banco BAI",
      accountHolder: "OpenVision Academy — IA",
      iban: "AO06 0040 0000 1234 5678 9011 2",
      account: "123456789011",
      reference: "IA-FUND",
    },
  },
  {
    id: "react-pro",
    title: "Engenharia Frontend com React 19",
    category: "Engenharia de Software",
    level: "Intermédio",
    instructor: "Eng. Paulo Cardoso",
    lessons: 56,
    hours: 24,
    rating: 4.8,
    students: 2480,
    price: 52000,
    progress: 34,
    color: "from-orange-400 to-red-600",
    summary:
      "Construa interfaces modernas, performáticas e acessíveis com React, TypeScript e boas práticas.",
    startDate: "2026-07-20T18:00:00",
    bank: {
      bankName: "Banco BIC",
      accountHolder: "OpenVision Academy — Software",
      iban: "AO06 0051 0000 2345 6789 0122 3",
      account: "234567890122",
      reference: "REACT-PRO",
    },
  },
  {
    id: "cloud-aws",
    title: "Cloud Computing & DevOps",
    category: "Cloud Computing",
    level: "Avançado",
    instructor: "Eng. Sara Mendes",
    lessons: 38,
    hours: 20,
    rating: 4.7,
    students: 1890,
    price: 60000,
    progress: 12,
    color: "from-amber-500 to-orange-700",
    summary:
      "Arquiteturas escaláveis, CI/CD, containers e infraestrutura como código na cloud.",
    startDate: "2026-08-03T09:00:00",
    bank: {
      bankName: "Banco Atlântico",
      accountHolder: "OpenVision Academy — Cloud",
      iban: "AO06 0055 0000 3456 7890 1233 4",
      account: "345678901233",
      reference: "CLOUD-AWS",
    },
  },
  {
    id: "ciberseguranca",
    title: "Cibersegurança Essencial",
    category: "Cibersegurança",
    level: "Intermédio",
    instructor: "Eng. Hélder Nunes",
    lessons: 44,
    hours: 22,
    rating: 4.9,
    students: 2010,
    price: 55000,
    color: "from-red-400 to-orange-600",
    summary:
      "Proteja sistemas, aprenda ethical hacking e implemente defesa em profundidade.",
    startDate: "2026-07-28T18:00:00",
    bank: {
      bankName: "Banco BFA",
      accountHolder: "OpenVision Academy — Cyber",
      iban: "AO06 0006 0000 4567 8901 2344 5",
      account: "456789012344",
      reference: "CYBER-ESS",
    },
  },
  {
    id: "data-science",
    title: "Data Science & Analytics",
    category: "Dados",
    level: "Intermédio",
    instructor: "Dra. Inês Bumba",
    lessons: 50,
    hours: 26,
    rating: 4.8,
    students: 1620,
    price: 58000,
    color: "from-orange-300 to-red-500",
    summary:
      "Análise de dados, visualização e modelos preditivos com Python e ferramentas modernas.",
    startDate: "2026-08-10T09:00:00",
    bank: {
      bankName: "Banco Sol",
      accountHolder: "OpenVision Academy — Dados",
      iban: "AO06 0044 0000 5678 9012 3455 6",
      account: "567890123455",
      reference: "DATA-SCI",
    },
  },
  {
    id: "empreendedorismo",
    title: "Empreendedorismo Digital",
    category: "Negócios",
    level: "Iniciante",
    instructor: "Dr. Júlio Afonso",
    lessons: 30,
    hours: 12,
    rating: 4.6,
    students: 2750,
    price: 38000,
    color: "from-amber-400 to-orange-500",
    summary:
      "Transforme ideias em negócios escaláveis com estratégia, produto e crescimento.",
    startDate: "2026-07-18T18:00:00",
    bank: {
      bankName: "Banco Keve",
      accountHolder: "OpenVision Academy — Negócios",
      iban: "AO06 0049 0000 6789 0123 4566 7",
      account: "678901234566",
      reference: "EMP-DIG",
    },
  },
];

export const enrolledCourses = courses.filter((c) => c.progress !== undefined);

export const studentStats = [
  { label: "Cursos ativos", value: "3" },
  { label: "Horas estudadas", value: "47h" },
  { label: "Certificados", value: "2" },
  { label: "Sequência", value: "12 dias" },
];

export const upcomingEvents = [
  { title: "Live: Redes Neuronais na prática", date: "Hoje, 18:00", tag: "IA" },
  { title: "Entrega: Projeto React", date: "Amanhã, 23:59", tag: "Frontend" },
  { title: "Quiz: Segurança de Redes", date: "Sex, 10:00", tag: "Cyber" },
];

export const certificates = [
  {
    code: "OV-2026-AX91KD",
    course: "Fundamentos de Inteligência Artificial",
    student: "Ana Domingos",
    instructor: "Dra. Mariana Lopes",
    date: "12 Mar 2026",
  },
  {
    code: "OV-2026-Q7M3PL",
    course: "Empreendedorismo Digital",
    student: "Ana Domingos",
    instructor: "Dr. Júlio Afonso",
    date: "28 Jan 2026",
  },
];

export const instructorCourses = [
  { title: "Fundamentos de IA", students: 3120, rating: 4.9, status: "Publicado", revenue: 14040000 },
  { title: "Deep Learning Avançado", students: 980, rating: 4.8, status: "Publicado", revenue: 5880000 },
  { title: "Visão Computacional", students: 0, rating: 0, status: "Rascunho", revenue: 0 },
];

export const recentSubmissions = [
  { student: "Carlos Eduardo", task: "Projeto Final - CNN", course: "Fundamentos de IA", status: "Pendente" },
  { student: "Beatriz Silva", task: "Quiz Módulo 4", course: "Deep Learning", status: "Avaliado" },
  { student: "Domingos Pinto", task: "Exercício 12", course: "Fundamentos de IA", status: "Pendente" },
];

export const adminStats = [
  { label: "Utilizadores", value: "15.240", delta: "+8,2%" },
  { label: "Receita (mês)", value: "84,5M Kz", delta: "+12,4%" },
  { label: "Cursos ativos", value: "126", delta: "+3" },
  { label: "Empresas", value: "82", delta: "+5" },
];

export const revenueByMonth = [
  { month: "Jan", value: 42 },
  { month: "Fev", value: 51 },
  { month: "Mar", value: 48 },
  { month: "Abr", value: 63 },
  { month: "Mai", value: 72 },
  { month: "Jun", value: 84 },
];

export const recentUsers = [
  { name: "Ana Domingos", email: "ana@email.ao", role: "Estudante", joined: "Hoje" },
  { name: "Paulo Cardoso", email: "paulo@email.ao", role: "Instrutor", joined: "Ontem" },
  { name: "TechAngola Lda", email: "rh@techangola.ao", role: "Empresa", joined: "2 dias" },
  { name: "Sara Mendes", email: "sara@email.ao", role: "Instrutor", joined: "3 dias" },
];

export const formatKz = (v: number) =>
  new Intl.NumberFormat("pt-AO", { maximumFractionDigits: 0 }).format(v) + " Kz";

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("pt-AO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/** Deadline = 24h before the course start date. */
export const enrollmentDeadline = (startDate: string) =>
  new Date(new Date(startDate).getTime() - 24 * 60 * 60 * 1000);

export const isEnrollmentOpen = (startDate: string) =>
  Date.now() < enrollmentDeadline(startDate).getTime();