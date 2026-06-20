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