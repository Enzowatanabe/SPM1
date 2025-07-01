import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const orcamentos = await prisma.orcamento.findMany();
    res.status(200).json(orcamentos);
  } else if (req.method === 'POST') {
    const novo = req.body;
    const orcamento = await prisma.orcamento.create({ data: novo });
    res.status(201).json(orcamento);
  } else {
    res.status(405).end();
  }
}

