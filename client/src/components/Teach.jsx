import React, { useState } from "react";
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Users,
  DollarSign,
  Clock,
  Award,
  BookOpen,
  Star,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Teach() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const benefits = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Earn Extra Income",
      description: "Make ₹50,000 - ₹2,00,000+ per month teaching cybersecurity"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Global Reach",
      description: "Teach students from around the world on our platform"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Flexible Schedule",
      description: "Create courses on your own schedule and timeline"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Expert Recognition",
      description: "Build your reputation as a cybersecurity expert"
    }
  ];

  const stats = [
    { number: "500+", label: "Active Instructors" },
    { number: "₹85L", label: "Total Instructor Earnings" },
    { number: "50K+", label: "Students Reached" },
    { number: "4.8⭐", label: "Average Rating" }
  ];

  const successStories = [
    {
      name: "Dr. Amit Sharma",
      expertise: "Ethical Hacking Expert",
      earnings: "₹1.5L/month",
      students: "2,500+",
      rating: "4.9",
      quote: "Teaching on CSI has allowed me to share my 15 years of experience while building a substantial passive income."
    },
    {
      name: "Priya Nair",
      expertise: "Cloud Security Specialist",
      earnings: "₹95K/month",
      students: "1,800+",
      rating: "4.8",
      quote: "The platform's support and student engagement tools make teaching incredibly rewarding."
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (isLogin) {
        if (email && password) {
          setSuccess("Instructor login successful! Welcome back.");
          setLoading(false);
          // Redirect on successful login after short delay to show success message
          setTimeout(() => {
            navigate("/instructor-portal");
          }, 700);
        } else {
          setError("Please fill in all fields.");
          setLoading(false);
        }
      } else {
        if (name && email && password) {
          setSuccess("Instructor application submitted! We'll review your profile and get back to you within 24 hours.");
          setLoading(false);
          // Switch to login mode after apply and optionally redirect after a delay
          setTimeout(() => {
            setIsLogin(true);
          }, 1000);
        } else {
          setError("Please fill in all required fields.");
          setLoading(false);
        }
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%237C3AED' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 rounded-full border border-purple-400/30 mb-6">
            <GraduationCap className="w-4 h-4 text-purple-400 mr-2" />
            <span className="text-purple-300 text-sm font-medium">Instructor Program</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent mb-6">
            Teach & Earn on
            <br />
            <span className="text-purple-400">CyberEdu</span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Share your cybersecurity expertise with thousands of eager learners worldwide. Build courses, earn money, and make an impact in the cybersecurity community.
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Benefits & Info */}
          <div className="space-y-12">
            {/* Why Teach Section */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Why Teach With Us?</h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="text-white">
                        {benefit.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                      <p className="text-slate-300 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Stories */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Instructor Success Stories</h2>
              <div className="space-y-6">
                {successStories.map((story, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{story.name}</h3>
                        <p className="text-purple-300 text-sm">{story.expertise}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold">{story.earnings}</div>
                        <div className="text-slate-400 text-sm">{story.students} students</div>
                      </div>
                    </div>
                    <p className="text-slate-300 italic mb-4">"{story.quote}"</p>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-white font-medium">{story.rating}</span>
                      <span className="text-slate-400 ml-2">rating</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Topics */}
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Popular Teaching Topics</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Ethical Hacking",
                  "Network Security",
                  "Cloud Security",
                  "Incident Response",
                  "Digital Forensics",
                  "Penetration Testing",
                  "Security Architecture",
                  "Compliance & Risk"
                ].map((topic, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300 text-sm">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Login/Register Form */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 sticky top-8">
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mb-4">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {isLogin ? "Instructor Portal" : "Become an Instructor"}
              </h2>
              <p className="text-slate-300">
                {isLogin
                  ? "Sign in to access your instructor dashboard"
                  : "Join our community of expert instructors"
                }
              </p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-green-300 text-sm">{success}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400 hover:text-white transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400 hover:text-white transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{isLogin ? "Sign In" : "Apply to Teach"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Login/Register */}
            <div className="mt-8 text-center">
              <p className="text-slate-400 text-sm">
                {isLogin ? "New instructor?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                    setSuccess("");
                    setName("");
                    setEmail("");
                    setPassword("");
                  }}
                  className="ml-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  {isLogin ? "Apply to teach" : "Sign in here"}
                </button>
              </p>
            </div>

            {/* Additional Info */}
            {!isLogin && (
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-start space-x-3">
                  <BookOpen className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium text-sm mb-1">Application Process</h4>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      We review all instructor applications within 24 hours. You'll need to provide course outlines and demonstrate expertise in your chosen topic.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-3xl p-8 max-w-4xl mx-auto">
            <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Teaching?</h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-6">
              Join hundreds of cybersecurity professionals who are already earning substantial income by sharing their knowledge. Start your instructor journey today!
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-300">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Free to apply</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Marketing support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Revenue sharing up to 70%</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Global student base</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
