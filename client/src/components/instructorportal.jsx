import React, { useState, useMemo, useEffect } from 'react';
import {
    LayoutDashboard, PlusCircle, BookCopy, Users, Upload, ChevronDown, X, DollarSign, Menu, Video, Trash2, FileQuestion
} from 'lucide-react';
import axios from 'axios';

// --- Mock Data & API URL ---
const INITIAL_STUDENTS = [
    { id: 1, name: 'Priya Sharma', courseId: 1, date: '1/23/2025', avatar: 'https://placehold.co/40x40/E2E8F0/475569?text=PS' },
    { id: 2, name: 'Raj Patel', courseId: 1, date: '1/22/2025', avatar: 'https://placehold.co/40x40/E2E8F0/475569?text=RP' },
    { id: 3, name: 'Anjali Mehta', courseId: 2, date: '2/15/2025', avatar: 'https://placehold.co/40x40/E2E8F0/475569?text=AM' },
];

const INITIAL_COURSES = [
    {
        id: 1, title: 'Introduction to Ethical Hacking', description: 'Learn the basics of ethical hacking and penetration testing.', price: 4999, discount: 10,
        thumbnail: 'https://placehold.co/600x400/ef4444/ffffff?text=Hacking',
        chapters: [{ id: 1, title: 'Chapter 1: Setup', modules: [{ id: 1, title: 'Module 1: Introduction', lectures: [{ id: 1, title: 'Course Overview', duration: 10, url: 'http://example.com', isPreviewFree: true }] }] }],
        publishedOn: '1/23/2025', students: 2, earnings: 8998,
    },
];

const API_URL = "http://localhost:5000";

// --- Reusable UI Components ---

const StatCard = ({ icon, label, value }) => (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow flex items-center gap-4">
        <div className="bg-slate-100 p-3 rounded-full text-blue-600">{icon}</div>
        <div>
            <p className="text-xl sm:text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-sm sm:text-base text-slate-500">{label}</p>
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
        if (!title || !url) { alert("Lecture title and URL are required."); return; }
        onAddLecture({ id: Date.now(), title, duration: Number(duration) || 0, url, isPreviewFree });
        setTitle(''); setDuration(''); setUrl(''); setIsPreviewFree(false); onClose();
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md mx-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800">Add Lecture</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input placeholder="Lecture Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
                    <input type="number" placeholder="Duration (minutes)" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
                    <input placeholder="Lecture URL" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is-preview-free" checked={isPreviewFree} onChange={(e) => setIsPreviewFree(e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <label htmlFor="is-preview-free" className="text-slate-700">Is Preview Free?</label>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition">Add</button>
                </form>
            </div>
        </div>
    );
};

const ModuleAccordion = ({ module, onUpdateModule, onDeleteModule, onAddLecture, onDeleteLecture }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="bg-white border rounded-lg overflow-hidden">
            <LectureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddLecture={onAddLecture} />
            <div className="p-3 flex justify-between items-center cursor-pointer bg-slate-100 hover:bg-slate-200" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center gap-3">
                    <ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    <input type="text" value={module.title} onClick={e => e.stopPropagation()} onChange={e => onUpdateModule({ ...module, title: e.target.value })} className="font-semibold text-slate-700 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2"/>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <span className="text-xs sm:text-sm text-slate-500">{module.lectures.length} Lectures</span>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteModule(); }} className="text-slate-500 hover:text-red-600"><Trash2 size={18} /></button>
                </div>
            </div>
            {isOpen && (
                <div className="p-3 border-t bg-slate-50 space-y-2">
                    {module.lectures.map(lec => (
                        <div key={lec.id} className="flex items-center justify-between p-2 bg-white rounded-md shadow-sm">
                            <div className='flex items-center gap-2'><Video size={16} className='text-slate-500' /><p className="text-slate-700 text-sm sm:text-base">{lec.title} ({lec.duration} min)</p></div>
                            <button onClick={() => onDeleteLecture(lec.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                        </div>
                    ))}
                    <button onClick={() => setIsModalOpen(true)} className="w-full bg-slate-200 text-slate-700 py-2 rounded-md hover:bg-slate-300 font-medium text-sm">+ Add Lecture</button>
                </div>
            )}
        </div>
    );
};

