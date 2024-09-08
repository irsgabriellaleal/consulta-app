"use client";
import { useEffect, useState } from "react";
import Login from "@/src/app/components/login";
import { dbConnection } from "@/src/config/database";

export default function Home() {
  const [users, setUsers] = useState([]);
  async function paciente() {
    try {
      const resposta = await fetch("/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const dados = await resposta.json();
      setUsers(dados);
      console.log(dados);
    } catch (error) {
      console.error("Erro ao conectar ao banco de dados:", error);
    }
  }

  useEffect(() => {
    paciente();
  }, []);

  return (
    <section>
      <h1>Login</h1>
      {users && users.length > 0 ? (
        users.map((item, index) => (
          <div>
            <li key={index}>{item.nome}</li>
            <li key={index}>{item.email}</li>
          </div>
        ))
      ) : (
        <p>Nenhum usuário encontrado.</p>
      )}
    </section>
  );
}
