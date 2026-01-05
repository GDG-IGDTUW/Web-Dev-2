// import Image from "next/image";

// export default function Home() {
//   return (
//     <div>
      
//     </div>
//   );
// }
"use client"
import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";
import Image from "next/image";
import { useState } from 'react';
import { Code2, Brain, BarChart2, Book, ArrowRight, Github, Twitter, Linkedin, Menu, X, ChevronRight } from 'lucide-react';
import Link from "next/link";

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
 
    {
      title: "Products",
      icon: (
        <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Components",
      icon: (
        <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Aceternity UI",
      icon: (
        <Image
          src="/"
          width={20}
          height={20}
          alt="Aceternity Logo"
        />
      ),
      href: "#",
    },
    {
      title: "Changelog",
      icon: (
        <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
 
    {
      title: "Twitter",
      icon: (
        <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
  ];

  const features = [
    {
      title: "Personalized Dashboards",
      description: "Track your progress and get customized recommendations based on your learning style and goals.",
      icon: <BarChart2 className="w-6 h-6" />,
      stats: "87% improvement in learning speed"
    },
    {
      title: "Algorithm Visualizations",
      description: "Interactive visualizations that help you understand complex algorithms step by step.",
      icon: <Brain className="w-6 h-6" />,
      stats: "500+ algorithm animations"
    },
    {
      title: "Code Analysis",
      description: "Get instant feedback on your code's efficiency and suggestions for optimization.",
      icon: <Code2 className="w-6 h-6" />,
      stats: "Real-time optimization tips"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your improvement over time with detailed analytics and progress reports.",
      icon: <Book className="w-6 h-6" />,
      stats: "Detailed performance metrics"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science Student @ Stanford",
      content: "AlgoEase helped me understand complex algorithms that I struggled with for months. The visualizations are incredible!",
      image: "/api/placeholder/40/40",
      rating: 5
    },
    {
      name: "Mike Johnson",
      role: "Senior SWE @ Google",
      content: "The personalized practice problems helped me ace my technical interviews. Best DSA learning platform out there!",
      image: "/api/placeholder/40/40",
      rating: 5
    }
  ];

  const NavigationLink = ({ href, children }) => (
    <a 
      href={href} 
      className="text-gray-300 hover:text-white transition-colors duration-200"
    >
      {children}
    </a>
  );

  const stats = [
    { label: "Active Users", value: "50K+" },
    { label: "Problems Solved", value: "1M+" },
    { label: "Success Rate", value: "94%" },
    { label: "Companies Hiring", value: "500+" }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-800 fixed w-full z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                AlgoEase
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 text-xl">
              <NavigationLink href="#features">Features</NavigationLink>
              <NavigationLink href="#testimonials">Testimonials</NavigationLink>
              <NavigationLink href="#pricing">Pricing</NavigationLink>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors duration-200">
                Try it Free
              </button>
            </div>

            {/* <div className="flex items-center justify-center h-[35rem] w-full">
      <FloatingDock
        mobileClassName="translate-y-20" // only for demo, remove for production
        items={links}
      />
    </div> */}

            {/* Mobile Navigation Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col space-y-4">
                <NavigationLink href="#features">Features</NavigationLink>
                <NavigationLink href="#testimonials">Testimonials</NavigationLink>
                <NavigationLink href="#pricing">Pricing</NavigationLink>
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg w-full transition-colors duration-200">
                  Try it Free
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0 relative z-10">
              <div className="animate-fade-in-up">
                <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Master DSA with Ease!
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Your AI-powered learning companion for mastering Data Structures and Algorithms. Get structured guidance, visual learning, and real-time feedback.
                </p>
                <div className="flex space-x-4">
                <Link href='/signup'><button className="bg-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center">
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button></Link>
                  <button className="border border-gray-600 px-8 py-3 rounded-lg font-medium hover:border-blue-400 transition-all duration-200 text-gray-300 hover:text-white">
                    Watch Demo
                  </button>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-8 h-64 flex items-center justify-center backdrop-blur-xl transform hover:scale-105 transition-transform duration-200">
                <Code2 className="w-32 h-32 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-12 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
            
          </div>
        </div>
      </section> */}
      
      


      {/* Features Section */}
      <section className="py-20" id="features">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Platform Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-all duration-200 transform hover:scale-105 cursor-pointer border border-gray-700 hover:border-blue-500"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <div className="text-sm text-blue-400">{feature.stats}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20 bg-gray-800" id="how-it-works">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
      How It Works
    </h2>
    <div className="grid md:grid-cols-4 gap-8">
      <div className="bg-gray-900 p-6 rounded-lg text-center">
        <h3 className="text-xl font-semibold mb-4">Step 1: Sign Up</h3>
        <p className="text-gray-400">Create an account and get access to a personalised roadmap tailored according to your needs and interests.</p>
      </div>
      <div className="bg-gray-900 p-6 rounded-lg text-center">
        <h3 className="text-xl font-semibold mb-4">Step 2: Learn and Practice</h3>
        <p className="text-gray-400">Follow structured lessons, visualize concepts, and complete exercises to enhance your skills.</p>
      </div>
      <div className="bg-gray-900 p-6 rounded-lg text-center">
        <h3 className="text-xl font-semibold mb-4">Step 3: Analyse your code</h3>
        <p className="text-gray-400">Use our code analyser for easy explanation, time and space complexity analysis, optimisation techniques and some edge test-cases!</p>
      </div>
      <div className="bg-gray-900 p-6 rounded-lg text-center">
        <h3 className="text-xl font-semibold mb-4">Step 4: Get Feedback</h3>
        <p className="text-gray-400">Receive real-time feedback and track your progress to ensure continuous improvement.</p>
      </div>
    </div>
  </div>
</section>


      {/* Testimonials Section */}
      {/* <section className="py-20 bg-gray-800" id="testimonials">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-gray-900 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-200 transform hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 mb-4">{testimonial.content}</p>
                <div className="flex items-center">
                  <img src={testimonial.image} alt={testimonial.name} className="rounded-full mr-4" />
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

<section className="py-20 bg-gray-800" id="faq">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
      Frequently Asked Questions
    </h2>
    <div className="space-y-8">
      <div className="bg-gray-900 p-6 rounded-lg">
        <h3 className="font-semibold text-white mb-2">What is AlgoEase?</h3>
        <p className="text-gray-400">AlgoEase is an AI-powered learning platform designed to help you master Data Structures and Algorithms through structured guidance, visual learning, and real-time feedback.</p>
      </div>
      <div className="bg-gray-900 p-6 rounded-lg">
        <h3 className="font-semibold text-white mb-2">How does the free trial work?</h3>
        <p className="text-gray-400">The free trial gives you access to select lessons and features. You can explore the platform before committing to a full subscription.</p>
      </div>
      {/* Add more FAQs */}
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Master DSA?</h2>
          <p className="text-xl mb-8 text-gray-100">Join thousands of developers who've improved their coding skills with AlgoEase</p>
          <Link href='/signup'><button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 transform hover:scale-105">
            Start Learning Now
          </button></Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                AlgoEase
              </h3>
              <p className="text-gray-400">Making DSA learning accessible and effective for everyone.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <Github className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;