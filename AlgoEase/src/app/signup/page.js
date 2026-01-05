

"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Github, ChevronRight, ChevronLeft, Book, Clock, Target, Code2, Sparkles } from 'lucide-react';
import { FaGoogle } from "react-icons/fa";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'path';

const Signup = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    level: '',
    goals: [],
    learningStyle: '',
    experience: '',
    timeCommitment: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false);
  const [apiError, setApiError] = useState('');
  const [roadmap, setRoadmap] = useState(null);


  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((num) => (
        <div key={num} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
            {num}
          </div>
          {num < 3 && (
            <div className={`w-12 h-1 ${step > num ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
          )}
        </div>
      ))}
    </div>
  );

  const learningGoals = [
    { id: 'algorithms', label: 'Master Algorithms' },
    { id: 'complexity', label: 'Understand Complexity' },
    { id: 'interviews', label: 'Prepare for Interviews' },
    { id: 'advanced', label: 'Explore Advanced Topics' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length > 100) {
      newErrors.username = 'Username must be less than 100 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }


    setIsLoading(true);

    try {
      const response = await fetch('/api/check-user', {  // Create this API route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, username: formData.username }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.message || 'Something went wrong');
        setIsLoading(false);
        return;  // Stop here if user exists
      }

      setStep(2);  // Move only if user does NOT exist
    } catch (error) {
      setApiError('An error occurred. Try again later.');
      setIsLoading(false);
    }

  };


  const handleGenerateRoadmap = async (userId) => {
    setIsLoadingRoadmap(true);
    console.log("accessing handleGenerteRoadmap function")
    
    setApiError("");
    try {
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
  
      const data = await response.json();
      console.log("this is the data fetched : ",data);
  
      if (response.ok) {
        setRoadmap(data.roadmap.content);
        setIsLoadingRoadmap(false);
        setStep(3); // Show roadmap step
      } else {
        setApiError(data.message);
      }
    } catch (error) {
      setApiError("An error occurred. Try again.");
    }
  
    setIsLoadingRoadmap(false);
  };
  


  const handleFinalSubmit = async (e) => {
    console.log("accessing handle final submit ")
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          experienceLevel: formData.experience,
          level: formData.level,
          goals: formData.goals,
          learningStyle: formData.learningStyle,
          timeCommitment: formData.timeCommitment
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("User created:", data.user);
        await handleGenerateRoadmap(data.user.id); // Pass new userId
        setStep(3);
        
      }
      else {
        setApiError(data.message || 'Signup failed. Try again.');
        // console.log(formData)
      }
    } catch (error) {
      setApiError('An error occurred. Try again later.');
      console.log(formData)
    }finally{
      setIsLoading(false);
    }
  };


  const [inputValueUsername, setInputValueUsername] = useState("");
  const [inputValueEmail, setInputValueEmail] = useState("");
  const [inputValuePass, setInputValuePass] = useState("");

  const inputRefUsername = useRef(null);
  useEffect(() => {
    if (inputRefUsername.current) {
      inputRefUsername.current.focus();
    }
  }, [inputValueUsername]); // Ensures input remains focused even after state changes


  const inputRefEmail = useRef(null);
  useEffect(() => {
    if (inputRefEmail.current) {
      inputRefEmail.current.focus();
    }
  }, [inputValueEmail]); // Ensures input remains focused even after state changes


  const inputRefPass = useRef(null);
  useEffect(() => {
    if (inputRefPass.current) {
      inputRefPass.current.focus();
    }
  }, [inputValuePass]); // Ensures input remains focused even after state changes


  const handleInputChangeUsername = (e) => {
    const { name, value } = e.target;
    setInputValueUsername(e.target.value);

    setFormData((prev) => {
      // Only update if the value is actually changing

      return { ...prev, [name]: value };
    });

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };
  const handleInputChangeEmail = (e) => {
    const { name, value } = e.target;
    setInputValueEmail(e.target.value);

    setFormData((prev) => {
      // Only update if the value is actually changing

      return { ...prev, [name]: value };
    });

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };
  const handleInputChangePass = (e) => {
    const { name, value } = e.target;
    setInputValuePass(e.target.value);

    setFormData((prev) => {
      // Only update if the value is actually changing

      return { ...prev, [name]: value };
    });

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleGoalToggle = (goalId) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(id => id !== goalId)
        : [...prev.goals, goalId]
    }));
  };


  



  const SignupStep = () => (
    <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Join AlgoEase</h2>
        <p className="mt-2 text-gray-600">Start your DSA learning journey today</p>
      </div>

      {apiError && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {apiError}
        </div>
      )}

      <div className="space-y-4">
        <button disabled={isLoading} className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          <FaGoogle className="w-5 h-5 mr-2" />
          Continue with Google
        </button>

        <button disabled={isLoading} className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          <Github className="w-5 h-5 mr-2" />
          Continue with GitHub
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              ref={inputRefUsername}
              name="username"
              value={formData.username}
              onChange={handleInputChangeUsername}
              className={`mt-1 block w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              ref={inputRefEmail}
              value={formData.email}
              onChange={handleInputChangeEmail}
              className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              ref={inputRefPass}
              value={formData.password}
              onChange={handleInputChangePass}
              className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Moving to next...' : 'Next'}
            <ChevronRight className="ml-2 w-4 h-4" />
          </button>
        </form>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Already have an account? </span>
          <div><Link href="/login"><button>Log In</button></Link></div>
        </div>
      </div>
    </div>
  );

  const PersonalizationStep = () => (
    <div className="max-w-2xl w-full space-y-6 p-8 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Personalize Your Experience</h2>
        <p className="mt-2 text-gray-600">Help us create your perfect learning path</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Level</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Absolute Beginner', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
              <button
                key={level}
                onClick={() => setFormData({ ...formData, level })}
                className={`px-4 py-2 rounded-md text-sm ${formData.level === level
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Learning Goals</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {learningGoals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => handleGoalToggle(goal.id)}
                className={`px-4 py-3 rounded-md text-sm flex items-center ${formData.goals.includes(goal.id)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
              >
                <Target className="w-4 h-4 mr-2" />
                {goal.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Learning Style</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {['Video Tutorials', 'Text-based Learning', 'Interactive Exercises'].map((style) => (
              <button
                key={style}
                onClick={() => setFormData({ ...formData, learningStyle: style })}
                className={`px-4 py-3 rounded-md text-sm ${formData.learningStyle === style
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Coding Experience</label>
          <div className="grid grid-cols-3 gap-3">
            {['0-3 months', '3-6 months', '6+ months'].map((exp) => (
              <button
                key={exp}
                onClick={() => setFormData({ ...formData, experience: exp })}
                className={`px-4 py-2 rounded-md text-sm ${formData.experience === exp
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
              >
                {exp}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Commitment</label>
          <div className="grid grid-cols-3 gap-3">
            {['< 1 hour/day', '1-2 hours/day', '2+ hours/day'].map((time) => (
              <button
                key={time}
                onClick={() => setFormData({ ...formData, timeCommitment: time })}
                className={`px-4 py-2 rounded-md text-sm ${formData.timeCommitment === time
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={() => setStep(1)}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <button
          onClick={(e) => handleFinalSubmit(e)}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {isLoadingRoadmap ? 'Generating Roadmap...' : 'Generate Roadmap'}
          <ChevronRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </div>
  );

  
  const RoadmapStep = () => {
    if (!roadmap) return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  
    return (
      <div className="max-w-4xl w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        {/* Header Section */}
        <div className="text-center border-b pb-6">
          <h2 className="text-3xl font-bold text-gray-900">Your Learning Roadmap</h2>
          <p className="mt-2 text-gray-600">Welcome {formData.username}! Here's your personalized DSA learning journey.</p>
        </div>
  
        {/* User Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900">Current Level</h3>
            <p className="text-lg font-semibold text-blue-700">{formData.level}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-900">Experience</h3>
            <p className="text-lg font-semibold text-purple-700">{formData.experience}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-900">Time Commitment</h3>
            <p className="text-lg font-semibold text-green-700">{formData.timeCommitment}</p>
          </div>
        </div>
  
        {/* Introduction & Expected Outcome */}
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Book className="w-5 h-5 mr-2 text-blue-600" />
              Introduction
            </h3>
            <p className="mt-2 text-gray-600">{roadmap.split('\n')[0]}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Expected Outcome
            </h3>
            <p className="mt-2 text-gray-600">{roadmap.split('\n')[1]}</p>
          </div>
        </div>
  
        {/* Roadmap Steps */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Learning Path</h3>
          <div className="space-y-4">
            {roadmap.split('Step ').slice(1).map((step, index) => {
              const [title, ...content] = step.split('\n').filter(Boolean);
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-3">
                      <h4 className="text-lg font-semibold text-gray-900">{title.replace(/^[:\s]+/, '')}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Description</p>
                          <p className="text-gray-700">{content[0]}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Time Estimate</p>
                          <p className="text-gray-700">{content[1]}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Resources & Tools</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {content[2]?.split(',').map((resource, idx) => (
                            <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              {resource.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
  
        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            onClick={() => setStep(2)}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </button>
  
          <Link href="/dashboard">
            <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
              Start Learning
              <ChevronRight className="ml-2 w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <StepIndicator />
      
      {step === 1 && <SignupStep />}
      {step === 2 && <PersonalizationStep />}
      {step === 3 && <RoadmapStep />}
    </div>
  );
};

export default Signup;