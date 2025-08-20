import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Mail, Lock, User, Phone, Eye, EyeOff, Shield, ArrowRight,
  CheckCircle, AlertCircle 
} from "lucide-react";

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profileType: "STUDENT",
    countryCode: "+91",
    phoneNumber: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const countryCodes = [
    { name: "India", code: "+91" },
    { name: "United States", code: "+1" },
    { name: "United Kingdom", code: "+44" },
    { name: "Canada", code: "+1" },
    { name: "Australia", code: "+61" }
  ];

  const validateEmail = useCallback(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), []);
  const validatePassword = useCallback(password => password.length >= 6, []);
  const validatePhone = useCallback(phone => /^[0-9]{6,15}$/.test(phone), []);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError("");
  }, [error]);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      email: "",
      password: "",
      profileType: "STUDENT",
      countryCode: "+91",
      phoneNumber: ""
    });
    setError("");
    setSuccess("");
    setShowPassword(false);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!formData.email || !formData.password)
        throw new Error("Please fill in all required fields.");

      if (!validateEmail(formData.email))
        throw new Error("Please enter a valid email address.");

      if (!validatePassword(formData.password))
        throw new Error("Password must be at least 6 characters long.");

      if (!isLogin) {
        if (!formData.name.trim())
          throw new Error("Please enter your full name.");
        if (!formData.phoneNumber || !validatePhone(formData.phoneNumber))
          throw new Error("Please enter a valid phone number (6-15 digits).");
      }

      await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate API

      // **Always redirect to onboarding survey after success**
      setSuccess(isLogin ? "Login successful! Redirecting..." : "Account created! Redirecting...");
      setTimeout(() => {
        navigate("/survey");
      }, 1000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [formData, isLogin, validateEmail, validatePassword, validatePhone, resetForm, navigate]);

  const handleToggleMode = useCallback(() => {
    setIsLogin(prev => !prev);
    resetForm();
  }, [resetForm]);

  const handleForgotPassword = useCallback(() => {
    alert("Password reset functionality would be implemented here");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? "Welcome Back!" : "Join CyberEdu"}
            </h2>
            <p className="text-slate-300">
              {isLogin
                ? "Sign in to continue your cybersecurity journey"
                : "Start your cybersecurity education today"
              }
            </p>
          </div>
          {/* Error/Success */}
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
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {!isLogin && (
              <>
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your full name"
                      autoComplete="name"
                    />
                  </div>
                </div>
                {/* Profile Type */}
                <div>
                  <label htmlFor="profileType" className="block text-sm font-medium text-slate-300 mb-2">
                    I am a... *
                  </label>
                  <select
                    id="profileType"
                    name="profileType"
                    value={formData.profileType}
                    onChange={e => handleInputChange('profileType', e.target.value)}
                    className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="STUDENT" className="bg-slate-800">Student</option>
                    <option value="TEACHER" className="bg-slate-800">Teacher</option>
                    <option value="JOB_PROFESSIONAL" className="bg-slate-800">Job Professional</option>
                  </select>
                </div>
              </>
            )}
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </div>
            </div>
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password * {!isLogin && <span className="text-xs text-slate-400">(minimum 6 characters)</span>}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={e => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-white transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-white transition-colors" />
                  )}
                </button>
              </div>
            </div>
            {/* Phone (Sign Up only) */}
            {!isLogin && (
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-300 mb-2">
                  Phone Number *
                </label>
                <div className="flex space-x-3">
                  <select
                    value={formData.countryCode}
                    onChange={e => handleInputChange('countryCode', e.target.value)}
                    className="w-32 p-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    aria-label="Country code"
                  >
                    {countryCodes.map((country, index) => (
                      <option key={`${country.code}-${index}`} value={country.code} className="bg-slate-800">
                        {country.code}
                      </option>
                    ))}
                  </select>
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={e => handleInputChange('phoneNumber', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Phone number"
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>
            )}
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>
          {/* Toggle Login/Register */}
          <div className="mt-8 text-center">
            <p className="text-slate-300">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={handleToggleMode}
                className="text-blue-400 font-semibold hover:text-blue-300 transition-colors duration-200 hover:underline focus:outline-none focus:underline"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
          {/* Additional Links */}
          {isLogin && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-slate-400 hover:text-white transition-colors duration-200 focus:outline-none focus:text-white"
              >
                Forgot your password?
              </button>
            </div>
          )}
        </div>
        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            Protected by enterprise-grade security measures
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;