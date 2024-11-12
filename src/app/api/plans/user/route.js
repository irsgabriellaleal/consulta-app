import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@src/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(null);
    }

    // Primeiro, encontre o usuário pelo email
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      return NextResponse.json(null);
    }

    // Então busque o plano ativo do usuário
    const userPlan = await prisma.userPlan.findFirst({
      where: {
        userId: user.id,
        status: 'active',
      },
      include: {
        plan: true,
      },
    });

    if (!userPlan) {
      return NextResponse.json(null);
    }

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
    console.error('Erro ao buscar plano do usuário:', error);
    return NextResponse.json({
      error: 'Erro ao buscar plano do usuário',
      details: error.message
    }, {
      status: 500
    });
  }
}