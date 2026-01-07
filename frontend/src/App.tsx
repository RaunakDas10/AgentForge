import React, { useState } from 'react';
import { Sparkles, Zap, Brain, Code, Database, Globe, Video, Calendar, Mail, Layers, ArrowRight, CheckCircle, Menu, X, BookTemplate } from 'lucide-react';
import { AgentBuilder } from './pages/AgentBuilder';
import { Dashboard } from './pages/Dashboard';
import { Templates } from './pages/Templates';
import { Profile } from './pages/Profile';
import { NLAgentCreator } from './pages/NLAgentCreator';
import { AgentWizard } from './components/wizard/AgentWizard';
import { GuideBot } from './components/common/GuideBot';
import { HeroPreview } from './components/common/HeroPreview';
import { Onboarding } from './components/common/Onboarding';

type Page = 'home' | 'dashboard' | 'builder' | 'templates' | 'profile' | 'nl-creator';

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [editingAgentId, setEditingAgentId] = useState<string | undefined>();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(
    localStorage.getItem('onboarding_completed') === 'true'
  );

  const handleCreateNew = () => {
    setWizardOpen(true);
  };

  const handleCreateWithAI = () => {
    setCurrentPage('nl-creator');
  };

  const handleWizardComplete = (description: string) => {
    console.log('Creating agent from description:', description);
    setEditingAgentId(undefined);
    setCurrentPage('builder');
  };

  const handleEditAgent = (agentId: string) => {
    setEditingAgentId(agentId);
    setCurrentPage('builder');
  };

  const handleUseTemplate = (templateId: string) => {
    console.log('Using template:', templateId);
    setEditingAgentId(undefined);
    setCurrentPage('builder');
  };

  const handleNLAgentCreated = (agentId: string) => {
    setEditingAgentId(agentId);
    setCurrentPage('builder');
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setHasCompletedOnboarding(true);
    setShowOnboarding(false);
    setCurrentPage('dashboard');
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setHasCompletedOnboarding(true);
    setShowOnboarding(false);
    setCurrentPage('dashboard');
  };

  const navigateToDashboard = () => {
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    } else {
      setCurrentPage('dashboard');
    }
  };

  // Natural Language Creator Page
  if (currentPage === 'nl-creator') {
    return (
      <>
        <NLAgentCreator 
          onBack={() => setCurrentPage('dashboard')} 
          onAgentCreated={handleNLAgentCreated}
        />
        <GuideBot />
      </>
    );
  }

  // Agent Builder Page
  if (currentPage === 'builder') {
    return (
      <>
        <AgentBuilder agentId={editingAgentId} onBack={() => setCurrentPage('dashboard')} />
        <GuideBot />
      </>
    );
  }

  // Dashboard Page
  if (currentPage === 'dashboard') {
    return (
      <>
        <Dashboard 
          onCreateNew={handleCreateNew} 
          onCreateWithAI={handleCreateWithAI}
          onEditAgent={handleEditAgent} 
        />
        <AgentWizard isOpen={wizardOpen} onClose={() => setWizardOpen(false)} onComplete={handleWizardComplete} />
        <GuideBot />
      </>
    );
  }

  // Templates Page
  if (currentPage === 'templates') {
    return (
      <>
        <Templates onBack={() => setCurrentPage('home')} onUseTemplate={handleUseTemplate} />
        <GuideBot />
      </>
    );
  }

  // Profile Page
  if (currentPage === 'profile') {
    return (
      <>
        <Profile onBack={() => setCurrentPage('dashboard')} />
        <GuideBot />
      </>
    );
  }

  // Landing Page
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Agents",
      description: "Create intelligent agents that understand context and execute complex workflows autonomously"
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "No-Code Builder",
      description: "Drag and drop to build powerful automation - no programming knowledge required"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Data Integration",
      description: "Connect to databases, spreadsheets, APIs, and more - all your data in one place"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Web Crawling",
      description: "Advanced web scraping to gather and analyze information from any website dynamically"
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Content Processing",
      description: "Summarize YouTube videos, PDFs, and documents in seconds with AI"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Smart Scheduling",
      description: "Automate meeting scheduling, reminders, and calendar management effortlessly"
    }
  ];

  const useCases = [
    "Schedule meetings across teams automatically",
    "Summarize daily news and send personalized briefings",
    "Monitor competitor websites and track changes",
    "Auto-respond to emails with context-aware replies",
    "Generate reports from multiple data sources",
    "Track social media mentions and sentiment"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AgentForge
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
            <a href="#use-cases" className="hover:text-purple-400 transition-colors">Use Cases</a>
            <button
              onClick={() => setCurrentPage('templates')}
              className="hover:text-purple-400 transition-colors flex items-center gap-2"
            >
              <BookTemplate className="w-4 h-4" />
              Templates
            </button>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="hover:text-purple-400 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={navigateToDashboard}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              Get Started
            </button>
          </div>

          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
            <div className="flex flex-col gap-4">
              <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
              <a href="#use-cases" className="hover:text-purple-400 transition-colors">Use Cases</a>
              <button
                onClick={() => setCurrentPage('templates')}
                className="text-left hover:text-purple-400 transition-colors"
              >
                Templates
              </button>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="text-left hover:text-purple-400 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={navigateToDashboard}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full mb-8 border border-purple-500/30">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Build AI Agents in Minutes, Not Months</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
              Create Intelligent
            </span>
            <br />
            <span className="text-white">AI Agents Without Code</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Empower your workflow with custom AI agents that automate tasks, analyze data, 
            and integrate seamlessly with your favorite tools. No programming required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleCreateWithAI}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-5 h-5" />
              Create with AI ✨
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={navigateToDashboard}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2 group"
            >
              Start Building Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setCurrentPage('templates')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-full text-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
            >
              Browse Templates
            </button>
          </div>
        </div>

        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-3xl"></div>
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
            <div className="aspect-video bg-gradient-to-br from-slate-900 to-purple-900/50 rounded-2xl">
              <HeroPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Simple Interface</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to build, deploy, and manage AI agents at scale
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div 
              key={i}
              className="group p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-purple-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built for <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Real-World Tasks</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              From simple automation to complex workflows, our platform handles it all
            </p>
            
            <div className="space-y-4">
              {useCases.map((useCase, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <span className="text-gray-300">{useCase}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-purple-500/20 rounded-xl">
                  <Mail className="w-8 h-8 text-purple-400" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Email Assistant</div>
                    <div className="text-xs text-gray-400">Processing 127 emails...</div>
                  </div>
                  <div className="animate-glow">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-blue-500/20 rounded-xl">
                  <Database className="w-8 h-8 text-blue-400" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Data Analyzer</div>
                    <div className="text-xs text-gray-400">Syncing 3 sources...</div>
                  </div>
                  <div className="animate-glow" style={{ animationDelay: '0.5s' }}>
                    <Sparkles className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-pink-500/20 rounded-xl">
                  <Video className="w-8 h-8 text-pink-400" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Video Summarizer</div>
                    <div className="text-xs text-gray-400">Completed 45 videos</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl border border-white/20 p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-gradient-x"></div>
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users building intelligent automation with AgentForge
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleCreateWithAI}
                className="px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-green-500/50 transition-all inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Try AI Creator
              </button>
              <button
                onClick={navigateToDashboard}
                className="px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all inline-flex items-center gap-2"
              >
                Start Building for Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 AgentForge. Built with ❤️ for automation enthusiasts.</p>
        </div>
      </footer>

      <GuideBot />
      <Onboarding 
        isOpen={showOnboarding} 
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    </div>
  );
};

export default App;