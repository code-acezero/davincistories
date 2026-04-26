DROP POLICY IF EXISTS "Users can log own events" ON public.audit_log;
CREATE POLICY "Users can log own auth events" ON public.audit_log
  FOR INSERT WITH CHECK (
    auth.uid() = actor_id
    AND event_type IN ('auth.login', 'auth.logout', 'auth.oauth_attempt', 'auth.oauth_success', 'auth.oauth_failure')
  );