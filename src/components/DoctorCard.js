"use client";

import { useState } from "react";
import { format, addDays, startOfDay } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@src/components/ui/avatar";
import { Button } from "@src/components/ui/button";
import { Card, CardContent, CardFooter } from "@src/components/ui/card";
import { Badge } from "@src/components/ui/badge";
import { Heart, Star, Video } from "lucide-react";
import { useRouter } from "next/navigation";

export function DoctorCard({ professional }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const timeSlots = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

  const today = startOfDay(new Date());
  const nextFiveDays = Array.from({ length: 5 }, (_, i) => addDays(today, i));

  const router = useRouter();


  const handleScheduleAppointment = async () => {
    try {
      const response = await fetch("/api/agendamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: format(selectedDate, "yyyy-MM-dd"),
          horario: selectedTime,
          especialidade: professional.especialidade,
          nomeMedico: professional.nome
        }),
      });

      if (response.ok) {
        router.push("/consultas-agendadas");
      } else {
        // Tratar erro de agendamento
        console.error("Erro ao agendar consulta");
      }
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
    }
  };

  return (
    <Card className="w-full bg-card shadow-lg rounded-lg overflow-hidden border border-border">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 ring-2 ring-purple-400">
                  <AvatarImage src={professional.avatar} alt={professional.nome} />
                  <AvatarFallback>{professional.nome.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-white">{professional.nome}</h2>
                  <p className="text-gray-400">
                    {professional.especialidade} · {professional.experiencia} de experiência
                  </p>
                  <p className="text-gray-400">CRM: {professional.crm}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-red-500 hover:text-white">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="gap-2 text-gray-400 border-gray-600 hover:bg-gray-700">
                <Video className="h-4 w-4" />
                Vídeo de apresentação
              </Button>
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              {professional.especialidades.map((especialidade) => (
                <Badge key={especialidade} variant="secondary" className="bg-gray-700 text-gray-300">
                  {especialidade}
                </Badge>
              ))}
            </div>
            <p className="mt-4 text-gray-400">{professional.descricao}</p>
            <div className="mt-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="font-bold text-white">{professional.avaliacao}</span>
              <span className="text-gray-400">({professional.avaliacoes} avaliações)</span>
              <span className="text-gray-600">·</span>
              <span className="text-gray-400">{professional.consultas} consultas</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-2">
                  {nextFiveDays.map((day) => (
                    <Button
                      key={day.getTime()}
                      variant={selectedDate?.getTime() === day.getTime() ? "default" : "outline"}
                      className={`flex-1 justify-center transition-all duration-300 ${selectedDate?.getTime() === day.getTime()
                        ? "bg-purple-600 text-white"
                        : "border-gray-700 text-gray-400 hover:bg-gray-800"
                        }`}
                      onClick={() => setSelectedDate(day)}
                    >
                      {format(day, "dd/MM")}
                    </Button>
                  ))}
                </div>
                <div className="space-y-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedTime === slot ? "default" : "outline"}
                      className={`w-full justify-start transition-all duration-300 ${selectedTime === slot
                        ? "bg-purple-600 text-white"
                        : "border-gray-700 text-gray-400 hover:bg-gray-800"
                        }`}
                      onClick={() => setSelectedTime(slot)}
                      disabled={!selectedDate}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-900 p-4 flex justify-between items-center">
        <div>
          <p className="text-lg font-bold text-white">Consulta Online 30 min</p>
          <p className="text-2xl font-bold text-green-400">R$ {professional.preco}</p>
        </div>
        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white"
          disabled={!selectedDate || !selectedTime}
          onClick={handleScheduleAppointment}
        >
          Agendar Consulta
        </Button>
      </CardFooter>
    </Card>
  );
}