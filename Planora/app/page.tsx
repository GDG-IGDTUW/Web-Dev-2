'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      title: "Pomodoro Timer",
      description: "Stay focused with customizable work/break intervals",
      icon: "⏱️",
      color: "from-green-400 to-emerald-500",
      path: "/pomodoro"
    },
    {
      title: "Smart Calendar",
      description: "Visualize tasks & track progress with interactive dots",
      icon: "📅",
      color: "from-blue-400 to-cyan-500",
      path: "/calendar"
    },
    {
      title: "Study Planner",
      description: "Organize tasks by subject, priority, and deadlines",
      icon: "📚",
      color: "from-purple-400 to-pink-500",
      path: "/study-planner"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: "25 min", label: "Average Focus Time" },
    { value: "95%", label: "Task Completion Rate" },
    { value: "3.2h", label: "Daily Study Average" },
    { value: "∞", label: "Productivity Gains" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="px-6 py-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h1 className="text-2xl font-bold text-white">StudyFlow</h1>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => router.push('/study-planner')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="px-6 py-12 md:py-24 max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-sm text-gray-300">Made for Students, by Students</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Study Smarter,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400">
                Not Harder
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
              Boost your productivity with AI-powered study tools. Plan, track, and optimize 
              your learning journey with smart timers, interactive calendars, and progress analytics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={() => router.push('/study-planner')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:-translate-y-1 shadow-xl shadow-green-500/20"
              >
                🚀 Start Today!
              </button>
              <button
                onClick={() => router.push('/pomodoro')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold border border-gray-700 hover:border-gray-600 transition-all"
              >
                ⚡ Try Pomodoro Timer
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white text-center mb-4">Everything You Need</h2>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              Three powerful tools, one seamless workflow. Optimize every aspect of your study routine.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  onClick={() => router.push(feature.path)}
                  className={`bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-8 border-2 ${
                    currentFeature === index 
                      ? 'border-green-500/50 shadow-xl shadow-green-500/10' 
                      : 'border-gray-700/50'
                  } transition-all duration-500 hover:border-green-500/30 hover:shadow-xl hover:shadow-green-500/5 cursor-pointer`}
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 mb-6">{feature.description}</p>
                  <button className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors">
                    Try it now →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-700/50 mb-20">
            <h2 className="text-3xl font-bold text-white text-center mb-12">How StudyFlow Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Plan Your Sessions",
                  description: "Add tasks with subjects, priorities, and deadlines in the Study Planner."
                },
                {
                  step: "02",
                  title: "Focus with Timer",
                  description: "Use the Pomodoro timer with customizable intervals for deep focus."
                },
                {
                  step: "03",
                  title: "Track Progress",
                  description: "Monitor your progress in the Calendar with visual indicators and updates."
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg mx-auto mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="text-center max-w-2xl mx-auto mb-20">
            <div className="text-4xl mb-6">✨</div>
            <p className="text-2xl text-white italic mb-6">
              "StudyFlow transformed how I manage my university workload. I'm 40% more productive!"
            </p>
            <div>
              <div className="font-semibold text-white">Alex Chen</div>
              <div className="text-gray-400">Computer Science Student, Stanford</div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Study Habits?</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Join thousands of students who are already studying smarter with StudyFlow.
            </p>
            <button
              onClick={() => router.push('/study-planner')}
              className="px-12 py-5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:-translate-y-1 shadow-2xl shadow-green-500/30"
            >
              🎓 Start Today
            </button>
            
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-12 max-w-7xl mx-auto border-t border-gray-800/50 mt-20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <span className="text-xl">🎯</span>
              </div>
              <h2 className="text-xl font-bold text-white">StudyFlow</h2>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400 justify-center">
              <button onClick={() => router.push('/study-planner')} className="hover:text-white transition-colors">Features</button>
              <button onClick={() => router.push('/pomodoro')} className="hover:text-white transition-colors">Pomodoro</button>
              <button onClick={() => router.push('/calendar')} className="hover:text-white transition-colors">Calendar</button>
              
            </div>
            <div className="text-gray-500 text-sm">
              © 2024 StudyFlow. Made with ❤️ for students.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}