"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@src/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@src/components/ui/table";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Calendar, Clock, Edit2, Trash2, PlusCircle, Home } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ConsultasAgendadas() {
  const [consultas, setConsultas] = useState([]);
  const [editando, setEditando] = useState(null);
  const [novaData, setNovaData] = useState("");
  const [novoHorario, setNovoHorario] = useState("");

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

  async function atualizarConsulta(id) {
    try {
      const response = await fetch(`/api/consultas-agendadas`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          data: novaData,
          horario: novoHorario,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar consulta");
      }

      await fetchConsultas();
      setEditando(null);
      setNovaData("");
      setNovoHorario("");
    } catch (error) {
      console.error("Erro ao atualizar consulta:", error);
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
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold text-primary">Consultas Agendadas</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Gerencie suas consultas médicas
              </CardDescription>
            </div>
            <div className="space-x-2">
              <Button asChild>
                <Link href="/agendamento">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Consulta
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Página Inicial
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {consultas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl text-muted-foreground mb-4">Você ainda não tem consultas agendadas.</p>
              <Button asChild>
                <Link href="/agendamento">Agendar Primeira Consulta</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultas.map((consulta) => (
                  <TableRow key={consulta.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{consulta.nomePaciente}</TableCell>
                    <TableCell>
                      {editando === consulta.id ? (
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="date"
                            value={novaData}
                            onChange={(e) => setNovaData(e.target.value)}
                            className="max-w-[150px]"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {format(new Date(consulta.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editando === consulta.id ? (
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="time"
                            value={novoHorario}
                            onChange={(e) => setNovoHorario(e.target.value)}
                            className="max-w-[100px]"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          {consulta.horario}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{consulta.especialidade}</TableCell>
                    <TableCell className="text-right">
                      {editando === consulta.id ? (
                        <Button onClick={() => atualizarConsulta(consulta.id)} size="sm">
                          Salvar
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditando(consulta.id);
                            setNovaData(consulta.data);
                            setNovoHorario(consulta.horario);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletarConsulta(consulta.id)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Total de consultas: {consultas.length}
          </p>
          <Button asChild>
            <Link href="/agendamento">Agendar Nova Consulta</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
