import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@src/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Buscar o usuário pelo email
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const { planId } = await request.json();

    // Verifica se já existe um plano ativo
    const existingPlan = await prisma.userPlan.findFirst({
      where: {
        userId: user.id,
        status: 'active',
      },
    });

    if (existingPlan) {
      // Cancela o plano existente
      await prisma.userPlan.update({
        where: { id: existingPlan.id },
        data: {
          status: 'cancelled',
          dataFim: new Date()
        },
      });
    }

    // Cria nova assinatura
    const userPlan = await prisma.userPlan.create({
      data: {
        userId: user.id,
        planId: planId,
        status: 'active',
        dataInicio: new Date(),
      },
      include: {
        plan: true,
      },
    });

    // Parse os benefícios do plano
    const formattedUserPlan = {
      ...userPlan,
      plan: {
        ...userPlan.plan,
        beneficios: typeof userPlan.plan.beneficios === 'string'
          ? JSON.parse(userPlan.plan.beneficios)
          : userPlan.plan.beneficios
      }
    };

    return NextResponse.json(formattedUserPlan);
  } catch (error) {
    console.error('Erro ao assinar plano:', error);
    return NextResponse.json({
      error: 'Erro ao assinar plano',
      details: error.message
    }, {
      status: 500
    });
  }
}