import React, { useState, useMemo } from 'react';
import { 
    LayoutDashboard, 
    PlusCircle, 
    BookCopy, 
    Users, 
    Upload, 
    ChevronDown, 
    X, 
    DollarSign,
    Menu,
    Video,
    Edit2,
    Trash2
} from 'lucide-react';

// --- Mock Data ---
const INITIAL_STUDENTS = [
  { id: 1, name: 'Priya Sharma', courseId: 1, date: '1/23/2025', avatar: 'https://placehold.co/40x40/E2E8F0/475569?text=PS' },
  { id: 2, name: 'Raj Patel', courseId: 1, date: '1/22/2025', avatar: 'https://placehold.co/40x40/E2E8F0/475569?text=RP' },
  { id: 3, name: 'Anjali Mehta', courseId: 2, date: '2/15/2025', avatar: 'https://placehold.co/40x40/E2E8F0/475569?text=AM' },
];

const INITIAL_COURSES = [
    {
      id: 1, title: 'Introduction to Ethical Hacking', description: 'Learn the basics of ethical hacking and penetration testing.', price: 4999, discount: 10,
      thumbnail: 'https://placehold.co/600x400/ef4444/ffffff?text=Hacking',
      chapters: [{ id: 1, title: 'Chapter 1: Setup', lectures: [{id: 1, title: 'Course Overview', duration: 10, url: 'http://example.com', isPreviewFree: true}] }], 
      publishedOn: '1/23/2025', students: 2, earnings: 8998,
    },
    {
      id: 2, title: 'Advanced Cloud Security', description: 'Secure cloud environments like a pro.', price: 7999, discount: 0,
      thumbnail: 'https://placehold.co/600x400/8b5cf6/ffffff?text=Cloud+Security',
      chapters: [{ id: 2, title: 'Chapter 1: AWS Security', lectures: [] }], 
      publishedOn: '2/10/2025', students: 1, earnings: 7999,
    }
];


// --- Reusable UI Components ---

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
    <div className="bg-slate-100 p-3 rounded-full text-blue-600">
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-slate-500">{label}</p>
    </div>
  </div>
);

