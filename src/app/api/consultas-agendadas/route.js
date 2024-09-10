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
      data: consulta.data.toISOString().split("T")[0], // Formato YYYY-MM-DD
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
