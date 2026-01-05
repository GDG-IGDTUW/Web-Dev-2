
"use client"
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";

import Link from 'next/link';

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";

import { motion } from 'framer-motion';
import { FaGithub, FaCode, FaChartLine } from 'react-icons/fa';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Moon, 
  Sun, 
  Target, 
  Code, 
  ExternalLink,
  PlusCircle,
  Calendar,
  ChevronRight,
  Trophy,
  Fire,
} from 'lucide-react';
import { FaFire } from 'react-icons/fa';
import { Star } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { Users } from 'lucide-react';
import { Settings } from 'lucide-react';
import { CgProfile } from "react-icons/cg";


// /dashboard where when the view full roadmap button is clicked, it should fecth the road map from the databse and send it to learning-path
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";



const algoEaseDashboard = () => {

    const handleViewFullRoadmap = async (userEmail) => {
        try {
            console.log("📡 Sending request for roadmap of:", userEmail);
            
            const response = await fetch("/api/get-roadmap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userEmail }),
            });

            const data = await response.json();
            console.log("Fetched roadmap data:", data);

            if (response.ok) {
                console.log("Roadmap fetched successfully:", data);
                
                // Store roadmap content in sessionStorage
                sessionStorage.setItem("roadmapContent", data.content);

                // Navigate to learning path page
                router.push('/learning-path');
            } else {
                console.error("Error fetching roadmap:", data.error);
                alert("Error: " + data.error);
            }
        } catch (error) {
            console.error("An error occurred while fetching the roadmap:", error);
            alert("An error occurred. Try again.");
        }
    };


    const UserProfileDialog = () => (
            <Dialog>
              <DialogTrigger>
                {/* <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                  {session.user?.name?.[0].toUpperCase()}
                </div> */}
                <CgProfile className='w-9 h-9' />

              </DialogTrigger>
              <DialogContent className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                <DialogHeader>
                  <DialogTitle>User Profile</DialogTitle>
                  <DialogDescription>Manage your profile and settings</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    {/* <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                      {session.user?.name?.[0].toUpperCase()}
                    </div> */}
                    <CgProfile className='w-9 h-9' />
                    <div>
                      <h2 className="text-xl font-bold">{session.user?.name}</h2>
                      <p className="text-muted-foreground">{session.user?.email}</p>
                    </div>
                  </div>
                  
                  {/* Notification Settings moved here */}
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Settings className="mr-2" /> Notification Preferences
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(notificationSettings).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                          <Button
                            variant={value ? "default" : "outline"}
                            onClick={() => setNotificationSettings(prev => ({
                              ...prev,
                              [key]: !value
                            }))}
                          >
                            {value ? "Enabled" : "Disabled"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          );

    const mockLeaderboard = [
        { name: "CodeNinja", points: 1250, rank: 1 },
        { name: "AlgoMaster", points: 1100, rank: 2 },
        { name: "DataWhiz", points: 1050, rank: 3 }
      ];
      
      const mockRecommendations = [
        { 
          title: "Dynamic Programming Patterns", 
          type: "Article", 
          difficulty: "Advanced",
          relevanceScore: 85
        },
        { 
          title: "Graph Traversal Optimization", 
          type: "Problem", 
          difficulty: "Hard",
          relevanceScore: 75
        }
      ];
      
      const mockAchievements = [
        { 
          title: "10 Hard Problems Solved", 
          icon: <Trophy className="text-yellow-400" />,
          description: "Mastered challenging algorithmic problems"
        },
        { 
          title: "7-Day Learning Streak", 
          icon: <FaFire className="text-orange-500" />,
          description: "Consistent daily learning"
        }
      ];
      
  const [isDarkMode] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState({
    dailyChallenge: true,
    weeklyGoals: true,
    newResources: true
  });

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return null;

  // Sample data
  const learningPath = [
    { 
      title: "Advanced Sorting Algorithms", 
      progress: 65, 
      difficulty: "Intermediate",
      nextStep: "Implement QuickSort Optimization"
    },
    { 
      title: "Graph Traversal Techniques", 
      progress: 40, 
      difficulty: "Advanced",
      nextStep: "Study Dijkstra's Algorithm"
    }
  ];

  const codeChallenges = [
    {
      title: "Implement Quick Sort",
      difficulty: "Medium",
      timeRemaining: "23:45:12",
      points: 150
    }
  ];

  const upcomingEvents = [
    {
      title: "DSA Hackathon",
      date: "March 15, 2024",
      type: "Competition"
    },
    {
      title: "Advanced Algorithms Webinar",
      date: "March 22, 2024",
      type: "Workshop"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900 text-white p-6"
    >
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8 pb-4 border-b border-gray-800 text-white"
      >
        <div className="flex items-center space-x-4">
          <Link href='/'><Button>
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            AlgoEase
          </div>
          </Button></Link>
          <h1 className="text-3xl">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
           
           <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
             Welcome, {session.user?.email}!
           </h1>
         </div>
         
        <div className="flex items-center space-x-4">
          <Button 
            variant="destructive" 
            onClick={() => signOut()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Logout
          </Button>
          <UserProfileDialog />
        </div>
      </motion.header>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-3 gap-6 ">
        
        {/* Learning Path */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gray-800 border-gray-700 hover:border-blue-400 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="text-blue-400" />
                  <span className='text-white'>Personalised Roadmap</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => router.push('/learning-path')}
                >
                  <ExternalLink className="text-gray-400 hover:text-blue-400" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {learningPath.map((path, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between mb-2 text-white">
                    <span>{path.title}</span>
                    <Badge variant="secondary">{path.difficulty}</Badge>
                  </div>
                  <Progress 
                    value={path.progress} 
                    className="bg-gray-600"
                    // IntermediateClassName="bg-gradient-to-r from-blue-400 to-cyan-400"
                    
                  />
                  
                  <p className="text-sm text-gray-400 mt-2">
                    Next Step: {path.nextStep}
                  </p>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full border-blue-600 text-blue-500 hover:bg-blue-600/20 font-bold"
                onClick={()=>handleViewFullRoadmap(session.user?.email)}
              >
                View Full Roadmap
                <ChevronRight className="ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Code Analyzer */}
      <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-gray-800 border-gray-700 hover:border-cyan-400 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FaCode className="text-cyan-400" />
                  <span className='text-white'>Code Analyzer</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => router.push('/code-analyzer')}
                >
                  <ExternalLink className="text-gray-400 hover:text-cyan-400" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 font-bold mb-4">
                Visualize and understand complex algorithms through animated explanations.
              </p>
              <Button 
                className="w-full bg-cyan-600 hover:bg-cyan-700"
                onClick={() => router.push('/code-analyzer')}
              >
                <PlusCircle className="mr-2" /> Analyze Algorithm
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        

        {/* Leaderboard & Streak Tracking */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card className="bg-gray-800 border-gray-700 hover:border-yellow-400 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="text-yellow-400" />
              <span className='text-white'>Leaderboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockLeaderboard.map((user, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-2 rounded hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-yellow-300">#{user.rank}</span>
                    <span className='font-bold text-yellow-300'>{user.name}</span>
                  </div>
                  <Badge className="bg-yellow-600 text-white">{user.points} pts</Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full text-center">
              <Badge variant="secondary">Your Rank: 12</Badge>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gray-800 border-gray-700 hover:border-purple-400 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="text-purple-400" />
                  <span className='text-white'>Upcoming Events</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => router.push('/events')}
                >
                  <ExternalLink className="text-gray-400 hover:text-purple-400" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.map((event, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center mb-3 p-2 rounded hover:bg-gray-700 transition-colors"
                >
                  <div>
                    <h4 className='text-white'>{event.title}</h4>
                    <p className="text-sm text-gray-300">{event.date}</p>
                  </div>
                  <Badge variant="outline" className="border-purple-600 text-purple-400">
                    {event.type}
                  </Badge>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full border-purple-600 text-purple-500 font-bold hover:bg-purple-600/20"
                onClick={() => router.push('/events')}
              >
                View All Events
                <ChevronRight className="ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>


        {/* Code Challenges */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gray-800 border-gray-700 hover:border-green-400 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-white">
                  <Code className="text-green-400" />
                  <span className='text-white'>Coding Challenges</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => router.push('/challenges')}
                >
                  <ExternalLink className="text-gray-400 hover:text-green-400" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {codeChallenges.map((challenge, index) => (
                <div key={index} className="space-y-3 ">
                  <h3 className='text-white'>{challenge.title}</h3>
                  <div className="flex justify-between">
                    <Badge variant="secondary">{challenge.difficulty}</Badge>
                    <Badge className="bg-green-800 text-green-300">{challenge.timeRemaining}</Badge>
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => router.push('/challenge/quick-sort')}
                  >
                    Start Challenge
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        
      {/* Achievements & Community */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <Card className="bg-gray-800 border-gray-700 hover:border-purple-400 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="text-purple-400" />
              <span className='text-white'>Achievements & Community</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Achievements */}
              <div className="mb-4">
                <h4 className="text-lg mb-2 flex items-center text-yellow-400">
                  <Trophy className="mr-2 text-yellow-400" /> Recent Achievements
                </h4>
                {mockAchievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 transition-colors text-white"
                  >
                    {achievement.icon}
                    <div>
                      <h5 className="font-medium">{achievement.title}</h5>
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Community Actions */}
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full border-purple-600 text-purple-500 font-bold hover:bg-purple-600/20 flex items-center"
                >
                  <MessageCircle className="mr-2" /> Discussion Forum
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-purple-600 text-purple-500 font-bold hover:bg-purple-600/20 flex items-center"
                >
                  <Users className="mr-2" /> Pair Programming
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      </div>


      {/* Additional Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* AI Recommendations */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card className="bg-gray-800 border-gray-700 hover:border-green-400 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="text-green-400" />
              <span className='text-white'>AI Mentor Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mockRecommendations.map((rec, index) => (
              <div 
                key={index} 
                className="mb-3 p-3 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-white">{rec.title}</h4>
                    <div className="flex space-x-2 mt-1">
                      <Badge variant="secondary">{rec.type}</Badge>
                      <Badge className="bg-green-800 text-green-300">{rec.difficulty}</Badge>
                    </div>
                  </div>
                  <Badge className="bg-green-600 text-white">
                    {rec.relevanceScore}%
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full border-green-600 text-green-600 font-bold hover:bg-green-600/20 "
            >
              View Full Recommendations
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
        

        {/* External Integrations */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-gray-800 border-gray-700 hover:border-gray-400 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FaGithub className="text-gray-400" />
                <span className='text-white'>External Integrations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-black hover:bg-gray-700"
                >
                  Connect GitHub
                  <FaGithub className="ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-black hover:bg-gray-700"
                >
                  Sync LeetCode Profile
                  <FaChartLine className="ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default algoEaseDashboard;