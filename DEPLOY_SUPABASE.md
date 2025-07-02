# Deploy com Supabase - Dados Compartilhados

## ✅ Por que Supabase?

- **Dados compartilhados** - Banco PostgreSQL na nuvem
- **Tempo real** - Atualizações instantâneas
- **Autenticação** - Login de usuários
- **Backup automático** - Dados seguros
- **Escalável** - Suporta milhões de usuários

## 🔄 Migração do SQLite para Supabase

### 1. Instalar Supabase
```bash
npm install @supabase/supabase-js
```

### 2. Criar conta no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto

### 3. Configurar variáveis
Crie `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
```

### 4. Criar tabelas
No SQL Editor do Supabase:
```sql
-- Contas a pagar
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

-- Funcionários
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
```

### 5. Configurar políticas
```sql
-- Permitir acesso público
ALTER TABLE contasapagar ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir acesso público" ON contasapagar FOR ALL USING (true);

ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir acesso público" ON funcionarios FOR ALL USING (true);
```

## 🚀 Deploy no Netlify

### 1. Configurar build
```bash
npm run build
```

### 2. No Netlify
- Build command: `npm run build`
- Publish directory: `out`
- Environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📊 Como Funciona

```
Usuário A → Netlify → Supabase (Banco na nuvem)
Usuário B → Netlify → Supabase (Banco na nuvem)
Usuário C → Netlify → Supabase (Banco na nuvem)
```

**Todos acessam o mesmo banco PostgreSQL!**

## 🎯 Vantagens do Supabase

- ✅ **Dados compartilhados** - Banco único na nuvem
- ✅ **Tempo real** - WebSockets automáticos
- ✅ **Autenticação** - Login e permissões
- ✅ **Backup** - Automático e seguro
- ✅ **Dashboard** - Interface visual para dados
- ✅ **API automática** - REST e GraphQL

## 🔧 Comandos Úteis

### Migrar dados do SQLite:
```javascript
// No console do navegador
const contas = await fetch('/api/contasapagar').then(r => r.json());
contas.forEach(conta => {
  // Enviar para Supabase
});
```

### Ver dados no Supabase:
1. Acesse o painel do Supabase
2. Vá em "Table Editor"
3. Veja todas as tabelas e dados

## 💡 Comparação Final

| Aspecto | SQLite Local | Supabase | Vercel |
|---------|-------------|----------|--------|
| **Dados Compartilhados** | ❌ Não | ✅ Sim | ✅ Sim |
| **Complexidade** | 🟢 Fácil | 🟡 Médio | 🟢 Fácil |
| **Custo** | 🟢 Gratuito | 🟢 Gratuito | 🟢 Gratuito |
| **Tempo Real** | ❌ Não | ✅ Sim | ❌ Não |
| **Autenticação** | ❌ Não | ✅ Sim | ❌ Não |

## 🎉 Recomendação

**Para dados compartilhados:**
1. **Vercel** - Mais simples, SQLite no servidor
2. **Supabase** - Mais recursos, PostgreSQL na nuvem

**Escolha Vercel se quer simplicidade!** 