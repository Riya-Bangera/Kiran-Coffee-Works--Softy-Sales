export interface DefaultCosts {
  id: string;
  milk_price_per_liter: number;
  premix_price_per_packet: number;
  coffee_price_per_liter: number;
  cup_price: number;
  spoon_price: number;
  price_per_cup_sold: number;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  username?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DailyEntry {
  id: string;
  entry_date: string;
  milk_liters: number;
  milk_price_per_liter: number;
  milk_total_cost?: number;
  premix_packets: number;
  premix_price_per_packet: number;
  premix_total_cost?: number;
  coffee_liters: number;
  coffee_price_per_liter: number;
  coffee_total_cost?: number;
  cups_used: number;
  cup_price: number;
  cups_total_cost?: number;
  spoons_used: number;
  spoon_price: number;
  spoons_total_cost?: number;
  cups_sold: number;
  price_per_cup_sold: number;
  total_revenue?: number;
  total_cost?: number;
  profit_loss?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DailyEntryInput {
  entry_date: string;
  milk_liters: number;
  milk_price_per_liter: number;
  premix_packets: number;
  premix_price_per_packet: number;
  coffee_liters: number;
  coffee_price_per_liter: number;
  cups_used: number;
  cup_price: number;
  spoons_used: number;
  spoon_price: number;
  cups_sold: number;
  price_per_cup_sold: number;
}

export interface MonthlySummary {
  month: string;
  year: number;
  total_revenue: number;
  total_cost: number;
  profit_loss: number;
  entries_count: number;
}

export interface YearlySummary {
  year: number;
  total_revenue: number;
  total_cost: number;
  profit_loss: number;
  monthly_summaries: MonthlySummary[];
}
