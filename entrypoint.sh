#!/bin/sh

echo "🚀 Iniciando container do NestJS..."

# Espera o Postgres estar pronto
echo "⏳ Aguardando Postgres..."
until nc -z "$POSTGRES_HOST" "$POSTGRES_PORT"; do
  sleep 1
done
echo "✅ Postgres disponível!"

# Executa migrações Prisma
echo "🧩 Executando migrações Prisma..."
npx prisma migrate deploy

# Gera o Prisma Client (caso ainda não esteja)
npx prisma generate

# Inicia a aplicação
echo "🏁 Iniciando aplicação NestJS..."
exec "$@"
