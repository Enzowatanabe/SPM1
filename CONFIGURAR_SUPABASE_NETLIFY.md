# Configurar Supabase + Netlify - Dados Compartilhados

## 🎯 Objetivo
Fazer com que **todos os usuários** vejam os **mesmos dados** no seu sistema no Netlify.

## 🚀 Passo a Passo

### 1. Criar conta no Supabase

1. **Acesse** [supabase.com](https://supabase.com)
2. **Clique** em "Start your project"
3. **Faça login** com GitHub
4. **Clique** em "New Project"

### 2. Configurar o Projeto

1. **Nome do projeto**: `spm2` (ou qualquer nome)
2. **Database Password**: Crie uma senha forte
3. **Region**: Escolha São Paulo (mais próximo)
4. **Clique** em "Create new project"

### 3. Obter Credenciais

1. No painel do Supabase, vá em **Settings** → **API**
2. **Copie**:
   - **Project URL** (ex: `https://xyz.supabase.co`)
   - **anon public** key (começa com `eyJ...`)

### 4. Criar Tabelas

No **SQL Editor** do Supabase, execute:

```sql
-- Tabela de Contas a Pagar
CREATE TABLE contasapagar (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conta TEXT NOT NULL,
  descricao TEXT,
  valor TEXT NOT NULL,
  vencimento TEXT NOT NULL,
  dataPagamento TEXT,
  status TEXT DEFAULT 'A PAGAR',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Funcionários
CREATE TABLE funcionarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  cpf TEXT,
  rg TEXT,
  dataNascimento TEXT,
  dataContratacao TEXT,
  status TEXT DEFAULT 'Ativo',
  observacoes TEXT,
  pagamentos TEXT DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Clientes
CREATE TABLE clientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  cpf_cnpj TEXT,
  endereco TEXT,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Lançamentos
CREATE TABLE lancamentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transacao TEXT NOT NULL,
  categoria TEXT NOT NULL,
  descricao TEXT,
  data TEXT NOT NULL,
  valor REAL NOT NULL,
  formaPagamento TEXT,
  banco TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Configurar Políticas de Segurança

```sql
-- Permitir acesso público (para desenvolvimento)
ALTER TABLE contasapagar ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir acesso público" ON contasapagar FOR ALL USING (true);

ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir acesso público" ON funcionarios FOR ALL USING (true);

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir acesso público" ON clientes FOR ALL USING (true);

ALTER TABLE lancamentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir acesso público" ON lancamentos FOR ALL USING (true);
```

### 6. Configurar Variáveis no Netlify

1. **No painel do Netlify**, vá em **Site settings** → **Environment variables**
2. **Adicione**:
   - `NEXT_PUBLIC_SUPABASE_URL` = sua URL do Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = sua chave anônima

### 7. Fazer Deploy

1. **Commit e push** das mudanças:
```bash
git add .
git commit -m "Configuração Supabase para dados compartilhados"
git push origin main
```

2. **O Netlify fará deploy automático**

## 🎯 Resultado

Após o deploy:
- ✅ **URL pública**: `https://seu-site.netlify.app`
- ✅ **Dados compartilhados**: Todos veem os mesmos dados
- ✅ **Tempo real**: Atualizações instantâneas
- ✅ **Backup automático**: Supabase faz backup

## 📊 Como Funciona

```
Usuário A (PC) → Netlify → Supabase (Banco na nuvem)
Usuário B (Celular) → Netlify → Supabase (Banco na nuvem)
Usuário C (Tablet) → Netlify → Supabase (Banco na nuvem)
```

**Todos acessam o mesmo banco PostgreSQL!**

## 🔧 Verificar se está funcionando

1. **Acesse** seu site no Netlify
2. **Vá** em Contas a Pagar
3. **Crie** uma nova conta
4. **Verifique** no Supabase (Table Editor) se apareceu
5. **Acesse** de outro dispositivo e veja se aparece

## 🛠️ Solução de Problemas

### Erro de CORS:
- Verifique se as variáveis de ambiente estão corretas
- Reinicie o deploy no Netlify

### Dados não aparecem:
- Verifique as políticas de segurança no Supabase
- Confirme se as tabelas foram criadas

### Erro de build:
- Verifique se o `output: 'export'` está no next.config.ts
- Confirme se as API routes estão corretas

## 💡 Vantagens

- ✅ **Dados compartilhados** - Banco único na nuvem
- ✅ **Tempo real** - WebSockets automáticos
- ✅ **Backup automático** - Dados seguros
- ✅ **Dashboard** - Interface visual para dados
- ✅ **Escalável** - Suporta milhares de usuários

## 🎉 Pronto!

Agora **todos os usuários** que acessarem seu sistema no Netlify verão os **mesmos dados**! 🚀 