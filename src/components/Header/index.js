'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  UserCircle,
  Calendar,
  Menu,
  X,
  ChevronDown,
  Bell,
  LogOut,
  Settings,
  User,
  FileText,
  Heart
} from "lucide-react";
import { usePathname } from 'next/navigation';

export default function Header() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Sobre Nós', href: '/agendamento/sobre-nos' },
    { name: 'Profissionais', href: '/profissionais' },
    { name: 'Planos', href: '/planos' },
  ];

  const profileMenuItems = [
    { name: 'Meu Perfil', href: '/dashboard', icon: User },
    { name: 'Minhas Consultas', href: '/dashboard/consultas', icon: Calendar },
    { name: 'Resultados', href: '/dashboard/resultados', icon: FileText },
    { name: 'Histórico', href: '/dashboard/historico', icon: Heart },
    { name: 'Configurações', href: '/dashboard/configuracoes', icon: Settings },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? 'bg-gray-900/90 backdrop-blur-md shadow-lg'
          : 'bg-gray-900'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="relative flex h-8 w-8">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-8 w-8 bg-blue-500"></span>
            </span>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Clinix
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-all duration-200 relative group ${pathname === item.href
                    ? 'text-blue-400'
                    : 'text-gray-300 hover:text-blue-400'
                  }`}
                prefetch={false}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full ${pathname === item.href ? 'w-full' : 'w-0'
                  }`} />
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {/* Agendar Consulta Button */}
            <Link
              href="/agendamento"
              className="hidden md:inline-flex h-11 items-center justify-center rounded-full 
                bg-gradient-to-r from-blue-600 to-blue-700 px-6 text-sm font-medium text-white 
                shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25 
                hover:from-blue-500 hover:to-blue-600 focus:ring-2 focus:ring-blue-500 
                focus:ring-offset-2 focus:ring-offset-gray-900 gap-2"
              prefetch={false}
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Consulta</span>
            </Link>

            {/* User Profile Section */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 
                    hover:bg-gray-700 transition-all duration-300 hover:scale-105 
                    border border-gray-700 group"
                >
                  <div className="relative">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <UserCircle className="w-8 h-8 text-blue-400" />
                    )}
                    <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white">
                    {session.user?.name?.split(' ')[0] || 'Meu Perfil'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white" />
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-gray-800 border 
                    border-gray-700 shadow-lg py-2 animate-in fade-in slide-in-from-top-5">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm text-gray-400">Logado como</p>
                      <p className="text-sm font-medium text-white truncate">
                        {session.user?.email}
                      </p>
                    </div>

                    {profileMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 
                          hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.name}
                      </Link>
                    ))}

                    <div className="border-t border-gray-700 mt-2 pt-2">
                      <button
                        onClick={() => {/* Implement logout */ }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 
                          hover:bg-gray-700 hover:text-red-300 transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 
                  hover:bg-gray-700 transition-all duration-300 hover:scale-105 
                  border border-gray-700"
                prefetch={false}
              >
                <UserCircle className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-gray-300">Login</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg 
                text-gray-400 hover:text-white hover:bg-gray-700 md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-in slide-in-from-top">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-gray-300 
                    hover:text-white hover:bg-gray-700 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/agendamento"
                className="block px-3 py-2 rounded-lg text-base font-medium text-white 
                  bg-blue-600 hover:bg-blue-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Agendar Consulta
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}