-- OPCIONAL: búsqueda semántica con pgvector.
-- Requiere la extensión instalada en el servidor (https://github.com/pgvector/pgvector).
-- NEXIA funciona sin esto (usa búsqueda por palabras clave sobre el catálogo);
-- este script deja preparada la columna para una futura búsqueda por embeddings.
CREATE EXTENSION IF NOT EXISTS vector;
ALTER TABLE ofertas_culturales ADD COLUMN IF NOT EXISTS embedding_vec vector(1536);
CREATE INDEX IF NOT EXISTS idx_ofertas_embedding ON ofertas_culturales USING hnsw (embedding_vec vector_cosine_ops);
