'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Shield, Check, Award, Star, Zap, Users, Activity, Heart, Globe, Clock } from 'lucide-react';
import { toast } from 'sonner';
import Header from "@src/components/Header";
import { Button } from "@src/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@src/components/ui/card";
import { useRouter } from 'next/navigation';

export default function PlanosPage() {
  const { data: session } = useSession();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchPlans();
    if (session?.user) {
      fetchUserPlan();
    }
  }, [session]);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans');
      if (!response.ok) {
        throw new Error('Erro ao buscar planos');
      }
      const data = await response.json();
      // Garantir que os benefícios estejam no formato correto
      const formattedPlans = data.map(plan => ({
        ...plan,
        beneficios: Array.isArray(plan.beneficios)
          ? plan.beneficios
          : typeof plan.beneficios === 'string'
            ? JSON.parse(plan.beneficios)
            : []
      }));
      setPlans(formattedPlans);
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
      toast.error('Erro ao carregar planos');
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPlan = async () => {
    try {
      const response = await fetch('/api/plans/user');
      if (response.ok) {
        const data = await response.json();
        setUserPlan(data);
      }
    } catch (error) {
      console.error('Erro ao buscar plano do usuário:', error);
    }
  };

  const handleSubscribe = async (planId) => {
    if (!session) {
      toast.error('Faça login para assinar um plano');
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/plans/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        throw new Error('Erro ao assinar plano');
      }

      toast.success('Plano assinado com sucesso!');
      await fetchUserPlan();
    } catch (error) {
      console.error('Erro ao assinar plano:', error);
      toast.error('Erro ao assinar plano');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p>Carregando planos...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0A0F1C] text-white">
        {/* Hero Section com Efeito Parallax */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 mix-blend-multiply" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          </div>

          {/* Círculos de Luz */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/30 rounded-full filter blur-[100px]" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/30 rounded-full filter blur-[100px]" />

          <div className="container mx-auto px-4 py-24 relative">
            {/* Título com Animação */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
              <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 animate-gradient">
                Planos de Saúde Clinix
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Escolha o plano ideal para você e sua família. Todos incluem acesso premium
                à nossa plataforma de telemedicina e rede de profissionais.
              </p>
            </div>

            {/* Cards de Estatísticas com Glassmorphism */}
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              {[
                { icon: Users, title: "+10.000", subtitle: "Pacientes Atendidos", color: "from-blue-400/20 to-blue-600/20" },
                { icon: Heart, title: "98%", subtitle: "Satisfação", color: "from-purple-400/20 to-purple-600/20" },
                { icon: Globe, title: "24/7", subtitle: "Suporte Online", color: "from-pink-400/20 to-pink-600/20" }
              ].map((stat, idx) => (
                <div key={idx} className={`
                  relative overflow-hidden rounded-2xl backdrop-blur-lg
                  bg-gradient-to-br ${stat.color} border border-white/10
                  p-8 group transition-all duration-300 hover:scale-105
                `}>
                  <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300" />
                  <stat.icon className="h-10 w-10 text-white/80 mb-4 group-hover:text-white 
                    transition-all duration-300" />
                  <h3 className="text-3xl font-bold mb-2">{stat.title}</h3>
                  <p className="text-gray-300">{stat.subtitle}</p>
                </div>
              ))}
            </div>

            {/* Plano Atual do Usuário com Efeito de Vidro */}
            {userPlan && (
              <div className="mt-20 mb-16 max-w-3xl mx-auto transform hover:scale-[1.02] transition-all duration-300">
                <div className="relative bg-gradient-to-r from-blue-600/30 to-purple-600/30 
                  rounded-2xl overflow-hidden backdrop-blur-xl border border-white/10 p-8">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full 
                    filter blur-[100px] -z-10" />

                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Seu Plano Atual</h2>
                      <p className="text-xl text-blue-300">{userPlan.plan.nome}</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                        <p className="text-blue-200 mb-1">Desconto em Consultas</p>
                        <p className="text-4xl font-bold bg-clip-text text-transparent 
                          bg-gradient-to-r from-blue-400 to-purple-400">
                          {userPlan.plan.descontoConsulta}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cards dos Planos com Efeito de Hover Avançado */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <div key={plan.id} className="relative group">
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white 
                        px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                        Mais Popular
                      </div>
                    </div>
                  )}

                  <Card className={`
                    relative overflow-hidden transition-all duration-500
                    ${plan.isPopular
                      ? 'bg-gradient-to-b from-blue-900/50 to-purple-900/50'
                      : 'bg-gray-900/50'} 
                    backdrop-blur-xl border-white/10 group-hover:border-blue-500/50
                    transform group-hover:-translate-y-2
                  `}>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent 
                      to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <CardHeader className="relative z-10">
                      <CardTitle className="flex items-center gap-3 text-2xl mb-6">
                        {plan.nome}
                        {plan.isPopular && <Award className="text-blue-400 animate-pulse" />}
                      </CardTitle>
                      <div className="flex items-baseline">
                        <span className="text-5xl font-bold bg-clip-text text-transparent 
                          bg-gradient-to-r from-blue-400 to-purple-400">
                          R$ {Number(plan.preco).toFixed(2)}
                        </span>
                        <span className="text-gray-400 ml-2">/mês</span>
                      </div>
                    </CardHeader>

                    <CardContent className="relative z-10 space-y-6">
                      <div className="space-y-3">
                        {plan.beneficios.map((beneficio, index) => (
                          <div key={index} className={`
                            flex items-center gap-3 transition-all duration-300
                            ${selectedPlan === plan.id || index < 4 ? 'opacity-100' : 'opacity-60'}
                            group-hover:opacity-100
                          `}>
                            <div className="bg-blue-500/20 rounded-full p-1">
                              <Check className="h-4 w-4 text-blue-400" />
                            </div>
                            <span className="text-gray-300 group-hover:text-white transition-colors">
                              {beneficio}
                            </span>
                          </div>
                        ))}
                      </div>

                      <Button
                        className={`
    w-full py-6 text-lg font-medium transition-all duration-300
    ${loading
                            ? 'bg-gray-700 cursor-not-allowed opacity-50'
                            : userPlan?.planId === plan.id
                              ? 'bg-green-600/20 text-green-400 border border-green-500/50 hover:bg-green-600/30'
                              : plan.isPopular
                                ? 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg hover:shadow-blue-500/25'
                                : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white border border-gray-700 hover:border-blue-500/50'
                          }
    relative overflow-hidden group
  `}
                        onClick={() => !loading && handleSubscribe(plan.id)}
                        disabled={loading}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative">
                          {loading
                            ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                <span>Processando...</span>
                              </div>
                            )
                            : userPlan?.planId === plan.id
                              ? 'Plano Atual'
                              : 'Assinar Plano'
                          }
                        </span>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Seção "Todos os planos incluem" com Design Premium */}
            <div className="mt-32 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-16 bg-clip-text text-transparent 
                bg-gradient-to-r from-blue-400 to-purple-400">
                Todos os planos incluem
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { icon: Shield, title: "Proteção Total", desc: "Cobertura completa para você e sua família" },
                  { icon: Clock, title: "Atendimento 24/7", desc: "Suporte médico disponível a qualquer hora" },
                  { icon: Star, title: "Especialistas", desc: "Acesso aos melhores profissionais" }
                ].map((feature, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 
                    backdrop-blur-xl rounded-xl p-8 border border-white/10 hover:border-blue-500/50 
                    transition-all duration-300 hover:transform hover:scale-105">
                    <feature.icon className="h-12 w-12 text-blue-400 mb-6" />
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-400">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}