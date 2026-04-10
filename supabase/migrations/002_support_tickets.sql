-- Support tickets (POST /api/support). Idempotent for new and existing databases.

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  category text NOT NULL DEFAULT 'other',
  priority text NOT NULL DEFAULT 'normal',
  system_info jsonb,
  user_id uuid REFERENCES auth.users (id),
  source text NOT NULL DEFAULT 'web',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Legacy: table existed with only `message` (combined blob) — add split columns
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS subject text;
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS priority text;

UPDATE public.support_tickets SET priority = coalesce(nullif(trim(priority), ''), 'normal') WHERE priority IS NULL OR trim(priority) = '';
UPDATE public.support_tickets SET subject = '(legacy — see message)' WHERE subject IS NULL OR trim(subject) = '';

ALTER TABLE public.support_tickets ALTER COLUMN subject SET NOT NULL;
ALTER TABLE public.support_tickets ALTER COLUMN priority SET NOT NULL;
ALTER TABLE public.support_tickets ALTER COLUMN priority SET DEFAULT 'normal';

COMMENT ON COLUMN public.support_tickets.message IS 'Description / body only; subject is stored separately.';
COMMENT ON COLUMN public.support_tickets.subject IS 'Short summary from the client.';

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
