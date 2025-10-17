import { useMemo } from 'react';

export default function ProgressChart({ 
  completed = 0, 
  total = 0, 
  size = 120, 
  strokeWidth = 8,
  title = "Progress",
  showPercentage = true 
}) {
  const progress = useMemo(() => {
    if (total === 0) return 0;
    return Math.min(Math.max((completed / total) * 100, 0), 100);
  }, [completed, total]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#10b981'; // green
    if (progress >= 60) return '#f59e0b'; // yellow
    if (progress >= 40) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#374151"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getProgressColor(progress)}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showPercentage && (
            <div className="text-2xl font-bold text-white">
              {Math.round(progress)}%
            </div>
          )}
          <div className="text-xs text-gray-400 text-center">
            {completed}/{total}
          </div>
        </div>
      </div>
      
      {title && (
        <div className="mt-2 text-sm text-gray-300 text-center font-medium">
          {title}
        </div>
      )}
    </div>
  );
}

// Multiple progress charts component
export function ProgressGrid({ progressData = [] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {progressData.map((item, index) => (
        <ProgressChart
          key={index}
          completed={item.completed}
          total={item.total}
          title={item.title}
          size={100}
          strokeWidth={6}
        />
      ))}
    </div>
  );
}

// Course progress summary
export function CourseProgress({ enrollments = [] }) {
  const progressData = useMemo(() => {
    return enrollments
      .filter(enrollment => enrollment.status === 'APPROVED')
      .map(enrollment => {
        const course = enrollment.course;
        const totalModules = course.modules?.length || 0;
        const completedModules = 0; // This would come from user progress data
        
        return {
          title: course.title,
          completed: completedModules,
          total: totalModules
        };
      });
  }, [enrollments]);

  const overallProgress = useMemo(() => {
    const totalItems = progressData.reduce((sum, item) => sum + item.total, 0);
    const completedItems = progressData.reduce((sum, item) => sum + item.completed, 0);
    return { completed: completedItems, total: totalItems };
  }, [progressData]);

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Learning Progress</h3>
      
      {/* Overall Progress */}
      <div className="flex justify-center mb-8">
        <ProgressChart
          completed={overallProgress.completed}
          total={overallProgress.total}
          title="Overall Progress"
          size={140}
          strokeWidth={10}
        />
      </div>
      
      {/* Individual Course Progress */}
      {progressData.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-300 mb-4">Course Progress</h4>
          <ProgressGrid progressData={progressData} />
        </div>
      )}
      
      {progressData.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No enrolled courses to track progress
        </div>
      )}
    </div>
  );
}