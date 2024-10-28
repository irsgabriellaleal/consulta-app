'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Edit2, Save } from 'lucide-react'
import { Button } from "@src/components/ui/button"
import { Input } from "@src/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@src/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@src/components/ui/avatar"

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState(0)
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/users")
        if (!response.ok) {
          throw new Error("Falha ao buscar usuário")
        }
        const data = await response.json()
        setName(data[0].nome)
        setEmail(data[0].email)
        setUserId(data[0].id)
      } catch (error) {
        console.error("Erro ao buscar usuário:", error)
      }
    }

    async function fetchAppointments() {
      try {
        const response = await fetch("/api/consultas-agendadas")
        if (!response.ok) {
          throw new Error("Falha ao buscar consultas agendadas")
        }
        const data = await response.json()
        setAppointments(data)
      } catch (error) {
        console.error("Erro ao buscar consultas agendadas:", error)
      }
    }

    fetchUser()
    fetchAppointments()
  }, [])

  const handleSave = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId, nome: name, email: email }),
      })
      if (!response.ok) {
        throw new Error("Falha ao atualizar usuário")
      }
      setIsEditing(false)
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold">Perfil do Usuário</CardTitle>
            <Button
              variant={isEditing ? "default" : "outline"}
              size="icon"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" alt={name} />
                <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="space-y-2 flex-1">
                {isEditing ? (
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                  />
                ) : (
                  <h2 className="text-2xl font-semibold">{name}</h2>
                )}
                {isEditing ? (
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu e-mail"
                    type="email"
                  />
                ) : (
                  <p className="text-gray-600">{email}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Consultas Agendadas</CardTitle>
          </CardHeader>
          <CardContent>

            {appointments.length > 0 ? (
              <ul className="space-y-4">
                {appointments.map((appointment) => (
                  <li key={appointment.id} className="bg-neutral-800 p-4 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{appointment.nomeMedico}</h3>
                        <p className="text-sm text-gray-500">{appointment.especialidade}</p>
                      </div>
                      <Button variant="outline" size="sm">Remarcar</Button>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Calendar className="mr-2 h-4 w-4" />
                      {appointment.data}
                      <Clock className="ml-4 mr-2 h-4 w-4" />
                      {appointment.horario}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Você não tem consultas agendadas no momento.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}