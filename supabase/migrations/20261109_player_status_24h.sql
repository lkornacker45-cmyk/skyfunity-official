-- Store public Minecraft player-count samples for the rolling 24-hour chart.
CREATE TABLE IF NOT EXISTS public.skyfunity_player_status_history (
  sampled_at timestamptz PRIMARY KEY DEFAULT now(),
  java_players integer,
  bedrock_players integer,
  CONSTRAINT skyfunity_java_nonnegative CHECK (java_players IS NULL OR java_players >= 0),
  CONSTRAINT skyfunity_bedrock_nonnegative CHECK (bedrock_players IS NULL OR bedrock_players >= 0)
);
CREATE INDEX IF NOT EXISTS skyfunity_status_history_recent_idx ON public.skyfunity_player_status_history (sampled_at DESC);
ALTER TABLE public.skyfunity_player_status_history ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.skyfunity_player_status_history FROM anon, authenticated;
CREATE OR REPLACE FUNCTION public.skyfunity_status_last_24h()
RETURNS TABLE(sampled_at timestamptz, java_players integer, bedrock_players integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
 SELECT h.sampled_at,h.java_players,h.bedrock_players
 FROM public.skyfunity_player_status_history h
 WHERE h.sampled_at >= now() - interval '24 hours'
 ORDER BY h.sampled_at ASC LIMIT 500;
$$;
REVOKE ALL ON FUNCTION public.skyfunity_status_last_24h() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.skyfunity_status_last_24h() TO anon, authenticated;
