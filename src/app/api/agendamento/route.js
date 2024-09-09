import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

// Inicialize o PrismaClient fora da função de rota
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { data, horario, especialidade, usuarioId } = await request.json();

    console.log('Dados recebidos:', { data, horario, especialidade, usuarioId });

    const usuario = await prisma.user.findUnique({
      where: {
        id: parseInt(usuarioId),
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
        usuarioId: parseInt(usuarioId),
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