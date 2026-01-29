#!/bin/bash
set -e

until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$DB_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q' 2>/dev/null; do
  echo "Waiting for database..."
  sleep 2
done

echo "Running schema..."
PGPASSWORD=$POSTGRES_PASSWORD psql -h "$DB_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /app/schema.sql

PGPASSWORD=$POSTGRES_PASSWORD psql -h "$DB_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  -c "CREATE SCHEMA IF NOT EXISTS auth;"

PGPASSWORD=$POSTGRES_PASSWORD psql -h "$DB_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  -c "SET search_path TO auth;" \
  -f /app/auth_migration.sql

if [ -f "/data/fire.csv" ] && [ -f "/data/ems.csv" ]; then
  echo "Running migration..."
  python /app/migration_script.py /data/fire.csv /data/ems.csv
else
  echo "CSV files not found, skipping migration"
fi

echo "Database initialization complete"
