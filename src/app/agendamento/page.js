"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { Calendar } from "@src/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select";
import { Label } from "@src/components/ui/label";
import { Textarea } from "@src/components/ui/textarea";
import { CalendarIcon, Clock, Stethoscope, FileText } from "lucide-react";

export default function AgendamentoPage() {
  const [data, setData] = useState(null);
  const [horario, setHorario] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [sintomas, setSintomas] = useState("");
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data || !horario || !especialidade) {
      setMensagem({
        tipo: "erro",
        texto: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    try {
      const response = await fetch("/api/agendamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: format(data, "yyyy-MM-dd"),
          horario,
          especialidade,
          sintomas,
        }),
      });

      if (response.ok) {
        setMensagem({
          tipo: "sucesso",
          texto: "Sua consulta foi agendada com sucesso!",
        });
        setTimeout(() => {
          router.push("/consultas-agendadas");
        }, 2000);
      } else {
        throw new Error("Falha ao agendar consulta");
      }
    } catch (error) {
      setMensagem({
        tipo: "erro",
        texto: "Ocorreu um erro ao agendar a consulta. Tente novamente.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto bg-gray-800 border-gray-700 shadow-xl">
        <CardHeader className="text-center border-b border-gray-700 pb-6">
          <CardTitle className="text-3xl font-bold text-blue-400">Agende sua Consulta</CardTitle>
          <CardDescription className="text-lg text-gray-400">
            Escolha a data, horário e especialidade para sua consulta médica
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {mensagem.texto && (
            <div className={`mb-6 p-4 rounded-md ${mensagem.tipo === "erro" ? "bg-red-900/50 text-red-200 border border-red-700" : "bg-green-900/50 text-green-200 border border-green-700"}`}>
              {mensagem.texto}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label htmlFor="data" className="text-lg font-medium flex items-center text-gray-300">
                  <CalendarIcon className="mr-2 h-5 w-5 text-blue-400" />
                  Data da Consulta
                </Label>
                <div className="w-full h-full min-h-[300px]">
                  <Calendar
                    mode="single"
                    selected={data}
                    onSelect={setData}
                    className="rounded-md border tabl border-gray-700 bg-gray-800 text-gray-100 w-full h-full"
                    locale={ptBR}
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="horario" className="text-lg font-medium flex items-center text-gray-300 mb-2">
                    <Clock className="mr-2 h-5 w-5 text-blue-400" />
                    Horário
                  </Label>
                  <Select value={horario} onValueChange={setHorario}>
                    <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-gray-200">
                      <SelectValue placeholder="Selecione o horário" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map((time) => (
                        <SelectItem key={time} value={time} className="text-gray-200">
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="especialidade" className="text-lg font-medium flex items-center text-gray-300 mb-2">
                    <Stethoscope className="mr-2 h-5 w-5 text-blue-400" />
                    Especialidade
                  </Label>
                  <Select value={especialidade} onValueChange={setEspecialidade}>
                    <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-gray-200">
                      <SelectValue placeholder="Selecione a especialidade" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {["Clínico Geral", "Cardiologia", "Dermatologia", "Ortopedia", "Pediatria"].map((esp) => (
                        <SelectItem key={esp} value={esp} className="text-gray-200">
                          {esp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <Label htmlFor="sintomas" className="text-lg font-medium flex items-center text-gray-300">
                <FileText className="mr-2 h-5 w-5 text-blue-400" />
                Descreva seus sintomas (opcional)
              </Label>
              <Textarea
                id="sintomas"
                placeholder="Descreva brevemente seus sintomas ou o motivo da consulta"
                value={sintomas}
                onChange={(e) => setSintomas(e.target.value)}
                className="min-h-[100px] bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
              />
            </div>
            <Button type="submit" size="lg" className="bg-blue-600 place-self-end hover:bg-blue-700 text-white">
              Agendar Consulta
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
