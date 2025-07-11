import Dexie, { Table } from 'dexie';

// Tipos das tabelas
export interface ContaAPagar {
  id?: number;
  conta: string;
  descricao?: string;
  valor: string;
  vencimento: string;
  dataPagamento?: string;
  status: 'A PAGAR' | 'PAGA' | 'VENCIDA';
  createdAt?: Date;
}

export interface Funcionario {
  id?: number;
  nome: string;
  cargo: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  rg?: string;
  dataNascimento?: string;
  dataContratacao?: string;
  status: string;
  observacoes?: string;
  pagamentos: any[];
  createdAt?: Date;
  valorDia?: number; // Salário diário
}

export interface Cliente {
  id?: number;
  nome: string;
  email?: string;
  telefone?: string;
  cpfCnpj?: string;
  endereco?: string;
  observacoes?: string;
  createdAt?: Date;
}

export interface Lancamento {
  id?: number;
  transacao: string;
  categoria: string;
  descricao?: string;
  data: string;
  valor: number;
  formaPagamento?: string;
  banco?: string;
  createdAt?: Date;
}

// Classe do banco de dados
export class SPMDatabase extends Dexie {
  contasAPagar!: Table<ContaAPagar>;
  funcionarios!: Table<Funcionario>;
  clientes!: Table<Cliente>;
  lancamentos!: Table<Lancamento>;

  constructor() {
    super('SPMDatabase');
    
    this.version(1).stores({
      contasAPagar: '++id, conta, vencimento, status, createdAt',
      funcionarios: '++id, nome, cargo, status, createdAt',
      clientes: '++id, nome, email, createdAt',
      lancamentos: '++id, transacao, categoria, data, valor, createdAt'
    });
  }
}

// Instância global do banco
export const db = new SPMDatabase();

// Funções auxiliares para migração do localStorage
export async function migrarDoLocalStorage() {
  try {
    // Migrar contas a pagar
    const contasLocal = localStorage.getItem('contasapagar');
    if (contasLocal) {
      const contas = JSON.parse(contasLocal);
      await db.contasAPagar.bulkAdd(contas);
      localStorage.removeItem('contasapagar');
    }

    // Migrar funcionários
    const funcionariosLocal = localStorage.getItem('funcionarios');
    if (funcionariosLocal) {
      const funcionarios = JSON.parse(funcionariosLocal);
      await db.funcionarios.bulkAdd(funcionarios);
      localStorage.removeItem('funcionarios');
    }

    // Migrar clientes
    const clientesLocal = localStorage.getItem('clientes');
    if (clientesLocal) {
      const clientes = JSON.parse(clientesLocal);
      await db.clientes.bulkAdd(clientes);
      localStorage.removeItem('clientes');
    }

    // Migrar lançamentos
    const lancamentosLocal = localStorage.getItem('lancamentos');
    if (lancamentosLocal) {
      const lancamentos = JSON.parse(lancamentosLocal);
      await db.lancamentos.bulkAdd(lancamentos);
      localStorage.removeItem('lancamentos');
    }

    console.log('Migração do localStorage concluída!');
  } catch (error) {
    console.error('Erro na migração:', error);
  }
}

// Função para exportar dados
export async function exportarDados() {
  try {
    const dados = {
      contasAPagar: await db.contasAPagar.toArray(),
      funcionarios: await db.funcionarios.toArray(),
      clientes: await db.clientes.toArray(),
      lancamentos: await db.lancamentos.toArray()
    };
    
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spm-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
  }
}

// Função para importar dados
export async function importarDados(file: File) {
  try {
    const text = await file.text();
    const dados = JSON.parse(text);
    
    await db.transaction('rw', [db.contasAPagar, db.funcionarios, db.clientes, db.lancamentos], async () => {
      if (dados.contasAPagar) {
        await db.contasAPagar.clear();
        await db.contasAPagar.bulkAdd(dados.contasAPagar);
      }
      
      if (dados.funcionarios) {
        await db.funcionarios.clear();
        await db.funcionarios.bulkAdd(dados.funcionarios);
      }
      
      if (dados.clientes) {
        await db.clientes.clear();
        await db.clientes.bulkAdd(dados.clientes);
      }
      
      if (dados.lancamentos) {
        await db.lancamentos.clear();
        await db.lancamentos.bulkAdd(dados.lancamentos);
      }
    });
    
    console.log('Importação concluída!');
    window.location.reload(); // Recarregar para mostrar os dados
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    alert('Erro ao importar dados. Verifique se o arquivo é válido.');
  }
} 