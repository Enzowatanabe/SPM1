import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({ orderBy: { id: 'desc' } });
    return NextResponse.json(clientes);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json({ error: 'Erro ao buscar clientes.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Recebido no POST /api/clientes:', body);
    // Extrai parcelasDetalhadas do body, se houver
    const { parcelasDetalhadas, ...clienteData } = body;
    // Cria o cliente
    const novo = await prisma.cliente.create({ data: clienteData });
    // Se vier parcelasDetalhadas, cria as parcelas associadas
    if (parcelasDetalhadas && Array.isArray(parcelasDetalhadas) && parcelasDetalhadas.length > 0) {
      await prisma.parcela.createMany({
        data: parcelasDetalhadas.map((p: any) => ({
          valor: p.valor,
          data: p.data,
          clienteId: novo.id
        }))
      });
    }
    return NextResponse.json(novo);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
} 