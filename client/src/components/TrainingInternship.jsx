import React, { useState } from "react";
import { 
  GraduationCap, 
  Building, 
  Clock, 
  Users, 
  CheckCircle, 
  Star, 
  Award, 
  Briefcase,
  TrendingUp,
  ArrowRight,
  Calendar,
  MapPin,
  DollarSign
} from "lucide-react";

export default function TrainingInternship() {
  const [activeTab, setActiveTab] = useState('overview');

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

  const curriculum = [
    {
      phase: "Phase 1: Foundations (Weeks 1-4)",
      topics: [
        "Cybersecurity Fundamentals",
        "Network Security Basics", 
        "Operating Systems Security",
        "Cryptography Essentials"
      ]
    },
    {
      phase: "Phase 2: Practical Skills (Weeks 5-8)",
      topics: [
        "Ethical Hacking & Penetration Testing",
        "Vulnerability Assessment",
        "Incident Response",
        "Digital Forensics"
      ]
    },
    {
      phase: "Phase 3: Specialization (Weeks 9-12)",
      topics: [
        "Cloud Security",
        "Application Security", 
        "Security Architecture",
        "Compliance & Governance"
      ]
    },
    {
      phase: "Phase 4: Internship (6 Months)",
      topics: [
        "Real-world Project Experience",
        "Industry Mentorship",
        "Professional Development",
        "Certification Preparation"
      ]
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
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      quote: "This program transformed my career. The combination of training and internship gave me real-world experience."
    },
    {
      name: "Rahul Patel", 
      role: "Penetration Tester at SecureNet",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      quote: "The hands-on approach and industry connections made all the difference in landing my dream job."
    }
  ];

  const handleEnrollClick = () => {
    alert("Enrolling in Training + Internship program");
  };

  const handleBrochureClick = () => {
    alert("Downloading brochure...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
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
                onClick={() => setActiveTab(tab)}
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

        {/* Tab Content */}
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

        {activeTab === 'curriculum' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Comprehensive Curriculum</h2>
            
            {curriculum.map((phase, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{phase.phase}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {phase.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-slate-300">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'internship' && (
          <div className="space-y-12">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Internship Opportunities</h2>
            
            {/* Partner Companies */}
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

            {/* Internship Benefits */}
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