const LectureModal = ({ isOpen, onClose, onAddLecture }) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [url, setUrl] = useState('');
  const [isPreviewFree, setIsPreviewFree] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !url) {
      alert("Lecture title and URL are required.");
      return;
    }
    onAddLecture({
      id: Date.now(),
      title,
      duration: Number(duration) || 0,
      url,
      isPreviewFree,
    });
    // Reset form and close
    setTitle('');
    setDuration('');
    setUrl('');
    setIsPreviewFree(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-slate-800">Add Lecture</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Lecture Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            placeholder="Lecture URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is-preview-free"
              checked={isPreviewFree}
              onChange={(e) => setIsPreviewFree(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is-preview-free" className="text-slate-700">Is Preview Free?</label>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition">
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

const ChapterAccordion = ({ chapter, onUpdateChapter, onDeleteChapter }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const addLecture = (newLecture) => {
        const updatedChapter = { ...chapter, lectures: [...chapter.lectures, newLecture] };
        onUpdateChapter(chapter.id, updatedChapter);
    };

    const deleteLecture = (lectureId) => {
        const updatedLectures = chapter.lectures.filter(lec => lec.id !== lectureId);
        const updatedChapter = { ...chapter, lectures: updatedLectures };
        onUpdateChapter(chapter.id, updatedChapter);
    }

    const totalLectures = chapter.lectures.length;

    return (
        <div className="bg-white border rounded-lg overflow-hidden">
            <LectureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddLecture={addLecture} />
            <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center gap-3">
                    <ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    <input 
                        type="text" 
                        value={chapter.title}
                        onClick={e => e.stopPropagation()}
                        onChange={e => onUpdateChapter(chapter.id, {...chapter, title: e.target.value})}
                        className="font-semibold text-slate-800 text-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500">{totalLectures} Lectures</span>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteChapter(chapter.id); }} className="text-slate-500 hover:text-red-600"><X size={20} /></button>
                </div>
            </div>
            {isOpen && (
                <div className="p-4 border-t bg-slate-50 space-y-3">
                    {chapter.lectures.map(lec => (
                        <div key={lec.id} className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                            <div className='flex items-center gap-2'>
                                <Video size={16} className='text-slate-500'/>
                                <p className="text-slate-700">{lec.title} ({lec.duration} min)</p>
                            </div>
                            <button onClick={() => deleteLecture(lec.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                        </div>
                    ))}
                    <button onClick={() => setIsModalOpen(true)} className="w-full bg-slate-200 text-slate-700 py-2 rounded-md hover:bg-slate-300 font-medium">
                        + Add Lecture
                    </button>
                </div>
            )}
        </div>
    );
};


// --- Page Components ---

const AddCoursePage = ({ onAddCourse }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [chapters, setChapters] = useState([]);

  const addChapter = () => setChapters([...chapters, { id: Date.now(), title: `Chapter ${chapters.length + 1}`, lectures: [] }]);
  const updateChapter = (id, updatedChapter) => setChapters(chapters.map(ch => ch.id === id ? updatedChapter : ch));
  const deleteChapter = (id) => setChapters(chapters.filter(ch => ch.id !== id));

  const handleSubmit = () => {
    // --- API CALL ---
    // In a real app, you would send this data to your Next.js API endpoint.
    // Example: axios.post('/api/courses', { title, description, ... })
    console.log("Submitting Course:", { title, description, price, discount, thumbnail, chapters });
    
    if (!title || !thumbnail) return alert("Course Title and Thumbnail are required.");
    onAddCourse({ 
        id: Date.now(), 
        title, 
        description, 
        price: +price || 0, 
        discount: +discount || 0, 
        thumbnail: thumbnailPreview, 
        chapters, 
        publishedOn: new Date().toLocaleDateString(), 
        students: 0, 
        earnings: 0 
    });
    
    // Reset form
    setTitle(''); setDescription(''); setPrice(''); setDiscount(''); setThumbnail(null); setThumbnailPreview(''); setChapters([]);
  };

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-3xl font-bold text-slate-800">Add Course</h2>
      
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="font-medium text-slate-700 block mb-1">Course Title</label>
          <input placeholder="Type here" value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="font-medium text-slate-700 block mb-1">Course Description</label>
          {/* Note: In a real app, replace this with a rich text editor like ReactQuill or TipTap */}
          <textarea placeholder="test..." value={description} onChange={e => setDescription(e.target.value)} className="w-full border p-3 rounded-md h-32 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="font-medium text-slate-700 block mb-1">Course Price</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
          </div>
          <div>
            <label className="font-medium text-slate-700 block mb-1">Discount %</label>
            <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
          </div>
          <div>
            <label className="font-medium text-slate-700 block mb-1">Course Thumbnail</label>
            <label className="bg-blue-600 text-white px-4 py-3 rounded-md cursor-pointer inline-flex items-center gap-2 hover:bg-blue-700 w-full justify-center">
              <Upload size={20} />
              <span>Upload</span>
              <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { setThumbnail(f); setThumbnailPreview(URL.createObjectURL(f)); } }} className="hidden" />
            </label>
          </div>
        </div>
        {thumbnailPreview && (
          <div className="relative w-48">
            <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-auto object-cover rounded-md" />
            <button onClick={() => { setThumbnail(null); setThumbnailPreview(''); }} className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md text-slate-600 hover:text-red-600">
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="text-xl font-bold text-slate-800">Course Content</h3>
        <div className="space-y-4">
            {chapters.map(ch => 
                <ChapterAccordion 
                    key={ch.id} 
                    chapter={ch} 
                    onUpdateChapter={updateChapter} 
                    onDeleteChapter={deleteChapter}
                />
            )}
        </div>
        <button onClick={addChapter} className="w-full bg-blue-100 text-blue-700 py-3 rounded-lg hover:bg-blue-200 font-semibold transition">
          + Add Chapter
        </button>
      </div>
      
      <button onClick={handleSubmit} className="bg-black text-white py-3 px-8 rounded-lg font-bold text-lg hover:bg-slate-800">
        ADD
      </button>
    </div>
  );
};

const MyCoursesPage = ({ courses }) => (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-slate-800 mb-8">My Courses</h2>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 font-semibold text-slate-600">Course</th>
              <th className="p-4 font-semibold text-slate-600">Earnings</th>
              <th className="p-4 font-semibold text-slate-600">Students</th>
              <th className="p-4 font-semibold text-slate-600">Published</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id} className="border-b hover:bg-slate-50">
                <td className="p-4 flex items-center gap-4">
                  <img src={course.thumbnail} alt={course.title} className="w-24 h-16 object-cover rounded-md" />
                  <span className="font-medium text-slate-800">{course.title}</span>
                </td>
                <td className="p-4 text-slate-700">₹{course.earnings.toLocaleString()}</td>
                <td className="p-4 text-slate-700">{course.students}</td>
                <td className="p-4 text-slate-700">{course.publishedOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
);
  
const StudentsEnrolledPage = ({ students, courses }) => {
    const getCourseTitleById = (courseId) => courses.find(c => c.id === courseId)?.title || 'Unknown Course';

    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">Students Enrolled</h2>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 font-semibold text-slate-600">Name</th>
                <th className="p-4 font-semibold text-slate-600">Course</th>
                <th className="p-4 font-semibold text-slate-600">Enrollment Date</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} className="border-b hover:bg-slate-50">
                  <td className="p-4 flex items-center gap-3">
                    <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full" />
                    <span className="font-medium text-slate-800">{student.name}</span>
                  </td>
                  <td className="p-4 text-slate-700">{getCourseTitleById(student.courseId)}</td>
                  <td className="p-4 text-slate-700">{student.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};
  
const DashboardPage = ({ courses, students }) => {
    const totalEnrollments = useMemo(() => students.length, [students]);
    const totalCourses = useMemo(() => courses.length, [courses]);
    const totalEarnings = useMemo(() => courses.reduce((sum, course) => sum + course.earnings, 0), [courses]);
    const getCourseTitleById = (courseId) => courses.find(c => c.id === courseId)?.title || 'Unknown';

    return (
      <div className="p-8 space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          <StatCard icon={<Users size={24} />} label="Total Enrollments" value={totalEnrollments}/>
          <StatCard icon={<BookCopy size={24} />} label="Total Courses" value={totalCourses}/>
          <StatCard icon={<DollarSign size={24} />} label="Total Earnings" value={`₹${totalEarnings.toLocaleString()}`}/>
        </div>
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Latest Enrollments</h2>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Name</th>
                            <th className="p-4 font-semibold text-slate-600">Course</th>
                            <th className="p-4 font-semibold text-slate-600">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.slice(0, 5).map(student => (
                            <tr key={student.id} className="border-b hover:bg-slate-50">
                                <td className="p-4 flex items-center gap-3">
                                    <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full"/>
                                    <span className="font-medium text-slate-800">{student.name}</span>
                                </td>
                                <td className="p-4 text-slate-700">{getCourseTitleById(student.courseId)}</td>
                                <td className="p-4 text-slate-700">{student.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    );
};

// --- Layout & Main App ---

export default function InstructorDashboard() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const addCourse = newCourse => {
    setCourses([...courses, newCourse]);
    alert("Course Added Successfully!");
    setCurrentPage('view');
  };

  const navItems = [
    { id: 'dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
    { id: 'add', icon: <PlusCircle />, label: 'Add Course' },
    { id: 'view', icon: <BookCopy />, label: 'My Courses' },
    { id: 'students', icon: <Users />, label: 'Student Enrolled' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className={`bg-white border-r flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64 p-4' : 'w-0 p-0' } overflow-hidden`}>
        <h1 className="text-2xl font-bold text-blue-600 mb-8">CSI</h1>
        <nav className="flex flex-col space-y-2">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setCurrentPage(item.id)}
              className={`text-left px-4 py-3 rounded-md hover:bg-slate-100 flex items-center gap-3 font-medium transition-colors ${currentPage === item.id ? 'bg-slate-100 border-l-4 border-blue-600 text-blue-600' : 'text-slate-700'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-600 hover:text-blue-600">
                <Menu size={24} />
            </button>
            <div className="flex items-center gap-3">
                <span className="font-medium text-slate-700">Hi! Riya Birnale</span>
                <div className="w-9 h-9 bg-slate-200 rounded-full"></div>
            </div>
        </header>

        <main className="overflow-y-auto">
          {currentPage === 'dashboard' && <DashboardPage courses={courses} students={students}/>}
          {currentPage === 'add' && <AddCoursePage onAddCourse={addCourse}/>}
          {currentPage === 'view' && <MyCoursesPage courses={courses}/>}
          {currentPage === 'students' && <StudentsEnrolledPage students={students} courses={courses}/>}
        </main>
      </div>
    </div>
  );
}