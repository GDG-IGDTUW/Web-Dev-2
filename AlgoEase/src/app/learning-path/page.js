///learning-path/page.js (where the roadmap is the be displayed)
"use client"
import React from 'react'
import { useEffect, useState } from "react";

import { Github, ChevronRight, ChevronLeft, Book, Clock, Target, Code2, Sparkles } from 'lucide-react';
import { FaGoogle } from "react-icons/fa";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'path';

const page = () => {

  const [roadmapContent, setRoadmapContent] = useState("");
  const [timeCommitment, setTimeCommitment] = useState("");
  const [level, setLevel] = useState("");
  const [experience, setExperience] = useState("");

  const [selectedStep, setSelectedStep] = useState(null);
  const [progress, setProgress] = useState({});

  

  useEffect(() => {
    // Retrieve roadmap content from sessionStorage
    const roadmap = sessionStorage.getItem("roadmapContent");

    if (roadmap) {
      setRoadmapContent(roadmap);
    }
  }, []);

  if (!roadmapContent){ return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  )};


  const handleCheckboxChange = (stepIndex, resourceIndex) => {
    setProgress(prev => {
      const stepKey = `step-${stepIndex}`;
      const currentStepProgress = prev[stepKey] || {};
      const newResourceProgress = {
        ...currentStepProgress,
        [resourceIndex]: !currentStepProgress[resourceIndex]
      };
      
      return {
        ...prev,
        [stepKey]: newResourceProgress
      };
    });
  };

  const calculateProgress = (stepIndex) => {
    const stepKey = `step-${stepIndex}`;
    const stepProgress = progress[stepKey] || {};
    const totalResources = roadmapContent.split('Step ')[stepIndex + 1]
      .split('\n')
      .filter(line => line.includes('Resources & Tools'))[0]
      .split(',').length;
    
    const completedResources = Object.values(stepProgress).filter(Boolean).length;
    return (completedResources / totalResources) * 100;
  };

  
    
    return (
      <div className='flex min-h-screen'>
        {/* left panel */}
      {/* <div className="max-w-4xl w-full space-y-8 p-8 bg-white rounded-lg shadow-lg"> */}
      <div className="w-1/2 p-8 overflow-y-scroll max-h-screen">
        <div className="space-y-8">

        {/* Header Section */}
        <div className="text-center border-b pb-6">
          <h2 className="text-3xl font-bold text-gray-900">Your Learning Roadmap</h2>
          <p className="mt-2 text-gray-600">Welcome ! Here's your personalized DSA learning journey.</p>
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900">Current Level</h3>
            {/* <p className="text-lg font-semibold text-blue-700">{formData.level}</p> */}
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-900">Experience</h3>
            {/* <p className="text-lg font-semibold text-purple-700">{formData.experience}</p> */}
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-900">Time Commitment</h3>
            {/* <p className="text-lg font-semibold text-green-700">{formData.timeCommitment}</p> */}
          </div>
        </div>

        {/* Introduction & Expected Outcome */}
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Book className="w-5 h-5 mr-2 text-blue-600" />
              Introduction
            </h3>
            <p className="mt-2 text-gray-600">{roadmapContent.split('\n')[0]}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Expected Outcome
            </h3>
            <p className="mt-2 text-gray-600">{roadmapContent.split('\n')[1]}</p>
          </div>
        </div>

        {/* Roadmap Steps */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Learning Path</h3>
          <div className="space-y-4">
            {roadmapContent.split('Step ').slice(1).map((step, index) => {
              const [title, ...content] = step.split('\n').filter(Boolean);
              const progressPercent = calculateProgress(index);
              return (
                <div key={index} 
                className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedStep(index)}>
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
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-5 mb-5">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                          <p className="text-sm text-gray-500">{progressPercent.toFixed(0)}% Complete</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </div>
        

        {/* Navigation Buttons */}

        {/* Right Panel */}
        
      <div className=" border-l border-gray-200 p-8 bg-gray-50 absolute right-0 top-0 w-1/2 h-full">
        {selectedStep !== null ? (
          (() => {
            const step = roadmapContent.split('Step ')[selectedStep + 1];
            const [title, ...content] = step.split('\n').filter(Boolean);
            return (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">{title.replace(/^[:\s]+/, '')}</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Time Estimate</p>
                      <p className="text-lg text-gray-900">{content[1]}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Resources & Tools</h4>
                      <div className="space-y-2">
                        {content[2]?.split(',').map((resource, idx) => (
                          <label
                            key={idx}
                            className="flex items-center space-x-3 p-2 bg-white rounded-lg hover:bg-gray-50 cursor-pointer border"
                          >
                            <input
                              type="checkbox"
                              checked={progress[`step-${selectedStep}`]?.[idx] || false}
                              onChange={() => handleCheckboxChange(selectedStep, idx)}
                              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">{resource.trim()}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a step to view details
          </div>
        )}
      </div>
      </div>
    
        
      </div>
      
    );
  };


export default page
