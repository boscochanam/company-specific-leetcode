"use client";
import { useEffect, useState } from "react";
import ProblemTable from "./components/ProblemTable";
import { Problem } from "./types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Clock, Search, Loader2 } from "lucide-react";

const TIME_OPTIONS = [
  "Thirty Days",
  "Three Months", 
  "Six Months",
  "More Than Six Months",
  "All"
];

export default function Home() {
  const [companies, setCompanies] = useState<string[]>([]);
  const [company, setCompany] = useState<string>("");
  const [time, setTime] = useState<string>("All");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch("/api/getCompanies");
        const list = await res.json();
        setCompanies(list);
        setCompany(list[0] || "");
      } catch (e) {
        console.error("Failed to fetch companies:", e);
      }
    }
    fetchCompanies();
  }, []);

  const fetchProblems = async () => {
    if (!company) return;
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`/api/getProblems/${encodeURIComponent(company)}/${encodeURIComponent(time)}`);
      if (!res.ok) {
        throw new Error("Failed to fetch problems");
      }
      const problems = await res.json();
      setProblems(problems);
    } catch {
      setError("Failed to fetch problems. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#d3cac2' }}>
      {/* Floating Panda Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Horizontal Moving Pandas */}
        <div 
          className="floating-panda-1 absolute text-6xl"
          style={{ top: '15%', left: '-100px' }}
        >
          🐼
        </div>
        <div 
          className="floating-panda-2 absolute text-5xl"
          style={{ top: '65%', right: '-100px' }}
        >
          🐼
        </div>
        <div 
          className="floating-panda-3 absolute text-7xl"
          style={{ top: '35%', left: '-100px' }}
        >
          🐼
        </div>
        <div 
          className="floating-panda-4 absolute text-4xl"
          style={{ top: '80%', right: '-100px' }}
        >
          🐼
        </div>
        <div 
          className="floating-panda-5 absolute text-6xl"
          style={{ top: '25%', left: '-120px' }}
        >
          🐼
        </div>
        <div 
          className="floating-panda-6 absolute text-5xl"
          style={{ top: '55%', right: '-80px' }}
        >
          🐼
        </div>
        <div 
          className="floating-panda-7 absolute text-8xl"
          style={{ top: '45%', left: '-90px' }}
        >
          🐼
        </div>
        <div 
          className="floating-panda-8 absolute text-4xl"
          style={{ top: '85%', right: '-110px' }}
        >
          🐼
        </div>

        {/* Vertical Moving Pandas */}
        <div 
          className="floating-panda-vertical-1 absolute text-5xl"
          style={{ left: '10%', top: '-100px' }}
        >
          🐼
        </div>
        <div 
          className="floating-panda-vertical-2 absolute text-6xl"
          style={{ right: '20%', bottom: '-100px' }}
        >
          🐼
        </div>

        {/* Diagonal Moving Pandas */}
        <div 
          className="floating-panda-diagonal-1 absolute text-5xl"
          style={{ left: '-80px', bottom: '-50px' }}
        >
          🐼
        </div>
        <div 
          className="floating-panda-diagonal-2 absolute text-7xl"
          style={{ right: '-70px', top: '-50px' }}
        >
          🐼
        </div>

        {/* Additional Bamboo and Pandas with Delays */}
        <div 
          className="floating-panda-1 absolute text-5xl"
          style={{ top: '5%', left: '-100px', animationDelay: '10s' }}
        >
          🎋
        </div>
        <div 
          className="floating-panda-2 absolute text-4xl"
          style={{ top: '90%', right: '-100px', animationDelay: '15s' }}
        >
          🎋
        </div>
        <div 
          className="floating-panda-3 absolute text-6xl"
          style={{ top: '70%', left: '-100px', animationDelay: '20s' }}
        >
          🐼
        </div>
        <div 
          className="floating-panda-4 absolute text-5xl"
          style={{ top: '10%', right: '-100px', animationDelay: '25s' }}
        >
          🐼
        </div>
        <div 
          className="floating-panda-5 absolute text-4xl"
          style={{ top: '50%', left: '-120px', animationDelay: '30s' }}
        >
          🎋
        </div>
        <div 
          className="floating-panda-6 absolute text-7xl"
          style={{ top: '30%', right: '-80px', animationDelay: '35s' }}
        >
          🐼
        </div>
        <div 
          className="floating-panda-7 absolute text-5xl"
          style={{ top: '75%', left: '-90px', animationDelay: '40s' }}
        >
          🐼
        </div>
        <div 
          className="floating-panda-8 absolute text-6xl"
          style={{ top: '20%', right: '-110px', animationDelay: '45s' }}
        >
          🎋
        </div>

        {/* Even More Pandas for Continuous Movement */}
        <div 
          className="floating-panda-1 absolute text-4xl"
          style={{ top: '40%', left: '-100px', animationDelay: '50s' }}
        >
          🐼
        </div>
        <div 
          className="floating-panda-2 absolute text-8xl"
          style={{ top: '60%', right: '-100px', animationDelay: '55s' }}
        >
          🐼
        </div>
        <div 
          className="floating-panda-3 absolute text-5xl"
          style={{ top: '85%', left: '-100px', animationDelay: '60s' }}
        >
          🎋
        </div>
      </div>
      
      {/* Main Content with Higher Z-Index */}
      <div className="relative z-10">
      {/* Elegant Panda-Themed Header */}
      <div className="relative overflow-hidden" style={{ backgroundColor: 'rgba(132, 160, 169, 0.1)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center items-center gap-3">
              <div 
                className="p-2.5 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105" 
                style={{ backgroundColor: '#84a0a9' }}
              >
                <span className="text-xl">🐼</span>
              </div>
              <h1 
                className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight"
                style={{ color: '#0b0e0e' }}
              >
                Panda&apos;s Company Leetcode List
              </h1>
            </div>
            <p 
              className="max-w-2xl mx-auto text-sm sm:text-base leading-relaxed"
              style={{ color: '#33433f' }}
            >
              Analyze trending coding problems from top tech companies
            </p>
            <div className="flex justify-center">
              <div 
                className="h-1 w-16 rounded-full"
                style={{ backgroundColor: '#7b7b5b' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Zen-Inspired Control Panel */}
        <div 
          className="rounded-3xl shadow-xl p-4 sm:p-6 mb-6 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: `2px solid #4e737a`
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 items-end">
            <div className="space-y-2">
              <label 
                className="text-xs sm:text-sm font-semibold flex items-center gap-2"
                style={{ color: '#33433f' }}
              >
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#84a0a9' }} />
                Company
              </label>
              <Select value={company} onValueChange={setCompany}>
                <SelectTrigger 
                  className="h-10 sm:h-11 rounded-2xl transition-all duration-200 hover:shadow-md focus:shadow-lg text-sm"
                  style={{ 
                    borderColor: '#4e737a',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)'
                  }}
                >
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent 
                  className="rounded-2xl border-2"
                  style={{ borderColor: '#4e737a' }}
                >
                  {companies.map(c => (
                    <SelectItem 
                      key={c} 
                      value={c} 
                      className="rounded-xl m-1 transition-colors duration-200 text-sm"
                      style={{ 
                        color: '#33433f'
                      }}
                    >
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label 
                className="text-xs sm:text-sm font-semibold flex items-center gap-2"
                style={{ color: '#33433f' }}
              >
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#7b7b5b' }} />
                Time Period
              </label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger 
                  className="h-10 sm:h-11 rounded-2xl transition-all duration-200 hover:shadow-md focus:shadow-lg text-sm"
                  style={{ 
                    borderColor: '#4e737a',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)'
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent 
                  className="rounded-2xl border-2"
                  style={{ borderColor: '#4e737a' }}
                >
                  {TIME_OPTIONS.map(t => (
                    <SelectItem 
                      key={t} 
                      value={t} 
                      className="rounded-xl m-1 transition-colors duration-200 text-sm"
                      style={{ 
                        color: '#33433f'
                      }}
                    >
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="sm:col-span-2 lg:col-span-1">
              <Button
                onClick={fetchProblems}
                disabled={loading || !company}
                className="w-full px-4 sm:px-6 h-10 sm:h-11 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 transform hover:scale-105 font-semibold text-sm"
                style={{ 
                  backgroundColor: loading || !company ? '#4e737a' : '#84a0a9',
                  borderColor: '#4e737a'
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Analyze Problems
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {error && (
            <div 
              className="mt-3 sm:mt-4 p-3 rounded-2xl border-2"
              style={{ 
                backgroundColor: 'rgba(11, 14, 14, 0.05)',
                borderColor: '#0b0e0e',
                color: '#0b0e0e'
              }}
            >
              <p className="text-xs sm:text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Data Visualization Section */}
        <ProblemTable problems={problems} />
      </div>
      </div>
    </div>
  );
}
