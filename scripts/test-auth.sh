#!/bin/bash

# Script para testar autenticação com json-server
echo "🚀 Iniciando teste de autenticação com JSON Server"

# Verificar se json-server está rodando
if ! curl -s http://localhost:3001 > /dev/null; then
    echo "⚠️  JSON Server não está rodando. Iniciando..."
    echo "Execute: pnpm run db"
    exit 1
fi

echo "✅ JSON Server está rodando"

# Verificar se Next.js está rodando
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "⚠️  Next.js não está rodando. Iniciando..."
    echo "Execute: pnpm run dev"
    exit 1
fi

echo "✅ Next.js está rodando"
echo "🌐 Acesse: http://localhost:3000/login para testar a autenticação"
