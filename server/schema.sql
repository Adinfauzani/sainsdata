CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES admins (id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions (expires_at);

CREATE TABLE IF NOT EXISTS instrumen_sections (
  no INTEGER PRIMARY KEY,
  nama TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS instrumen_rows (
  section_no INTEGER NOT NULL REFERENCES instrumen_sections (no) ON DELETE CASCADE,
  row_no INTEGER NOT NULL,
  row_id TEXT NOT NULL,
  sub_kriteria TEXT NOT NULL,
  indikator TEXT NOT NULL,
  penjelasan_prodi TEXT,
  PRIMARY KEY (section_no, row_id)
);

ALTER TABLE instrumen_rows ADD COLUMN IF NOT EXISTS penjelasan_prodi TEXT;

CREATE TABLE IF NOT EXISTS instrumen_children (
  section_no INTEGER NOT NULL,
  row_id TEXT NOT NULL,
  child_no INTEGER NOT NULL,
  sub_kriteria TEXT NOT NULL,
  indikator TEXT NOT NULL,
  doc JSONB,
  file_name TEXT,
  file_url TEXT,
  PRIMARY KEY (section_no, row_id, child_no),
  FOREIGN KEY (section_no, row_id)
    REFERENCES instrumen_rows (section_no, row_id)
    ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION enforce_admin_limit() RETURNS trigger AS $$
BEGIN
  IF (SELECT count(*) FROM admins) >= 3 THEN
    RAISE EXCEPTION 'Maksimal 3 akun admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS admins_limit ON admins;
CREATE TRIGGER admins_limit
  BEFORE INSERT ON admins
  FOR EACH ROW
  EXECUTE FUNCTION enforce_admin_limit();
