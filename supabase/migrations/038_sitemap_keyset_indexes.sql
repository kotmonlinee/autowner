-- Sitemap shard queries paginate diagnoses with:
--   ORDER BY created_at DESC, slug DESC ... range(offset, offset+999)
-- Without a matching index, every page re-sorts the whole table and deep
-- offsets get slower as the table grows, pushing the route past the
-- serverless function time limit. Google then can't read the shard and the
-- sitemap "discovered URLs" count never updates.
CREATE INDEX IF NOT EXISTS idx_diagnoses_created_slug
  ON diagnoses (created_at DESC, slug DESC);

-- OBD sitemap shard orders by code (unique, already indexed) so no extra
-- index is needed there; keep the secondary sort deterministic too.
CREATE INDEX IF NOT EXISTS idx_obd_codes_created
  ON obd_codes (created_at DESC);
