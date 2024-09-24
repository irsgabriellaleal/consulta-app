"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Loader2, Mail, AlertCircle } from "lucide-react";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/agendamento",
      });
      if (result?.error) {
        setError("Falha ao enviar o e-mail. Por favor, tente novamente.");
      } else {
        setIsEmailSent(true);
      }
    } catch (error) {
      setError("Ocorreu um erro. Por favor, tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 text-white p-4">
      <div className="w-full max-w-md space-y-8 bg-neutral-800 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Clinix</h1>
          <p className="text-neutral-400">Entre para acessar sua conta</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md flex items-center space-x-2">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {isEmailSent ? (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-md">
            <p>
              E-mail de verificação enviado. Verifique sua caixa de entrada.
            </p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleEmailSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Endereço de e-mail
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Entrar com E-mail
                </>
              )}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-neutral-400">
          Ao continuar, você concorda com nossos <br />
          <a href="#" className="text-blue-400 hover:underline">
            Termos de Serviço
          </a>{" "}
          e{" "}
          <a href="#" className="text-blue-400 hover:underline">
            Política de Privacidade
          </a>
          .
        </p>
      </div>
    </div>
  );
}
