ALTER TABLE public.audios ADD COLUMN is_featured boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.unset_other_featured_audio()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.is_featured THEN
    UPDATE public.audios SET is_featured = false WHERE id <> NEW.id AND is_featured = true;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_unset_other_featured_audio
BEFORE INSERT OR UPDATE ON public.audios
FOR EACH ROW EXECUTE FUNCTION public.unset_other_featured_audio();