"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "../../components/ui/button";
import { signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Bem-vindo, {session?.user?.email}</p>
      <Button onClick={() => signOut({ callbackUrl: "/" })} className="mt-4">
        Sair
      </Button>
    </div>
  );
}