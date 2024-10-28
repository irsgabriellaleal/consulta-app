"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Loader2, Mail, AlertCircle } from "lucide-react";

export default function LoginScreen() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true)
  const { data: session, status } = useSession();

  const toggleView = () => setIsLogin(!isLogin)

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/agendamento");
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("email", {
        email,
        callbackUrl: "/agendamento",
        redirect: false
      });
      if (result?.error) {
        setError("Ocorreu um erro ao enviar o email. Por favor, tente novamente.");
      } else {
        setIsEmailSent(true);
      }
    } catch (error) {
      setError("Ocorreu um erro. Por favor, tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
      <Card className="w-full max-w-md bg-neutral-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{isLogin ? 'Login' : 'Cadastro'}</CardTitle>
          <CardDescription className="text-center text-neutral-400">
            {isLogin ? 'Entre com seu email para receber um link de acesso' : 'Cadastre-se para acessar o sistema'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md flex items-center space-x-2 mb-4">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}
          {isEmailSent ? (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-md mb-4">
              <p>Link de acesso enviado. Por favor, verifique seu email.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      placeholder="Nome"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="seu@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:ring-blue-500 focus:border-blue-500"
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
                      {isLogin ? 'Enviar link de acesso' : 'Criar conta'}
                    </>
                  )}
                </Button>

                <button onClick={toggleView} className="text-sm text-blue-400 hover:text-blue-500">
                  {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-neutral-400 mt-4">
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
        </CardContent>
      </Card>
    </div>
  );
}
