"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Falha ao buscar usuários");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-b from-blue-50 to-white text-neutral-800">
      <header className="px-4 lg:px-6 h-20 flex items-center bg-white shadow-sm">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-blue-600">Clinix</span>
        </div> {/* Adicionei o fechamento da tag div */}

        <nav className="ml-auto flex items-center gap-6 text-neutral-800">
          <Link
            href="/agendamento/home"
            className="text-sm font-medium hover:text-blue-600 transition-colors duration-200"
            prefetch={false}
          >
            Home
          </Link>
          <Link
            href="/agendamento/sobre-nos"
            className="text-sm font-medium hover:text-blue-600 transition-colors duration-200"
            prefetch={false}
          >
            Sobre Nós
          </Link>
          <Link
            href="/profissionais"
            className="text-sm font-medium hover:text-blue-600 transition-colors duration-200"
            prefetch={false}
          >
            Profissionais
          </Link>
          <Link
            href="/agendamento"
            className="inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-8 text-sm font-medium text-white shadow-lg transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            prefetch={false}
          >
            Agendar Consulta
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-8">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900">
                  Cuide da sua saúde com facilidade e praticidade
                </h1>
                <p className="max-w-[600px] text-xl text-gray-600">
                  Agende suas consultas de forma rápida e segura. Cuidamos de você para que você possa cuidar do que realmente importa.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/agendamento"
                    className="inline-flex h-14 items-center justify-center rounded-full bg-blue-600 px-8 text-lg font-medium text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                    prefetch={false}
                  >
                    Agendar Agora
                  </Link>
                  <Link
                    href="/sobre-nos"
                    className="inline-flex h-14 items-center justify-center rounded-full bg-gray-100 px-8 text-lg font-medium text-gray-900 shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2"
                    prefetch={false}
                  >
                    Saiba Mais
                  </Link>
                </div>
              </div>
              <div className="relative grid place-items-center">
                <img
                  src="background.jpeg"
                  alt="Profissional de saúde"
                  className="rounded-2xl shadow-2xl max-w-[400px]"
                />
                <div className="absolute -bottom-8 left-6 bg-white p-6 rounded-xl shadow-lg">
                  <p className="text-3xl font-bold text-blue-600">98%</p>
                  <p className="text-gray-600">Pacientes satisfeitos</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl text-neutral-100 font-bold tracking-tighter sm:text-5xl">
                  Nossos Serviços
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Oferecemos uma ampla gama de serviços de saúde para atender às
                  suas necessidades.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <HeartPulseIcon className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="text-xl text-neutral-100 font-bold">Cuidados Primários</h3>
                  <p className="text-muted-foreground">
                    Agende uma consulta com nossos experientes profissionais de
                    cuidados primários.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <StethoscopeIcon className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="text-xl text-neutral-100 font-bold">Cuidados Especializados</h3>
                  <p className="text-muted-foreground">
                    Acesse nossa rede de especialistas para cuidados médicos
                    avançados.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <MicroscopeIcon className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="text-xl text-neutral-100 font-bold">Exames Diagnósticos</h3>
                  <p className="text-muted-foreground">
                    Agende exames laboratoriais e de imagem com facilidade.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  O Que Nossos Pacientes Dizem
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Ouça o que nossos pacientes satisfeitos têm a dizer sobre sua
                  experiência com nossos serviços de saúde.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <img
                  src="/placeholder.svg"
                  width="80"
                  height="80"
                  alt="Avatar"
                  className="rounded-full"
                  style={{ aspectRatio: "80/80", objectFit: "cover" }}
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">João Silva</h3>
                  <p className="text-muted-foreground">
                    &quot;A equipe foi incrivelmente amigável e prestativa. Tive
                    uma ótima experiência com minha consulta.&quot;
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <img
                  src="/placeholder.svg"
                  width="80"
                  height="80"
                  alt="Avatar"
                  className="rounded-full"
                  style={{ aspectRatio: "80/80", objectFit: "cover" }}
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Maria Santos</h3>
                  <p className="text-muted-foreground">
                    &quot;Consegui agendar minha consulta online facilmente e o
                    processo foi muito simples.&quot;
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <img
                  src="/placeholder.svg"
                  width="80"
                  height="80"
                  alt="Avatar"
                  className="rounded-full"
                  style={{ aspectRatio: "80/80", objectFit: "cover" }}
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Carlos Oliveira</h3>
                  <p className="text-muted-foreground">
                    &quot;Os profissionais de saúde foram muito competentes e
                    dedicaram tempo para abordar todas as minhas
                    preocupações.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-100 py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Sobre Nós</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Nossa História</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Equipe</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Carreiras</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Serviços</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Consultas</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Exames</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Especialidades</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">FAQ</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Contato</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-blue-600">Política de Privacidade</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Siga-nos</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeartPulseIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </svg>
  );
}

function MicroscopeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 18h8" />
      <path d="M3 22h18" />
      <path d="M14 22a7 7 0 1 0 0-14h-1" />
      <path d="M9 14h2" />
      <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
      <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
    </svg>
  );
}

function StethoscopeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  );
}
