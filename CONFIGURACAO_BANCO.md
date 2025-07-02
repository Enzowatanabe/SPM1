# Configuração do Banco de Dados Supabase

## 1. Criar conta no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub ou crie uma conta
4. Clique em "New Project"

## 2. Configurar o Projeto

1. **Nome do projeto**: `spm2` (ou qualquer nome)
2. **Database Password**: Crie uma senha forte
3. **Region**: Escolha a região mais próxima (ex: São Paulo)
4. Clique em "Create new project"

## 3. Obter as Credenciais

1. No painel do Supabase, vá em **Settings** → **API**
2. Copie:
   - **Project URL** (ex: `https://xyz.supabase.co`)
   - **anon public** key (começa com `eyJ...`)

## 4. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

## 5. Criar as Tabelas no Banco

No painel do Supabase, vá em **SQL Editor** e execute:

### Tabela de Contas a Pagar:
```sql
CREATE TABLE contasapagar (
  id BIGINT PRIMARY KEY,
  conta TEXT NOT NULL,
  descricao TEXT,
  valor TEXT NOT NULL,
  vencimento DATE NOT NULL,
  dataPagamento DATE,
  status TEXT NOT NULL DEFAULT 'A PAGAR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela de Funcionários:
```sql
CREATE TABLE funcionarios (
  id BIGINT PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  cpf TEXT,
  rg TEXT,
  dataNascimento DATE,
  dataContratacao DATE,
  status TEXT DEFAULT 'Ativo',
  observacoes TEXT,
  pagamentos JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela de Clientes:
```sql
CREATE TABLE clientes (
  id BIGINT PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  cpf_cnpj TEXT,
  endereco TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela de Lançamentos Financeiros:
```sql
CREATE TABLE lancamentos (
  id BIGINT PRIMARY KEY,
  transacao TEXT NOT NULL,
  categoria TEXT NOT NULL,
  descricao TEXT,
  data DATE NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  formaPagamento TEXT,
  banco TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 6. Configurar Políticas de Segurança (RLS)

Para permitir leitura e escrita pública (para desenvolvimento):

```sql
-- Contas a pagar
ALTER TABLE contasapagar ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir acesso público" ON contasapagar FOR ALL USING (true);

-- Funcionários
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir acesso público" ON funcionarios FOR ALL USING (true);

-- Clientes
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir acesso público" ON clientes FOR ALL USING (true);

-- Lançamentos
ALTER TABLE lancamentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir acesso público" ON lancamentos FOR ALL USING (true);
```

## 7. Testar a Configuração

1. Execute `npm run dev`
2. Acesse a página de contas a pagar
3. Tente criar uma nova conta
4. Verifique se aparece no painel do Supabase

## 8. Deploy no Netlify

1. Configure as variáveis de ambiente no Netlify:
   - Vá em **Site settings** → **Environment variables**
   - Adicione:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. Faça o deploy normalmente

## 9. Migração de Dados (Opcional)

Se você já tem dados no localStorage, pode migrá-los:

```javascript
// Execute no console do navegador
const contas = JSON.parse(localStorage.getItem('contasapagar') || '[]');
contas.forEach(async (conta) => {
  await fetch('/api/contasapagar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(conta)
  });
});
```

## Benefícios

✅ **Dados compartilhados**: Todos os usuários veem os mesmos dados
✅ **Backup automático**: Supabase faz backup automático
✅ **Escalável**: Suporta milhares de usuários
✅ **Gratuito**: Plano gratuito com 500MB de dados
✅ **Tempo real**: Pode implementar atualizações em tempo real

## Próximos Passos

1. Implementar autenticação de usuários
2. Adicionar controle de permissões
3. Implementar notificações em tempo real
4. Adicionar backup automático 