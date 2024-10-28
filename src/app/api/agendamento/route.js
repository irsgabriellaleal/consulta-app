import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// Inicialize o PrismaClient fora da função de rota
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
    }

    const { data, horario, especialidade, nomeMedico } = await request.json();

    console.log('Dados recebidos:', { data, horario, especialidade, nomeMedico });

    const usuario = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!usuario) {
      return NextResponse.json({ success: false, error: 'Usuário não encontrado' }, { status: 404 });
    }

    const agendamento = await prisma.agendamento.create({
      data: {
        data: new Date(data),
        horario,
        especialidade,
        usuarioId: usuario.id,
        nomeMedico,
      },
    });

    console.log('Agendamento criado:', agendamento);

    return NextResponse.json({ success: true, agendamento });
  } catch (error) {
    console.error('Erro detalhado ao criar agendamento:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro interno do servidor',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Adicione um manipulador de eventos para fechar a conexão do Prisma quando o servidor for encerrado
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});