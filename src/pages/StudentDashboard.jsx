import { useEffect, useMemo, useState } from 'react';
import { getCourses, getStudentDashboard, requestEnrollment } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [dashboardRes, coursesRes] = await Promise.all([
          getStudentDashboard(),
          getCourses(),
        ]);
        if (mounted) {
          setData(dashboardRes);
          setCourses(coursesRes || []);
        }
      } catch (e) {
        if (mounted) setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const enrolledCourseIds = useMemo(() => new Set((data?.enrollments || []).map((e) => e.courseId)), [data]);

  const handleEnroll = async (courseId) => {
    try {
      setEnrollingCourseId(courseId);
      await requestEnrollment({ courseId });
      const refreshed = await getStudentDashboard();
      setData(refreshed);
    } catch (e) {
      setError(e);
    } finally {
      setEnrollingCourseId(null);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading student dashboard...</div>;
  if (error) return <div style={{ padding: 24, color: 'red' }}>{error?.message || 'Failed to load student dashboard'}</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Student Dashboard</h1>
      <div>Welcome, {user?.name || user?.email}</div>
      <section style={{ marginTop: 16 }}>
        <h2>Your Enrollments</h2>
        <pre style={{ background: '#f5f5f5', padding: 12, overflow: 'auto' }}>{JSON.stringify(data?.enrollments || [], null, 2)}</pre>
      </section>
      <section style={{ marginTop: 16 }}>
        <h2>Available Courses</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {courses.map((c) => {
            const isEnrolled = enrolledCourseIds.has(c.id);
            return (
              <li key={c.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <div style={{ flex: 1 }}>
                  <div><strong>{c.title}</strong></div>
                  <div style={{ color: '#666' }}>{c.description}</div>
                </div>
                <button disabled={isEnrolled || enrollingCourseId === c.id} onClick={() => handleEnroll(c.id)}>
                  {isEnrolled ? 'Enrolled' : enrollingCourseId === c.id ? 'Submitting...' : 'Enroll'}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

