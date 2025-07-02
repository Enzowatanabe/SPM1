# Configuração do Banco SQLite com Prisma

## ✅ Vantagens do SQLite

- **Mais simples** - Não precisa de conta externa
- **Arquivo único** - Banco fica em `prisma/dev.db`
- **Funciona offline** - Perfeito para desenvolvimento
- **Gratuito** - Sem limites de uso
- **Já configurado** - Prisma já está instalado

## 🚀 Configuração Automática

O banco já está configurado! As tabelas foram criadas automaticamente:

- ✅ **ContaAPagar** - Contas a pagar
- ✅ **Funcionario** - Funcionários e pagamentos
- ✅ **Cliente** - Clientes e fornecedores
- ✅ **Lancamento** - Lançamentos financeiros
- ✅ **Orcamento** - Orçamentos

## 📁 Estrutura do Banco

```
prisma/
├── dev.db              # Arquivo do banco SQLite
├── schema.prisma       # Schema das tabelas
└── migrations/         # Histórico de mudanças
```

## 🔧 Comandos Úteis

### Ver dados no banco:
```bash
npx prisma studio
```

### Resetar banco (cuidado!):
```bash
npx prisma migrate reset
```

### Gerar cliente Prisma:
```bash
npx prisma generate
```

### Ver status do banco:
```bash
npx prisma db push
```

## 🌐 Deploy no Netlify

### Opção 1: Deploy Estático (Recomendado)
Para sites estáticos, o SQLite funciona localmente:

1. **Configure o build**:
```bash
npm run build
```

2. **No Netlify**:
   - Build command: `npm run build`
   - Publish directory: `out`

3. **Dados locais**: Cada usuário terá seus próprios dados no navegador

### Opção 2: Deploy com API (Avançado)
Para dados compartilhados, você precisará de um servidor:

1. **Vercel** (Recomendado):
   - Conecte seu repositório
   - Deploy automático
   - SQLite funciona perfeitamente

2. **Railway/Render**:
   - Serviços que suportam SQLite
   - Deploy com API routes

## 📊 Migração de Dados

### Do localStorage para SQLite:
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

### Backup do banco:
```bash
# Copie o arquivo do banco
cp prisma/dev.db backup_$(date +%Y%m%d).db
```

## 🔍 Verificando se está funcionando

1. **Execute o projeto**:
```bash
npm run dev
```

2. **Acesse**: `http://localhost:3000/financeiro/contasapagar`

3. **Crie uma conta** e verifique se aparece

4. **Abra o Prisma Studio**:
```bash
npx prisma studio
```

5. **Verifique os dados** no navegador em `http://localhost:5555`

## 🛠️ Solução de Problemas

### Erro de migração:
```bash
npx prisma migrate reset
npx prisma migrate dev
```

### Banco corrompido:
```bash
rm prisma/dev.db
npx prisma migrate dev
```

### Cliente não gerado:
```bash
npx prisma generate
```

## 📈 Próximos Passos

1. **Implementar autenticação** (opcional)
2. **Adicionar backup automático**
3. **Implementar sincronização** entre dispositivos
4. **Adicionar relatórios** e dashboards

## 🎯 Benefícios Implementados

✅ **Dados estruturados** - Banco relacional
✅ **Consultas otimizadas** - Prisma ORM
✅ **Tipagem forte** - TypeScript
✅ **Migrações automáticas** - Controle de versão
✅ **Interface visual** - Prisma Studio
✅ **Backup fácil** - Arquivo único

## 💡 Dicas

- **Desenvolvimento**: Use `npm run dev` para desenvolvimento
- **Produção**: Use Vercel para deploy com API
- **Backup**: Copie `prisma/dev.db` regularmente
- **Debug**: Use `npx prisma studio` para ver dados
- **Logs**: Verifique o console do navegador para erros 