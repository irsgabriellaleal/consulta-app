// app/api/medicamentos/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const medicamentos = await prisma.medicamento.findMany({
      where: {
        userId: parseInt(session.user.id)
      },
      orderBy: {
        criadoEm: 'desc'
      }
    });

    return NextResponse.json(medicamentos);
  } catch (error) {
    console.error("Erro ao buscar medicamentos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar medicamentos" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const data = await request.json();
    const {
      nome,
      dosagem,
      frequencia,
      horarios,
      dataInicio,
      dataFim,
      observacoes,
    } = data;

    const medicamento = await prisma.medicamento.create({
      data: {
        nome,
        dosagem,
        frequencia,
        horarios,
        dataInicio: new Date(dataInicio),
        dataFim: dataFim ? new Date(dataFim) : null,
        observacoes,
        userId: parseInt(session.user.id),
      },
    });

    return NextResponse.json(medicamento);
  } catch (error) {
    console.error("Erro ao criar medicamento:", error);
    return NextResponse.json(
      { error: "Erro ao criar medicamento" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}