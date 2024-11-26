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

      await fetchMedicamentos(); // Recarrega a lista
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
    const agora = new Date();
    const horaAtual = agora.getHours() * 60 + agora.getMinutes();

    return horarios.reduce((proxima, horario) => {
      const [hora, minuto] = horario.split(':');
      const horarioMinutos = parseInt(hora) * 60 + parseInt(minuto);

      if (horarioMinutos > horaAtual && (!proxima || horarioMinutos < proxima)) {
        return horarioMinutos;
      }
      return proxima;
    }, null);
  };

  const getTempoAteProximaDose = (proximaDoseMinutos) => {
    if (!proximaDoseMinutos) return "Próxima dose amanhã";

    const agora = new Date();
    const horaAtual = agora.getHours() * 60 + agora.getMinutes();
    const diferenca = proximaDoseMinutos - horaAtual;

    const horas = Math.floor(diferenca / 60);
    const minutos = diferenca % 60;

    if (horas > 0) {
      return `Em ${horas}h${minutos > 0 ? ` e ${minutos}min` : ''}`;
    }
    return `Em ${minutos} minutos`;
  };

  const calcularProgresso = (dataInicio, dataFim) => {
    if (!dataFim) return 75; // Valor padrão para tratamentos sem data fim
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const hoje = new Date();
    const total = fim - inicio;
    const atual = hoje - inicio;
    return Math.min(Math.round((atual / total) * 100), 100);
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
              <div className="mt-2">
                <p className="text-4xl font-bold text-white">
                  {medicamentos[0]?.horarios[0]}
                </p>
                <p className="text-neutral-500 text-sm mt-1">
                  {medicamentos[0]?.horarios[0] &&
                    getTempoAteProximaDose(getProximaDose(medicamentos[0].horarios))}
                </p>
              </div>
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
                <DialogContent className="bg-[#1C1C1F] border-neutral-800 text-white max-w-2xl p-0 gap-0">
                  <DialogHeader className="p-6 border-b border-neutral-800">
                    <DialogTitle className="text-2xl">Novo Medicamento</DialogTitle>
                    <p className="text-neutral-400 text-sm">Preencha as informações do medicamento</p>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-6 p-6">
                    {/* Divisão em 2 colunas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Coluna 1 */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="nome" className="text-neutral-200">Nome do Medicamento</Label>
                          <Input
                            id="nome"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            required
                            className="bg-neutral-800 border-neutral-700 mt-1.5 h-11"
                            placeholder="Ex: Diazepan"
                          />
                        </div>

                        <div>
                          <Label htmlFor="dosagem" className="text-neutral-200">Dosagem</Label>
                          <Input
                            id="dosagem"
                            value={formData.dosagem}
                            onChange={(e) => setFormData({ ...formData, dosagem: e.target.value })}
                            placeholder="Ex: 500mg"
                            required
                            className="bg-neutral-800 border-neutral-700 mt-1.5 h-11"
                          />
                        </div>

                        <div>
                          <Label htmlFor="status" className="text-neutral-200">Status</Label>
                          <select
                            id="status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-md mt-1.5 h-11 px-3 text-white"
                            required
                          >
                            <option value="ativo">Ativo</option>
                            <option value="pausado">Pausado</option>
                            <option value="finalizado">Finalizado</option>
                          </select>
                        </div>
                      </div>

                      {/* Coluna 2 */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="frequencia" className="text-neutral-200">Frequência</Label>
                          <Input
                            id="frequencia"
                            value={formData.frequencia}
                            onChange={(e) => setFormData({ ...formData, frequencia: e.target.value })}
                            placeholder="Ex: 2x ao dia"
                            required
                            className="bg-neutral-800 border-neutral-700 mt-1.5 h-11"
                          />
                        </div>

                        <div>
                          <Label htmlFor="horarios" className="text-neutral-200">Horários</Label>
                          <Input
                            id="horarios"
                            value={formData.horarios}
                            onChange={(e) => setFormData({ ...formData, horarios: e.target.value })}
                            placeholder="Ex: 08:00, 20:00"
                            required
                            className="bg-neutral-800 border-neutral-700 mt-1.5 h-11"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Datas em linha */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="dataInicio" className="text-neutral-200">Data de Início</Label>
                        <Input
                          id="dataInicio"
                          type="date"
                          value={formData.dataInicio}
                          onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                          required
                          className="bg-neutral-800 border-neutral-700 mt-1.5 h-11"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dataFim" className="text-neutral-200">Data de Término (opcional)</Label>
                        <Input
                          id="dataFim"
                          type="date"
                          value={formData.dataFim}
                          onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                          className="bg-neutral-800 border-neutral-700 mt-1.5 h-11"
                        />
                      </div>
                    </div>

                    {/* Observações em largura total */}
                    <div>
                      <Label htmlFor="observacoes" className="text-neutral-200">Observações</Label>
                      <textarea
                        id="observacoes"
                        value={formData.observacoes}
                        onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                        placeholder="Observações adicionais sobre o medicamento..."
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-md mt-1.5 p-3 text-white h-24 resize-none"
                      />
                    </div>

                    {/* Botões em um card footer */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="bg-transparent border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={isLoading}
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