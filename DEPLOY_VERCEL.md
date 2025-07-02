# Deploy no Vercel - Dados Compartilhados

## ✅ Por que Vercel?

- **Dados compartilhados** - Todos veem os mesmos dados
- **SQLite funciona** - Banco único no servidor
- **Deploy automático** - Conecta com GitHub
- **Gratuito** - Plano free generoso
- **Mais simples** - Não precisa configurar servidor

## 🚀 Passo a Passo

### 1. Preparar o Projeto

Seu projeto já está pronto! Só precisa:

```bash
# Verificar se está tudo funcionando
npm run build
```

### 2. Subir para GitHub

```bash
git add .
git commit -m "Sistema com SQLite e dados compartilhados"
git push origin main
```

### 3. Deploy no Vercel

1. **Acesse** [vercel.com](https://vercel.com)
2. **Faça login** com GitHub
3. **Clique** em "New Project"
4. **Selecione** seu repositório
5. **Configure**:
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. **Clique** em "Deploy"

### 4. Configurar Variáveis (Opcional)

Se precisar de variáveis de ambiente:
1. No painel do Vercel, vá em **Settings** → **Environment Variables**
2. Adicione suas variáveis

## 🎯 Resultado

- ✅ **URL pública**: `https://seu-projeto.vercel.app`
- ✅ **Dados compartilhados**: Todos veem os mesmos dados
- ✅ **Deploy automático**: Cada push atualiza o site
- ✅ **Backup automático**: Vercel faz backup do banco

## 📊 Como Funciona

```
Usuário A (PC) → Vercel (Servidor) → SQLite (Banco Único)
Usuário B (Celular) → Vercel (Servidor) → SQLite (Banco Único)
Usuário C (Tablet) → Vercel (Servidor) → SQLite (Banco Único)
```

**Todos acessam o mesmo banco de dados!**

## 🔧 Comandos Úteis

### Deploy manual:
```bash
npx vercel
```

### Ver logs:
```bash
npx vercel logs
```

### Acessar banco:
```bash
npx vercel env pull
```

## 💡 Vantagens

- **Simplicidade**: Deploy com um clique
- **Performance**: CDN global
- **Escalabilidade**: Suporta milhares de usuários
- **Monitoramento**: Logs e analytics
- **Domínio**: URL personalizada

## 🆚 Comparação

| Plataforma | Dados Compartilhados | Complexidade | Custo |
|------------|---------------------|--------------|-------|
| **Vercel** | ✅ Sim | 🟢 Fácil | 🟢 Gratuito |
| Netlify | ❌ Não (estático) | 🟢 Fácil | 🟢 Gratuito |
| Railway | ✅ Sim | 🟡 Médio | 🟡 Pago |
| Render | ✅ Sim | 🟡 Médio | 🟡 Pago |

## 🎉 Pronto!

Após o deploy no Vercel:
1. **Compartilhe a URL** com sua equipe
2. **Todos verão os mesmos dados**
3. **Atualizações em tempo real**
4. **Backup automático**

**Vercel é a melhor opção para o que você quer!** 🚀 