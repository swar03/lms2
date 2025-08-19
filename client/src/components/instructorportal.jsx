import React, { useState, useMemo } from 'react';

// --- SVG Icons ---
const icons = {
  dashboard: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="none" viewBox="0 0 24 24"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
  addCourse: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  myCourses: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  students: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  upload: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  chevronDown: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>,
  x: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  enrollments: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  totalCourses: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  earnings: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="none" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
};

// --- Mock Data ---
const MOCK_STUDENTS = [
  { id: 1, name: 'GreatStack', courseId: 1, date: '1/23/2025', avatar: 'https://placehold.co/40x40/E2E8F0/475569?text=GS' },
  { id: 2, name: 'John Doe', courseId: 1, date: '1/22/2025', avatar: 'https://placehold.co/40x40/E2E8F0/475569?text=JD' },
];
const INITIAL_COURSES = [{
  id: 1, title: 'Introduction to Cybersecurity', description: 'Intro to cybersecurity concepts.', price: 101, discount: 0,
  thumbnail: 'https://placehold.co/600x400/3b82f6/ffffff?text=Cybersecurity',
  chapters: [{ id: 1, title: 'Chapter 1', lectures: [] }], publishedOn: '1/23/2025', students: 2, earnings: 101,
}];

// --- Layout ---
const Header = () => (
  <header className="bg-white border-b p-4 flex justify-between items-center">
    <h1 className="text-2xl font-bold text-blue-600">CyberEdu</h1>
    <div className="flex items-center gap-3"><span>Hi! Great Stack</span><div className="w-8 h-8 bg-slate-200 rounded-full"></div></div>
  </header>
);

const Sidebar = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', icon: icons.dashboard, label: 'Dashboard' },
    { id: 'add', icon: icons.addCourse, label: 'Add Course' },
    { id: 'view', icon: icons.myCourses, label: 'My Courses' },
    { id: 'students', icon: icons.students, label: 'Student Enrolled' },
  ];
  return (
    <aside className="w-64 bg-white border-r p-4 flex flex-col">
      <nav className="flex flex-col space-y-2">
        {navItems.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)}
            className={`text-left px-4 py-3 rounded-md hover:bg-slate-100 flex items-center gap-3 font-medium ${currentPage === item.id ? 'bg-slate-100 border-l-4 border-blue-600 text-blue-600' : 'text-slate-700'}`}>
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

// --- Course Pages ---
const AddCoursePage = ({ onAddCourse }) => {
  const [title, setTitle] = useState(''), [description, setDescription] = useState('');
  const [price, setPrice] = useState(0), [discount, setDiscount] = useState(0);
  const [thumbnail, setThumbnail] = useState(null), [thumbnailPreview, setThumbnailPreview] = useState('');
  const [chapters, setChapters] = useState([]);

  const addChapter = () => setChapters([...chapters, { id: Date.now(), title: `Chapter ${chapters.length + 1}`, lectures: [] }]);
  const updateChapter = (id, updated) => setChapters(chapters.map(ch => ch.id === id ? updated : ch));
  const deleteChapter = (id) => setChapters(chapters.filter(ch => ch.id !== id));

  const submit = () => {
    if (!title || !thumbnail) return alert("Please add title & thumbnail.");
    onAddCourse({ id: Date.now(), title, description, price: +price, discount: +discount, thumbnail: thumbnailPreview, chapters, publishedOn: new Date().toLocaleDateString(), students: 0, earnings: 0 });
    setTitle(''); setDescription(''); setPrice(0); setDiscount(0); setThumbnail(null); setThumbnailPreview(''); setChapters([]);
  };

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-3xl font-bold mb-8">Add New Course</h2>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-2 rounded" />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full border p-2 rounded" />
      <div className="grid md:grid-cols-3 gap-6">
        <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="border p-2 rounded" placeholder="Price" />
        <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} className="border p-2 rounded" placeholder="Discount %" />
        {thumbnailPreview ? (
          <div className="relative">
            <img src={thumbnailPreview} alt="Thumb" className="w-32 h-20 object-cover rounded" />
            <button onClick={() => { setThumbnail(null); setThumbnailPreview(''); }} className="absolute -top-2 -right-2 bg-white rounded-full p-1">{icons.x}</button>
          </div>
        ) : (
          <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer inline-flex items-center gap-2">{icons.upload}
            <input type="file" onChange={e => { const f = e.target.files[0]; if (f) { setThumbnail(f); setThumbnailPreview(URL.createObjectURL(f)); } }} className="hidden" />
          </label>
        )}
      </div>
      {chapters.map(ch => <div key={ch.id} className="border p-2 rounded">{ch.title} <button onClick={() => deleteChapter(ch.id)}>{icons.x}</button></div>)}
      <button onClick={addChapter} className="w-full bg-blue-100 py-2 rounded">+ Add Chapter</button>
      <button onClick={submit} className="bg-black text-white py-3 px-6 rounded">ADD</button>
    </div>
  );
};

