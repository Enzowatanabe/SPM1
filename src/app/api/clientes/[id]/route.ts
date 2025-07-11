import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const cliente = await prisma.cliente.update({ where: { id }, data: body });
    return NextResponse.json(cliente);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    await prisma.cliente.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: { parcelasDetalhadas: true }
    });
    return NextResponse.json(cliente);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
} 