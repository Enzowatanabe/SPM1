export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const lancamentos = await prisma.lancamento.findMany({ orderBy: { data: 'asc' } });
    return NextResponse.json(lancamentos);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar lançamentos.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const novo = await prisma.lancamento.create({ data: body });
    return NextResponse.json(novo);
  } catch (error) {
    console.error('Erro ao criar lançamento:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
} 