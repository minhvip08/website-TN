import { useState, useEffect, useRef } from 'react';
import { fetchRSVPs as apiFetchRSVPs, fetchRSVPStats, submitRSVP } from './rsvpApi';

const INTRO_TEXT = `Thân gửi những người tôi yêu…. Nếu bạn đọc được những dòng tin nhắn này, thì bạn chính là một trong những người quan trọng nhất đối với Minh Dương. Xin được gửi lời cảm ơn sâu sắc đến bạn – người đã đồng hành cùng Minh Dương trong suốt quãng đời sinh viên đầy trọn vẹn và ý nghĩa. Giờ đây, hãy để Minh Dương được ghi lại những kỷ niệm đáng quý này bằng những tấm hình chụp mang đầy màu sắc với bạn trong buổi lễ tốt nghiệp thiêng liêng ấy. Rồi chúng ta sẽ có dịp gặp lại vào những ngày không xa…. Cảm ơn người đã thức cùng tôi!`;

const EVENT_DATE = new Date('2026-08-07T14:00:00+07:00');

// ===========================================================================
//  CHỈNH SỬA: ĐƯỜNG DẪN ẢNH CỦA BẢN THÂN
//  Thay thế hoặc thêm ảnh vào 'frontend/public/' và cập nhật mảng dưới đây.
// ===========================================================================
const personalPhotos = [
  '/pt2.JPG', // Ảnh 1 (Mặc định)
  '/pt3.JPG', // Ảnh 2 (Click để đổi)
  '/pt4.JPG',
  '/pt5.JPG',
];

const INTRO_SYMBOLS = ['🎓', '✨', '🎈', '🌸', '⭐', '🎓', '🎉'];
const BG_SYMBOLS    = ['🎓', '✨', '🎈', '🌸', '⭐', '🎓', '🎉'];
const CONFETTI_COLORS = ['#ffd700', '#ff7eb6', '#52c4ff', '#9ee2ff', '#ffc266'];

let fallbackIdCounter = 1;

