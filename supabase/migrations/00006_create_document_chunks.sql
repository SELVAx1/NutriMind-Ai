-- RAG knowledge base table with vector embeddings
create table if not exists knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source text not null,
  doc_type text,
  publication_date date,
  created_at timestamptz default now()
);

create table if not exists document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references knowledge_documents(id) on delete cascade not null,
  content text not null,
  embedding vector(768),
  metadata jsonb default '{}'::jsonb,
  chunk_index int default 0,
  created_at timestamptz default now()
);

create index if not exists idx_document_chunks_embedding
  on document_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 10);

-- RLS
alter table knowledge_documents enable row level security;
alter table document_chunks enable row level security;

create policy "Anyone can read knowledge documents" on knowledge_documents
  for select using (auth.role() = 'authenticated');

create policy "Anyone can read document chunks" on document_chunks
  for select using (auth.role() = 'authenticated');
