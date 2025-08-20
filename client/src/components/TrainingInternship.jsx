import React, { useState } from "react";
import { 
  GraduationCap, 
  Building, 
  Briefcase,
  TrendingUp,
  ArrowRight,
  DollarSign,
  Users,
  Award,
  MapPin,
  Star,
  Clock,
  BookOpen,
  Shield,
  Brain,
  Globe,
  Smartphone,
  Eye,
  Cloud,
  Search,
  CheckCircle,
  ChevronRight,
  Play
} from "lucide-react";

export default function TrainingInternship() {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedCourse, setExpandedCourse] = useState(null);

  // Enhanced course data with icons and additional details
  const curriculumData = [
    {
      title: "Cyber Foundations: OS & Networking Essentials",
      description: "This foundational course is designed to build a strong technical base for anyone stepping into the world of cybersecurity. It offers a clear and structured introduction to how computers work, how operating systems manage resources, and how networks function behind the scenes.",
      modules: ["Computer & OS Fundamentals", "Network Fundamentals"],
      status: "live",
      icon: <Shield className="w-6 h-6" />,
      duration: "3 weeks",
      difficulty: "Beginner",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      labs: 8,
      projects: 2
    },
    {
      title: "AI in Cybersecurity",
      description: "This course bridges the gap between artificial intelligence and cybersecurity, introducing learners to how AI can strengthen cyber defense mechanisms. The course is designed for learners who want to stay ahead in the evolving threat landscape.",
      modules: ["Cybersecurity Fundamentals", "AI in Cybersecurity"],
      status: "live",
      icon: <Brain className="w-6 h-6" />,
      duration: "2 weeks",
      difficulty: "Intermediate",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      labs: 6,
      projects: 3
    },
    {
      title: "Web Attack Arsenal: Recon to Exploitation",
      description: "This hands-on course dives deep into the offensive side of web security, walking learners through the entire attack chain—from information gathering to critical exploitation techniques. Ideal for aspiring penetration testers and bug bounty hunters.",
      modules: ["Reconnaissance", "Burpsuite", "Types of Injections", "Broken Authentication", "Broken Access Control", "CSRF + SSTI"],
      status: "live",
      icon: <Globe className="w-6 h-6" />,
      duration: "4 weeks",
      difficulty: "Advanced",
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      labs: 12,
      projects: 4
    },
    {
      title: "Red Team Tactics: Discovery & Escalation",
      description: "This course focuses on the post-exploitation phase of red teaming, equipping learners with the skills required to navigate compromised environments and escalate privileges across different operating systems, from Nmap and Metasploit to advanced escalation.",
      modules: ["Nmap", "Metasploit", "Linux Privilege Escalation", "Windows Privilege Escalation 1", "Windows Privilege Escalation 2"],
      status: "live",
      icon: <Search className="w-6 h-6" />,
      duration: "3 weeks",
      difficulty: "Advanced",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      labs: 15,
      projects: 5
    },
    {
      title: "Mobile AppSec: Android & iOS",
      description: "This course provides a comprehensive guide to mobile application security, covering both Android and iOS platforms. Learners will explore static and dynamic analysis techniques to identify and exploit vulnerabilities in mobile apps.",
      modules: ["Android Pentesting (Static)", "Android Pentesting (Dynamic) 1", "Android Pentesting (Dynamic) 2", "iOS Pentesting"],
      status: "live",
      icon: <Smartphone className="w-6 h-6" />,
      duration: "3 weeks",
      difficulty: "Intermediate",
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/30",
      labs: 10,
      projects: 3
    },
    {
      title: "OSINT and Dark Web Recon",
      description: "This course focuses on Open-Source Intelligence (OSINT) techniques and dark web monitoring strategies essential for threat intelligence professionals. It equips learners with the ability to extract actionable data from publicly available sources.",
      modules: ["OSINT", "Dark Web Monitoring"],
      status: "upcoming",
      icon: <Eye className="w-6 h-6" />,
      duration: "2 weeks",
      difficulty: "Intermediate",
      color: "from-yellow-500 to-amber-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      labs: 8,
      projects: 2
    },
    {
      title: "Cloud Security: Fundamentals & Defense",
      description: "This course introduces the foundational principles and delves into practical approaches for securing cloud environments. Participants will gain an understanding of shared responsibility models, common vulnerabilities, and security misconfigurations.",
      modules: ["Cloud Fundamentals", "Defending Cloud Fundamentals"],
      status: "live",
      icon: <Cloud className="w-6 h-6" />,
      duration: "2 weeks",
      difficulty: "Intermediate",
      color: "from-teal-500 to-cyan-500",
      bgColor: "bg-teal-500/10",
      borderColor: "border-teal-500/30",
      labs: 9,
      projects: 3
    },
    {
      title: "Digital Forensics: Core Concepts & Applications",
      description: "This course provides a comprehensive entry point into digital forensics, focusing on the systematic identification, preservation, examination, and analysis of digital evidence. It covers core concepts, tools, and real-world case studies.",
      modules: ["Fundamentals of Digital Forensics", "Knowing Digital Forensics", "Digital Forensics Case Studies"],
      status: "live",
      icon: <BookOpen className="w-6 h-6" />,
      duration: "3 weeks",
      difficulty: "Intermediate",
      color: "from-slate-500 to-gray-500",
      bgColor: "bg-slate-500/10",
      borderColor: "border-slate-500/30",
      labs: 11,
      projects: 4
    }
  ];

  const programHighlights = [
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Comprehensive Training",
      description: "12-week intensive cybersecurity curriculum with hands-on labs"
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: "Industry Internship", 
      description: "6-month paid internship with top cybersecurity companies"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Guaranteed Placement",
      description: "97% job placement rate with our partner companies"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Career Growth",
      description: "Average 40% salary increase post-program completion"
    }
  ];

  const partnerCompanies = [
    { name: "CyberTech Solutions", positions: "5 openings", salary: "₹8-12 LPA" },
    { name: "SecureNet Corp", positions: "3 openings", salary: "₹10-15 LPA" },
    { name: "InfoSec Dynamics", positions: "7 openings", salary: "₹9-14 LPA" },
    { name: "TechGuard Industries", positions: "4 openings", salary: "₹11-16 LPA" }
  ];

  const testimonials = [
    {
      name: "Riya Birnale",
      role: "Full Stack Developer at Cyber Secured India",
      image: "https://i.postimg.cc/mhnWZyyP/logo2.jpg",
      quote: "This program transformed my career. The combination of training and internship gave me real-world experience."
    },
    {
      name: "Rahul Patel", 
      role: "Penetration Tester at SecureNet",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      quote: "The hands-on approach and industry connections made all the difference in landing my dream job."
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'Advanced': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const handleEnrollClick = () => {
    alert("Enrolling in Training + Internship program");
  };

  const handleBrochureClick = () => {
    alert("Downloading brochure...");
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-400/30 mb-6">
            <GraduationCap className="w-4 h-4 text-purple-400 mr-2" />
            <span className="text-purple-300 text-sm font-medium">Premium Training + Internship Program</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent mb-6">
            Launch Your
            <br />
            <span className="text-purple-400">Cybersecurity Career</span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Complete training program with guaranteed internship placement. Go from beginner to industry-ready professional in just 9 months.
          </p>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">97%</div>
              <div className="text-slate-400 text-sm">Placement Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">₹12L</div>
              <div className="text-slate-400 text-sm">Avg. Starting Salary</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-slate-400 text-sm">Graduates Placed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">50+</div>
              <div className="text-slate-400 text-sm">Partner Companies</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-1">
            {['overview', 'curriculum', 'internship', 'testimonials'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* --- Tab Content --- */}
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-16">
            {/* Program Highlights */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {programHighlights.map((highlight, index) => (
                <div key={index} className="group text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">
                      {highlight.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{highlight.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{highlight.description}</p>
                </div>
              ))}
            </div>

            {/* Program Structure */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white text-center mb-12">Program Structure</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Training Phase</h3>
                      <p className="text-slate-300">12 weeks of intensive cybersecurity training with hands-on labs and real-world projects.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Internship Placement</h3>
                      <p className="text-slate-300">6-month paid internship with our partner companies, gaining valuable industry experience.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Certification</h3>
                      <p className="text-slate-300">Earn industry-recognized certifications and build a strong professional portfolio.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Job Placement</h3>
                      <p className="text-slate-300">Guaranteed job placement assistance with our extensive network of cybersecurity companies.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Curriculum Tab */}
        {activeTab === 'curriculum' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Program Curriculum</h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
                A comprehensive journey through cybersecurity domains with hands-on labs and real-world projects.
              </p>
              
              {/* Curriculum Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-12">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">8</div>
                  <div className="text-slate-400 text-sm">Specialized Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">79</div>
                  <div className="text-slate-400 text-sm">Hands-on Labs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">26</div>
                  <div className="text-slate-400 text-sm">Real Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400 mb-1">12</div>
                  <div className="text-slate-400 text-sm">Weeks Duration</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {curriculumData.map((course, index) => (
                <div 
                  key={index} 
                  className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 hover:scale-[1.02] ${course.borderColor} ${course.bgColor} backdrop-blur-sm`}
                >
                  {/* Course Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-r ${course.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <div className="text-white">
                            {course.icon}
                          </div>
                        </div>
                        
                        {/* Course Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                              {course.title}
                            </h3>
                            {course.status === 'upcoming' && (
                              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-semibold rounded-full border border-yellow-500/30">
                                Coming Soon
                              </span>
                            )}
                            {course.status === 'live' && (
                              <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-semibold rounded-full border border-green-500/30 flex items-center">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                                Live
                              </span>
                            )}
                          </div>
                          
                          {/* Course Meta */}
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center text-slate-400">
                              <Clock className="w-4 h-4 mr-1" />
                              {course.duration}
                            </div>
                            <div className={`px-2 py-1 rounded-md border text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                              {course.difficulty}
                            </div>
                            <div className="flex items-center text-slate-400">
                              <BookOpen className="w-4 h-4 mr-1" />
                              {course.labs} Labs
                            </div>
                            <div className="flex items-center text-slate-400">
                              <Award className="w-4 h-4 mr-1" />
                              {course.projects} Projects
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Expand Button */}
                      <button 
                        onClick={() => setExpandedCourse(expandedCourse === index ? null : index)}
                        className="flex-shrink-0 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300"
                      >
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${expandedCourse === index ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                    
                    {/* Course Description */}
                    <p className="text-slate-300 text-sm mt-4 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Expandable Module List */}
                  {expandedCourse === index && (
                    <div className="border-t border-white/10 p-6 bg-black/20">
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Play className="w-5 h-5 mr-2 text-purple-400" />
                        Course Modules
                      </h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {course.modules.map((module, i) => (
                          <div key={i} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors duration-300">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-slate-200 text-sm font-medium">{module}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Module Stats */}
                      <div className="mt-6 grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="text-lg font-bold text-purple-400">{course.modules.length}</div>
                          <div className="text-xs text-slate-400">Modules</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="text-lg font-bold text-blue-400">{course.labs}</div>
                          <div className="text-xs text-slate-400">Hands-on Labs</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="text-lg font-bold text-green-400">{course.projects}</div>
                          <div className="text-xs text-slate-400">Real Projects</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hover Gradient Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${course.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}></div>
                </div>
              ))}
            </div>

            {/* Learning Path Visualization */}
            <div className="mt-16 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white text-center mb-8">Your Learning Journey</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Foundations</h4>
                  <p className="text-slate-300 text-sm">Build core security knowledge</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Specialization</h4>
                  <p className="text-slate-300 text-sm">Master web & mobile security</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Advanced</h4>
                  <p className="text-slate-300 text-sm">Red team & forensics skills</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Certification</h4>
                  <p className="text-slate-300 text-sm">Industry recognition</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Internship Tab */}
        {activeTab === 'internship' && (
          <div className="space-y-12">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Internship Opportunities</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {partnerCompanies.map((company, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">{company.name}</h3>
                    <div className="text-right">
                      <div className="text-green-400 font-semibold">{company.salary}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-slate-300">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {company.positions}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Remote/Hybrid
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white text-center mb-8">Internship Benefits</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-white mb-2">Paid Internship</h4>
                  <p className="text-slate-300">Earn ₹15,000-₹25,000 per month during your internship</p>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-white mb-2">Expert Mentorship</h4>
                  <p className="text-slate-300">Work directly with senior cybersecurity professionals</p>
                </div>
                <div className="text-center">
                  <Award className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-white mb-2">Performance Certificate</h4>
                  <p className="text-slate-300">Receive detailed performance evaluation and recommendations</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="space-y-12">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Success Stories</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                      <p className="text-slate-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-300 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join our comprehensive Training + Internship program and become a cybersecurity professional in just 9 months.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                onClick={handleEnrollClick}
              >
                Enroll Now - Limited Seats
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              
              <button 
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                onClick={handleBrochureClick}
              >
                Download Brochure
              </button>
            </div>

            <div className="mt-6 text-slate-400 text-sm">
              Next batch starts: <span className="text-white font-semibold">September 15, 2025</span> | 
              Early bird discount: <span className="text-green-400 font-semibold">30% OFF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}