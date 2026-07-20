// Wrapper RSVP dùng Supabase (nhúng trực tiếp từ frontend, không cần backend).
// Yêu cầu: bảng `rsvps` (id, name, attending, message, created_at) + RLS public read/insert.

import { supabase } from './supabase';

export async function fetchRSVPs() {
  const { data, error } = await supabase
    .from('rsvps')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchRSVPStats() {
  // Supabase trả về count qua head+count, không cần load rows.
  const { count: total, error: errTotal } = await supabase
    .from('rsvps')
    .select('*', { count: 'exact', head: true });

  if (errTotal) throw errTotal;

  const { count: attending, error: errAttending } = await supabase
    .from('rsvps')
    .select('*', { count: 'exact', head: true })
    .eq('attending', true);

  if (errAttending) throw errAttending;

  return {
    total: total || 0,
    attending: attending || 0,
    not_attending: (total || 0) - (attending || 0),
  };
}

export async function submitRSVP(payload) {
  const { data, error } = await supabase
    .from('rsvps')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}