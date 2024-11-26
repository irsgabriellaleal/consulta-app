"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import Header from "@/src/components/Header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import {
  Pill,
  Clock,
  Calendar,
  Plus,
  Bell,
  Loader2,
  CheckCircle2,
  MoreVertical,
  Search,
  PauseCircle,
  XCircle,
  Activity
} from "lucide-react";
import { format, isToday, isTomorrow, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";

export default function Medicamentos() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(null);
  const [medicamentosAtivos, setMedicamentosAtivos] = useState([]);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [medicamentosFiltrados, setMedicamentosFiltrados] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    dosagem: "",
    frequencia: "",
    horarios: "",
    dataInicio: "",
    dataFim: "",
    observacoes: "",
    status: "ativo" // Adicione esta linha
  });

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetchMedicamentos();
  }, []);

  const fetchMedicamentos = async () => {
    try {
      const response = await fetch("/api/medicamentos");
      const data = await response.json();
      setMedicamentos(data);
      setMedicamentosAtivos(data.filter(med => med.status === 'ativo'));
      setIsLoading(false);
    } catch (error) {
      setError("Erro ao carregar medicamentos");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/medicamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          horarios: formData.horarios.split(",").map(h => h.trim()),
        }),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setFormData({
          nome: "",
          dosagem: "",
          frequencia: "",
          horarios: "",
          dataInicio: "",
          dataFim: "",
          observacoes: "",
        });
        fetchMedicamentos();
      }
    } catch (error) {
      setError("Erro ao criar medicamento");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setLoadingStatus(id);
    try {
      const response = await fetch(`/api/medicamentos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao atualizar status');
      }

      await fetchMedicamentos(); // Isso já vai atualizar os medicamentos ativos
    } catch (error) {
      setError(error.message);
      console.error('Erro completo:', error);
    } finally {
      setLoadingStatus(null);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-500/10 text-green-500';
      case 'pausado':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'finalizado':
        return 'bg-neutral-500/10 text-neutral-400';
      default:
        return 'bg-neutral-500/10 text-neutral-400';
    }
  };

  const getProximaDose = (horarios) => {
    if (!horarios || horarios.length === 0) return null;

    const agora = new Date();
    const horaAtual = agora.getHours() * 60 + agora.getMinutes();

    // Converte todos os horários para minutos desde meia-noite
    const horariosEmMinutos = horarios.map(horario => {
      const [horas, minutos] = horario.split(':').map(Number);
      return horas * 60 + minutos;
    });

    // Encontra o próximo horário
    const proximoHorario = horariosEmMinutos.find(horario => horario > horaAtual);

    // Se não encontrou próximo horário hoje, retorna o primeiro horário do dia seguinte
    return proximoHorario || horariosEmMinutos[0];
  };

  const getTempoAteProximaDose = (proximaDoseMinutos) => {
    if (!proximaDoseMinutos) return "Sem horários definidos";

    const agora = new Date();
    const horaAtual = agora.getHours() * 60 + agora.getMinutes();

    let diferenca = proximaDoseMinutos - horaAtual;

    // Se a diferença é negativa, significa que é para o próximo dia
    if (diferenca <= 0) {
      diferenca = (24 * 60) + diferenca; // Adiciona 24 horas em minutos
    }

    const horas = Math.floor(diferenca / 60);
    const minutos = diferenca % 60;

    if (horas === 0) {
      return `Em ${minutos} minutos`;
    } else if (minutos === 0) {
      return `Em ${horas}h`;
    } else {
      return `Em ${horas}h e ${minutos}min`;
    }
  };

  const calcularProgresso = (dataInicio, dataFim) => {
    const inicio = new Date(dataInicio);
    const hoje = new Date();

    if (!dataFim) {
      // Se não tem data fim, calcula baseado em 30 dias por padrão
      const totalDias = 30;
      const diasPassados = Math.floor((hoje - inicio) / (1000 * 60 * 60 * 24));
      return Math.min(Math.round((diasPassados / totalDias) * 100), 100);
    }

    const fim = new Date(dataFim);
    const totalDuracao = fim - inicio;
    const tempoPassado = hoje - inicio;

    const progresso = Math.round((tempoPassado / totalDuracao) * 100);
    return Math.min(Math.max(progresso, 0), 100); // Garante que fique entre 0 e 100
  };

  const getProximoMedicamento = (medicamentos) => {
    if (!medicamentos || medicamentos.length === 0) return null;

    const medicamentosAtivos = medicamentos.filter(med => med.status === 'ativo');

    if (medicamentosAtivos.length === 0) return null;

    return medicamentosAtivos.reduce((proximo, atual) => {
      const proximaDoseAtual = getProximaDose(atual.horarios);

      if (!proximo) return atual;

      const proximaDoseProximo = getProximaDose(proximo.horarios);

      return proximaDoseAtual < proximaDoseProximo ? atual : proximo;
    }, null);
  };

  useEffect(() => {
    if (!medicamentos) return;

    const filtrar = () => {
      if (filtroStatus === 'todos') {
        setMedicamentosFiltrados(medicamentos);
        return;
      }

      const filtrados = medicamentos.filter(med => med.status === filtroStatus);
      setMedicamentosFiltrados(filtrados);
    };

    filtrar();
  }, [medicamentos, filtroStatus]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#0A0A0B] pt-20">
        {/* Header Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl">
              <h1 className="text-4xl font-bold text-white mb-4">
                Controle de Medicamentos
              </h1>
              <p className="text-blue-100 text-lg opacity-90">
                Mantenha o controle dos seus medicamentos e nunca perca um horário
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="container mx-auto px-4 -mt-10">
          {/* Cards Estatísticos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Card Medicamentos Ativos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1C1C1F] rounded-2xl p-6 border border-neutral-800"
            >
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-sm">Medicamentos Ativos</span>
                <div className="bg-blue-500/10 p-2 rounded-xl">
                  <Pill className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <p className="text-4xl font-bold text-white mt-2">
                {medicamentos.filter(m => m.status === 'ativo').length}
              </p>
            </motion.div>

            {/* Card Próxima Dose */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#1C1C1F] rounded-2xl p-6 border border-neutral-800"
            >
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-sm">Próxima Dose</span>
                <div className="bg-purple-500/10 p-2 rounded-xl">
                  <Clock className="w-5 h-5 text-purple-500" />
                </div>
              </div>
              {(() => {
                const proximoMed = getProximoMedicamento(medicamentosAtivos);
                if (!proximoMed) {
                  return (
                    <div className="mt-2">
                      <p className="text-4xl font-bold text-white">--:--</p>
                      <p className="text-neutral-500 text-sm mt-1">Nenhum medicamento ativo</p>
                    </div>
                  );
                }

                const proximaDose = getProximaDose(proximoMed.horarios);
                const horaFormatada = Math.floor(proximaDose / 60).toString().padStart(2, '0') + ':' +
                  (proximaDose % 60).toString().padStart(2, '0');

                return (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <p className="text-4xl font-bold text-white">{horaFormatada}</p>
                      <p className="text-lg font-medium text-neutral-400">{proximoMed.nome}</p>
                    </div>
                    <p className="text-neutral-500 text-sm mt-1">
                      {getTempoAteProximaDose(proximaDose)}
                    </p>
                  </div>
                );
              })()}
            </motion.div>

            {/* Card Aderência */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#1C1C1F] rounded-2xl p-6 border border-neutral-800"
            >
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-sm">Aderência</span>
                <div className="bg-green-500/10 p-2 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
              </div>
              <p className="text-4xl font-bold text-white mt-2">95%</p>
            </motion.div>
          </div>

          {/* Ações e Filtros */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex gap-4">
              <Button
                variant={filtroStatus === 'todos' ? 'default' : 'outline'}
                className={`${filtroStatus === 'todos' ? 'bg-blue-600' : 'bg-[#1C1C1F]'} text-neutral-100 border-neutral-800`}
                onClick={() => setFiltroStatus('todos')}
              >
                Todos
                <span className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded-full">
                  {medicamentos.length}
                </span>
              </Button>

              <Button
                variant={filtroStatus === 'ativo' ? 'default' : 'outline'}
                className={`${filtroStatus === 'ativo' ? 'bg-green-600' : 'bg-[#1C1C1F]'} text-neutral-100 border-neutral-800`}
                onClick={() => setFiltroStatus('ativo')}
              >
                Ativos
                <span className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded-full">
                  {medicamentos.filter(m => m.status === 'ativo').length}
                </span>
              </Button>

              <Button
                variant={filtroStatus === 'pausado' ? 'default' : 'outline'}
                className={`${filtroStatus === 'pausado' ? 'bg-yellow-600' : 'bg-[#1C1C1F]'} text-neutral-100 border-neutral-800`}
                onClick={() => setFiltroStatus('pausado')}
              >
                Pausados
                <span className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded-full">
                  {medicamentos.filter(m => m.status === 'pausado').length}
                </span>
              </Button>

              <Button
                variant={filtroStatus === 'finalizado' ? 'default' : 'outline'}
                className={`${filtroStatus === 'finalizado' ? 'bg-neutral-600' : 'bg-[#1C1C1F]'} text-neutral-100 border-neutral-800`}
                onClick={() => setFiltroStatus('finalizado')}
              >
                Finalizados
                <span className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded-full">
                  {medicamentos.filter(m => m.status === 'finalizado').length}
                </span>
              </Button>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 w-4 h-4" />
                <Input
                  placeholder="Buscar medicamento..."
                  className="pl-10 bg-[#1C1C1F] border-neutral-800 text-white w-full md:w-[300px]"
                />
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-5 h-5 mr-2" />
                    Adicionar Medicamento
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1C1C1F] border-neutral-800 text-white max-w-2xl p-0">
                  {/* Header com ícone e descrição */}
                  <DialogHeader className="p-6 border-b border-neutral-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/10 p-3 rounded-xl">
                        <Pill className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <DialogTitle className="text-2xl">Novo Medicamento</DialogTitle>
                        <p className="text-sm text-neutral-400">Preencha as informações para adicionar um novo medicamento</p>
                      </div>
                    </div>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-6 p-6">
                    {/* Seção Principal */}
                    <div className="space-y-6">
                      {/* Nome e Status - Linha 1 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-neutral-200">Nome do Medicamento</Label>
                          <div className="relative">
                            <Pill className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                            <Input
                              value={formData.nome}
                              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                              className="bg-neutral-800 border-neutral-700 pl-10"
                              placeholder="Ex: Diazepan"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-neutral-200">Status</Label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-md h-10 px-3 text-white focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="ativo" className="bg-neutral-800">Ativo</option>
                            <option value="pausado" className="bg-neutral-800">Pausado</option>
                            <option value="finalizado" className="bg-neutral-800">Finalizado</option>
                          </select>
                        </div>
                      </div>

                      {/* Dosagem e Frequência - Linha 2 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-neutral-200">Dosagem</Label>
                          <Input
                            value={formData.dosagem}
                            onChange={(e) => setFormData({ ...formData, dosagem: e.target.value })}
                            className="bg-neutral-800 border-neutral-700"
                            placeholder="Ex: 500mg"
                          />
                          {/* Sugestões de dosagem comuns */}
                          <div className="flex gap-2 mt-2">
                            {['100mg', '250mg', '500mg'].map((dose) => (
                              <button
                                type="button"
                                key={dose}
                                onClick={() => setFormData({ ...formData, dosagem: dose })}
                                className="px-2 py-1 text-xs bg-neutral-700 rounded hover:bg-neutral-600 text-white"
                              >
                                {dose}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-neutral-200">Frequência</Label>
                          <Input
                            value={formData.frequencia}
                            onChange={(e) => setFormData({ ...formData, frequencia: e.target.value })}
                            className="bg-neutral-800 border-neutral-700"
                            placeholder="Ex: 2x ao dia"
                          />
                          {/* Sugestões de frequência comuns */}
                          <div className="flex gap-2 mt-2">
                            {['1x ao dia', '2x ao dia', '3x ao dia', '12/12h'].map((freq) => (
                              <button
                                type="button"
                                key={freq}
                                onClick={() => setFormData({ ...formData, frequencia: freq })}
                                className="px-2 py-1 text-xs bg-neutral-700 rounded hover:bg-neutral-600 text-white"
                              >
                                {freq}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Horários - Linha 3 */}
                      <div className="space-y-2">
                        <Label className="text-neutral-200">Horários</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                          <Input
                            value={formData.horarios}
                            onChange={(e) => setFormData({ ...formData, horarios: e.target.value })}
                            className="bg-neutral-800 border-neutral-700 pl-10"
                            placeholder="Ex: 08:00, 20:00"
                          />
                        </div>
                        {/* Sugestões de horários comuns */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {['08:00', '12:00', '20:00', '08:00, 20:00', '08:00, 16:00, 00:00'].map((time) => (
                            <button
                              type="button"
                              key={time}
                              onClick={() => setFormData({ ...formData, horarios: time })}
                              className="px-2 py-1 text-xs bg-neutral-700 rounded hover:bg-neutral-600 text-white"
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Datas - Linha 4 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-neutral-200">
                            Data de Início
                            <span className="text-blue-500 ml-1">*</span>
                          </Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                            <Input
                              type="date"
                              value={formData.dataInicio}
                              onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                              className="bg-neutral-800 border-neutral-700 pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-neutral-200 flex items-center gap-2">
                            Data de Término
                            <span className="text-xs text-neutral-500">(Opcional)</span>
                          </Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                            <Input
                              type="date"
                              value={formData.dataFim}
                              onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                              className="bg-neutral-800 border-neutral-700 pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Observações */}
                      <div className="space-y-2">
                        <Label className="text-neutral-200">Observações</Label>
                        <textarea
                          value={formData.observacoes}
                          onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-3 text-white h-24 resize-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Adicione informações importantes sobre o medicamento..."
                        />
                      </div>
                    </div>

                    {/* Footer com Botões */}
                    <div className="flex items-center justify-between pt-6 border-t border-neutral-800">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsDialogOpen(false)}
                        className="text-neutral-400 hover:text-white"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 px-8"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          'Salvar Medicamento'
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Lista de Medicamentos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicamentosFiltrados.map((med) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="group bg-[#1C1C1F] rounded-2xl p-6 border border-neutral-800 hover:border-blue-500/50"
              >
                {/* Cabeçalho do Card */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl">
                      <Pill className="w-5 h-5 text-white" />
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(med.status)}`}>
                      {med.status.charAt(0).toUpperCase() + med.status.slice(1)}
                    </span>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-5 h-5 text-neutral-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#1C1C1F] border-neutral-800">
                        <DropdownMenuLabel className="text-neutral-400">Status</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-neutral-800" />
                        <DropdownMenuItem
                          className="text-white hover:bg-neutral-800 cursor-pointer"
                          onClick={() => handleStatusChange(med.id, 'ativo')}
                          disabled={loadingStatus === med.id}
                        >
                          {loadingStatus === med.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                          )}
                          Ativo
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-white hover:bg-neutral-800 cursor-pointer"
                          onClick={() => handleStatusChange(med.id, 'pausado')}
                        >
                          <PauseCircle className="w-4 h-4 mr-2" />
                          Pausado
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-white hover:bg-neutral-800 cursor-pointer"
                          onClick={() => handleStatusChange(med.id, 'finalizado')}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Finalizado
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                  </button>
                </div>

                {/* Informações do Medicamento */}
                <h3 className="text-xl font-bold text-white mb-1">{med.nome}</h3>
                <p className="text-neutral-400 text-sm mb-4">{med.dosagem}</p>

                {/* Detalhes */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-neutral-300">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{med.frequencia} - {med.horarios.join(", ")}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-neutral-300">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>Desde {format(new Date(med.dataInicio), "dd/MM/yyyy")}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-neutral-300">
                    <Bell className="w-4 h-4 text-blue-500" />
                    <span>
                      {getTempoAteProximaDose(getProximaDose(med.horarios))}
                    </span>
                  </div>
                </div>

                {/* Barra de Progresso */}
                <div className="mt-6">
                  <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${calcularProgresso(med.dataInicio, med.dataFim)}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    {calcularProgresso(med.dataInicio, med.dataFim)}% do tratamento concluído
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
              {error}
            </div>
          )}

          {/* Estado Vazio */}
          {medicamentos.length === 0 && !isLoading && (
            <div className="min-h-[500px] p-8 relative overflow-hidden">
              {/* Gradientes sutis no background */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl" />

              <div className="max-w-2xl mx-auto relative">
                {/* Ícone Minimalista */}
                <motion.div
                  className="mb-12 flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-2xl relative">
                      <Pill className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </motion.div>

                {/* Conteúdo Principal */}
                <div className="text-center space-y-12">
                  <div className="space-y-4">
                    <motion.h1
                      className="text-4xl font-bold text-white"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      Gerencie seus Medicamentos
                    </motion.h1>
                    <motion.p
                      className="text-lg text-neutral-400"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Tenha o controle completo dos seus medicamentos em um só lugar,
                      com lembretes e acompanhamento personalizado.
                    </motion.p>
                  </div>

                  {/* Features */}
                  <motion.div
                    className="grid sm:grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="bg-[#1C1C1F] p-6 rounded-xl border border-neutral-800 hover:border-blue-500/50 transition-all duration-300">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="bg-blue-500/10 p-2 rounded-lg">
                          <Bell className="w-5 h-5 text-blue-500" />
                        </div>
                        <h3 className="font-medium text-white">Lembretes Inteligentes</h3>
                      </div>
                      <p className="text-sm text-neutral-400 ml-11">
                        Nunca mais esqueça de tomar seus medicamentos no horário certo
                      </p>
                    </div>

                    <div className="bg-[#1C1C1F] p-6 rounded-xl border border-neutral-800 hover:border-blue-500/50 transition-all duration-300">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="bg-blue-500/10 p-2 rounded-lg">
                          <Activity className="w-5 h-5 text-blue-500" />
                        </div>
                        <h3 className="font-medium text-white">Acompanhamento Detalhado</h3>
                      </div>
                      <p className="text-sm text-neutral-400 ml-11">
                        Monitore o progresso do seu tratamento em tempo real
                      </p>
                    </div>
                  </motion.div>

                  {/* Call to Action */}
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      onClick={() => setIsDialogOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl transition-all"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Adicionar Primeiro Medicamento
                    </Button>

                    <p className="text-sm text-neutral-500">
                      Mais de 1000 usuários já estão gerenciando seus medicamentos
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}