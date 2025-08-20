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

  // Data remains the same, no changes needed here.
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
    { icon: <GraduationCap className="w-6 h-6" />, title: "Comprehensive Training", description: "12-week intensive cybersecurity curriculum with hands-on labs" },
    { icon: <Building className="w-6 h-6" />, title: "Industry Internship",  description: "6-month paid internship with top cybersecurity companies" },
    { icon: <Award className="w-6 h-6" />, title: "Guaranteed Placement", description: "97% job placement rate with our partner companies" },
    { icon: <TrendingUp className="w-6 h-6" />, title: "Career Growth", description: "Average 40% salary increase post-program completion" }
  ];
  const partnerCompanies = [
    { name: "CyberTech Solutions", positions: "5 openings", salary: "₹8-12 LPA" },
    { name: "SecureNet Corp", positions: "3 openings", salary: "₹10-15 LPA" },
    { name: "InfoSec Dynamics", positions: "7 openings", salary: "₹9-14 LPA" },
    { name: "TechGuard Industries", positions: "4 openings", salary: "₹11-16 LPA" }
  ];
  const testimonials = [
    { name: "Riya Birnale", role: "Full Stack Developer at Cyber Secured India", image: "https://i.postimg.cc/mhnWZyyP/logo2.jpg", quote: "This program transformed my career. The combination of training and internship gave me real-world experience." },
    { name: "Rahul Patel",  role: "Penetration Tester at SecureNet", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", quote: "The hands-on approach and industry connections made all the difference in landing my dream job." }
  ];

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'Advanced': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const handleEnrollClick = () => alert("Enrolling in Training + Internship program");
  const handleBrochureClick = () => alert("Downloading brochure...");
  const handleTabClick = (tab) => setActiveTab(tab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
      ></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-400/30 mb-6">
            <GraduationCap className="w-4 h-4 text-purple-400 mr-2" />
            <span className="text-purple-300 text-xs sm:text-sm font-medium">Premium Training + Internship Program</span>
          </div>
          
          {/* Responsive Typography */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent mb-4 md:mb-6">
            Launch Your
            <br />
            <span className="text-purple-400">Cybersecurity Career</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Complete training program with guaranteed internship placement. Go from beginner to industry-ready professional in just 9 months.
          </p>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">97%</div>
              <div className="text-slate-400 text-xs sm:text-sm">Placement Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">₹12L</div>
              <div className="text-slate-400 text-xs sm:text-sm">Avg. Salary</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-slate-400 text-xs sm:text-sm">Graduates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">50+</div>
              <div className="text-slate-400 text-xs sm:text-sm">Partners</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          {/* On small screens, this container will scroll horizontally */}
          <div className="flex space-x-1 sm:space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-1 overflow-x-auto">
            {['overview', 'curriculum', 'internship', 'testimonials'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium whitespace-nowrap text-sm sm:text-base transition-all duration-300 ${
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
          <div className="space-y-12 md:space-y-16">
            {/* Program Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {programHighlights.map((highlight, index) => (
                <div key={index} className="group text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">{highlight.icon}</div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{highlight.title}</h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Curriculum Tab */}
        {activeTab === 'curriculum' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Program Curriculum</h2>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8">
                A comprehensive journey through cybersecurity domains with hands-on labs and real-world projects.
              </p>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {curriculumData.map((course, index) => (
                <div key={index} className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 ${course.borderColor} ${course.bgColor} backdrop-blur-sm`}>
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-r ${course.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <div className="text-white">{course.icon}</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 mb-2">
                            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">{course.title}</h3>
                            {course.status === 'upcoming' && <span className="px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">Coming Soon</span>}
                            {course.status === 'live' && <span className="px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-300 border border-green-500/30 flex items-center"><div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>Live</span>}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm">
                            <div className="flex items-center text-slate-400"><Clock className="w-4 h-4 mr-1" />{course.duration}</div>
                            <div className={`px-2 py-1 rounded-md border text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>{course.difficulty}</div>
                            <div className="flex items-center text-slate-400"><BookOpen className="w-4 h-4 mr-1" />{course.labs} Labs</div>
                            <div className="flex items-center text-slate-400"><Award className="w-4 h-4 mr-1" />{course.projects} Projects</div>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => setExpandedCourse(expandedCourse === index ? null : index)} className="flex-shrink-0 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${expandedCourse === index ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                    <p className="text-slate-300 text-sm mt-4 leading-relaxed">{course.description}</p>
                  </div>

                  {expandedCourse === index && (
                    <div className="border-t border-white/10 p-4 sm:p-6 bg-black/20">
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center"><Play className="w-5 h-5 mr-2 text-purple-400" />Course Modules</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {course.modules.map((module, i) => (
                          <div key={i} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-slate-200 text-sm font-medium">{module}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Internship Tab */}
        {activeTab === 'internship' && (
          <div className="space-y-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">Internship Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {partnerCompanies.map((company, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                    <h3 className="text-lg sm:text-xl font-semibold text-white">{company.name}</h3>
                    <div className="text-green-400 font-semibold">{company.salary}</div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-x-4 gap-y-2 text-slate-300 text-sm">
                    <div className="flex items-center"><Briefcase className="w-4 h-4 mr-2" />{company.positions}</div>
                    <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" />Remote/Hybrid</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="space-y-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover" />
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white">{testimonial.name}</h3>
                      <p className="text-slate-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-300 italic text-sm sm:text-base">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Transform Your Career?</h2>
            <p className="text-base sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join our program and become a cybersecurity professional in just 9 months.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleEnrollClick} className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                Enroll Now <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button onClick={handleBrochureClick} className="px-6 py-3 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}