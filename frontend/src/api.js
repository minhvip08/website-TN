// Helper gọi backend FastAPI lưu/đọc RSVP.
// Mặc định dùng đường dẫn tương đối `/api/...` (Vite dev proxy tới http://127.0.0.1:8000).
// Khi deploy production, set VITE_API_URL trong .env tới domain backend.

const API_BASE = import.meta.env.VITE_API_URL || '';

export async function fetchRSVPs() {
  const res = await fetch(`${API_BASE}/api/rsvp`);
  if (!res.ok) throw new Error(`Lỗi tải RSVP: ${res.status}`);
  return res.json();
}

export async function fetchRSVPStats() {
  const res = await fetch(`${API_BASE}/api/rsvp/stats`);
  if (!res.ok) throw new Error(`Lỗi tải thống kê: ${res.status}`);
  return res.json();
}

export async function submitRSVP(payload) {
  const res = await fetch(`${API_BASE}/api/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let detail = `Lỗi ${res.status}`;
    try {
      const err = await res.json();
      if (err && err.detail) detail = err.detail;
    } catch { /* ignore */ }
    throw new Error(detail);
  }
  return res.json();
}