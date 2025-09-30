import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { allCourses } from '../data/mockData';
import { calculateCourseProgress, checkCourseCompletion } from '../utils/progress';

import ProgressBar from '../components/ProgressBar';
import ModuleAccordion from '../components/ModuleAccordion';
import VideoPlayerModal from '../components/VideoPlayerModal';
import AssignmentModal from '../components/AssignmentModal';
import QuizModal from '../components/QuizModal';
import CertificateModal from '../components/CertificateModal';

const CoursePage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const course = allCourses.find(c => c.id === courseId);

  const [progress, setProgress] = useState({ lectures: {}, assignments: {}, quizzes: {} });
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  const courseProgress = useMemo(() => calculateCourseProgress(course, progress), [course, progress]);
  const isCourseCompleted = useMemo(() => checkCourseCompletion(course, progress), [course, progress]);

  useEffect(() => {
    if (isCourseCompleted) {
      setActiveModal('certificate');
    }
  }, [isCourseCompleted]);

  const handlePlayVideo = (lecture) => {
    setProgress(prev => ({ ...prev, lectures: { ...prev.lectures, [lecture.id]: true } }));
    setModalData(lecture);
    setActiveModal('video');
  };

  const handleSubmitAssignment = (assignmentId, content) => {
    setProgress(prev => ({ ...prev, assignments: { ...prev.assignments, [assignmentId]: { status: 'submitted', content } } }));
    toast.success('Assignment submitted!');
    closeModal();
  };
  
  const handleSubmitQuiz = (quizId, score, total) => {
     setProgress(prev => ({ ...prev, quizzes: { ...prev.quizzes, [quizId]: { score, total } } }));
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  if (!course) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-white">Course Not Found</h1>
        <Link to="/dashboard" className="text-indigo-400 hover:underline mt-4 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <>
      {/* Modals */}
      {activeModal === 'video' && <VideoPlayerModal videoUrl={modalData?.videoUrl} onClose={closeModal} />}
      {activeModal === 'assignment' && <AssignmentModal assignment={modalData} submission={progress.assignments[modalData?.id]} onClose={closeModal} onSubmit={handleSubmitAssignment} />}
      {activeModal === 'quiz' && <QuizModal quiz={modalData} result={progress.quizzes[modalData?.id]} onClose={closeModal} onSubmit={handleSubmitQuiz} />}
      {activeModal === 'certificate' && <CertificateModal course={course} user={user} onClose={closeModal} />}

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-8">
              <h1 className="text-3xl font-bold text-white">{course.title}</h1>
              <p className="text-gray-400 mt-2">Instructor: {course.instructor}</p>
              <div className="mt-6">
                <ProgressBar percentage={courseProgress} />
              </div>
          </div>
          
          {isCourseCompleted && (
            <div className="bg-green-900 border border-green-700 text-green-300 p-4 mb-8 rounded-lg flex items-center justify-between" role="alert">
              <div>
                <p className="font-bold">Course Completed!</p>
                <p>Congratulations! You can now view your certificate.</p>
              </div>
              <button onClick={() => setActiveModal('certificate')} className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-500">
                View Certificate
              </button>
            </div>
          )}

          {course.modules.map(module => (
            <ModuleAccordion
              key={module.id}
              module={module}
              progress={progress}
              onPlayVideo={handlePlayVideo}
              onOpenAssignment={(assignment) => { setModalData(assignment); setActiveModal('assignment'); }}
              onOpenQuiz={(quiz) => { setModalData(quiz); setActiveModal('quiz'); }}
            />
          ))}
      </div>
    </>
  );
};

export default CoursePage;