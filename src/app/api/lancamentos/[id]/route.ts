import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    await prisma.lancamento.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Erro ao excluir lançamento:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
} 