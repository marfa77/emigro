-- @emigro_chat_bot redesign (2026-11-19): the specialist-request dialogue gets its own app value.
-- Old values stay so live sessions of retired apps do not fail the check before they expire.
ALTER TABLE emigro_bot_sessions DROP CONSTRAINT IF EXISTS emigro_bot_sessions_app_check;
ALTER TABLE emigro_bot_sessions
  ADD CONSTRAINT emigro_bot_sessions_app_check
  CHECK (app IN ('request', 'assist', 'property', 'news', 'city', 'invest', 'tax', 'wizard'));
UPDATE emigro_bot_sessions SET app = 'request' WHERE app = 'assist';
