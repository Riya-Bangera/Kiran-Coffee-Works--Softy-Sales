import { supabase } from './supabase';
import type { DailyEntry, DailyEntryInput, DefaultCosts } from '@/types/types';

// Default Costs API
export const getDefaultCosts = async (): Promise<DefaultCosts | null> => {
  const { data, error } = await supabase
    .from('default_costs')
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Error fetching default costs:', error);
    throw error;
  }

  return data;
};

export const updateDefaultCosts = async (costs: Partial<DefaultCosts>): Promise<DefaultCosts | null> => {
  // Get the first record
  const existing = await getDefaultCosts();
  
  if (!existing) {
    // Insert if doesn't exist
    const { data, error } = await supabase
      .from('default_costs')
      .insert([costs])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error inserting default costs:', error);
      throw error;
    }

    return data;
  }

  // Update existing record
  const { data, error } = await supabase
    .from('default_costs')
    .update(costs)
    .eq('id', existing.id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating default costs:', error);
    throw error;
  }

  return data;
};

// Daily Entries API
export const getDailyEntries = async (limit?: number, offset?: number): Promise<DailyEntry[]> => {
  let query = supabase
    .from('daily_entries')
    .select('*')
    .order('entry_date', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  if (offset) {
    query = query.range(offset, offset + (limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching daily entries:', error);
    throw error;
  }

  return Array.isArray(data) ? data : [];
};

export const getDailyEntriesByMonth = async (year: number, month: number): Promise<DailyEntry[]> => {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

  const { data, error } = await supabase
    .from('daily_entries')
    .select('*')
    .gte('entry_date', startDate)
    .lte('entry_date', endDate)
    .order('entry_date', { ascending: false });

  if (error) {
    console.error('Error fetching monthly entries:', error);
    throw error;
  }

  return Array.isArray(data) ? data : [];
};

export const getDailyEntriesByYear = async (year: number): Promise<DailyEntry[]> => {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const { data, error } = await supabase
    .from('daily_entries')
    .select('*')
    .gte('entry_date', startDate)
    .lte('entry_date', endDate)
    .order('entry_date', { ascending: false });

  if (error) {
    console.error('Error fetching yearly entries:', error);
    throw error;
  }

  return Array.isArray(data) ? data : [];
};

export const getDailyEntryByDate = async (date: string): Promise<DailyEntry | null> => {
  const { data, error } = await supabase
    .from('daily_entries')
    .select('*')
    .eq('entry_date', date)
    .maybeSingle();

  if (error) {
    console.error('Error fetching daily entry:', error);
    throw error;
  }

  return data;
};

export const createDailyEntry = async (entry: DailyEntryInput): Promise<DailyEntry | null> => {
  const { data, error } = await supabase
    .from('daily_entries')
    .insert([entry])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating daily entry:', error);
    throw error;
  }

  return data;
};

export const updateDailyEntry = async (id: string, entry: Partial<DailyEntryInput>): Promise<DailyEntry | null> => {
  const { data, error } = await supabase
    .from('daily_entries')
    .update(entry)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating daily entry:', error);
    throw error;
  }

  return data;
};

export const deleteDailyEntry = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('daily_entries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting daily entry:', error);
    throw error;
  }
};

// Get all available years with entries
export const getAvailableYears = async (): Promise<number[]> => {
  const { data, error } = await supabase
    .from('daily_entries')
    .select('entry_date')
    .order('entry_date', { ascending: false });

  if (error) {
    console.error('Error fetching available years:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [new Date().getFullYear()];
  }

  const years = new Set<number>();
  data.forEach((entry) => {
    const year = new Date(entry.entry_date).getFullYear();
    years.add(year);
  });

  return Array.from(years).sort((a, b) => b - a);
};