const MyCoursesPage = ({ courses }) => (
  <div className="p-8">
    <h2 className="text-3xl font-bold mb-8">My Courses</h2>
    <table className="w-full bg-white rounded shadow">
      <thead><tr><th className="p-4 text-left">Course</th><th>Earnings</th><th>Students</th><th>Published</th></tr></thead>
      <tbody>{courses.map(c => (
        <tr key={c.id} className="border-b"><td className="p-4 flex items-center gap-4"><img src={c.thumbnail} className="w-24 h-16 rounded" />{c.title}</td><td>${c.earnings}</td><td>{c.students}</td><td>{c.publishedOn}</td></tr>
      ))}</tbody>
    </table>
  </div>
);

const StudentsEnrolledPage = ({ students, courses }) => {
  const getCourse = id => courses.find(c => c.id === id)?.title || 'Unknown';
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Students Enrolled</h2>
      <table className="w-full bg-white rounded shadow">
        <thead><tr><th>#</th><th>Name</th><th>Course</th><th>Date</th></tr></thead>
        <tbody>{students.map((s, i) => (
          <tr key={s.id} className="border-b"><td>{i+1}</td><td className="flex items-center gap-3"><img src={s.avatar} className="w-10 h-10 rounded-full" />{s.name}</td><td>{getCourse(s.courseId)}</td><td>{s.date}</td></tr>
        ))}</tbody>
      </table>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded shadow flex items-center gap-4"><div className="bg-slate-100 p-3 rounded text-blue-600">{icon}</div><div><p className="text-2xl font-bold">{value}</p><p className="text-slate-500">{label}</p></div></div>
);

const DashboardPage = ({ courses, students }) => {
  const totalEnrollments = students.length, totalCourses = courses.length, totalEarnings = courses.reduce((s, c) => s+c.earnings, 0);
  const getCourse = id => courses.find(c => c.id === id)?.title || 'Unknown';
  return (
    <div className="p-8">
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={icons.enrollments} label="Enrollments" value={totalEnrollments}/>
        <StatCard icon={icons.totalCourses} label="Courses" value={totalCourses}/>
        <StatCard icon={icons.earnings} label="Earnings" value={`$${totalEarnings}`}/>
      </div>
      <h2 className="text-2xl font-bold mb-4">Latest Enrollments</h2>
      <table className="w-full bg-white rounded shadow">
        <thead><tr><th>#</th><th>Name</th><th>Course</th></tr></thead>
        <tbody>{students.slice(0,5).map((s,i)=>(
          <tr key={s.id} className="border-b"><td>{i+1}</td><td className="flex items-center gap-3"><img src={s.avatar} className="w-10 h-10 rounded-full"/>{s.name}</td><td>{getCourse(s.courseId)}</td></tr>
        ))}</tbody>
      </table>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [students] = useState(MOCK_STUDENTS);

  const addCourse = c => { setCourses([...courses, c]); alert("Course Added!"); setCurrentPage('view'); };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage}/>
      <div className="flex-1 flex flex-col">
        <Header/>
        <main className="overflow-y-auto">
          {currentPage==='dashboard' && <DashboardPage courses={courses} students={students}/>}
          {currentPage==='add' && <AddCoursePage onAddCourse={addCourse}/>}
          {currentPage==='view' && <MyCoursesPage courses={courses}/>}
          {currentPage==='students' && <StudentsEnrolledPage students={students} courses={courses}/>}
        </main>
      </div>
    </div>
  );
}
