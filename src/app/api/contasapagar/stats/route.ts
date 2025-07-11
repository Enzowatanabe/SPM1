import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const hoje = new Date().toISOString().slice(0, 10);
    
    // Contas vencidas
    const contasVencidas = await prisma.contaAPagar.count({
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
      }
    });

    // Contas que vencem hoje
    const contasHoje = await prisma.contaAPagar.count({
      where: {
        AND: [
          { status: 'A PAGAR' },
          { vencimento: hoje }
        ]
      }
    });

    // Total de contas a pagar
    const totalContasAPagar = await prisma.contaAPagar.count({
      where: {
        status: 'A PAGAR'
      }
    });

    // Valor total das contas vencidas
    const valorContasVencidas = await prisma.contaAPagar.aggregate({
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
      _sum: {
        valor: true
      }
    });

    // Valor total das contas que vencem hoje
    const valorContasHoje = await prisma.contaAPagar.aggregate({
      where: {
        AND: [
          { status: 'A PAGAR' },
          { vencimento: hoje }
        ]
      },
      _sum: {
        valor: true
      }
    });

    return NextResponse.json({
      contasVencidas,
      contasHoje,
      totalContasAPagar,
      valorContasVencidas: valorContasVencidas._sum.valor || '0',
      valorContasHoje: valorContasHoje._sum.valor || '0'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar estatísticas.' }, { status: 500 });
  }
} 