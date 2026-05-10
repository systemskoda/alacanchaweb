
-- Matches (transmisiones de partidos)
CREATE TABLE public.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  cover_image_url text,
  stream_url text,
  match_date timestamptz,
  is_match_of_day boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read matches" ON public.matches FOR SELECT TO public USING (true);
CREATE POLICY "auth write matches" ON public.matches FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Ensure only one match-of-day at a time
CREATE OR REPLACE FUNCTION public.unset_other_match_of_day()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.is_match_of_day THEN
    UPDATE public.matches SET is_match_of_day = false WHERE id <> NEW.id AND is_match_of_day = true;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_unset_other_match_of_day
AFTER INSERT OR UPDATE OF is_match_of_day ON public.matches
FOR EACH ROW WHEN (NEW.is_match_of_day = true)
EXECUTE FUNCTION public.unset_other_match_of_day();

-- Guests (Invitados) photos
CREATE TABLE public.guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read guests" ON public.guests FOR SELECT TO public USING (true);
CREATE POLICY "auth write guests" ON public.guests FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('matches', 'matches', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('guests', 'guests', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public read matches bucket" ON storage.objects FOR SELECT USING (bucket_id = 'matches');
CREATE POLICY "auth write matches bucket" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'matches') WITH CHECK (bucket_id = 'matches');
CREATE POLICY "public read guests bucket" ON storage.objects FOR SELECT USING (bucket_id = 'guests');
CREATE POLICY "auth write guests bucket" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'guests') WITH CHECK (bucket_id = 'guests');
