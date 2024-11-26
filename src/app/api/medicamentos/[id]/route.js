// app/api/medicamentos/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = params;
    const data = await request.json();

    // Validação do status
    if (data.status && !['ativo', 'pausado', 'finalizado'].includes(data.status)) {
      return NextResponse.json(
        { error: "Status inválido" },
        { status: 400 }
      );
    }

    // Busca o medicamento primeiro para verificar se existe e pertence ao usuário
    const existingMedicamento = await prisma.medicamento.findFirst({
      where: {
        id: parseInt(id),
        userId: parseInt(session.user.id)
      }
    });

    if (!existingMedicamento) {
      return NextResponse.json(
        { error: "Medicamento não encontrado" },
        { status: 404 }
      );
    }

    // Atualiza o medicamento
    const medicamento = await prisma.medicamento.update({
      where: {
        id: parseInt(id)
      },
      data: {
        ...data,
        userId: parseInt(session.user.id) // Mantém o userId original
      }
    });

    return NextResponse.json(medicamento);
  } catch (error) {
    console.error("Erro ao atualizar medicamento:", error);
    // Retorna o erro específico para debug
    return NextResponse.json(
      { error: "Erro ao atualizar medicamento", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}