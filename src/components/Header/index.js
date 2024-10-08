import Link from "next/link";

export default function Header() {
  return (
    <header className="px-4 lg:px-6 h-20 flex items-center bg-gray-900 shadow-sm">
      <div className="flex items-center">
        <span className="text-2xl font-bold text-blue-400">Clinix</span>
      </div> {/* Adicionei o fechamento da tag div */}

      <nav className="ml-auto flex items-center gap-6 text-gray-300">
        <Link
          href="/"
          className="text-sm font-medium hover:text-blue-400 transition-colors duration-200"
          prefetch={false}
        >
          Home
        </Link>
        <Link
          href="/agendamento/sobre-nos"
          className="text-sm font-medium hover:text-blue-400 transition-colors duration-200"
          prefetch={false}
        >
          Sobre Nós
        </Link>
        <Link
          href="/profissionais"
          className="text-sm font-medium hover:text-blue-400 transition-colors duration-200"
          prefetch={false}
        >
          Profissionais
        </Link>
        <Link
          href="/agendamento"
          className="inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-8 text-sm font-medium text-white shadow-lg transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          prefetch={false}
        >
          Agendar Consulta
        </Link>
      </nav>
    </header>
  );
}
