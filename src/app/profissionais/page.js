"use client";

import Header from "@src/components/Header";
import { DoctorCard } from "@src/components/DoctorCard";

const professionals = [
  {
    id: 1,
    nome: "Dr. Gabriel Santos",
    especialidade: "Cardiologia",
    experiencia: "10 anos",
    crm: "123456",
    avatar: "https://i.pravatar.cc/100",
    descricao:
      "Olá! Sou especialista em cardiologia, focado em oferecer atendimento de qualidade via telemedicina. Realizo consultas online para diagnóstico, acompanhamento e prevenção de doenças cardiovasculares.",
    avaliacao: 4.9,
    avaliacoes: 52,
    consultas: 230,
    preco: 250,
    especialidades: ["Hipertensão", "Arritmias", "Prevenção Cardiovascular"],
  },
  {
    id: 2,
    nome: "Dra. Helena Costa",
    especialidade: "Dermatologia",
    experiencia: "7 anos",
    crm: "654321",
    avatar: "https://i.pravatar.cc/101",
    descricao:
      "Dermatologista experiente, oferecendo tratamentos para acne, dermatites, e cuidados gerais com a pele. Minha missão é cuidar da saúde da pele com as melhores práticas e inovações da medicina.",
    avaliacao: 4.8,
    avaliacoes: 45,
    consultas: 180,
    preco: 200,
    especialidades: ["Acne", "Dermatites", "Cuidados Gerais com a Pele"],
  },
  // Novos profissionais adicionados
  {
    id: 3,
    nome: "Dr. Lucas Oliveira",
    especialidade: "Ortopedia",
    experiencia: "12 anos",
    crm: "987654",
    avatar: "https://i.pravatar.cc/102",
    descricao:
      "Ortopedista dedicado a oferecer tratamentos eficazes para lesões e dores musculoesqueléticas. Utilizo técnicas modernas e abordagens personalizadas para cada paciente.",
    avaliacao: 4.7,
    avaliacoes: 38,
    consultas: 150,
    preco: 280,
    especialidades: ["Lesões Esportivas", "Dores Articulares", "Reabilitação"],
  },
  {
    id: 4,
    nome: "Dra. Camila Fernandes",
    especialidade: "Ginecologia",
    experiencia: "9 anos",
    crm: "246810",
    avatar: "https://i.pravatar.cc/103",
    descricao:
      "Ginecologista comprometida em cuidar da saúde feminina em todas as fases da vida. Ofereço consultas online para orientação, diagnóstico e tratamento de questões ginecológicas.",
    avaliacao: 4.9,
    avaliacoes: 60,
    consultas: 200,
    preco: 220,
    especialidades: ["Saúde da Mulher", "Contracepção", "Pré-natal"],
  },
];

export default function ProfessionalsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
        <section className="container mx-auto">
          <h1 className="mb-8 text-4xl font-bold text-center text-foreground">
            Conheça Nossos Profissionais
          </h1>
          <div className="grid gap-10">
            {professionals?.map((professional) => (
              <DoctorCard key={professional.id} professional={professional} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
