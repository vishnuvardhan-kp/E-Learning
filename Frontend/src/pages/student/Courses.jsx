import { useState } from 'react';
import { BookOpen, Users, ArrowRight, CheckCircle, Search, Filter, Sparkles, Clock, GraduationCap } from 'lucide-react';

export default function Courses({ courses, onEnroll }) {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');

  const activeCourses = courses.filter(c => c.status === 'Active');

  const filtered = activeCourses.filter(c =>
    (c.title?.toLowerCase().includes(search.toLowerCase()) ||
     c.instructorName?.toLowerCase().includes(search.toLowerCase())) &&
    (filterDept === '' || c.dept === filterDept)
  );

  // Unique departments
  const departments = [...new Set(activeCourses.map(c => c.dept).filter(Boolean))];

  const deptColors = {
    CSE: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
    IT:  { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
    ECE: { bg: '#fdf4ff', color: '#9333ea', border: '#e9d5ff' },
    MECH:{ bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  };

  return (
    <div style={{ maxWidth: '1200px' }}>
      <style>{`
        /* ─── HERO ─── */
        .courses-hero {
          background: linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #8b5cf6 100%);
          border-radius: 28px;
          padding: 52px 48px;
          color: #fff;
          margin-bottom: 36px;
          box-shadow: 0 16px 48px -8px rgba(99, 102, 241, 0.45);
          position: relative;
          overflow: hidden;
        }
        .courses-hero::before {
          content: '';
          position: absolute; top: -60px; right: -60px;
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none;
        }
        .courses-hero::after {
          content: '';
          position: absolute; bottom: -40px; left: 30%;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none;
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 12px; font-weight: 800;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: #e0e7ff; margin-bottom: 20px;
        }
        .courses-hero h1 {
          font-size: 42px; font-weight: 900;
          letter-spacing: -2px; margin: 0 0 14px;
          color: #fff; line-height: 1.1;
        }
        .courses-hero p {
          font-size: 16px; opacity: 0.85;
          max-width: 540px; color: #e0e7ff; line-height: 1.65;
          font-weight: 500;
        }
        .hero-stats {
          display: flex; gap: 28px; margin-top: 28px;
          flex-wrap: wrap;
        }
        .hero-stat {
          display: flex; flex-direction: column;
        }
        .hero-stat-value {
          font-size: 28px; font-weight: 900; color: #fff;
          letter-spacing: -1px; line-height: 1;
        }
        .hero-stat-label {
          font-size: 12px; font-weight: 600;
          color: rgba(255,255,255,0.7); margin-top: 4px;
          text-transform: uppercase; letter-spacing: 0.5px;
        }

        /* ─── FILTERS ─── */
        .browse-filters {
          display: flex; gap: 12px; align-items: center;
          flex-wrap: wrap; margin-bottom: 32px;
        }
        .browse-search {
          display: flex; align-items: center; gap: 12px;
          background: #fff; border: 1.5px solid #e8eaf6;
          border-radius: 14px; padding: 12px 18px; flex: 1;
          min-width: 240px; box-shadow: 0 2px 8px rgba(99,102,241,0.05);
          transition: all 0.3s;
        }
        .browse-search:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .browse-search input {
          border: none; outline: none; width: 100%;
          font-size: 14px; font-weight: 600; color: #1e1b4b;
          background: transparent; font-family: 'Inter', sans-serif;
        }
        .browse-search input::placeholder { color: #9ca3af; font-weight: 500; }
        .dept-filter-btn {
          padding: 12px 18px; border-radius: 12px;
          border: 1.5px solid #e8eaf6; background: #fff;
          font-size: 13px; font-weight: 700; color: #6b7280;
          cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif;
        }
        .dept-filter-btn:hover { border-color: #a5b4fc; color: #4338ca; background: #f0f0ff; }
        .dept-filter-btn.active { border-color: #6366f1; background: #eef2ff; color: #4338ca; }

        /* ─── COURSE CARD ─── */
        .student-course-card {
          background: #fff;
          border-radius: 24px;
          border: 1.5px solid #e8eaf6;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex; flex-direction: column;
          overflow: hidden; position: relative;
        }
        .student-course-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(99, 102, 241, 0.14);
          border-color: #a5b4fc;
        }
        .course-card-accent {
          height: 6px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
        }
        .course-card-body { padding: 28px; flex: 1; display: flex; flex-direction: column; gap: 16px; }
        .course-badge-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .course-badge {
          padding: 4px 12px; border-radius: 100px;
          font-size: 11px; font-weight: 800;
          letter-spacing: 0.5px; text-transform: uppercase;
          border: 1px solid;
        }
        .course-title {
          font-size: 20px; font-weight: 800;
          color: #1e1b4b; letter-spacing: -0.5px; margin: 0; line-height: 1.3;
        }
        .course-description {
          font-size: 13px; color: #6b7280;
          line-height: 1.65; margin: 0; flex: 1;
        }
        .course-stats {
          display: flex; gap: 18px;
          padding-top: 16px;
          border-top: 1px solid #f1f3ff;
        }
        .stat-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: #9ca3af; font-weight: 700;
        }
        .stat-item svg { color: #818cf8; }

        /* ─── ENROLL BUTTON ─── */
        .enroll-btn {
          width: 100%; padding: 14px 20px;
          border-radius: 16px; font-weight: 800; font-size: 14px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          cursor: pointer; transition: all 0.3s; border: none;
          font-family: 'Inter', sans-serif; letter-spacing: 0.2px;
        }
        .btn-ready {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          box-shadow: 0 8px 20px -4px rgba(99, 102, 241, 0.4);
        }
        .btn-ready:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px -4px rgba(99, 102, 241, 0.5);
        }
        .btn-enrolled {
          background: #f0fdf4; color: #16a34a;
          border: 1.5px solid #bbf7d0; cursor: default;
        }

        /* ─── EMPTY STATE ─── */
        .browse-empty {
          grid-column: 1 / -1; padding: 80px 40px; text-align: center;
          background: #fff; border-radius: 24px;
          border: 2px dashed #c7d2fe;
        }
        .browse-empty p { color: #9ca3af; font-weight: 600; font-size: 15px; }

        @media (max-width: 640px) {
          .courses-hero { padding: 36px 28px; }
          .courses-hero h1 { font-size: 30px; }
          .hero-stats { gap: 20px; }
          .browse-filters { flex-direction: column; align-items: stretch; }
        }
      `}</style>

      {/* ── HERO ── */}
      <div className="courses-hero animate-fade-in">
        <div className="hero-eyebrow">
          <Sparkles size={12} />
          Academic Catalog
        </div>
        <h1>Expand Your Horizon.</h1>
        <p>Explore institutional-grade courses designed by leading faculty to shape your professional future.</p>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">{activeCourses.length}</span>
            <span className="hero-stat-label">Active Courses</span>
          </div>
          <div className="hero-stat" style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '28px' }}>
            <span className="hero-stat-value">{departments.length}</span>
            <span className="hero-stat-label">Departments</span>
          </div>
          <div className="hero-stat" style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '28px' }}>
            <span className="hero-stat-value">100%</span>
            <span className="hero-stat-label">Free Enrollment</span>
          </div>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="browse-filters">
        <div className="browse-search">
          <Search size={18} color="#818cf8" />
          <input
            placeholder="Search courses or instructors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          className={`dept-filter-btn ${filterDept === '' ? 'active' : ''}`}
          onClick={() => setFilterDept('')}
        >All</button>
        {departments.map(d => (
          <button
            key={d}
            className={`dept-filter-btn ${filterDept === d ? 'active' : ''}`}
            onClick={() => setFilterDept(d)}
          >{d}</button>
        ))}
      </div>

      {/* ── SECTION HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e1b4b', margin: 0, letterSpacing: '-0.5px' }}>
          Available Curriculum
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#818cf8', marginLeft: '12px' }}>
            {filtered.length} course{filtered.length !== 1 ? 's' : ''}
          </span>
        </h2>
      </div>

      {/* ── COURSE CARDS ── */}
      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
        {filtered.map(course => {
          const palette = deptColors[course.dept] || { bg: '#f5f7ff', color: '#6366f1', border: '#c7d2fe' };
          return (
            <div className="student-course-card animate-fade-in" key={course._id}>
              <div className="course-card-accent" />
              <div className="course-card-body">
                <div className="course-badge-row">
                  {course.dept && (
                    <span className="course-badge" style={{ background: palette.bg, color: palette.color, borderColor: palette.border }}>
                      {course.dept}
                    </span>
                  )}
                  {course.code && (
                    <span className="course-badge" style={{ background: '#f5f7ff', color: '#6366f1', borderColor: '#c7d2fe' }}>
                      {course.code}
                    </span>
                  )}
                  {course.targetYear && (
                    <span className="course-badge" style={{ background: '#fff7ed', color: '#ea580c', borderColor: '#fed7aa' }}>
                      {course.targetYear}
                    </span>
                  )}
                </div>

                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">
                  {course.description || `Master the fundamentals and advanced concepts in this comprehensive academic module by the ${course.dept || 'academic'} department.`}
                </p>

                <div className="course-stats">
                  <div className="stat-item">
                    <Users size={14} />
                    <span>{course.enrolled || 0} Enrolled</span>
                  </div>
                  {course.instructorName && (
                    <div className="stat-item">
                      <GraduationCap size={14} />
                      <span>{course.instructorName}</span>
                    </div>
                  )}
                  {course.section && (
                    <div className="stat-item">
                      <Clock size={14} />
                      <span>Sec {course.section}</span>
                    </div>
                  )}
                </div>

                {course.enrolled ? (
                  <button className="enroll-btn btn-enrolled">
                    <CheckCircle size={17} />
                    Already Enrolled
                  </button>
                ) : (
                  <button className="enroll-btn btn-ready" onClick={() => onEnroll(course)}>
                    Enroll Now
                    <ArrowRight size={17} />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="browse-empty">
            <BookOpen size={40} color="#c7d2fe" style={{ margin: '0 auto 16px' }} />
            <p>No courses match your search. Try adjusting the filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
