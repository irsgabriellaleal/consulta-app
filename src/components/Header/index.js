import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserCircle, Calendar } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="px-4 lg:px-6 h-20 flex items-center bg-gray-900 shadow-sm">
      <div className="flex items-center">
        <span className="text-2xl font-bold text-blue-400">Clinix</span>
      </div>

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
          className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-8 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-blue-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 gap-2"
          prefetch={false}
        >
          <Calendar className="w-5 h-5" />
          <span>Agendar Consulta</span>
        </Link>
        {session && (
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-200 hover:scale-105 border border-gray-700"
            prefetch={false}
          >
            <UserCircle className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">Meu Perfil</span>
          </Link>
        )}
      </nav>
    </header>
  );
}