const ChapterAccordion = ({ chapter, onUpdateChapter, onDeleteChapter, onAddModule, onUpdateModule, onDeleteModule, onAddLecture, onDeleteLecture }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="bg-white border rounded-lg overflow-hidden">
            <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center gap-3">
                    <ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    <input type="text" value={chapter.title} onClick={e => e.stopPropagation()} onChange={e => onUpdateChapter({ ...chapter, title: e.target.value })} className="font-bold text-slate-800 text-base sm:text-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2"/>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <span className="text-xs sm:text-sm text-slate-500">{chapter.modules.length} Modules</span>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteChapter(); }} className="text-slate-500 hover:text-red-600"><X size={20} /></button>
                </div>
            </div>
            {isOpen && (
                <div className="p-2 sm:p-4 border-t bg-slate-50 space-y-3">
                    {chapter.modules.map(mod => (
                        <ModuleAccordion key={mod.id} module={mod} onUpdateModule={(updatedModule) => onUpdateModule(mod.id, updatedModule)} onDeleteModule={() => onDeleteModule(mod.id)} onAddLecture={(newLecture) => onAddLecture(mod.id, newLecture)} onDeleteLecture={(lectureId) => onDeleteLecture(mod.id, lectureId)}/>
                    ))}
                    <button onClick={onAddModule} className="w-full bg-slate-200 text-slate-700 py-2 rounded-md hover:bg-slate-300 font-medium">+ Add Module</button>
                </div>
            )}
        </div>
    );
};

