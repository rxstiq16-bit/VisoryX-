-- Add typing indicators table
CREATE TABLE IF NOT EXISTS typing_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  user_name text NOT NULL,
  channel text NOT NULL DEFAULT 'general',
  updated_at timestamp with time zone DEFAULT now()
);

-- Add read receipts table
CREATE TABLE IF NOT EXISTS message_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  read_at timestamp with time zone DEFAULT now(),
  UNIQUE(message_id, user_id)
);

-- Add chat_theme column to profiles if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS chat_theme text DEFAULT 'default';

-- Enable RLS
ALTER TABLE typing_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reads ENABLE ROW LEVEL SECURITY;

-- RLS policies for typing_indicators
CREATE POLICY "Anyone can view typing indicators" ON typing_indicators FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert typing indicators" ON typing_indicators FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own typing indicators" ON typing_indicators FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own typing indicators" ON typing_indicators FOR DELETE USING (true);

-- RLS policies for message_reads
CREATE POLICY "Anyone can view read receipts" ON message_reads FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert read receipts" ON message_reads FOR INSERT WITH CHECK (true);

-- Enable realtime for typing indicators
ALTER PUBLICATION supabase_realtime ADD TABLE typing_indicators;
ALTER PUBLICATION supabase_realtime ADD TABLE message_reads;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_typing_indicators_channel ON typing_indicators(channel);
CREATE INDEX IF NOT EXISTS idx_typing_indicators_updated ON typing_indicators(updated_at);
CREATE INDEX IF NOT EXISTS idx_message_reads_message ON message_reads(message_id);
