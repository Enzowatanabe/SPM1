import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const hoje = new Date().toISOString().slice(0, 10);
    
    // Buscar contas vencidas (vencimento < hoje e status A PAGAR ou VENCIDA)
    const contasVencidas = await prisma.contaAPagar.findMany({
      where: {
        AND: [
          {
            OR: [
              { status: 'A PAGAR' },
              { status: 'VENCIDA' }
            ]
          },
          {
            vencimento: {
              lt: hoje
            }
          }
        ]
      },
      orderBy: { vencimento: 'asc' }
    });

    // Buscar contas que vencem hoje
    const contasHoje = await prisma.contaAPagar.findMany({
      where: {
        AND: [
          { status: 'A PAGAR' },
          { vencimento: hoje }
        ]
      },
      orderBy: { vencimento: 'asc' }
    });

    return NextResponse.json({
      vencidas: contasVencidas,
      hoje: contasHoje
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar contas vencidas.' }, { status: 500 });
  }
} 