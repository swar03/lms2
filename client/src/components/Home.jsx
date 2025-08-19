// src/components/Home.jsx
import React from "react";
import { Shield, BookOpen, Users, Award, ArrowRight, Zap, Lock, Globe } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Advanced Security Training",
      description: "Learn cutting-edge cybersecurity techniques from industry experts"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Interactive Courses",
      description: "Hands-on labs and real-world scenarios to enhance your skills"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Instructors",
      description: "Learn from certified professionals with years of industry experience"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Industry Certification",
      description: "Earn recognized certificates to boost your career prospects"
    }
  ];

  const stats = [
    { number: "50K+", label: "Students Trained" },
    { number: "200+", label: "Expert Instructors" },
    { number: "95%", label: "Job Placement Rate" },
    { number: "24/7", label: "Learning Support" }
  ];

  const tracks = [
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Ethical Hacking",
      lessons: "45 Lessons",
      duration: "8 Weeks",
      level: "Intermediate",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Network Security",
      lessons: "38 Lessons",
      duration: "6 Weeks",
      level: "Beginner",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Cloud Security",
      lessons: "52 Lessons",
      duration: "10 Weeks",
      level: "Advanced",
      color: "from-purple-500 to-indigo-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            {/* Main Heading */}
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30 mb-6">
                <Zap className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-blue-300 text-sm font-medium">Next-Gen Cybersecurity Education</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent mb-6 leading-tight">
                Cyber Security
                <br />
                <span className="text-blue-400">Learning Hub</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Master cybersecurity with hands-on training, expert guidance, and industry-recognized certifications. 
                Protect the digital world, one skill at a time.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button 
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg flex items-center"
                onClick={() => alert('Starting learning journey!')}
              >
                Start Learning Today
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-black font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-xl"
                onClick={() => alert('Playing demo video!')}
              >
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-white/5 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Comprehensive cybersecurity education designed for the modern digital landscape
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Tracks */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Popular Learning Tracks</h2>
          <p className="text-xl text-slate-300">Specialized pathways to advance your cybersecurity career</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tracks.map((track, index) => (
            <div key={index} className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105">
              <div className={`h-2 bg-gradient-to-r ${track.color}`}></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`p-3 bg-gradient-to-r ${track.color} rounded-xl text-white mr-4`}>
                    {track.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{track.title}</h3>
                    <span className="text-sm text-slate-400">{track.level}</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Lessons:</span>
                    <span className="text-white">{track.lessons}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Duration:</span>
                    <span className="text-white">{track.duration}</span>
                  </div>
                </div>

                <button 
                  className="w-full py-3 bg-white/10 text-black font-medium rounded-xl hover:bg-white/20 transition-all duration-300 group-hover:transform group-hover:translate-y-[-2px]"
                  onClick={() => alert(`Exploring ${track.title} track!`)}
                >
                  Explore Track
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}