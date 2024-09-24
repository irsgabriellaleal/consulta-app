"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/agendamento");
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await signIn("email", {
      email,
      callbackUrl: "/agendamento",
      redirect: false
    });
    if (result?.error) {
      setError("Ocorreu um erro ao enviar o email. Por favor, tente novamente.");
    } else {
      setError("Link de acesso enviado. Por favor, verifique seu email.");
    }
  };

  if (status === "loading") {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Entre com seu email para receber um link de acesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="seu@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Enviar link de acesso
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
