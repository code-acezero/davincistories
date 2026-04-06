
-- Music playlist table for admin-managed background audio
CREATE TABLE public.music_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  file_url text NOT NULL,
  track_type text NOT NULL DEFAULT 'bgm' CHECK (track_type IN ('bgm', 'welcome')),
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.music_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active tracks" ON public.music_tracks FOR SELECT USING (true);
CREATE POLICY "Admins can manage tracks" ON public.music_tracks FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
