// app.jsx — Sıfır Çakışmalı Ders Programı Optimizasyonu
// React 18 + Memoized Component Architecture

const { useState, useEffect, useCallback, useMemo, useRef } = React;

// ============================================================
// THEME TOGGLE COMPONENT (Dark / Light Mode)
// ============================================================
const ThemeToggle = React.memo(function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      className="theme-toggle-btn"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      title={theme === 'dark' ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
      aria-label="Tema Değiştir"
    >
      <span className="theme-toggle-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
      <span>{theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}</span>
    </button>
  );
});

// ============================================================
// HEADER COMPONENT (Memoized)
// ============================================================
const Header = React.memo(function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
        <div className="header__badge" style={{ marginBottom: 0 }}>
          <span className="header__badge-dot"></span>
          Gazi Üniversitesi · Bilgisayar Mühendisliği
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
      <h1 className="header__title">Kendi Ders Programını Tasarla</h1>
    </header>
  );
});

// ============================================================
// COURSE INPUT COMPONENT (Memoized)
// ============================================================
const CourseInput = React.memo(function CourseInput({ courseData, onDataLoaded, onClearData }) {
  const [dragover, setDragover] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data && Array.isArray(data.courses)) {
          onDataLoaded(data);
        } else {
          alert('Geçersiz JSON formatı: "courses" dizisi bulunamadı.');
        }
      } catch (err) {
        alert('JSON ayrıştırma hatası: ' + err.message);
      }
    };
    reader.readAsText(file);
  }, [onDataLoaded]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragover(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleChange = useCallback((e) => {
    e.preventDefault();
    handleFile(e.target.files[0]);
  }, [handleFile]);

  return (
    <div className="panel">
      <div className="panel__header">
        <div className="panel__icon">📚</div>
        <h2 className="panel__title">Ders Listesi</h2>
        <span className="panel__badge">{courseData ? courseData.courses.length : 0} Ders</span>
      </div>
      <div className="panel__body">
        {!courseData ? (
          <div
            className={`upload-area ${dragover ? 'dragover' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragover(false); }}
            onDrop={handleDrop}
          >
            <div className="upload-area__icon">📁</div>
            <div className="upload-area__text">
              <strong>JSON dosyanızı sürükleyin</strong><br />
              veya tıklayarak seçin
            </div>
            <input type="file" accept=".json" onChange={handleChange} ref={fileInputRef} />
          </div>
        ) : (
          <div className="fade-in">
            <div className="course-tags">
              {courseData.courses.map((c, i) => (
                <span key={c.code || i} className="course-tag course-tag--loaded">
                  ✓ {c.code}
                </span>
              ))}
            </div>
            <div style={{ marginTop: '12px' }}>
              <button
                type="button"
                className="btn-export"
                onClick={(e) => {
                  e.preventDefault();
                  onClearData();
                }}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                🔄 Farklı Veri Yükle
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// ============================================================
// CONSTRAINT PANEL COMPONENT (Memoized)
// ============================================================
const ConstraintPanel = React.memo(function ConstraintPanel({ freeDays, onDayToggle, onFridayToggle }) {
  const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
  const DAY_SHORT = { Pazartesi: 'Pzt', Salı: 'Sal', Çarşamba: 'Çar', Perşembe: 'Per', Cuma: 'Cum' };

  return (
    <div className="panel">
      <div className="panel__header">
        <div className="panel__icon">⚙️</div>
        <h2 className="panel__title">Gün Kısıtları</h2>
        <span className="panel__badge">{freeDays.length} Boş Gün</span>
      </div>
      <div className="panel__body">
        <div className="constraint-group__label">
          <span>Boş Bırakılacak Günler</span>
        </div>
        <div className="day-checkboxes">
          {DAYS.map((day) => {
            const isChecked = freeDays.includes(day);
            return (
              <div key={day} className="day-cb">
                <input
                  type="checkbox"
                  id={`day-cb-${day}`}
                  checked={isChecked}
                  onChange={(e) => {
                    e.stopPropagation();
                    onDayToggle(day);
                  }}
                />
                <label htmlFor={`day-cb-${day}`}>
                  {DAY_SHORT[day]}
                </label>
              </div>
            );
          })}
        </div>

        {/* Friday toggle */}
        <div className="friday-toggle">
          <span className="friday-toggle__label">🎯 Cuma gününü tamamen boş bırak</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={freeDays.includes('Cuma')}
              onChange={(e) => {
                e.stopPropagation();
                onFridayToggle();
              }}
            />
            <span className="toggle-switch__slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
});

// ============================================================
// INSTRUCTOR FILTERS PANEL COMPONENT (Memoized, Preserves Scroll)
// ============================================================
const InstructorFiltersPanel = React.memo(function InstructorFiltersPanel({
  instructorsByCourse,
  instructorFilters,
  onInstructorToggle,
  onSelectAllForCourse,
  onClearAllForCourse
}) {
  const scrollRef = useRef(null);

  return (
    <div className="panel">
      <div className="panel__header">
        <div className="panel__icon">👨‍🏫</div>
        <h2 className="panel__title">Öğretim Üyesi Filtresi</h2>
        <span className="panel__badge">Anlık Tepki</span>
      </div>
      <div className="panel__body">
        <div className="instructor-filters-wrapper" ref={scrollRef}>
          {Object.entries(instructorsByCourse).map(([courseCode, instList]) => {
            if (!instList || instList.length <= 1) return null;
            const allowed = instructorFilters[courseCode] || [];
            const isAllChecked = instList.every(i => allowed.includes(i.name));

            return (
              <div key={courseCode} className="course-filter-card">
                <div className="course-filter-card__header">
                  <div className="course-filter-card__title">
                    {courseCode}
                    <span className="course-filter-card__sub">({allowed.length}/{instList.length})</span>
                  </div>
                  <div className="course-filter-card__actions">
                    <button
                      type="button"
                      className="btn-text-action"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isAllChecked) {
                          onClearAllForCourse(courseCode);
                        } else {
                          onSelectAllForCourse(courseCode);
                        }
                      }}
                    >
                      {isAllChecked ? 'Temizle' : 'Tümü'}
                    </button>
                  </div>
                </div>
                <div className="instructor-list">
                  {instList.map((inst) => {
                    const isChecked = allowed.includes(inst.name);
                    return (
                      <label key={inst.name} className="instructor-item" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            e.stopPropagation();
                            onInstructorToggle(courseCode, inst.name);
                          }}
                        />
                        <span className="instructor-item__name" title={inst.name}>{inst.name}</span>
                        <span className="instructor-item__sections">{inst.sections.join(', ')}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

// ============================================================
// STATS GRID COMPONENT (Memoized)
// ============================================================
const StatsGrid = React.memo(function StatsGrid({ totalSchedules, score }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-card__value">{totalSchedules}</div>
        <div className="stat-card__label">Tekil Alternatif</div>
      </div>
      <div className="stat-card">
        <div className="stat-card__value">{score.activeDays}</div>
        <div className="stat-card__label">Aktif Gün</div>
      </div>
      <div className="stat-card">
        <div className="stat-card__value">{score.totalGap} dk</div>
        <div className="stat-card__label">Toplam Gün İçi Boşluk</div>
      </div>
      <div className="stat-card">
        <div className="stat-card__value">{score.totalHours} sa</div>
        <div className="stat-card__label">Ders Yükü</div>
      </div>
    </div>
  );
});

// ============================================================
// ADVANCED PAGINATION COMPONENT (Memoized, Strictly Boundary-Checked)
// ============================================================
const AdvancedPagination = React.memo(function AdvancedPagination({
  currentIndex,
  total,
  onIndexChange
}) {
  const handleFirst = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentIndex > 0) onIndexChange(0);
  }, [currentIndex, onIndexChange]);

  const handlePrev = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentIndex > 0) onIndexChange(currentIndex - 1);
  }, [currentIndex, onIndexChange]);

  const handleNext = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentIndex < total - 1) onIndexChange(currentIndex + 1);
  }, [currentIndex, total, onIndexChange]);

  const handleLast = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentIndex < total - 1) onIndexChange(total - 1);
  }, [currentIndex, total, onIndexChange]);

  const handleInputChange = useCallback((e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      const clamped = Math.max(0, Math.min(total - 1, val - 1));
      onIndexChange(clamped);
    }
  }, [total, onIndexChange]);

  const isFirstDisabled = currentIndex <= 0;
  const isLastDisabled = currentIndex >= total - 1;

  return (
    <div className="pagination-bar">
      <div className="pagination-controls">
        <button
          type="button"
          className="btn-nav-page"
          disabled={isFirstDisabled}
          onClick={handleFirst}
          title="En Başa Git (İlk Program)"
        >
          &lt;&lt;
        </button>
        <button
          type="button"
          className="btn-nav-page"
          disabled={isFirstDisabled}
          onClick={handlePrev}
          title="Önceki Program"
        >
          ◀
        </button>
      </div>

      <div className="page-jump-wrapper">
        <span>Program</span>
        <input
          type="number"
          className="page-input"
          min={1}
          max={total}
          value={total > 0 ? currentIndex + 1 : 0}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleInputChange(e);
            }
          }}
          title="Program numarasını yazıp Enter'a basabilirsiniz"
        />
        <span className="page-total">/ {total}</span>
      </div>

      <div className="pagination-controls">
        <button
          type="button"
          className="btn-nav-page"
          disabled={isLastDisabled}
          onClick={handleNext}
          title="Sonraki Program"
        >
          ▶
        </button>
        <button
          type="button"
          className="btn-nav-page"
          disabled={isLastDisabled}
          onClick={handleLast}
          title="En Sona Git (Son Program)"
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  );
});

// ============================================================
// SCHEDULE TABLE COMPONENT (Memoized)
// ============================================================
const ScheduleTable = React.memo(function ScheduleTable({ schedule, allCourseCodes, onBlockClick }) {
  const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
  const TIME_SLOTS = ['08:30','09:30','10:30','11:30','12:30','13:30','14:30','15:30','16:30','17:30','18:30','19:30'];
  const SLOT_LABELS = ['08:30-09:20','09:30-10:20','10:30-11:20','11:30-12:20','12:30-13:20','13:30-14:20','14:30-15:20','15:30-16:20','16:30-17:20','17:30-18:20','18:30-19:20','19:30-20:20'];

  const { blocks, occCells, activeDays, minS, maxS } = useMemo(() => {
    const slots = schedule.slots;
    const bList = [];
    const occ = {};

    for (const slot of slots) {
      const si = TIME_SLOTS.indexOf(slot.start);
      const span = Math.ceil(((parseInt(slot.end.split(':')[0])*60 + parseInt(slot.end.split(':')[1])) - (parseInt(slot.start.split(':')[0])*60 + parseInt(slot.start.split(':')[1]))) / 60);
      if (si === -1) continue;
      bList.push({
        ...slot,
        startIdx: si,
        span,
        colorIdx: allCourseCodes.indexOf(slot.courseCode) % 7
      });
      for (let i = 0; i < span; i++) occ[`${slot.day}-${si + i}`] = true;
    }

    const aDays = DAYS.filter(d => slots.some(s => s.day === d));
    let mi = 11, ma = 0;
    bList.forEach(b => {
      mi = Math.min(mi, b.startIdx);
      ma = Math.max(ma, b.startIdx + b.span - 1);
    });
    if (mi > ma) { mi = 0; ma = 8; }

    return { blocks: bList, occCells: occ, activeDays: aDays, minS: mi, maxS: ma };
  }, [schedule, allCourseCodes]);

  return (
    <div className="schedule-container" id="schedule-capture-area">
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Saat</th>
            {activeDays.map(d => <th key={d}>{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxS - minS + 1 }, (_, i) => minS + i).map(si => (
            <tr key={si}>
              <td>{SLOT_LABELS[si]}</td>
              {activeDays.map(day => {
                const block = blocks.find(b => b.day === day && b.startIdx === si);
                if (block) {
                  return (
                    <td key={day} rowSpan={block.span}>
                      <div
                        className={`course-block course-block--${block.colorIdx}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const rect = e.currentTarget.getBoundingClientRect();
                          onBlockClick(block, rect);
                        }}
                      >
                        <div className="course-block__code">
                          <span>{block.courseCode}</span>
                          {block.room && <span style={{ fontSize: '0.62rem', opacity: 0.8 }}>{block.room}</span>}
                        </div>
                        <div className="course-block__section">
                          {block.component === 'lab' ? 'Lab' : 'Teori'} · Ş.{block.sectionNum}
                        </div>
                        {block.instructor && (
                          <div className="course-block__instructor" title={block.instructor}>
                            👨‍🏫 {block.instructor}
                          </div>
                        )}
                        {block.hasAlternative && block.allSections && block.allSections.length > 1 && (
                          <div className="course-block__alt-badge">
                            ⚡ Alternatif Şubeler
                          </div>
                        )}
                        <div className="course-block__time">{block.start}–{block.end}</div>
                      </div>
                    </td>
                  );
                } else if (!occCells[`${day}-${si}`]) {
                  return <td key={day}></td>;
                }
                return null;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

// ============================================================
// EXPORT DROPDOWN COMPONENT (Memoized)
// ============================================================
const ExportDropdown = React.memo(function ExportDropdown({ isOpen, onToggle, onExport }) {
  return (
    <div className="export-dropdown-wrapper">
      <button
        type="button"
        className="btn-export-main"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
      >
        📥 Dışa Aktar <span style={{ fontSize: '0.65rem', marginLeft: '2px' }}>▼</span>
      </button>

      <div className={`export-menu ${isOpen ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="export-item"
          onClick={(e) => { e.preventDefault(); onExport('pdf'); }}
        >
          <span className="export-item__icon">📄</span>
          <div>
            <div>PDF İndir</div>
            <div className="export-item__desc">A4 Yazdırılabilir Belge</div>
          </div>
        </button>

        <button
          type="button"
          className="export-item"
          onClick={(e) => { e.preventDefault(); onExport('excel'); }}
        >
          <span className="export-item__icon">📊</span>
          <div>
            <div>Excel (.xlsx) İndir</div>
            <div className="export-item__desc">Tablo & Detay Verisi</div>
          </div>
        </button>

        <button
          type="button"
          className="export-item"
          onClick={(e) => { e.preventDefault(); onExport('png'); }}
        >
          <span className="export-item__icon">🖼️</span>
          <div>
            <div>PNG Resmi İndir</div>
            <div className="export-item__desc">Yüksek Kalite Görsel</div>
          </div>
        </button>

        <button
          type="button"
          className="export-item"
          onClick={(e) => { e.preventDefault(); onExport('jpeg'); }}
        >
          <span className="export-item__icon">🌄</span>
          <div>
            <div>JPEG Resmi İndir</div>
            <div className="export-item__desc">Sıkıştırılmış Görsel</div>
          </div>
        </button>

        <button
          type="button"
          className="export-item"
          onClick={(e) => { e.preventDefault(); onExport('json'); }}
        >
          <span className="export-item__icon">📋</span>
          <div>
            <div>JSON Verisi İndir</div>
            <div className="export-item__desc">Ham Algoritma Verisi</div>
          </div>
        </button>
      </div>
    </div>
  );
});

// ============================================================
// POPOVER COMPONENT (Memoized)
// ============================================================
const PopoverCard = React.memo(function PopoverCard({ popoverData, onClose }) {
  if (!popoverData) return null;
  const { block, x, y } = popoverData;

  return (
    <div
      className="popover-card"
      style={{ left: `${Math.max(16, x)}px`, top: `${Math.max(16, y)}px` }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="popover-card__header">
        <div>
          <div className="popover-card__code">
            {block.courseCode} ({block.component === 'lab' ? 'Laboratuvar' : 'Teori'})
          </div>
          <div className="popover-card__name">{block.courseName}</div>
        </div>
        <button
          type="button"
          className="popover-card__close"
          onClick={(e) => {
            e.preventDefault();
            onClose();
          }}
        >
          ×
        </button>
      </div>

      <div className="popover-card__row">
        <span className="popover-card__icon">👨‍🏫</span>
        <span className="popover-card__label">Öğretim Üyesi</span>
        <span className="popover-card__val">{block.instructor || 'Belirtilmedi'}</span>
      </div>

      <div className="popover-card__row">
        <span className="popover-card__icon">🏷️</span>
        <span className="popover-card__label">Şube No</span>
        <span className="popover-card__val">Şube {block.sectionNum}</span>
      </div>

      <div className="popover-card__row">
        <span className="popover-card__icon">📍</span>
        <span className="popover-card__label">Derslik / Oda</span>
        <span className="popover-card__val">{block.room || 'Belirtilmedi'}</span>
      </div>

      <div className="popover-card__row">
        <span className="popover-card__icon">⏰</span>
        <span className="popover-card__label">Saat Dilimi</span>
        <span className="popover-card__val">{block.day} {block.start} – {block.end}</span>
      </div>

      {block.hasAlternative && block.allSections && block.allSections.length > 1 && (
        <div className="popover-card__alt-box">
          <div className="popover-card__alt-title">
            ⚡ Aynı saatte alternatif şubeler mevcut:
          </div>
          {block.allSections.map((s, idx) => (
            <div key={idx} className="popover-card__alt-item">
              Şube {s.section}: {s.instructor || 'Öğretim Üyesi'} {s.room ? `(${s.room})` : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

// ============================================================
// MAIN APP COMPONENT
// ============================================================
function App() {
  // Theme state with localStorage persistence
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ders_programi_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    } else {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    }
    localStorage.setItem('ders_programi_theme', theme);
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Course & Schedule State
  const [courseData, setCourseData] = useState(() => DEFAULT_DATA);
  const [freeDays, setFreeDays] = useState(['Cuma']);
  const [instructorFilters, setInstructorFilters] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activePopover, setActivePopover] = useState(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  // Initialize instructor filters on course load
  useEffect(() => {
    if (courseData) {
      const map = extractInstructorsByCourse(courseData.courses);
      const filters = {};
      for (const [code, insts] of Object.entries(map)) {
        filters[code] = insts.map(i => i.name);
      }
      setInstructorFilters(filters);
    }
  }, [courseData]);

  // Memoized instructor map
  const instructorsByCourse = useMemo(() => {
    if (!courseData) return {};
    return extractInstructorsByCourse(courseData.courses);
  }, [courseData]);

  // All course codes for color indexing
  const allCourseCodes = useMemo(() => {
    if (!courseData) return [];
    return courseData.courses.map(c => c.code);
  }, [courseData]);

  // Memoized schedule generation (Time-block deduplication & Instructor filtering)
  const schedules = useMemo(() => {
    if (!courseData) return null;
    return generateSchedules(courseData.courses, freeDays, instructorFilters, 500);
  }, [courseData, freeDays, instructorFilters]);

  // Reset index when schedules change
  useEffect(() => {
    setCurrentIndex(0);
  }, [schedules]);

  // Handlers
  const handleDayToggle = useCallback((day) => {
    setFreeDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  }, []);

  const handleFridayToggle = useCallback(() => {
    setFreeDays(prev => prev.includes('Cuma') ? prev.filter(d => d !== 'Cuma') : [...prev, 'Cuma']);
  }, []);

  const handleInstructorToggle = useCallback((courseCode, instName) => {
    setInstructorFilters(prev => {
      const cur = prev[courseCode] ? [...prev[courseCode]] : [];
      const updated = cur.includes(instName) ? cur.filter(x => x !== instName) : [...cur, instName];
      return { ...prev, [courseCode]: updated };
    });
  }, []);

  const handleSelectAllForCourse = useCallback((courseCode) => {
    const list = instructorsByCourse[courseCode] || [];
    setInstructorFilters(prev => ({ ...prev, [courseCode]: list.map(i => i.name) }));
  }, [instructorsByCourse]);

  const handleClearAllForCourse = useCallback((courseCode) => {
    setInstructorFilters(prev => ({ ...prev, [courseCode]: [] }));
  }, []);

  const handleBlockClick = useCallback((block, rect) => {
    setActivePopover({
      block,
      x: Math.min(rect.right + 10, window.innerWidth - 370),
      y: Math.min(rect.top, window.innerHeight - 320)
    });
  }, []);

  const handleClosePopover = useCallback(() => {
    setActivePopover(null);
  }, []);

  const handleToggleExportMenu = useCallback(() => {
    setIsExportMenuOpen(prev => !prev);
  }, []);

  // Global click listener to close popover / export dropdown
  useEffect(() => {
    const onGlobalClick = () => {
      setActivePopover(null);
      setIsExportMenuOpen(false);
    };
    window.addEventListener('click', onGlobalClick);
    return () => window.removeEventListener('click', onGlobalClick);
  }, []);

  // Keyboard navigation (Arrow keys, Home, End)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (!schedules || schedules.length === 0) return;
      if (e.target.tagName === 'INPUT') return;
      const total = schedules.length;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIndex(i => Math.max(0, i - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentIndex(i => Math.min(total - 1, i + 1));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentIndex(total - 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [schedules]);

  const currentSchedule = schedules && schedules[currentIndex] ? schedules[currentIndex] : null;

  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={handleToggleTheme} />

      <div className="main-layout">
        <div className="sidebar">
          <CourseInput
            courseData={courseData}
            onDataLoaded={setCourseData}
            onClearData={() => setCourseData(null)}
          />

          <ConstraintPanel
            freeDays={freeDays}
            onDayToggle={handleDayToggle}
            onFridayToggle={handleFridayToggle}
          />

          <InstructorFiltersPanel
            instructorsByCourse={instructorsByCourse}
            instructorFilters={instructorFilters}
            onInstructorToggle={handleInstructorToggle}
            onSelectAllForCourse={handleSelectAllForCourse}
            onClearAllForCourse={handleClearAllForCourse}
          />
        </div>

        <div>
          {!schedules ? (
            <div className="panel">
              <div className="empty-state">
                <div className="empty-state__icon">🎓</div>
                <div className="empty-state__title">Program Oluşturmaya Hazır</div>
              </div>
            </div>
          ) : schedules.length === 0 ? (
            <div className="panel">
              <div className="empty-state">
                <div className="empty-state__icon">🔍</div>
                <div className="empty-state__title" style={{ color: 'var(--accent-warning)' }}>
                  Seçilen Kriterlere Uygun Program Bulunamadı
                </div>
                <div className="empty-state__text">
                  Lütfen sol taraftaki hoca seçimlerini genişletin veya boş gün kısıtını kaldırın.
                </div>
              </div>
            </div>
          ) : (
            <div className="panel fade-in">
              <div className="panel__header">
                <div className="panel__icon">📅</div>
                <div>
                  <h2 className="panel__title">Ders Programı</h2>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                    Ders bloklarına tıklayarak hoca ve alternatif şubeleri inceleyebilirsiniz
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ExportDropdown
                    isOpen={isExportMenuOpen}
                    onToggle={handleToggleExportMenu}
                    onExport={(format) => exportSchedule(format, currentIndex, schedules)}
                  />
                </div>
              </div>

              <div className="panel__body">
                <StatsGrid
                  totalSchedules={schedules.length}
                  score={currentSchedule.score}
                />

                <AdvancedPagination
                  currentIndex={currentIndex}
                  total={schedules.length}
                  onIndexChange={setCurrentIndex}
                />

                <ScheduleTable
                  schedule={currentSchedule}
                  allCourseCodes={allCourseCodes}
                  onBlockClick={handleBlockClick}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <PopoverCard popoverData={activePopover} onClose={handleClosePopover} />
    </div>
  );
}

// ============================================================
// MOUNT
// ============================================================
if (typeof ReactDOM !== 'undefined' && ReactDOM.createRoot) {
  ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
}
