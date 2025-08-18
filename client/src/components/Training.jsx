import React, { useState, useCallback } from "react";
import { 
  BookOpen, 
  Users, 
  Clock, 
  Award, 
  Star, 
  ArrowRight, 
  Shield, 
  Code, 
  Lock,
  Globe,
  CheckCircle,
  Play
} from "lucide-react";

const Training = () => {
  const [selectedTrack, setSelectedTrack] = useState(null);

  const trainingTracks = [
    {
      id: 1,
      title: "Cybersecurity Fundamentals",
      subtitle: "Essential Skills Training",
      duration: "8 weeks",
      level: "Beginner",
      rating: 4.8,
      students: "12,340",
      price: "₹9,999",
      originalPrice: "₹19,999",
      icon: <Shield className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      description: "Master the fundamentals of cybersecurity with hands-on labs and real-world scenarios.",
      features: [
        "Network Security Basics",
        "Threat Detection",
        "Security Policies",
        "Incident Response",
        "Risk Assessment"
      ],
      badge: "Most Popular"
    },
    {
      id: 2,
      title: "Ethical Hacking & Penetration Testing",
      subtitle: "Advanced Security Testing",
      duration: "12 weeks",
      level: "Intermediate",
      rating: 4.9,
      students: "8,750",
      price: "₹24,999",
      originalPrice: "₹39,999",
      icon: <Code className="w-8 h-8" />,
      color: "from-red-500 to-pink-500",
      description: "Learn ethical hacking techniques and penetration testing methodologies.",
      features: [
        "Web Application Testing",
        "Network Penetration",
        "Social Engineering",
        "Vulnerability Assessment",
        "Security Tools Mastery"
      ],
      badge: "Industry Favorite"
    },
    {
      id: 3,
      title: "Cloud Security Specialist",
      subtitle: "Cloud Infrastructure Protection",
      duration: "10 weeks",
      level: "Advanced",
      rating: 4.7,
      students: "6,420",
      price: "₹29,999",
      originalPrice: "₹49,999",
      icon: <Globe className="w-8 h-8" />,
      color: "from-purple-500 to-indigo-500",
      description: "Secure cloud environments with cutting-edge security practices and tools.",
      features: [
        "AWS/Azure Security",
        "Container Security",
        "DevSecOps",
        "Cloud Compliance",
        "Zero Trust Architecture"
      ],
      badge: "High Demand"
    }
  ];

  const benefits = [
    {
      icon: <Award className="w-6 h-6" />,
      title: "Industry Certification",
      description: "Get certified by leading cybersecurity organizations"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Mentorship",
      description: "Learn from certified professionals with 10+ years experience"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Flexible Learning",
      description: "Study at your own pace with 24/7 access to materials"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Hands-on Labs",
      description: "Practice in realistic environments with real-world scenarios"
    }
  ];

  const handleTrackClick = useCallback((track) => {
    setSelectedTrack(track);
  }, []);

  const handleEnrollClick = useCallback((e, trackTitle) => {
    e.stopPropagation();
    alert(`Enrolling in ${trackTitle}`);
  }, []);

  const handlePreviewClick = useCallback((e, trackTitle) => {
    e.stopPropagation();
    alert(`Previewing ${trackTitle}`);
  }, []);

  const handleTrainingInternshipClick = useCallback(() => {
    alert("Redirecting to Training + Internship program");
  }, []);

  const handleViewAllCoursesClick = useCallback(() => {
    alert("Redirecting to all courses page");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30 mb-6">
            <BookOpen className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-blue-300 text-sm font-medium">Professional Training Programs</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent mb-6">
            Choose Your
            <br />
            <span className="text-blue-400">Training Path</span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Accelerate your cybersecurity career with our comprehensive training programs designed by industry experts.
          </p>
        </div>

        {/* Training Options */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {trainingTracks.map((track) => (
            <div 
              key={track.id}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
              onClick={() => handleTrackClick(track)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTrackClick(track);
                }
              }}
            >
              {/* Badge */}
              {track.badge && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
                    {track.badge}
                  </span>
                </div>
              )}

              {/* Color Bar */}
              <div className={`h-2 bg-gradient-to-r ${track.color}`}></div>
              
              <div className="p-6">
                {/* Icon and Level */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-r ${track.color} rounded-xl text-white`}>
                    {track.icon}
                  </div>
                  <span className="px-3 py-1 bg-white/10 text-slate-300 text-sm rounded-full">
                    {track.level}
                  </span>
                </div>

                {/* Title and Subtitle */}
                <h3 className="text-xl font-bold text-white mb-2">{track.title}</h3>
                <p className="text-blue-300 text-sm font-medium mb-4">{track.subtitle}</p>
                
                {/* Stats */}
                <div className="flex items-center space-x-4 mb-4 text-sm text-slate-400">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{track.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                    <span>{track.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{track.students}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  {track.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {track.features.slice(0, 3).map((feature, index) => (
                    <div key={`${track.id}-feature-${index}`} className="flex items-center text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {track.features.length > 3 && (
                    <div className="text-sm text-blue-400">
                      +{track.features.length - 3} more topics
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-2xl font-bold text-white">{track.price}</span>
                    <span className="text-slate-400 line-through ml-2">{track.originalPrice}</span>
                  </div>
                  <div className="text-green-400 text-sm font-medium">
                    50% OFF
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button 
                    type="button"
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={(e) => handleEnrollClick(e, track.title)}
                  >
                    Enroll Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                  
                  <button 
                    type="button"
                    className="w-full py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
                    onClick={(e) => handlePreviewClick(e, track.title)}
                  >
                    <Play className="mr-2 w-4 h-4" />
                    Preview Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose Our Training Programs?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={`benefit-${index}`} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
                <p className="text-slate-300 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have advanced their careers with our training programs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                type="button"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleTrainingInternshipClick}
              >
                Training + Internship Program
              </button>
              
              <button 
                type="button"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                onClick={handleViewAllCoursesClick}
              >
                View All Courses
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Selected Track Modal/Overlay (if needed) */}
      {selectedTrack && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTrack(null)}
        >
          <div 
            className="bg-slate-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">{selectedTrack.title}</h3>
              <button 
                type="button"
                onClick={() => setSelectedTrack(null)}
                className="text-slate-400 hover:text-white"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-300 mb-4">{selectedTrack.description}</p>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">All Features:</h4>
              {selectedTrack.features.map((feature, index) => (
                <div key={`modal-feature-${index}`} className="flex items-center text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Training;