import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRSVPs, fetchRSVPStats } from './rsvpApi';

export default function AttendancesPage() {
  const [rsvps, setRsvps] = useState([]);
  const [stats, setStats] = useState({ total: 0, attending: 0, not_attending: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all | attending | not_attending

  const load = () => {
    setError(null);
    Promise.all([
      fetchRSVPs().catch((err) => ({ __error: err })),
      fetchRSVPStats().catch((err) => ({ __error: err })),
    ])
      .then(([list, st]) => {
        if (list && list.__error) {
          console.warn('Lỗi tải danh sách RSVP:', list.__error);
          setError('Không tải được danh sách. Vui lòng thử lại sau.');
          return;
        }
        if (st && st.__error) {
          console.warn('Lỗi tải thống kê:', st.__error);
        } else {
          setStats(st);
        }
        setRsvps(list || []);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    Promise.resolve().then(load);
  }, []);

  const filtered = rsvps.filter((g) => {
    if (filter === 'attending') return g.attending;
    if (filter === 'not_attending') return !g.attending;
    return true;
  });

  return (
    <div className="sky-bg">
      <div className="sky-dots" aria-hidden="true" />
      <main className="container">
        <section className="section-card variant-feature" id="attendances" aria-labelledby="attendances-title">
          <h2 className="section-title" id="attendances-title">
            <svg className="section-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            Lời chúc & Danh sách tham dự
          </h2>

          {/* THỐNG KÊ */}
          <div className="rsvp-stats-grid">
            <div className="rsvp-stat-item">
              <span className="rsvp-stat-num">{stats.total}</span>
              <span className="rsvp-stat-label">Phản hồi</span>
            </div>
            <div className="rsvp-stat-item">
              <span className="rsvp-stat-num">{stats.attending}</span>
              <span className="rsvp-stat-label">Sẽ đến 🥳</span>
            </div>
            <div className="rsvp-stat-item">
              <span className="rsvp-stat-num">{stats.not_attending}</span>
              <span className="rsvp-stat-label">Bận 😢</span>
            </div>
          </div>

          {/* BỘ LỌC */}
          <div className="attendance-filters" role="tablist" aria-label="Lọc danh sách tham dự">
            {[
              { key: 'all', label: `Tất cả (${stats.total})` },
              { key: 'attending', label: `Sẽ đến (${stats.attending})` },
              { key: 'not_attending', label: `Bận (${stats.not_attending})` },
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={`attendance-filter-btn btn-focus ${filter === opt.key ? 'active' : ''}`}
                onClick={() => setFilter(opt.key)}
                role="tab"
                aria-selected={filter === opt.key}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* NÚT TẢI LẠI */}
          <div className="guestbook-actions">
            <button
              type="button"
              className="bubbly-button btn-focus"
              onClick={load}
              disabled={isLoading}
            >
              {isLoading ? 'Đang tải...' : '↻ Tải lại'}
            </button>
          </div>

          {error && <p className="guest-empty">{error}</p>}

          {/* DANH SÁCH */}
          {!error && (
            <div className="guest-cards-container guest-cards-public">
              {isLoading && rsvps.length === 0 ? (
                <p className="guest-empty">Đang tải danh sách...</p>
              ) : filtered.length === 0 ? (
                <p className="guest-empty">Chưa có phản hồi nào trong mục này.</p>
              ) : (
                filtered.map((guest) => (
                  <article key={guest.id} className="guest-card">
                    <div className="guest-card-header">
                      <div className="guest-name" title={guest.name}>{guest.name}</div>
                      <span className={`guest-badge ${guest.attending ? 'badge-yes' : 'badge-no'}`}>
                        {guest.attending ? 'Sẽ tham gia' : 'Vắng mặt'}
                      </span>
                    </div>
                    {guest.message && <div className="guest-message">“{guest.message}”</div>}
                    <span className="guest-time">
                      {new Date(guest.created_at).toLocaleString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </span>
                  </article>
                ))
              )}
            </div>
          )}

          <p className="attendance-back">
            <Link to="/" className="map-button-link">← Quay lại thư mời</Link>
          </p>
        </section>
      </main>
    </div>
  );
}