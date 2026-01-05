"use client"
import React, { useState } from 'react';
import { 
  Code2, Upload, Play, Copy, Save, 
  Zap, Clock, Bug, Sparkles, ChevronDown,
  PlayCircle, AlertTriangle, BookOpen
} from 'lucide-react';

const CodeAnalyzer = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [activeTab, setActiveTab] = useState('explanation');
  const [code, setCode] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCode(e.target.result);
      reader.readAsText(file);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const languages = [
    { value: 'python', label: 'Python' },
    { value: 'cpp', label: 'C++' },
    { value: 'java', label: 'Java' },
    { value: 'javascript', label: 'JavaScript' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className=" mx-auto h-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Code2 className="text-blue-400" />
            Code Analyzer
          </h1>
          <p className="text-gray-400 mt-2">Analyze, optimize, and understand your code</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Code Input */}
          <div className="space-y-4">
            {/* Language Selection and Actions */}
            <div className="flex items-center gap-4 mb-4 ">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2">
                  <Upload size={18} />
                  Upload
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Code Editor */}
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                className="w-full h-[750px] bg-gray-800 border border-gray-700 rounded-lg p-4 font-mono focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={handleCopyCode}
                  className="p-2 hover:bg-gray-700 rounded-lg"
                  title="Copy code"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Analysis Output */}
          <div className="bg-gray-800 rounded-lg p-6">
            {/* Analysis Tabs */}
            <div className="flex space-x-4 border-b border-gray-700 mb-6">
              <button
                onClick={() => setActiveTab('explanation')}
                className={`pb-2 flex items-center gap-2 ${
                  activeTab === 'explanation' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400'
                }`}
              >
                <BookOpen size={18} />
                Explanation
              </button>
              <button
                onClick={() => setActiveTab('complexity')}
                className={`pb-2 flex items-center gap-2 ${
                  activeTab === 'complexity' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400'
                }`}
              >
                <Clock size={18} />
                Complexity
              </button>
              <button
                onClick={() => setActiveTab('testCases')}
                className={`pb-2 flex items-center gap-2 ${
                  activeTab === 'testCases' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400'
                }`}
              >
                <Bug size={18} />
                Test Cases
              </button>
              <button
                onClick={() => setActiveTab('optimization')}
                className={`pb-2 flex items-center gap-2 ${
                  activeTab === 'optimization' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400'
                }`}
              >
                <Sparkles size={18} />
                Optimization
              </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'explanation' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Code Explanation</h3>
                    <button
                      onClick={() => setIsAnimating(!isAnimating)}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <PlayCircle size={18} />
                      Animate Flow
                    </button>
                  </div>
                  {isAnimating ? (
                    <div className="bg-gray-900 rounded-lg p-4 h-64 flex items-center justify-center">
                      [Animation Visualization Panel]
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300">
                        Enter your code to see a detailed explanation of its logic and purpose.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'complexity' && (
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Clock size={18} className="text-yellow-500" />
                      Time Complexity
                    </h4>
                    <p className="text-gray-300">Enter code to analyze time complexity</p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Zap size={18} className="text-yellow-500" />
                      Space Complexity
                    </h4>
                    <p className="text-gray-300">Enter code to analyze space complexity</p>
                  </div>
                </div>
              )}

              {activeTab === 'testCases' && (
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle size={18} className="text-orange-500" />
                      Edge Cases
                    </h4>
                    <p className="text-gray-300">Enter code to identify potential edge cases</p>
                  </div>
                </div>
              )}

              {activeTab === 'optimization' && (
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Sparkles size={18} className="text-purple-500" />
                      Optimization Suggestions
                    </h4>
                    <p className="text-gray-300">Enter code to receive optimization recommendations</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2">
                <Save size={18} />
                Save Analysis
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2">
                <Play size={18} />
                Run Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeAnalyzer;