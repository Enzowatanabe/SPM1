import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const contas = await prisma.contaAPagar.findMany({ orderBy: { vencimento: 'asc' } });
    return NextResponse.json(contas);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar contas.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const novaConta = await prisma.contaAPagar.create({ data });
    return NextResponse.json(novaConta, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar conta.' }, { status: 500 });
  }
}

// Para PUT e DELETE, usaremos rotas dinâmicas ([id]/route.ts) 