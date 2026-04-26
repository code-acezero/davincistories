-- 1. Publish status enum
CREATE TYPE public.publish_status AS ENUM ('draft', 'review', 'published');

-- 2. Add status to blog_posts (keep is_published for backward compat — sync via trigger)
ALTER TABLE public.blog_posts
  ADD COLUMN status public.publish_status NOT NULL DEFAULT 'draft',
  ADD COLUMN preview_token uuid NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN submitted_at timestamptz,
  ADD COLUMN submitted_by uuid;

-- Backfill: existing published posts -> 'published'
UPDATE public.blog_posts SET status = 'published' WHERE is_published = true;

-- Sync trigger: keep is_published <-> status='published'
CREATE OR REPLACE FUNCTION public.sync_blog_published()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.is_published := (NEW.status = 'published');
  IF NEW.status = 'published' AND OLD.status IS DISTINCT FROM 'published' THEN
    NEW.published_at := COALESCE(NEW.published_at, now());
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER blog_posts_sync_published
  BEFORE INSERT OR UPDATE OF status ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.sync_blog_published();

-- 3. Add status to gallery_images (mirrors is_visible)
ALTER TABLE public.gallery_images
  ADD COLUMN status public.publish_status NOT NULL DEFAULT 'draft',
  ADD COLUMN preview_token uuid NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN submitted_at timestamptz,
  ADD COLUMN submitted_by uuid;

UPDATE public.gallery_images SET status = 'published' WHERE is_visible = true;

CREATE OR REPLACE FUNCTION public.sync_gallery_visible()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.is_visible := (NEW.status = 'published');
  RETURN NEW;
END;
$$;
CREATE TRIGGER gallery_images_sync_visible
  BEFORE INSERT OR UPDATE OF status ON public.gallery_images
  FOR EACH ROW EXECUTE FUNCTION public.sync_gallery_visible();

-- 4. Public read policies: only published (preserve existing admin-manage policies)
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.blog_posts;
CREATE POLICY "Anyone can view published posts" ON public.blog_posts
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Anyone can view visible images" ON public.gallery_images;
CREATE POLICY "Anyone can view published images" ON public.gallery_images
  FOR SELECT USING (status = 'published');

-- Moderators can view + update status (submit to review) on blog/gallery
CREATE POLICY "Moderators can view all posts" ON public.blog_posts
  FOR SELECT USING (public.has_role(auth.uid(), 'moderator'));
CREATE POLICY "Moderators can submit posts" ON public.blog_posts
  FOR UPDATE USING (public.has_role(auth.uid(), 'moderator'))
  WITH CHECK (public.has_role(auth.uid(), 'moderator') AND status IN ('draft','review'));

CREATE POLICY "Moderators can view all images" ON public.gallery_images
  FOR SELECT USING (public.has_role(auth.uid(), 'moderator'));
CREATE POLICY "Moderators can submit images" ON public.gallery_images
  FOR UPDATE USING (public.has_role(auth.uid(), 'moderator'))
  WITH CHECK (public.has_role(auth.uid(), 'moderator') AND status IN ('draft','review'));

-- 5. Audit log table
CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,            -- e.g. 'role.granted', 'role.revoked', 'auth.oauth_attempt', 'admin.bootstrap_regenerated', 'post.published'
  actor_id uuid,                        -- who performed the action (nullable for system events)
  actor_email text,
  target_id uuid,                       -- what was affected (user id, post id, etc.)
  target_label text,                    -- human-readable target
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log" ON public.audit_log
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert audit log" ON public.audit_log
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
-- Authenticated users can insert their own audit entries (for self-events like login)
CREATE POLICY "Users can log own events" ON public.audit_log
  FOR INSERT WITH CHECK (auth.uid() = actor_id);

CREATE INDEX idx_audit_log_created_at ON public.audit_log (created_at DESC);
CREATE INDEX idx_audit_log_event_type ON public.audit_log (event_type);

-- 6. Trigger: log role changes automatically
CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_log (event_type, actor_id, target_id, target_label, metadata)
    VALUES ('role.granted', auth.uid(), NEW.user_id, NEW.role::text, jsonb_build_object('role', NEW.role));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_log (event_type, actor_id, target_id, target_label, metadata)
    VALUES ('role.revoked', auth.uid(), OLD.user_id, OLD.role::text, jsonb_build_object('role', OLD.role));
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER user_roles_audit
  AFTER INSERT OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_role_change();

-- 7. Trigger: log publish state transitions
CREATE OR REPLACE FUNCTION public.log_publish_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.audit_log (event_type, actor_id, target_id, target_label, metadata)
    VALUES (
      TG_TABLE_NAME || '.' || NEW.status::text,
      auth.uid(),
      NEW.id,
      COALESCE(NEW.title, NEW.id::text),
      jsonb_build_object('from', OLD.status, 'to', NEW.status, 'table', TG_TABLE_NAME)
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER blog_posts_publish_audit
  AFTER UPDATE OF status ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.log_publish_change();
CREATE TRIGGER gallery_images_publish_audit
  AFTER UPDATE OF status ON public.gallery_images
  FOR EACH ROW EXECUTE FUNCTION public.log_publish_change();