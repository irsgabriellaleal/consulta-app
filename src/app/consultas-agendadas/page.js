"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/src/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";

export default function ConsultasAgendadas() {
  const [consultas, setConsultas] = useState([]);

  useEffect(() => {
    fetchConsultas();
  }, []);

  async function fetchConsultas() {
    try {
      const response = await fetch("/api/consultas-agendadas");
      if (!response.ok) {
        throw new Error("Falha ao buscar consultas agendadas");
      }
      const data = await response.json();
      setConsultas(data);
    } catch (error) {
      console.error("Erro ao buscar consultas agendadas:", error);
    }
  }

  async function deletarConsulta(id) {
    try {
      const response = await fetch("/api/consultas-agendadas", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Falha ao deletar consulta");
      }

      await fetchConsultas();
    } catch (error) {
      console.error("Erro ao deletar consulta:", error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consultas Agendadas</CardTitle>
        <CardDescription>
          Lista de consultas agendadas dos pacientes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Paciente</TableHead>
              <TableHead>Data da Consulta</TableHead>
              <TableHead>Horário da Consulta</TableHead>
              <TableHead>Especialidade</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consultas.map((consulta) => (
              <TableRow key={consulta.id}>
                <TableCell>{consulta.nomePaciente}</TableCell>
                <TableCell>{consulta.data}</TableCell>
                <TableCell>{consulta.horario}</TableCell>
                <TableCell>{consulta.especialidade}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => deletarConsulta(consulta.id)}
                    variant="destructive"
                  >
                    Deletar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
