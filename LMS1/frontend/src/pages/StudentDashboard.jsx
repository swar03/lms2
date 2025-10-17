import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AssignmentSubmission from '../components/AssignmentSubmission';
import QuizInterface from '../components/QuizInterface';
import ProgressChart from '../components/ProgressChart';

export default function StudentDashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  const [expandedModules, setExpandedModules] = useState(new Set());
  const [activeVideo, setActiveVideo] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [completedModules, setCompletedModules] = useState(new Set());

  const moduleData = [
    {
      id: 1,
      title: 'Computer & OS Fundamentals',
      video: {
        title: 'Computer & OS Fundamentals',
        url: 'https://www.youtube.com/live/QJMzDLTlpn8?si=b3tXII31dLIvov08'
      },
      assignment: {
        title: 'Assignment 1: OS Fundamentals',
        url: 'https://docs.google.com/document/d/1KhDEG71LjQgNgAJ0smlV3GGcyCAOdHj-iWx24YA1XLM/edit?usp=drive_link'
      },
      quiz: {
        title: 'OS Fundamentals Quiz',
        url: 'https://docs.google.com/forms/d/1KxIjQztuzsmIgkVp8trjsd1mB5g6vreThfZ8L5xRpTg/edit'
      },
      feedback: {
        title: 'Module Feedback',
        url: 'https://docs.google.com/forms/d/1EiIAHIUJEcg_rdt6UvaFMtGm8uC4VwdTVLEvIafJFiM/edit'
      }
    },
    {
      id: 2,
      title: 'Network Fundamentals',
      video: {
        title: 'Network Fundamentals',
        url: 'https://www.youtube.com/live/68fUBH7qrjM?si=fgXawZgie0oe_l-Y'
      },
      assignment: {
        title: 'Assignment 2: Networking Fundamentals',
        url: 'https://docs.google.com/document/d/networking-assignment'
      },
      quiz: {
        title: 'Networking Quiz',
        url: 'https://docs.google.com/forms/d/networking-quiz'
      },
      feedback: {
        title: 'Module Feedback',
        url: 'https://docs.google.com/forms/d/networking-feedback'
      }
    },
    {
      id: 3,
      title: 'Reconnaissance',
      video: {
        title: 'Reconnaissance',
        url: 'https://www.youtube.com/live/eCxSI-BfwfI?si=XeNmGO6KawQ2Q9Nu'
      },
      assignment: {
        title: 'Assignment 3: Reconnaissance & OSINT',
        url: 'https://docs.google.com/document/d/osint-assignment'
      },
      quiz: {
        title: 'OSINT Quiz',
        url: 'https://docs.google.com/forms/d/osint-quiz'
      },
      feedback: {
        title: 'Module Feedback',
        url: 'https://docs.google.com/forms/d/osint-feedback'
      }
    },
    {
      id: 4,
      title: 'Burpsuite',
      video: {
        title: 'Burpsuite',
        url: 'https://www.youtube.com/live/XCY_ZqBD9FU?si=-wPCrBG3h9wlni4z'
      },
      assignment: {
        title: 'Assignment 4: BurpSuite',
        url: 'https://docs.google.com/document/d/burpsuite-assignment'
      },
      quiz: {
        title: 'BurpSuite Quiz',
        url: 'https://docs.google.com/forms/d/burpsuite-quiz'
      },
      feedback: {
        title: 'Module Feedback',
        url: 'https://docs.google.com/forms/d/burpsuite-feedback'
      }
    },
    {
      id: 5,
      title: 'Types of Injections',
      video: {
        title: 'Types of Injections',
        url: 'https://www.youtube.com/live/KlDiyFY-3lk?si=pbhexiETXxM4QGaT'
      },
      assignment: {
        title: 'Assignment 5: Types of Injections',
        url: 'https://docs.google.com/document/d/injection-assignment'
      },
      quiz: {
        title: 'Injection Quiz',
        url: 'https://docs.google.com/forms/d/injection-quiz'
      },
      feedback: {
        title: 'Module Feedback',
        url: 'https://docs.google.com/forms/d/injection-feedback'
      }
    },
    {
      id: 6,
      title: 'Broken Authentication',
      video: {
        title: 'Broken Authentication',
        url: 'https://www.youtube.com/live/eQ1h1TxzOOk?si=Wk6vAWo-iHexajN2'
      },
      assignment: {
        title: 'Assignment 6: Broken Authentication',
        url: 'https://docs.google.com/document/d/broken-auth-assignment'
      },
      quiz: {
        title: 'Broken Authentication Quiz',
        url: 'https://docs.google.com/forms/d/broken-auth-quiz'
      },
      feedback: {
        title: 'Module Feedback',
        url: 'https://docs.google.com/forms/d/broken-auth-feedback'
      }
    },
    {
      id: 7,
      title: 'Broken Access Control',
      video: {
        title: 'Broken Access Control',
        url: 'https://www.youtube.com/live/mUMwSYssQjA?si=aV-f-DwkbH30qThl'
      },
      assignment: {
        title: 'Assignment 7: Broken Access Control',
        url: 'https://docs.google.com/document/d/broken-access-assignment'
      },
      quiz: {
        title: 'Broken Access Control Quiz',
        url: 'https://docs.google.com/forms/d/broken-access-quiz'
      },
      feedback: {
        title: 'Module Feedback',
        url: 'https://docs.google.com/forms/d/broken-access-feedback'
      }
    },
    {
      id: 8,
      title: 'CSRF+SSTI',
      video: {
        title: 'CSRF+SSTI',
        url: 'https://www.youtube.com/live/HiDHoaa_tvY?si=xaih84N428zuXeDM'
      },
      assignment: {
        title: 'Assignment 8: CSRF + SSTI',
        url: 'https://docs.google.com/document/d/csrf-ssti-assignment'
      },
      quiz: {
        title: 'CSRF & SSTI Quiz',
        url: 'https://docs.google.com/forms/d/csrf-ssti-quiz'
      },
      feedback: {
        title: 'Module Feedback',
        url: 'https://docs.google.com/forms/d/csrf-ssti-feedback'
      }
    },
    {
      id: 9,
      title: 'Nmap',
      video: {
        title: 'Nmap',
        url: 'https://www.youtube.com/live/kd4liLoFNV0?si=ag3tUM5fN3Ql5muC'
      },
      assignment: {
        title: 'Assignment 9: Nmap',
        url: 'https://docs.google.com/document/d/nmap-assignment'
      },
      quiz: {
        title: 'Nmap Quiz',
        url: 'https://docs.google.com/forms/d/nmap-quiz'
      },
      feedback: {
        title: 'Module Feedback',
        url: 'https://docs.google.com/forms/d/nmap-feedback'
      }
    },
    {
      id: 10,
      title: 'Metasploit',
      video: {
        title: 'Metasploit',
        url: 'https://www.youtube.com/live/3cKcw0RSIbc?si=MGFGHT4ha2u4qjpB'
      },
      assignment: {
        title: 'Assignment 10: Metasploit',
        url: 'https://docs.google.com/document/d/metasploit-assignment'
      },
      quiz: {
        title: 'Metasploit Quiz',
        url: 'https://docs.google.com/forms/d/metasploit-quiz'
      },
      feedback: {
        title: 'Module Feedback',
        url: 'https://docs.google.com/forms/d/metasploit-feedback'
      }
    },
    {
      id: 11,
      title: 'Android Pentesting (Static)',
      video: {
        title: 'Android Pentesting (Static)',
        url: 'https://www.youtube.com/live/jfSr-DwSmL4?si=551_bfQNTIGKz5Rx'
      },
      assignment: {
        title: 'Assignment 11: Android Pentesting (Static)',
        url: 'https://docs.google.com/document/d/android-static-assignment'
      },
      quiz: {
        title: 'Android Static Analysis Quiz',
        url: 'https://docs.google.com/forms/d/android-static-quiz'
      },
      feedback: {
        title: 'Module Feedback',
        url: 'https://docs.google.com/forms/d/android-static-feedback'
      }
    },
    {
      id: 12,
      title: 'Android Pentesting (Dynamic) 1',
      video: {
        title: 'Android Pentesting (Dynamic) 1',
        url: 'https://www.youtube.com/live/iCkPQ84bdYk?si=pePuXmxou5D4DUC4'
      },
      assignment: {
        title: 'Assignment 12: Android Pentesting (Dynamic) 1',
        url: 'https://docs.google.com/document/d/android-dynamic1-assignment'
      },
      quiz: {
        title: 'Android Dynamic Analysis 1 Quiz',
        url: 'https://docs.google.com/forms/d/android-dynamic1-quiz'
      },
      feedback: {
        title: 'Module Feedback',
        url: 'https://docs.google.com/forms/d/android-dynamic1-feedback'
      }
    },
    {
      id: 13,
      title: 'Android Pentesting (Dynamic) 2',
      video: {
        title: 'Android Pentesting (Dynamic) 2',
        url: 'https://www.youtube.com/live/EpOw_0WB_t4?si=VZszI6ZywPRwoMTR'
      },
      assignment: {
        title: 'Assignment 13: Android Pentesting (Dynamic) 2',
        url: 'https://docs.google.com/document/d/android-dynamic2-assignment'
      },
      quiz: {
        title: 'Android Dynamic Analysis 2 Quiz',
        url: 'https://docs.google.com/forms/d/android-dynamic2-quiz'
      },
      feedback: {
        title: 'Module Feedback',
        url: 'https://docs.google.com/forms/d/android-dynamic2-feedback'
      }
    },
    {
      id: 14,
      title: 'Linux Privilege Escalation',
      video: {
        title: 'Linux Privilege Escalation',
        url: 'https://www.youtube.com/live/TrGUq9qWj_o?si=EXrYyUQlgmlgeWGA'
      },
      assignment: {
        title: 'Assignment 14: Linux Privilege Escalation',
        url: 'https://docs.google.com/document/d/linux-privesc-assignment'
      },
      quiz: {
        title: 'Linux PrivEsc Quiz',
        url: 'https://docs.google.com/forms/d/linux-privesc-quiz'
      },
      feedback: {
        title: 'Module Feedback',
        url: 'https://docs.google.com/forms/d/linux-privesc-feedback'
      }
    },
    {
      id: 15,
      title: 'Windows Privilege Escalation 1',
      video: {
        title: 'Windows Privilege Escalation 1',
        url: 'https://www.youtube.com/live/6sF1NdLe9wE?si=qhYGAxXVsNhkd8HV'
      },
      assignment: {
        title: 'Assignment 15: Windows Privilege Escalation 1',
        url: 'https://docs.google.com/document/d/windows-privesc1-assignment'
      },
      quiz: {
        title: 'Windows PrivEsc 1 Quiz',
        url: 'https://docs.google.com/forms/d/windows-privesc1-quiz'
      },
      feedback: {
        title: 'Module Feedback',
        url: 'https://docs.google.com/forms/d/windows-privesc1-feedback'
      }
    },
    {
      id: 16,
      title: 'Windows Privilege Escalation 2',
      video: {
        title: 'Windows Privilege Escalation 2',
        url: 'https://www.youtube.com/live/H4ahp4D_lzE?si=seZ8NIJNss3hUCwR'
      },
      assignment: {
        title: 'Assignment 16: Windows Privilege Escalation 2',
        url: 'https://docs.google.com/document/d/windows-privesc2-assignment'
      },
      quiz: {
        title: 'Windows PrivEsc 2 Quiz',
        url: 'https://docs.google.com/forms/d/windows-privesc2-quiz'
      },
      feedback: {
        title: 'Module Feedback',
        url: 'https://docs.google.com/forms/d/windows-privesc2-feedback'
      }
    },
    {
      id: 17,
      title: 'Cloud Fundamentals',
      video: {
        title: 'Cloud Fundamentals',
        url: 'https://www.youtube.com/live/jJzyTLGGozc?feature=shared'
      },
      assignment: {
        title: 'Assignment 17: Cloud Fundamentals',
        url: 'https://docs.google.com/document/d/cloud-fundamentals-assignment'
      },
      quiz: {
        title: 'Cloud Fundamentals Quiz',
        url: 'https://docs.google.com/forms/d/cloud-fundamentals-quiz'
      },
      feedback: {
        title: 'Module Feedback',
        url: 'https://docs.google.com/forms/d/cloud-fundamentals-feedback'
      }
    },
    {
      id: 18,
      title: 'Defending Cloud Fundamentals',
      video: {
        title: 'Defending Cloud Fundamentals',
        url: 'https://www.youtube.com/live/ODno6A5PLXY?si=cn3sxjsVxuciGKbE'
      },
      assignment: {
        title: 'Assignment 18: Defending Cloud Fundamentals',
        url: 'https://docs.google.com/document/d/defending-cloud-assignment'
      },
      quiz: {
        title: 'Defending Cloud Quiz',
        url: 'https://docs.google.com/forms/d/defending-cloud-quiz'
      },
      feedback: {
        title: 'Module Feedback',
        url: 'https://docs.google.com/forms/d/defending-cloud-feedback'
      }
    },
    {
      id: 19,
      title: 'Fundamentals of Digital Forensics',
      video: {
        title: 'Fundamentals of Digital Forensics',
        url: 'https://www.youtube.com/live/WrSzcKYmUU8?feature=shared'
      },
      assignment: {
        title: 'Assignment 19: Digital Forensics Fundamentals',
        url: 'https://docs.google.com/document/d/digital-forensics1-assignment'
      },
      quiz: {
        title: 'Digital Forensics Fundamentals Quiz',
        url: 'https://docs.google.com/forms/d/digital-forensics1-quiz'
      },
      feedback: {
        title: 'Module Feedback',
        url: 'https://docs.google.com/forms/d/digital-forensics1-feedback'
      }
    },
    {
      id: 20,
      title: 'Knowing Digital Forensics',
      video: {
        title: 'Knowing Digital Forensics',
        url: 'https://www.youtube.com/live/UEjBZEWiAqw?si=vl1gNC1kcijlS4Pc'
      },
      assignment: {
        title: 'Assignment 20: Advanced Digital Forensics',
        url: 'https://docs.google.com/document/d/digital-forensics2-assignment'
      },
      quiz: {
        title: 'Advanced Digital Forensics Quiz',
        url: 'https://docs.google.com/forms/d/digital-forensics2-quiz'
      },
      feedback: {
        title: 'Module Feedback',
        url: 'https://docs.google.com/forms/d/digital-forensics2-feedback'
      }
    },
    {
      id: 21,
      title: 'Digital Forensics Case Studies',
      video: {
        title: 'Digital Forensics Case Studies',
        url: 'https://www.youtube.com/live/ebyB--ry6ig?si=A-xlNO0n3Qt91zmC'
      },
      assignment: {
        title: 'Assignment 21: Digital Forensics Case Studies',
        url: 'https://docs.google.com/document/d/digital-forensics3-assignment'
      },
      quiz: {
        title: 'Digital Forensics Case Studies Quiz',
        url: 'https://docs.google.com/forms/d/digital-forensics3-quiz'
      },
      feedback: {
        title: 'Module Feedback',
        url: 'https://docs.google.com/forms/d/digital-forensics3-feedback'
      }
    }
  ];

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    let videoId = null;
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtube.com/live/')) {
      videoId = url.split('/live/')[1]?.split('?')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const toggleModule = (moduleId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleAssignmentSubmit = (moduleId) => {
    const newCompleted = new Set(completedModules);
    newCompleted.add(`assignment-${moduleId}`);
    setCompletedModules(newCompleted);
  };

  const handleQuizSubmit = (moduleId) => {
    const newCompleted = new Set(completedModules);
    newCompleted.add(`quiz-${moduleId}`);
    setCompletedModules(newCompleted);
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setLoading(false);
  }, []);

  const enrolledCourseIds = useMemo(
    () => new Set((data?.enrollments || []).map((e) => e.courseId)),
    [data]
  );

  const calculateProgress = () => {
    if (enrolledCourseIds.size === 0) return { completed: 0, total: 0, percentage: 0 };
    
    const totalItems = moduleData.length * 2; // 2 items per module (assignment + quiz)
    const completedItems = completedModules.size;
    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    return { completed: completedItems, total: totalItems, percentage };
  };

  const progress = calculateProgress();

  const handleEnroll = async (courseId) => {
    try {
      setEnrollingCourseId(courseId);
      const refreshed = await studentService.getDashboard();
      setData(refreshed.data);
    } catch (e) {
      setError(e);
    } finally {
      setEnrollingCourseId(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">Loading student dashboard...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-red-400">{error?.message || 'Failed to load student dashboard'}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Progress Navbar - Only show for approved students */}
      {user?.status === 'APPROVED' && (
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Learning Progress</span>
              <button
                onClick={() => setShowProgressModal(true)}
                className="flex items-center space-x-2 hover:bg-gray-700 rounded-lg p-2 transition-colors"
              >
                <div className="relative w-8 h-8">
                  <svg className="w-8 h-8 transform -rotate-90">
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="#374151"
                      strokeWidth="3"
                      fill="transparent"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="#10b981"
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 14}`}
                      strokeDashoffset={`${2 * Math.PI * 14 * (1 - progress.percentage / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{progress.percentage}%</span>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-white font-medium">{progress.completed}/{progress.total}</div>
                  <div className="text-gray-400 text-xs">Overall Progress</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Profile Card */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Student Dashboard</h1>
          
          {/* Profile Card */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.fullName || user?.email}&background=4f46e5&color=fff&size=80`}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-4 border-white"
                />
                <div>
                  <h2 className="text-2xl font-bold text-white">{user?.fullName || 'Student'}</h2>
                  <p className="text-indigo-100">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user?.status === 'APPROVED' ? 'bg-green-500 text-white' :
                      user?.status === 'PENDING' ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {user?.status}
                    </span>
                    {user?.emailVerified && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Profile Details Grid */}
            {user?.profile && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-indigo-400">
                {user.mobile && (
                  <div>
                    <p className="text-indigo-200 text-xs">Phone</p>
                    <p className="text-white font-medium">{user.mobile}</p>
                  </div>
                )}
                {user.profile.dateOfBirth && (
                  <div>
                    <p className="text-indigo-200 text-xs">Date of Birth</p>
                    <p className="text-white font-medium">{new Date(user.profile.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                )}
                {user.profile.occupation && (
                  <div>
                    <p className="text-indigo-200 text-xs">University</p>
                    <p className="text-white font-medium">{user.profile.occupation}</p>
                  </div>
                )}
                {user.profile.education && (
                  <div>
                    <p className="text-indigo-200 text-xs">Major</p>
                    <p className="text-white font-medium">{user.profile.education}</p>
                  </div>
                )}
                {user.profile.experience && (
                  <div>
                    <p className="text-indigo-200 text-xs">Experience</p>
                    <p className="text-white font-medium capitalize">{user.profile.experience}</p>
                  </div>
                )}
                {user.profile.address && (
                  <div className="col-span-2">
                    <p className="text-indigo-200 text-xs">Address</p>
                    <p className="text-white font-medium">{user.profile.address}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Profile Status */}
        {user?.status === 'PENDING' ? (
          <div className="mb-8 bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Account Status</h2>
              <button
                onClick={async () => {
                  setLoading(true);
                  await refreshUser();
                  setLoading(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
              >
                🔄 Refresh Status
              </button>
            </div>
            <div className="bg-yellow-900 bg-opacity-50 border border-yellow-500 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-yellow-900 font-bold">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-200">Pending Admin Approval</h3>
                  <p className="text-yellow-300 text-sm">Your account is awaiting approval from an administrator. You will be notified once approved.</p>
                </div>
              </div>
            </div>
          </div>
        ) : user?.status === 'REJECTED' ? (
          <div className="mb-8 bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Account Status</h2>
              <button
                onClick={async () => {
                  setLoading(true);
                  await refreshUser();
                  setLoading(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
              >
                🔄 Refresh Status
              </button>
            </div>
            <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-red-900 font-bold">✕</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-200">Account Rejected</h3>
                  <p className="text-red-300 text-sm">Your account application was not approved. Please contact support for more information.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Your Courses */}
            <div className="mb-8 bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
              {data?.enrollments?.length > 0 ? (
                <div className="space-y-4">
                  {data.enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{enrollment.course.title}</h3>
                          <p className="text-gray-400 text-sm">{enrollment.course.description}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-600 text-green-100">
                          Enrolled
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No courses available yet</p>
              )}
            </div>
          </>
        )}



        {/* Course Modules - Only show if approved */}
        {user?.status === 'APPROVED' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Course Modules</h2>
            
            {/* Video Player */}
            {activeVideo && (
              <div className="mb-8 bg-black rounded-lg overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    src={getYouTubeEmbedUrl(activeVideo.url)}
                    title={activeVideo.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4 bg-gray-700">
                  <h3 className="font-semibold">{activeVideo.title}</h3>
                  <button
                    onClick={() => setActiveVideo(null)}
                    className="mt-2 text-sm text-gray-400 hover:text-white"
                  >
                    Close Video
                  </button>
                </div>
              </div>
            )}

            {/* Module List */}
            <div className="space-y-4">
              {moduleData.map((module) => (
                <div key={module.id} className="bg-gray-700 rounded-lg">
                  <div 
                    className="p-4 cursor-pointer flex justify-between items-center hover:bg-gray-600 rounded-lg"
                    onClick={() => toggleModule(module.id)}
                  >
                    <h3 className="font-semibold">{module.title}</h3>
                    <span className="text-gray-400">
                      {expandedModules.has(module.id) ? '−' : '+'}
                    </span>
                  </div>
                  
                  {expandedModules.has(module.id) && (
                    <div className="p-4 pt-0 space-y-4">
                      {/* Video Section */}
                      <div className="bg-gray-600 rounded-lg p-4">
                        <h4 className="font-medium mb-2 text-blue-300">📹 Video Lecture</h4>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{module.video.title}</span>
                          <button
                            onClick={() => setActiveVideo(module.video)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                          >
                            Play Video
                          </button>
                        </div>
                      </div>

                      {/* Assignment Section */}
                      <div className="bg-gray-600 rounded-lg p-4">
                        <h4 className="font-medium mb-2 text-green-300">📝 Assignment</h4>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{module.assignment.title}</span>
                          <div className="flex gap-2">
                            <a
                              href={module.assignment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                            >
                              View Instructions
                            </a>
                            <button
                              onClick={() => setShowAssignmentModal({
                                id: `assignment-${module.id}`,
                                title: module.assignment.title,
                                description: 'Submit your completed assignment via Google Drive link',
                                taskUrl: module.assignment.url,
                                moduleId: module.id
                              })}
                              className={`px-3 py-1 rounded text-sm ${
                                completedModules.has(`assignment-${module.id}`)
                                  ? 'bg-green-600 text-green-100'
                                  : 'bg-blue-600 hover:bg-blue-700'
                              }`}
                            >
                              {completedModules.has(`assignment-${module.id}`) ? '✓ Submitted' : 'Submit Work'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quiz Section */}
                      <div className="bg-gray-600 rounded-lg p-4">
                        <h4 className="font-medium mb-2 text-purple-300">🧠 Quiz</h4>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{module.quiz.title}</span>
                          <div className="flex gap-2">
                            <a
                              href={module.quiz.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm"
                            >
                              External Quiz
                            </a>
                            <button
                              onClick={() => setShowQuizModal({
                                id: `quiz-${module.id}`,
                                title: module.quiz.title,
                                questions: [], // Would be populated from API
                                moduleId: module.id
                              })}
                              className={`px-3 py-1 rounded text-sm ${
                                completedModules.has(`quiz-${module.id}`)
                                  ? 'bg-green-600 text-green-100'
                                  : 'bg-indigo-600 hover:bg-indigo-700'
                              }`}
                            >
                              {completedModules.has(`quiz-${module.id}`) ? '✓ Completed' : 'Take Quiz'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Feedback Section */}
                      <div className="bg-gray-600 rounded-lg p-4">
                        <h4 className="font-medium mb-2 text-yellow-300">💬 Feedback</h4>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{module.feedback.title}</span>
                          <a
                            href={module.feedback.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm"
                          >
                            Give Feedback
                          </a>
                        </div>
                      </div>


                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Modal */}
        {showProgressModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md transform transition-all duration-300 scale-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Learning Progress</h3>
                <button
                  onClick={() => setShowProgressModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex justify-center mb-6">
                <ProgressChart
                  completed={progress.completed}
                  total={progress.total}
                  size={120}
                  strokeWidth={8}
                  title="Overall Progress"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Assignments Completed:</span>
                  <span className="text-white">
                    {Array.from(completedModules).filter(id => id.startsWith('assignment-')).length}/{moduleData.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Quizzes Completed:</span>
                  <span className="text-white">
                    {Array.from(completedModules).filter(id => id.startsWith('quiz-')).length}/{moduleData.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-400">Total Progress:</span>
                  <span className="text-green-400">{progress.percentage}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assignment Submission Modal */}
        {showAssignmentModal && (
          <AssignmentSubmission
            assignment={showAssignmentModal}
            onSubmit={() => {
              handleAssignmentSubmit(showAssignmentModal.moduleId);
              console.log('Assignment submitted successfully');
            }}
            onClose={() => setShowAssignmentModal(null)}
          />
        )}

        {/* Quiz Interface Modal */}
        {showQuizModal && (
          <QuizInterface
            quiz={showQuizModal}
            onSubmit={(result) => {
              handleQuizSubmit(showQuizModal.moduleId);
              console.log('Quiz submitted:', result);
            }}
            onClose={() => setShowQuizModal(null)}
          />
        )}
      </div>
    </div>
  );
}