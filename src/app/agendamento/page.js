'use client'
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/src/components/ui/card"
import { Label } from "@/src/components/ui/label"
import { Popover, PopoverTrigger, PopoverContent } from "@/src/components/ui/popover"
import { Button } from "@/src/components/ui/button"
import { Calendar } from "@/src/components/ui/calendar"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/src/components/ui/select"
import { Input } from "@/src/components/ui/input"
import { format } from 'date-fns'

export default function AgendamentoPage() {
  const [data, setData] = useState(null)
  const [horario, setHorario] = useState('')
  const [especialidade, setEspecialidade] = useState('')
  const [usuarioId, setUsuarioId] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!data || !horario || !especialidade || !usuarioId) {
      alert('Por favor, preencha todos os campos')
      return
    }

    const userId = parseInt(usuarioId);
    if (isNaN(userId) || userId <= 0) {
      alert('Por favor, insira um ID de usuário válido')
      return
    }

    try {
      const response = await fetch('/api/agendamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: format(data, 'yyyy-MM-dd'),
          horario,
          especialidade,
          usuarioId: userId,
        }),
      })

      const result = await response.json()
      if (result.success) {
        alert('Agendamento realizado com sucesso!')
        // Limpar o formulário
        setData(null)
        setHorario('')
        setEspecialidade('')
        setUsuarioId('')
      } else {
        alert(`Erro ao realizar agendamento: ${result.error}`)
      }
    } catch (error) {
      console.error('Erro ao enviar agendamento:', error)
      alert(`Erro ao enviar agendamento: ${error.message}`)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Agendar Consulta</CardTitle>
            <CardDescription>Escolha a data, horário e especialidade.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {data ? format(data, 'dd/MM/yyyy') : 'Selecionar data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={data} onSelect={setData} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Horário</Label>
              <Select value={horario} onValueChange={setHorario}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Selecionar horário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="11:00">11:00</SelectItem>
                  <SelectItem value="14:00">14:00</SelectItem>
                  <SelectItem value="15:00">15:00</SelectItem>
                  <SelectItem value="16:00">16:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Especialidade</Label>
              <Select value={especialidade} onValueChange={setEspecialidade}>
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="Selecionar especialidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiologia">Cardiologia</SelectItem>
                  <SelectItem value="dermatologia">Dermatologia</SelectItem>
                  <SelectItem value="ginecologia">Ginecologia</SelectItem>
                  <SelectItem value="ortopedia">Ortopedia</SelectItem>
                  <SelectItem value="pediatria">Pediatria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="userId">ID do Usuário</Label>
              <Input
                type="number"
                id="userId"
                value={usuarioId}
                onChange={(e) => setUsuarioId(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Agendar Consulta
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}