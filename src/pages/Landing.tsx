
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Map, Users, CreditCard, ArrowRight, Check } from 'lucide-react';

const Landing = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the email to a backend service
    setSubmitted(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <Plane className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-primary">AITrvlBuddy</span>
        </div>
        <div>
          <Link 
            to="/onboarding" 
            className="py-2 px-4 rounded-md bg-primary text-white text-sm font-medium"
          >
            Get Started
          </Link>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Turn Every Trip into a Game. Every Memory into Income.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            AI-powered travel planning, social sharing, and seamless booking in one app.
          </p>
          <div className="max-w-md mx-auto">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-md border border-border bg-background"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-3 rounded-md bg-primary text-white font-medium"
                >
                  Join Early Access
                </button>
              </form>
            ) : (
              <div className="bg-primary/10 text-primary rounded-md p-4 flex items-center gap-2">
                <Check className="h-5 w-5" />
                <span>Thanks! We'll notify you when early access is available.</span>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Feature Highlights
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plane className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Itinerary</h3>
            <p className="text-muted-foreground">
              Get personalized travel plans based on your preferences, budget, and travel style.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Map className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AR Quests</h3>
            <p className="text-muted-foreground">
              Discover hidden gems and complete challenges at your destination for rewards.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Clone Trips</h3>
            <p className="text-muted-foreground">
              See a trip you love? Clone it instantly and customize it to make it your own.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Book Instantly</h3>
            <p className="text-muted-foreground">
              Seamless booking for flights, hotels, and activities with best price guarantees.
            </p>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16 bg-primary/5 rounded-lg my-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          What Travelers Say
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/20"></div>
              <div>
                <h4 className="font-semibold">Sarah K.</h4>
                <p className="text-xs text-muted-foreground">Tokyo, Japan</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              "The AI itinerary saved me hours of planning. It suggested places I never would have found on my own!"
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/20"></div>
              <div>
                <h4 className="font-semibold">Michael T.</h4>
                <p className="text-xs text-muted-foreground">Barcelona, Spain</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              "I cloned a trip from a local and had the most authentic experience. The booking process was seamless too."
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/20"></div>
              <div>
                <h4 className="font-semibold">Priya M.</h4>
                <p className="text-xs text-muted-foreground">Bali, Indonesia</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              "The AR quests made exploring so much fun! I earned badges while discovering hidden spots around the island."
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Ready to Transform Your Travel Experience?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of travelers who are already using AITrvlBuddy to plan, share, and book their dream trips.
        </p>
        <Link 
          to="/onboarding" 
          className="inline-flex items-center gap-2 py-3 px-6 rounded-md bg-primary text-white font-medium"
        >
          Get Started Now
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
      
      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Plane className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-primary">AITrvlBuddy</span>
            </div>
            
            <div className="flex flex-wrap gap-6 justify-center mb-6 md:mb-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">About</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">Features</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">Pricing</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">Blog</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</a>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 AITrvlBuddy. All rights reserved.</p>
            <div className="flex gap-4 justify-center mt-2">
              <a href="#" className="hover:text-primary">Privacy Policy</a>
              <a href="#" className="hover:text-primary">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;