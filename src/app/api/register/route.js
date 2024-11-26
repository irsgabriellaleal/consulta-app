// app/api/register/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password, nome, dataNascimento } = await request.json();

    if (!email || !password || !nome || !dataNascimento) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        senha: hashedPassword,
        nome,
        dataNascimento: new Date(dataNascimento),
      }
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
      }
    });

  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 }
    );
  }
}