const QuizCreator = ({ onSaveQuiz, onCancel, titleText = "Create Quiz" }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([{ question_text: '', options: ['', '', '', ''], correct_answer: '' }]);
    const handleQuestionChange = (index, field, value) => { const newQuestions = [...questions]; newQuestions[index][field] = value; setQuestions(newQuestions); };
    const handleOptionChange = (qIndex, oIndex, value) => { const newQuestions = [...questions]; newQuestions[qIndex].options[oIndex] = value; setQuestions(newQuestions); };
    const addQuestion = () => setQuestions([...questions, { question_text: '', options: ['', '', '', ''], correct_answer: '' }]);
    const handleSave = () => { if (!title.trim()) { alert("Quiz title is required."); return; } onSaveQuiz({ title, description, questions }); };
    
    return (
        <div className="mt-4 border-t pt-4 space-y-4">
            <div className="flex justify-between items-center"><h3 className="text-xl font-bold text-slate-700">{titleText}</h3><button onClick={onCancel} className="text-sm font-medium text-red-600 hover:text-red-800">Cancel</button></div>
            <input placeholder="Quiz Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-3 rounded-md"/>
            <textarea placeholder="Quiz Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-3 rounded-md h-24"/>
            {questions.map((q, qIndex) => (
                <div key={qIndex} className="bg-slate-50 p-4 rounded-lg border space-y-3">
                    <h4 className="font-semibold text-slate-800">Question {qIndex + 1}</h4>
                    <input placeholder={`Question Text`} value={q.question_text} onChange={(e) => handleQuestionChange(qIndex, 'question_text', e.target.value)} className="w-full border p-2 rounded-md" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIndex) => (<input key={oIndex} placeholder={`Option ${oIndex + 1}`} value={opt} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} className="w-full border p-2 rounded-md" />))}
                    </div>
                    <select value={q.correct_answer} onChange={(e) => handleQuestionChange(qIndex, 'correct_answer', e.target.value)} className="w-full border p-2 rounded-md bg-white">
                        <option value="">Select Correct Answer</option>
                        {q.options.filter(opt => opt).map((opt, oIndex) => ( <option key={oIndex} value={opt}>{opt}</option> ))}
                    </select>
                </div>
            ))}
            <button onClick={addQuestion} className="w-full bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 font-semibold transition text-sm">+ Add Another Question</button>
            <button onClick={handleSave} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold transition">Save Quiz</button>
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
    const [chapterQuizzes, setChapterQuizzes] = useState({});
    const [overallQuiz, setOverallQuiz] = useState(null);
    const [creatingQuizForChapter, setCreatingQuizForChapter] = useState(null);
    const [isCreatingOverallQuiz, setIsCreatingOverallQuiz] = useState(false);

    const addChapter = () => setChapters([...chapters, { id: Date.now(), title: `Chapter ${chapters.length + 1}`, modules: [] }]);
    const updateChapter = (id, updatedChapter) => setChapters(chapters.map(ch => ch.id === id ? updatedChapter : ch));
    const deleteChapter = (id) => {
        setChapters(chapters.filter(ch => ch.id !== id));
        const newQuizzes = {...chapterQuizzes}; delete newQuizzes[id]; setChapterQuizzes(newQuizzes);
    };

    const updateChapterContent = (chapterId, updateFn) => { setChapters(chapters.map(ch => ch.id === chapterId ? updateFn(ch) : ch)); };
    const addModule = (chapterId) => updateChapterContent(chapterId, (ch) => ({ ...ch, modules: [...ch.modules, { id: Date.now(), title: `Module ${ch.modules.length + 1}`, lectures: [] }] }));
    const updateModule = (chapterId, moduleId, updatedModule) => updateChapterContent(chapterId, (ch) => ({ ...ch, modules: ch.modules.map(m => m.id === moduleId ? updatedModule : m) }));
    const deleteModule = (chapterId, moduleId) => updateChapterContent(chapterId, (ch) => ({ ...ch, modules: ch.modules.filter(m => m.id !== moduleId) }));
    const addLecture = (chapterId, moduleId, newLecture) => updateChapterContent(chapterId, (ch) => ({ ...ch, modules: ch.modules.map(m => m.id === moduleId ? { ...m, lectures: [...m.lectures, newLecture] } : m) }));
    const deleteLecture = (chapterId, moduleId, lectureId) => updateChapterContent(chapterId, (ch) => ({ ...ch, modules: ch.modules.map(m => m.id === moduleId ? { ...m, lectures: m.lectures.filter(l => l.id !== lectureId) } : m) }));

    const handleSaveChapterQuiz = (chapterId, quizData) => {
        setChapterQuizzes(prev => ({...prev, [chapterId]: quizData }));
        setCreatingQuizForChapter(null);
        axios.post(`${API_URL}/create_quiz`, quizData).then(res => alert("Chapter quiz saved!")).catch(err => console.error(err));
    };
    const handleSaveOverallQuiz = (quizData) => {
        setOverallQuiz(quizData);
        setIsCreatingOverallQuiz(false);
        axios.post(`${API_URL}/create_quiz`, quizData).then(res => alert("Overall course quiz saved!")).catch(err => console.error(err));
    };

    const handleSubmit = async () => {
        if (!title || !thumbnailPreview) {
            return alert("Course Title and Thumbnail are required.");
        }
        
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert("You must be logged in to create a course.");
                return;
            }

            const courseData = {
                title,
                description,
                price: +price || 0,
                thumbnail: "https://placehold.co/600x400/8b5cf6/ffffff?text=New+Course", 
                chapters,
            };

            const response = await axios.post(`${API_URL}/api/courses`, courseData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            onAddCourse(response.data);

            setTitle(''); setDescription(''); setPrice(''); setDiscount(''); setThumbnail(null); 
            setThumbnailPreview(''); setChapters([]); setChapterQuizzes({}); setOverallQuiz(null);

        } catch (err) {
            console.error("Course creation failed:", err);
            alert(err.response?.data?.message || "An error occurred while creating the course.");
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Add Course</h2>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow space-y-4">
                <div><label className="font-medium text-slate-700 block mb-1">Course Title</label><input placeholder="Type here" value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                <div><label className="font-medium text-slate-700 block mb-1">Course Description</label><textarea placeholder="e.g. In this course you will learn..." value={description} onChange={e => setDescription(e.target.value)} className="w-full border p-3 rounded-md h-32 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div><label className="font-medium text-slate-700 block mb-1">Course Price</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" /></div>
                    <div><label className="font-medium text-slate-700 block mb-1">Discount %</label><input type="number" value={discount} onChange={e => setDiscount(e.target.value)} className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" /></div>
                    <div><label className="font-medium text-slate-700 block mb-1">Course Thumbnail</label><label className="bg-blue-600 text-white px-4 py-3 rounded-md cursor-pointer inline-flex items-center gap-2 hover:bg-blue-700 w-full justify-center"><Upload size={20} /><span>Upload</span><input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { setThumbnail(f); setThumbnailPreview(URL.createObjectURL(f)); } }} className="hidden" /></label></div>
                </div>
                {thumbnailPreview && (<div className="relative w-48"><img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-auto object-cover rounded-md" /><button onClick={() => { setThumbnail(null); setThumbnailPreview(''); }} className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md text-slate-600 hover:text-red-600"><X size={16} /></button></div>)}
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow space-y-4">
                <h3 className="text-xl font-bold text-slate-800">Course Content</h3>
                <div className="space-y-6">
                    {chapters.map(ch => (
                        <div key={ch.id} className="border-2 border-slate-200 p-2 sm:p-4 rounded-xl space-y-4">
                           <ChapterAccordion chapter={ch} onUpdateChapter={(updatedChapter) => updateChapter(ch.id, updatedChapter)} onDeleteChapter={() => deleteChapter(ch.id)} onAddModule={() => addModule(ch.id)} onUpdateModule={(moduleId, updatedModule) => updateModule(ch.id, moduleId, updatedModule)} onDeleteModule={(moduleId) => deleteModule(ch.id, moduleId)} onAddLecture={(moduleId, newLecture) => addLecture(ch.id, moduleId, newLecture)} onDeleteLecture={(moduleId, lectureId) => deleteLecture(ch.id, moduleId, lectureId)}/>
                            <div className="border-t-2 border-dashed mt-4 pt-4">
                                {chapterQuizzes[ch.id] ? (
                                    <div className="flex justify-between items-center bg-green-100 p-3 rounded-lg">
                                        <div><p className="font-bold text-green-800">Chapter Quiz Added:</p><p className="text-green-700">{chapterQuizzes[ch.id].title}</p></div>
                                        <button onClick={() => {const newQuizzes = {...chapterQuizzes}; delete newQuizzes[ch.id]; setChapterQuizzes(newQuizzes);}} className="font-semibold text-red-600 hover:text-red-800">Remove</button>
                                    </div>
                                ) : creatingQuizForChapter === ch.id ? (
                                    <QuizCreator onSaveQuiz={(quizData) => handleSaveChapterQuiz(ch.id, quizData)} onCancel={() => setCreatingQuizForChapter(null)} titleText="Create Chapter Quiz"/>
                                ) : (
                                    <button onClick={() => setCreatingQuizForChapter(ch.id)} className="w-full bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 font-semibold transition">+ Add Quiz to Chapter</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={addChapter} className="w-full bg-slate-100 text-slate-800 py-3 rounded-lg hover:bg-slate-200 font-semibold transition mt-4">+ Add Chapter</button>
            </div>
            
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow space-y-4">
                <h3 className="text-xl font-bold text-slate-800">Overall Course Quiz</h3>
                {overallQuiz ? (
                    <div className="flex justify-between items-center bg-green-100 p-3 rounded-lg">
                        <div><p className="font-bold text-green-800">Overall Quiz Added:</p><p className="text-green-700">{overallQuiz.title}</p></div>
                        <button onClick={() => setOverallQuiz(null)} className="font-semibold text-red-600 hover:text-red-800">Remove</button>
                    </div>
                ) : isCreatingOverallQuiz ? (
                    <QuizCreator onSaveQuiz={handleSaveOverallQuiz} onCancel={() => setIsCreatingOverallQuiz(false)} titleText="Create Overall Course Quiz"/>
                ) : (
                    <button onClick={() => setIsCreatingOverallQuiz(true)} className="w-full bg-slate-100 text-slate-800 py-3 rounded-lg hover:bg-slate-200 font-semibold transition">+ Add Final Quiz</button>
                )}
            </div>
            
            <button onClick={handleSubmit} className="w-full md:w-auto bg-black text-white py-3 px-8 rounded-lg font-bold text-lg hover:bg-slate-800">ADD COURSE</button>
        </div>
    );
};

const MyCoursesPage = ({ courses }) => (
    <div className="p-4 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">My Courses</h2>
        <div className="lg:hidden space-y-4">{courses.map(course => (<div key={course.id} className="bg-white rounded-lg shadow p-4 space-y-3"><div className="flex items-start gap-4"><img src={course.thumbnailUrl || course.thumbnail} alt={course.title} className="w-24 h-16 object-cover rounded-md" /><span className="font-bold text-slate-800">{course.title}</span></div><div className="text-sm text-slate-600 border-t pt-3 space-y-2"><p><strong className="text-slate-700">Earnings:</strong> ₹{(course.earnings || 0).toLocaleString()}</p><p><strong className="text-slate-700">Students:</strong> {course.students || 0}</p><p><strong className="text-slate-700">Published:</strong> {new Date(course.createdAt || course.publishedOn).toLocaleDateString()}</p></div></div>))}</div>
        <div className="hidden lg:block bg-white rounded-lg shadow overflow-x-auto"><table className="w-full text-left"><thead className="bg-slate-50"><tr><th className="p-4 font-semibold text-slate-600">Course</th><th className="p-4 font-semibold text-slate-600">Earnings</th><th className="p-4 font-semibold text-slate-600">Students</th><th className="p-4 font-semibold text-slate-600">Published</th></tr></thead><tbody>{courses.map(course => (<tr key={course.id} className="border-b hover:bg-slate-50"><td className="p-4 flex items-center gap-4"><img src={course.thumbnailUrl || course.thumbnail} alt={course.title} className="w-24 h-16 object-cover rounded-md" /><span className="font-medium text-slate-800">{course.title}</span></td><td className="p-4 text-slate-700">₹{(course.earnings || 0).toLocaleString()}</td><td className="p-4 text-slate-700">{course.students || 0}</td><td className="p-4 text-slate-700">{new Date(course.createdAt || course.publishedOn).toLocaleDateString()}</td></tr>))}</tbody></table></div>
    </div>
);

const StudentsEnrolledPage = ({ students, courses }) => {
    const getCourseTitleById = (courseId) => courses.find(c => c.id === courseId)?.title || 'Unknown Course';
    return (
        <div className="p-4 md:p-8"><h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">Students Enrolled</h2><div className="lg:hidden space-y-4">{students.map(student => (<div key={student.id} className="bg-white rounded-lg shadow p-4 space-y-3"><div className="flex items-center gap-3"><img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full" /><span className="font-bold text-slate-800">{student.name}</span></div><div className="text-sm text-slate-600 border-t pt-3 space-y-2"><p><strong className="text-slate-700">Course:</strong> {getCourseTitleById(student.courseId)}</p><p><strong className="text-slate-700">Enrolled On:</strong> {student.date}</p></div></div>))}</div><div className="hidden lg:block bg-white rounded-lg shadow overflow-x-auto"><table className="w-full text-left"><thead className="bg-slate-50"><tr><th className="p-4 font-semibold text-slate-600">Name</th><th className="p-4 font-semibold text-slate-600">Course</th><th className="p-4 font-semibold text-slate-600">Enrollment Date</th></tr></thead><tbody>{students.map(student => (<tr key={student.id} className="border-b hover:bg-slate-50"><td className="p-4 flex items-center gap-3"><img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full" /><span className="font-medium text-slate-800">{student.name}</span></td><td className="p-4 text-slate-700">{getCourseTitleById(student.courseId)}</td><td className="p-4 text-slate-700">{student.date}</td></tr>))}</tbody></table></div></div>
    );
};

const DashboardPage = ({ courses, students }) => {
    const totalEnrollments = useMemo(() => students.length, [students]);
    const totalCourses = useMemo(() => courses.length, [courses]);
    const totalEarnings = useMemo(() => courses.reduce((sum, course) => sum + (course.earnings || 0), 0), [courses]);
    const getCourseTitleById = (courseId) => courses.find(c => c.id === courseId)?.title || 'Unknown';
    return (
        <div className="p-4 md:p-8 space-y-8"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"><StatCard icon={<Users size={24} />} label="Total Enrollments" value={totalEnrollments} /><StatCard icon={<BookCopy size={24} />} label="Total Courses" value={totalCourses} /><StatCard icon={<DollarSign size={24} />} label="Total Earnings" value={`₹${totalEarnings.toLocaleString()}`} /></div><div><h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4">Latest Enrollments</h2><div className="lg:hidden space-y-4">{students.slice(0, 5).map(student => (<div key={student.id} className="bg-white rounded-lg shadow p-4 space-y-3"><div className="flex items-center gap-3"><img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full" /><span className="font-bold text-slate-800">{student.name}</span></div><div className="text-sm text-slate-600 border-t pt-3 space-y-2"><p><strong className="text-slate-700">Course:</strong> {getCourseTitleById(student.courseId)}</p><p><strong className="text-slate-700">Date:</strong> {student.date}</p></div></div>))}</div><div className="hidden lg:block bg-white rounded-lg shadow overflow-x-auto"><table className="w-full text-left"><thead className="bg-slate-50"><tr><th className="p-4 font-semibold text-slate-600">Name</th><th className="p-4 font-semibold text-slate-600">Course</th><th className="p-4 font-semibold text-slate-600">Date</th></tr></thead><tbody>{students.slice(0, 5).map(student => (<tr key={student.id} className="border-b hover:bg-slate-50"><td className="p-4 flex items-center gap-3"><img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full" /><span className="font-medium text-slate-800">{student.name}</span></td><td className="p-4 text-slate-700">{getCourseTitleById(student.courseId)}</td><td className="p-4 text-slate-700">{student.date}</td></tr>))}</tbody></table></div></div></div>
    );
};

const TakeQuizPage = () => {
    // This component remains unchanged
    const [quizzes, setQuizzes] = useState([]); const [selectedQuiz, setSelectedQuiz] = useState(null); const [answers, setAnswers] = useState({}); const [result, setResult] = useState(null);
    useEffect(() => { const fetchQuizzes = async () => { try { const response = await axios.get(`${API_URL}/quizzes`); setQuizzes(response.data); } catch (error) { console.error("Error fetching quizzes", error); } }; fetchQuizzes(); }, []);
    const handleAnswerChange = (qIndex, value) => { setAnswers({ ...answers, [qIndex]: value }); };
    const handleSubmit = async () => { const payload = { quiz_id: selectedQuiz.id, answers: Object.entries(answers).map(([qIndex, selected]) => ({ question_id: parseInt(qIndex) + 1, selected, })), }; try { const response = await axios.post(`${API_URL}/submit_attempt`, payload); setResult(response.data); } catch (error) { console.error("Error submitting answers", error); alert("Failed to submit answers."); } };
    if (result) { return ( <div className="p-4 md:p-8"><h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Quiz Results</h2><div className="bg-white p-6 rounded-lg shadow"><h3 className="text-2xl font-bold text-blue-600 mb-4">You scored {result.score} out of {result.total}</h3><div className="space-y-4">{result.feedback.map((fb, index) => (<div key={index} className={`p-4 rounded-md ${fb.is_correct ? 'bg-green-100' : 'bg-red-100'}`}><p className="font-bold">{fb.is_correct ? '✅' : '❌'} {fb.question}</p><p>Your answer: {fb.selected}</p>{!fb.is_correct && <p>Correct answer: {fb.correct}</p>}</div>))}</div><button onClick={() => { setSelectedQuiz(null); setResult(null); setAnswers({}); }} className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700">Back to Quizzes</button></div></div>); }
    if (selectedQuiz) { return ( <div className="p-4 md:p-8"><h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">{selectedQuiz.title}</h2><div className="space-y-6">{selectedQuiz.questions.map((q, index) => (<div key={index} className="bg-white p-6 rounded-lg shadow"><p className="font-semibold text-lg mb-3">{index + 1}. {q.question_text}</p><div className="space-y-2">{q.options.map((opt, oIndex) => (<label key={oIndex} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer"><input type="radio" name={`question_${index}`} value={opt} onChange={(e) => handleAnswerChange(index, e.target.value)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" /><span>{opt}</span></label>))}</div></div>))}</div><button onClick={handleSubmit} className="mt-8 bg-black text-white py-3 px-8 rounded-lg font-bold text-lg hover:bg-slate-800 w-full sm:w-auto">Submit Answers</button></div>); }
    return ( <div className="p-4 md:p-8"><h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8">Available Quizzes</h2><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{quizzes.map(quiz => (<div key={quiz.id} className="bg-white p-6 rounded-lg shadow flex flex-col"><h3 className="text-xl font-bold text-slate-800">{quiz.title}</h3><p className="text-slate-600 my-2 flex-grow">{quiz.description}</p><button onClick={() => setSelectedQuiz(quiz)} className="w-full bg-blue-600 text-white py-2 mt-4 rounded-md hover:bg-blue-700">Take Quiz</button></div>))}</div></div>);
};

// --- Layout & Main App ---

export default function InstructorDashboard() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [courses, setCourses] = useState(INITIAL_COURSES);
    const [students, setStudents] = useState(INITIAL_STUDENTS);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const addCourse = (newCourseFromServer) => {
        setCourses(prevCourses => [...prevCourses, newCourseFromServer]);
        alert("Course Added Successfully!");
        setCurrentPage('view');
    };
    
    const navItems = [
        { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { id: 'add', icon: <PlusCircle size={20} />, label: 'Add Course' },
        { id: 'view', icon: <BookCopy size={20} />, label: 'My Courses' },
        { id: 'students', icon: <Users size={20} />, label: 'Student Enrolled' },
        { id: 'quizzes', icon: <FileQuestion size={20} />, label: 'Quizzes' },
    ];

    const handleNavClick = (pageId) => {
        setCurrentPage(pageId);
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };
    
    return (
        <div className="min-h-screen flex bg-slate-50">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <aside className={`bg-white border-r flex flex-col fixed inset-y-0 left-0 z-30
                w-64 p-4 transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:relative lg:w-64`}>
                <h1 className="text-2xl font-bold text-blue-600 mb-8">CSI</h1>
                <nav className="flex flex-col space-y-2">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`text-left px-4 py-3 rounded-md hover:bg-slate-100 flex items-center gap-3 font-medium transition-colors ${
                                currentPage === item.id
                                    ? 'bg-slate-100 border-l-4 border-blue-600 text-blue-600'
                                    : 'text-slate-700'
                            }`}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>
            </aside>
            
            <div className="flex-1 flex flex-col">
                <header className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-600 hover:text-blue-600 lg:hidden">
                        <Menu size={24} />
                    </button>
                    <div className="lg:hidden"></div>
                    <div className="hidden lg:block"></div>
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-slate-700 hidden sm:inline">Hi! Riya Devansh Aage</span>
                        <div className="w-9 h-9 bg-slate-200 rounded-full"></div>
                    </div>
                </header>
                <main className="overflow-y-auto">
                    {currentPage === 'dashboard' && <DashboardPage courses={courses} students={students} />}
                    {currentPage === 'add' && <AddCoursePage onAddCourse={addCourse} />}
                    {currentPage === 'view' && <MyCoursesPage courses={courses} />}
                    {currentPage === 'students' && <StudentsEnrolledPage students={students} courses={courses} />}
                    {currentPage === 'quizzes' && <TakeQuizPage />}
                </main>
            </div>
        </div>
    );
}