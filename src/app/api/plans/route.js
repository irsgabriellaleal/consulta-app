import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: {
        preco: 'asc'
      }
    });

    if (!plans) {
      return NextResponse.json([]);
    }

    // Parse os benefícios para garantir que são JSON válido
    const formattedPlans = plans.map(plan => ({
      ...plan,
      beneficios: typeof plan.beneficios === 'string'
        ? JSON.parse(plan.beneficios)
        : plan.beneficios
    }));

    return NextResponse.json(formattedPlans);
  } catch (error) {
    console.error('Erro detalhado ao buscar planos:', error);
    return NextResponse.json({
      error: 'Erro ao buscar planos',
      details: error.message
    }, {
      status: 500
    });
  }
}