-- Create default_costs table
CREATE TABLE IF NOT EXISTS default_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milk_price_per_liter DECIMAL(10, 2) NOT NULL DEFAULT 0,
  premix_price_per_packet DECIMAL(10, 2) NOT NULL DEFAULT 0,
  coffee_price_per_liter DECIMAL(10, 2) NOT NULL DEFAULT 0,
  cup_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  spoon_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  price_per_cup_sold DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create daily_entries table
CREATE TABLE IF NOT EXISTS daily_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date DATE NOT NULL UNIQUE,
  milk_liters DECIMAL(10, 2) NOT NULL DEFAULT 0,
  milk_price_per_liter DECIMAL(10, 2) NOT NULL DEFAULT 0,
  milk_total_cost DECIMAL(10, 2) GENERATED ALWAYS AS (milk_liters * milk_price_per_liter) STORED,
  premix_packets INTEGER NOT NULL DEFAULT 0,
  premix_price_per_packet DECIMAL(10, 2) NOT NULL DEFAULT 0,
  premix_total_cost DECIMAL(10, 2) GENERATED ALWAYS AS (premix_packets * premix_price_per_packet) STORED,
  coffee_liters DECIMAL(10, 2) NOT NULL DEFAULT 0,
  coffee_price_per_liter DECIMAL(10, 2) NOT NULL DEFAULT 0,
  coffee_total_cost DECIMAL(10, 2) GENERATED ALWAYS AS (coffee_liters * coffee_price_per_liter) STORED,
  cups_used INTEGER NOT NULL DEFAULT 0,
  cup_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  cups_total_cost DECIMAL(10, 2) GENERATED ALWAYS AS (cups_used * cup_price) STORED,
  spoons_used INTEGER NOT NULL DEFAULT 0,
  spoon_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  spoons_total_cost DECIMAL(10, 2) GENERATED ALWAYS AS (spoons_used * spoon_price) STORED,
  cups_sold INTEGER NOT NULL DEFAULT 0,
  price_per_cup_sold DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_revenue DECIMAL(10, 2) GENERATED ALWAYS AS (cups_sold * price_per_cup_sold) STORED,
  total_cost DECIMAL(10, 2) GENERATED ALWAYS AS (
    (milk_liters * milk_price_per_liter) + 
    (premix_packets * premix_price_per_packet) + 
    (coffee_liters * coffee_price_per_liter) + 
    (cups_used * cup_price) + 
    (spoons_used * spoon_price)
  ) STORED,
  profit_loss DECIMAL(10, 2) GENERATED ALWAYS AS (
    (cups_sold * price_per_cup_sold) - (
      (milk_liters * milk_price_per_liter) + 
      (premix_packets * premix_price_per_packet) + 
      (coffee_liters * coffee_price_per_liter) + 
      (cups_used * cup_price) + 
      (spoons_used * spoon_price)
    )
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on entry_date for faster queries
CREATE INDEX IF NOT EXISTS idx_daily_entries_date ON daily_entries(entry_date DESC);

-- Insert default costs if not exists
INSERT INTO default_costs (milk_price_per_liter, premix_price_per_packet, coffee_price_per_liter, cup_price, spoon_price, price_per_cup_sold)
SELECT 60, 100, 50, 5, 1, 50
WHERE NOT EXISTS (SELECT 1 FROM default_costs LIMIT 1);

-- Enable RLS (but allow public access since no auth)
ALTER TABLE default_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access on default_costs" ON default_costs FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on default_costs" ON default_costs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on default_costs" ON default_costs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on default_costs" ON default_costs FOR DELETE USING (true);

CREATE POLICY "Allow public read access on daily_entries" ON daily_entries FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on daily_entries" ON daily_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on daily_entries" ON daily_entries FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on daily_entries" ON daily_entries FOR DELETE USING (true);