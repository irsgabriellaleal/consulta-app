import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const consultasAgendadas = await prisma.agendamento.findMany({
      include: {
        usuario: {
          select: {
            nome: true,
          },
        },
      },
      orderBy: {
        data: "asc",
      },
    });

    const consultasFormatadas = consultasAgendadas.map((consulta) => ({
      id: consulta.id,
      nomePaciente: consulta.usuario.nome,
      nomeMedico: consulta.nomeMedico,
      data: consulta.data.toISOString().split("T")[0],
      horario: consulta.horario,
      especialidade: consulta.especialidade,
    }));

    return NextResponse.json(consultasFormatadas);
  } catch (error) {
    console.error("Erro ao buscar consultas agendadas:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request) {
  try {
    const { id, data, horario } = await request.json();

    const consultaAtualizada = await prisma.agendamento.update({
      where: { id: parseInt(id) },
      data: {
        data: new Date(data),
        horario,
      },
    });

    return NextResponse.json({
      message: "Consulta atualizada com sucesso",
      consulta: consultaAtualizada,
    });
  } catch (error) {
    console.error("Erro ao atualizar consulta:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    await prisma.agendamento.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Consulta deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar consulta:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
