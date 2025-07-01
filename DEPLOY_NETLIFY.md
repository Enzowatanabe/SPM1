# Como Publicar no Netlify

## Pré-requisitos
1. Ter uma conta no [Netlify](https://netlify.com)
2. Ter o projeto no GitHub, GitLab ou Bitbucket
3. Ter o Git configurado localmente

## Passos para Publicação

### 1. Preparar o Projeto
O projeto já está configurado com os arquivos necessários:
- `netlify.toml` - Configuração do Netlify
- `next.config.ts` - Configuração do Next.js para export estático
- `package.json` - Scripts de build atualizados

### 2. Fazer Commit e Push
```bash
git add .
git commit -m "Configuração para deploy no Netlify"
git push origin main
```

### 3. Publicar no Netlify

#### Opção A: Deploy via Git (Recomendado)
1. Acesse [netlify.com](https://netlify.com) e faça login
2. Clique em "Add new site" → "Import an existing project"
3. Conecte sua conta do GitHub/GitLab/Bitbucket
4. Selecione o repositório do seu projeto
5. Configure as opções de build:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
6. Clique em "Deploy site"

#### Opção B: Deploy Manual
1. Execute localmente: `npm run build`
2. A pasta `out` será criada com os arquivos estáticos
3. Arraste a pasta `out` para o Netlify

### 4. Configurações Adicionais (Opcional)

#### Variáveis de Ambiente
Se precisar de variáveis de ambiente:
1. No painel do Netlify, vá em "Site settings" → "Environment variables"
2. Adicione suas variáveis

#### Domínio Personalizado
1. No painel do Netlify, vá em "Domain settings"
2. Clique em "Add custom domain"
3. Siga as instruções para configurar DNS

## Estrutura do Projeto
- `/src/app/` - Páginas e componentes
- `/prisma/` - Configuração do banco de dados
- `/public/` - Arquivos estáticos
- `netlify.toml` - Configuração do Netlify
- `next.config.ts` - Configuração do Next.js

## Funcionalidades
- ✅ Sistema de Clientes
- ✅ Financeiro (Contas a Pagar)
- ✅ Fluxo de Caixa
- ✅ Funcionários
- ✅ Orçamentos
- ✅ Dados salvos no localStorage

## Notas Importantes
- O projeto usa localStorage para persistir dados
- Não há banco de dados externo configurado
- Todas as funcionalidades são client-side
- O deploy é estático (não há API routes)

## Suporte
Se encontrar problemas:
1. Verifique os logs de build no Netlify
2. Teste localmente com `npm run build`
3. Verifique se todos os arquivos foram commitados 