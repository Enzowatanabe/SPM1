import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;
    const id = Number(pathname.split('/').pop());
    const data = await req.json();
    const conta = await prisma.contaAPagar.update({
      where: { id },
      data,
    });
    return NextResponse.json(conta);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar conta.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;
    const id = Number(pathname.split('/').pop());
    await prisma.contaAPagar.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir conta.' }, { status: 500 });
  }
} 