-- Keep vector at 768 dimensions (we'll reduce embedding output to 768)
-- Just recreate the match function to be safe
drop function if exists match_documents;

create or replace function match_documents(
  query_embedding vector(768),
  match_threshold float default 0.3,
  match_count int default 5
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
    select
      dc.id,
      dc.content,
      dc.metadata,
      1 - (dc.embedding <=> query_embedding) as similarity
    from document_chunks dc
    where 1 - (dc.embedding <=> query_embedding) > match_threshold
    order by dc.embedding <=> query_embedding
    limit match_count;
end;
$$;
