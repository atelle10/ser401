FROM python:3.13-slim

WORKDIR /app

RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir pandas sqlalchemy psycopg2-binary

COPY database/Fire_EMS_Schema_DDL.sql /app/schema.sql
COPY auth_server/better-auth_migrations/2026-01-18T00-43-36.982Z.sql /app/auth_migration.sql
COPY backend/db_ops/migration_script.py /app/migration_script.py
COPY deployment/db/db_init.sh /app/db_init.sh

RUN chmod +x /app/db_init.sh

CMD ["/app/db_init.sh"]