function App() {
  // --- STATE QUẢN LÝ ---
  const [name, setName] = useState('');
  const [attending, setAttending] = useState(true);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rsvps, setRsvps] = useState([]);
  const [stats, setStats] = useState({ total: 0, attending: 0, not_attending: 0 });
  const [isLoadingGuestbook, setIsLoadingGuestbook] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [confetti, setConfetti] = useState([]);
  const [sparkleEffects, setSparkleEffects] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // --- STATE CHO INTRO WELCOME SCREEN ---
  const [showIntro, setShowIntro] = useState(true);
  const [introText, setIntroText] = useState('');
  const [introIsFadingOut, setIntroIsFadingOut] = useState(false);
  const [introShowContinue, setIntroShowContinue] = useState(false);
  const [introStars, setIntroStars] = useState([]);
  const typingIntervalRef = useRef(null);

  // --- STATE CHO ĐỒNG HỒ ĐẾM NGƯỢC ---
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // --- STATE CHO VẬT THỂ BAY NỀN ---
  const [bgParticles, setBgParticles] = useState([]);

  // --- STATE CHO NHẠC NỀN ---
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);

  // --- TẢI DANH SÁCH RSVP + THỐNG KÊ TỪ BACKEND API ---
  const loadRSVPs = async () => {
    try {
      const [list, st] = await Promise.all([
        apiFetchRSVPs(),
        fetchRSVPStats().catch(() => null),
      ]);
      setRsvps(list);
      if (st) setStats(st);
    } catch (error) {
      console.warn('Lỗi tải RSVP từ backend. Dùng dự phòng LocalStorage:', error);
      loadFromLocalStorage();
    }
  };

  const fetchAllData = async () => {
    setIsLoadingGuestbook(true);
    try {
      await loadRSVPs();
    } finally {
      setIsLoadingGuestbook(false);
    }
  };

  const loadFromLocalStorage = () => {
    const localData = localStorage.getItem('rsvp_backup');
    if (localData) {
      setRsvps(JSON.parse(localData));
    } else {
      const mockData = [
        {
          id: 1,
          name: 'Phạm Khánh Linh',
          attending: true,
          message: 'Chúc mừng Minh Dương nhé! Chúc bạn ngày tốt nghiệp thật rực rỡ ✨',
          created_at: new Date(Date.now() - 1000 * 60 * 38).toISOString(),
        },
        {
          id: 2,
          name: 'Lê Hoàng Nam',
          attending: true,
          message: 'Mãi iu Dương nha, mình nhất định sẽ tới! ❤️',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        },
      ];
      setRsvps(mockData);
      localStorage.setItem('rsvp_backup', JSON.stringify(mockData));
    }
  };

  useEffect(() => {
    loadRSVPs();

    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') setIsAdmin(true);

    // Intro stars
    const starsArray = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 120 - 10,
      size: 16 + Math.random() * 24,
      symbol: INTRO_SYMBOLS[Math.floor(Math.random() * INTRO_SYMBOLS.length)],
      duration: 12 + Math.random() * 15,
      delay: Math.random() * -20,
      opacity: 0.08 + Math.random() * 0.15,
    }));
    setIntroStars(starsArray);

    // Typing intro
    let currentIdx = 0;
    typingIntervalRef.current = setInterval(() => {
      if (currentIdx < INTRO_TEXT.length) {
        setIntroText(INTRO_TEXT.substring(0, currentIdx + 1));
        currentIdx++;
      } else {
        clearInterval(typingIntervalRef.current);
        setIntroShowContinue(true);
      }
    }, 35);

    // Countdown
    const updateCountdown = () => {
      const difference = EVENT_DATE - new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days:    Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Background particles
    const initialParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 16 + Math.random() * 24,
      symbol: BG_SYMBOLS[Math.floor(Math.random() * BG_SYMBOLS.length)],
      delay: Math.random() * -20,
      duration: 15 + Math.random() * 20,
      opacity: 0.12 + Math.random() * 0.2,
    }));
    setBgParticles(initialParticles);

    return () => {
      clearInterval(countdownInterval);
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  // Scroll lock khi mở intro
  useEffect(() => {
    document.body.style.overflow = showIntro ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showIntro]);

  // --- XỬ LÝ PLAY/PAUSE NHẠC ---
  const togglePlayMusic = () => {
    const audio = document.getElementById('bg-music');
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.log('Không thể phát nhạc:', err));
    }
    setIsPlaying(!isPlaying);
  };

  // --- XỬ LÝ CLICK TRÊN MÀN HÌNH INTRO ---
  const handleIntroClick = () => {
    if (introText.length < INTRO_TEXT.length) {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      setIntroText(INTRO_TEXT);
      setIntroShowContinue(true);
    } else {
      setIntroIsFadingOut(true);
      const audio = document.getElementById('bg-music');
      if (audio) {
        audio.play().catch((err) => console.log('Không thể phát nhạc:', err));
        setIsPlaying(true);
      }
      setTimeout(() => setShowIntro(false), 1000);
    }
  };

  const handleIntroKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleIntroClick();
    }
  };

  // --- HIỆU ỨNG CONFETTI KHI ĐĂNG KÝ THÀNH CÔNG ---
  const triggerConfetti = () => {
    const newConfetti = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      size: 5 + Math.random() * 8,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      round: Math.random() > 0.5,
    }));
    setConfetti(newConfetti);
    setTimeout(() => setConfetti([]), 6000);
  };

  // --- HIỆU ỨNG LẤP LÁNH KHI CLICK CHUỘT LÊN ẢNH ---
  const handlePhotoClick = (e) => {
    setCurrentPhotoIdx((prev) => (prev + 1) % personalPhotos.length);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newSparkle = { id: Date.now(), x, y };
    setSparkleEffects((prev) => [...prev, newSparkle]);
    setTimeout(() => {
      setSparkleEffects((prev) => prev.filter((s) => s.id !== newSparkle.id));
    }, 1400);
  };

  // --- XỬ LÝ GỬI FORM RSVP LÊN BACKEND API ---
  const handleSubmitRSVP = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const payload = {
      name: name.trim(),
      attending,
      message: message.trim() || null,
    };

    try {
      const savedRSVP = await submitRSVP(payload);
      setRsvps((prev) => [savedRSVP, ...prev]);
      setStats((prev) => ({
        total: prev.total + 1,
        attending: prev.attending + (attending ? 1 : 0),
        not_attending: prev.not_attending + (attending ? 0 : 1),
      }));
      showToast('Em đã nhận được tín hiệu của mình ạaaa ❤️‍🔥');
      triggerConfetti();
      setName('');
      setMessage('');
    } catch (error) {
      console.warn('Lỗi gửi RSVP tới backend. Thực hiện lưu cục bộ (Local Fallback):', error);
      const mockId =
        (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
          ? crypto.randomUUID()
          : `local-${fallbackIdCounter++}`;
      const mockSaved = {
        id: mockId,
        ...payload,
        created_at: new Date().toISOString(),
      };
      const updatedRsvps = [mockSaved, ...rsvps];
      setRsvps(updatedRsvps);
      localStorage.setItem('rsvp_backup', JSON.stringify(updatedRsvps));
      showToast('Đã ghi nhận lời mời (Chế độ Offline/Demo)');
      triggerConfetti();
      setName('');
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 4000);
  };

  return (
    <div className="sky-bg">
      <a href="#main-content" className="skip-link">Bỏ qua tới nội dung</a>

      {/* Màn hình giới thiệu chào mừng (Intro Overlay) */}
      {showIntro && (
        <div
          className={`intro-overlay ${introIsFadingOut ? 'fade-out' : ''}`}
          onClick={handleIntroClick}
          onKeyDown={handleIntroKeyDown}
          role="button"
          tabIndex={0}
          aria-label="Chạm để mở lời mời tốt nghiệp"
        >
          <div className="intro-stars" aria-hidden="true">
            {introStars.map((s) => (
              <div
                key={s.id}
                className="intro-star"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  fontSize: `${s.size}px`,
                  animationDuration: `${s.duration}s`,
                  animationDelay: `${s.delay}s`,
                  opacity: s.opacity,
                }}
              >
                {s.symbol}
              </div>
            ))}
          </div>
          <div className="intro-card" onClick={(e) => e.stopPropagation()}>
            <p className="intro-quote">
              {introText}
              {introText.length < INTRO_TEXT.length && <span className="intro-cursor" />}
            </p>
            {introShowContinue && (
              <button
                type="button"
                className="intro-continue"
                onClick={handleIntroClick}
              >
                <span>Click để tiếp tục</span>
                <span className="intro-continue-arrow" aria-hidden="true">👇</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Thẻ nhạc nền ẩn */}
      <audio id="bg-music" src="/music.mp3" loop />

      {/* Lớp hạt nền */}
      <div className="sky-dots" aria-hidden="true" />

      {/* Vật thể bay trong nền */}
      <div className="bg-particles-container" aria-hidden="true">
        {bgParticles.map((p) => (
          <div
            key={p.id}
            className="bg-particle"
            style={{
              left: `${p.x}%`,
              fontSize: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              opacity: p.opacity,
            }}
          >
            {p.symbol}
          </div>
        ))}
      </div>

      {/* Mây bay trang trí */}
      <div className="clouds-container" aria-hidden="true">
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />
      </div>

      {/* Confetti */}
      {confetti.length > 0 && (
        <div className="confetti-container" aria-hidden="true">
          {confetti.map((c) => (
            <div
              key={c.id}
              className="confetti-piece"
              style={{
                left: `${c.x}%`,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.duration}s`,
                width: `${c.size}px`,
                height: `${c.size}px`,
                backgroundColor: c.color,
                borderRadius: c.round ? '50%' : '0%',
              }}
            />
          ))}
        </div>
      )}

      {/* Toast */}
      <div
        className={`toast-alert ${toast.show ? 'show' : ''}`}
        role="status"
        aria-live="polite"
      >
        <span>{toast.message}</span>
      </div>

      {/* NỘI DUNG CHÍNH */}
      <main id="main-content" className="container">

        {/* ==========================================
            HERO — asymmetric split
           ========================================== */}
        <header className="hero">
          <div className="hero-grid">
            <div className="hero-left">
              <button
                type="button"
                className="polaroid-frame btn-focus"
                onClick={handlePhotoClick}
                aria-label="Đổi ảnh Minh Dương"
              >
                <svg className="sparkle sparkle-1" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M12,2L14.7,8.7L22,10L16.2,14.7L18.2,22L12,18L5.8,22L7.8,14.7L2,10L9.3,8.7L12,2Z" />
                </svg>
                <svg className="sparkle sparkle-2" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M12,2L14.7,8.7L22,10L16.2,14.7L18.2,22L12,18L5.8,22L7.8,14.7L2,10L9.3,8.7L12,2Z" />
                </svg>
                <svg className="sparkle sparkle-3" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M12,2L14.7,8.7L22,10L16.2,14.7L18.2,22L12,18L5.8,22L7.8,14.7L2,10L9.3,8.7L12,2Z" />
                </svg>
                <div className="polaroid-image-container">
                  <img
                    src={personalPhotos[currentPhotoIdx]}
                    alt="Minh Dương trong ngày lễ tốt nghiệp"
                    className="polaroid-image"
                  />
                  {sparkleEffects.map((s) => (
                    <div
                      key={s.id}
                      className="sparkle-fly"
                      style={{ left: s.x, top: s.y }}
                      aria-hidden="true"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" style={{ color: '#ffd700' }}>
                        <path fill="currentColor" d="M12,2L14.7,8.7L22,10L16.2,14.7L18.2,22L12,18L5.8,22L7.8,14.7L2,10L9.3,8.7L12,2Z" />
                      </svg>
                    </div>
                  ))}
                </div>
                <div className="polaroid-caption">MINH DƯƠNG</div>
              </button>
            </div>

            <div className="hero-right">
              <span className="eyebrow">Lễ Tốt nghiệp · 07.08.2026</span>

              <h1 className="hero-title">
                Gặp bạn ở <em>sảnh A</em>
              </h1>

              <p className="hero-subtitle">
                Thân mời bạn chung vui và chúc mừng tân cử nhân{' '}
                <strong>Minh Dương aka Mind</strong> — Cử nhân ngành Luật, khoa Luật Thương mại.
              </p>

              <p className="hero-lead">
                Được chụp cùng bạn một tấm ảnh và nhận lời chúc mừng của bạn là niềm vui lớn nhất
                ở điểm cuối của chặng đường vừa qua.
              </p>

              <p className="photo-switch-hint">
                <span aria-hidden="true">✨</span> Nhấp vào ảnh để xem Minh Dương xinh xắn như thế nào nhé
              </p>

              {/* Countdown */}
              <div className="countdown-container" aria-label="Đồng hồ đếm ngược tới ngày tốt nghiệp">
                <div className="countdown-title">Đếm ngược tới ngày được gặp Minh Dương</div>
                <div className="countdown-timer">
                  <div className="countdown-item">
                    <span className="countdown-number">{timeLeft.days}</span>
                    <span className="countdown-label">Ngày</span>
                  </div>
                  <div className="countdown-separator">:</div>
                  <div className="countdown-item">
                    <span className="countdown-number">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="countdown-label">Giờ</span>
                  </div>
                  <div className="countdown-separator">:</div>
                  <div className="countdown-item">
                    <span className="countdown-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="countdown-label">Phút</span>
                  </div>
                  <div className="countdown-separator">:</div>
                  <div className="countdown-item">
                    <span className="countdown-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="countdown-label">Giây</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ==========================================
            MỤC 2: THỜI GIAN VÀ ĐỊA ĐIỂM
           ========================================== */}
        <section className="section-card variant-feature" id="thoi-gian" aria-labelledby="thoi-gian-title">
          <h2 className="section-title" id="thoi-gian-title">
            <svg className="section-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            Thời gian &amp; Địa điểm
          </h2>

          <div className="datetime-container">
            {/* CHỈNH SỬA: chi tiết thời gian */}
            <div className="detail-item">
              <div className="detail-icon" aria-hidden="true">📅</div>
              <div className="detail-label">Thời gian</div>
              <div className="detail-value">14 giờ 00 đến 16 giờ 00</div>
              <div className="detail-value">Thứ Sáu, ngày 07/8/2026</div>
            </div>

            {/* CHỈNH SỬA: chi tiết địa điểm */}
            <div className="detail-item">
              <div className="detail-icon" aria-hidden="true">🎓</div>
              <div className="detail-label">Địa điểm</div>
              <div className="detail-value">Sân trường — Sảnh A</div>
              <div className="detail-value">(ngay logo Ulaw vàng ở sảnh A)</div>
              <div className="detail-value">Trường Đại học Luật TP. Hồ Chí Minh</div>
              <div className="detail-subvalue">Số 02 Nguyễn Tất Thành, phường Xóm Chiếu, TP. Hồ Chí Minh</div>
            </div>
          </div>
        </section>

        {/* ==========================================
            MỤC 3: BẢN ĐỒ GOOGLE MAPS
           ========================================== */}
        <section className="section-card variant-feature" id="ban-do" aria-labelledby="ban-do-title">
          <h2 className="section-title" id="ban-do-title">
            <svg className="section-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            Bản đồ đường đi
          </h2>

          <p className="map-note">
            📍{' '}
            <strong>Trường Đại học Luật TP. Hồ Chí Minh (cơ sở 1)</strong>:{' '}
            Số 02 Nguyễn Tất Thành, phường Xóm Chiếu, TP. Hồ Chí Minh.
          </p>

          <div className="map-iframe-container">
            <iframe
              src="https://www.google.com/maps?q=Trường Đại học Luật TP.HCM&output=embed"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ Trường Đại học Luật TP.HCM"
            />
          </div>

          <a
            href="https://maps.app.goo.gl/ZspPUchBfXjSqYF1A?g_st=ic"
            target="_blank"
            rel="noopener noreferrer"
            className="map-button-link"
          >
            <span aria-hidden="true">🗺️</span> Chỉ đường trên Google Maps
          </a>
        </section>

        {/* ==========================================
            MỤC 3B: SƠ ĐỒ KHUÔN VIÊN
           ========================================== */}
        <section className="section-card variant-feature" id="ban-do-khuon-vien" aria-labelledby="khuon-vien-title">
          <h2 className="section-title" id="khuon-vien-title">
            <svg className="section-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg>
            Sơ đồ khuôn viên UIT
          </h2>
          <p className="map-note">
            🗺️{' '}
            <strong>Sơ đồ giảng đường &amp; các khu vực</strong>:{' '}
            Sảnh A sẽ là nơi làm lễ chính. Sau khi làm lễ xong, mình sẽ di chuyển ra{' '}
            <strong>Sân trường</strong> (ngay logo Ulaw vàng ở sảnh A) để chụp hình cùng mọi người.
          </p>
          <div className="campus-map-container">
            <img
              src="/UITMap.png"
              alt="Sơ đồ khuôn viên UIT" 
              className="campus-map-img"
            />
          </div>
        </section>

        {/* ==========================================
            MỤC 4: HƯỚNG DẪN GỬI XE
           ========================================== */}
        <section className="section-card variant-feature" id="gui-xe" aria-labelledby="gui-xe-title">
          <h2 className="section-title" id="gui-xe-title">
            <svg className="section-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13" rx="2" ry="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
            Hướng dẫn gửi xe
          </h2>

          {/* CHỈNH SỬA: các bước hướng dẫn gửi xe */}
          <ul className="parking-steps">
            <li className="parking-step-item">
              <div className="parking-step-num" aria-hidden="true">1</div>
              <div className="parking-step-text">
                <strong>Bãi gửi xe:</strong> Gần trường có hai bãi giữ xe là{' '}
                <a href="https://maps.app.goo.gl/4b7LMUuTdgAcLUkv8?g_st=ic" target="_blank" rel="noopener noreferrer">
                  Bãi giữ xe 1 Bến Vân Đồn
                </a>{' '}
                và{' '}
                <a href="https://maps.app.goo.gl/myQLZ4KFxc7CAjdV8?g_st=ic" target="_blank" rel="noopener noreferrer">
                  Bãi giữ xe Bộ đội Biên phòng cũ
                </a>
                . Tuy nhiên tớ thấy Bãi giữ xe 1 Bến Vân Đồn tốt hơn nhiều, nếu được mọi người hãy
                gửi ở đó nhé — và nhớ đi đúng chiều, đừng chạy ngược chiều dễ bị «mấy ảnh» giữ lại lắm nhoa.
              </div>
            </li>
            <li className="parking-step-item">
              <div className="parking-step-num" aria-hidden="true">2</div>
              <div className="parking-step-text">
                <strong>Chi phí gửi xe:</strong> Mỗi lượt gửi xe gắn máy ở bãi là 6.000 đồng ạ.
              </div>
            </li>
          </ul>
        </section>

        {/* ==========================================
            MỤC 5: XÁC NHẬN THAM DỰ (RSVP)
           ========================================== */}
        <section className="section-card variant-rsvp" id="xac-nhan" aria-labelledby="xac-nhan-title">
          <h2 className="section-title" id="xac-nhan-title">
            <svg className="section-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            Xác nhận tham dự
          </h2>

          <p className="rsvp-intro-note">
            Hãy phản hồi giúp tớ trước ngày <strong>06/8/2026</strong> để tớ đón tiếp được chu đáo
            nhất ạaaa ❤️
          </p>

          <form onSubmit={handleSubmitRSVP} className="rsvp-form-container">
            <div className="form-group">
              <label htmlFor="guest-name" className="form-label">
                Cho tớ xin danh tính của bạn với nhoa (viết sao cho tớ biết là ai á){' '}
                <span className="form-required" aria-hidden="true">*</span>
              </label>
              <input
                type="text"
                id="guest-name"
                className="form-input"
                placeholder="Nhập họ và tên của bạn..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div className="form-group" role="radiogroup" aria-label="Bạn có thể đến chụp cùng tớ không?">
              <span className="form-label" id="attending-label">
                Bạn có thể đến và chụp cùng tớ tấm ảnh chứ ạ?
              </span>
              <div className="rsvp-options-grid">
                <button
                  type="button"
                  className={`rsvp-option-card btn-focus ${attending ? 'selected-yes' : ''}`}
                  onClick={() => setAttending(true)}
                  role="radio"
                  aria-checked={attending}
                  aria-labelledby="attending-label"
                >
                  <div className="option-emoji" aria-hidden="true">🥳</div>
                  <div className="option-title option-title-yes">
                    Tớ sẽ đến chung vui với Minh Dương đáng iu nhoa 👏
                  </div>
                  <div className="option-desc">ok iu iu moa moa!</div>
                </button>

                <button
                  type="button"
                  className={`rsvp-option-card btn-focus ${!attending ? 'selected-no' : ''}`}
                  onClick={() => setAttending(false)}
                  role="radio"
                  aria-checked={!attending}
                  aria-labelledby="attending-label"
                >
                  <div className="option-emoji" aria-hidden="true">😢</div>
                  <div className="option-title option-title-no">
                    Ú nâu, hôm đó tớ có việc bận rồi 🙁
                  </div>
                  <div className="option-desc">
                    Dạ hỏng seo, mình sẽ hẹn gặp nhau sau nhé, chưa thoát khỏi tớ được đâu hẹ hẹ 😁
                  </div>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="guest-msg" className="form-label">
                Bạn có điều gì muốn nhắn gửi tớ hăm ạ 😊
              </label>
              <textarea
                id="guest-msg"
                className="form-input"
                rows={3}
                placeholder="Gửi lời chúc mừng hoặc lời nhắn tại đây..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="bubbly-button btn-focus"
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? 'Đang gửi phản hồi...' : 'Gửi xác nhận của bạn'}
            </button>
          </form>

          {/* DANH SÁCH KHÁCH MỜI — chỉ admin (?admin=true) */}
          {isAdmin && (
            <div className="guest-list-section">
              <h3 className="guest-list-title">
                👥 Những người bạn đã gửi phản hồi ({rsvps.length})
              </h3>

              <div className="guest-cards-container">
                {rsvps.length === 0 ? (
                  <p className="guest-empty">
                    Chưa có ai gửi xác nhận. Hãy là người đầu tiên!
                  </p>
                ) : (
                  rsvps.map((guest) => (
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
            </div>
          )}
        </section>

        {/* ==========================================
            MỤC 5B: LỜI CHÚC TỪ BẠN BÈ (PUBLIC GUESTBOOK)
            Hiển thị công khai danh sách RSVP + thống kê đọc từ backend API.
           ========================================== */}
        <section className="section-card variant-feature" id="loi-chuc" aria-labelledby="loi-chuc-title">
          <h2 className="section-title" id="loi-chuc-title">
            <svg className="section-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            Lời chúc từ bạn bè
          </h2>

          {/* THỐNG KÊ XÁC NHẬN */}
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

          {/* NÚT TẢI LẠI */}
          <div className="guestbook-actions">
            <button
              type="button"
              className="bubbly-button btn-focus"
              onClick={fetchAllData}
              disabled={isLoadingGuestbook}
            >
              {isLoadingGuestbook ? 'Đang tải...' : '↻ Tải lại lời chúc'}
            </button>
          </div>

          {/* DANH SÁCH LỜI CHÚC — PUBLIC */}
          <div className="guest-cards-container guest-cards-public">
            {rsvps.length === 0 ? (
              <p className="guest-empty">
                Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc cho Minh Dương nhé! 💌
              </p>
            ) : (
              rsvps.map((guest) => (
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
        </section>

        {/* ==========================================
            MỤC 6: THÔNG TIN LIÊN LẠC
           ========================================== */}
        <section className="section-card variant-feature" id="lien-he" aria-labelledby="lien-he-title">
          <h2 className="section-title" id="lien-he-title">
            <svg className="section-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            Thông tin liên lạc
          </h2>

          <p className="rsvp-intro-note">
            Nếu bạn có câu hỏi hoặc cần hỗ trợ thêm thông tin gì, đừng ngần ngại liên lạc với tớ qua:
          </p>

          <div className="contacts-grid">
            {/* CHỈNH SỬA: số điện thoại */}
            <a href="tel:0908056949" className="contact-link-card btn-focus">
              <div className="contact-icon-wrapper" aria-hidden="true">📞</div>
              <div className="contact-info-text">
                <span className="contact-title">Điện thoại</span>
                <span className="contact-value">0908 056 949</span>
              </div>
            </a>

            {/* CHỈNH SỬA: email */}
            <a href="mailto:leminhduong1604@gmail.com" className="contact-link-card btn-focus">
              <div className="contact-icon-wrapper" aria-hidden="true">✉️</div>
              <div className="contact-info-text">
                <span className="contact-title">Email</span>
                <span className="contact-value">leminhduong1604@gmail.com</span>
              </div>
            </a>

            {/* CHỈNH SỬA: Facebook / Messenger */}
            <a
              href="https://www.facebook.com/share/18wApis99D/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link-card btn-focus"
              style={{ gridColumn: '1 / -1' }}
            >
              <div className="contact-icon-wrapper" aria-hidden="true">💬</div>
              <div className="contact-info-text">
                <span className="contact-title">Facebook</span>
                <span className="contact-value">fb.com/minhduong</span>
              </div>
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <p>🎓 Made with <span className="footer-heart">❤</span> for Minh Dương&apos;s Graduation Day 🎓</p>
        <p className="footer-mute">© 2026 Minh Dương · Thư mời tốt nghiệp</p>
      </footer>

      {/* NÚT NHẠC NỀN */}
      <button
        type="button"
        className={`floating-music-btn btn-focus ${isPlaying ? 'playing' : ''}`}
        onClick={togglePlayMusic}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền'}
        title={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc nền'}
      >
        <span className="music-disk" aria-hidden="true">🎵</span>
      </button>
    </div>
  );
}

export default App;