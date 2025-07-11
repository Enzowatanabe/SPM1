import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const funcionarios = await prisma.funcionario.findMany({ orderBy: { nome: 'asc' } });
    return NextResponse.json(funcionarios);
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
    return NextResponse.json({ error: 'Erro ao buscar funcionários.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const funcionario = await prisma.funcionario.create({ data: body });
    return NextResponse.json(funcionario);
  } catch (error) {
    console.error('Erro ao criar funcionário:', error);
    return NextResponse.json({ error: 'Erro ao criar funcionário.' }, { status: 500 });
  }
} 