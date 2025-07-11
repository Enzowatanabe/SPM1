import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const funcionario = await prisma.funcionario.update({ where: { id: Number(params.id) }, data: body });
    return NextResponse.json(funcionario);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar funcionário.' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.funcionario.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir funcionário.' }, { status: 500 });
  }
} 