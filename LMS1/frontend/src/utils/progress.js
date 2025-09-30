// src/utils/progress.js

export const checkCourseCompletion = (course, progress) => {
  if (!course?.modules?.length) {
    return false;
  }

  // Check if every lecture, assignment, and quiz has been completed.
  return course.modules.every(module => 
    module.lectures.every(lecture => progress.lectures[lecture.id]) &&
    module.assignments.every(assignment => progress.assignments[assignment.id]) &&
    module.quizzes.every(quiz => progress.quizzes[quiz.id])
  );
};


export const calculateCourseProgress = (course, progress) => {
  if (!course?.modules?.length) {
    return 0;
  }

  let totalItems = 0;
  let completedItems = 0;

  course.modules.forEach(module => {
    totalItems += module.lectures.length + module.assignments.length + module.quizzes.length;
    
    Object.keys(progress.lectures).forEach(id => {
      if(module.lectures.some(l => l.id === id)) completedItems++;
    });
    Object.keys(progress.assignments).forEach(id => {
      if(module.assignments.some(a => a.id === id)) completedItems++;
    });
    Object.keys(progress.quizzes).forEach(id => {
      if(module.quizzes.some(q => q.id === id)) completedItems++;
    });
  });

  if (totalItems === 0) return 0;
  
  return Math.round((completedItems / totalItems) * 100);
};