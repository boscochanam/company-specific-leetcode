"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Filter,
  ExternalLink,
  Hash,
  Target,
  TrendingUp,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Problem } from "../types/problem";

type SortField = keyof Problem | 'none';
type SortDirection = 'asc' | 'desc';

// Panda-themed Color Palette
const pandaColors = {
  agreeableGrey: '#d3cac2',    // Primary background
  tourmaline: '#84a0a9',       // Accent for interactive elements
  kokoda: '#7b7b5b',          // Secondary accent for illustrations
  tornadoSeason: '#4e737a',    // Darker accent for borders/lines
  dyingLight: '#33433f',       // Primary text color
  blackWash: '#0b0e0e'         // High-contrast elements
};

// Dynamic Color Coding System based on panda theme
const getDifficultyStyle = (difficulty: string) => {
  const normalizedDifficulty = difficulty.trim().toLowerCase();
  switch (normalizedDifficulty) {
    case 'easy':
      return {
        backgroundColor: 'rgba(132, 160, 169, 0.15)',
        color: pandaColors.tourmaline,
        borderColor: pandaColors.tourmaline
      };
    case 'medium':
      return {
        backgroundColor: 'rgba(78, 115, 122, 0.15)',
        color: pandaColors.tornadoSeason,
        borderColor: pandaColors.tornadoSeason
      };
    case 'hard':
      return {
        backgroundColor: 'rgba(11, 14, 14, 0.1)',
        color: pandaColors.blackWash,
        borderColor: pandaColors.blackWash
      };
    default:
      return {
        backgroundColor: 'rgba(123, 123, 91, 0.1)',
        color: pandaColors.kokoda,
        borderColor: pandaColors.kokoda
      };
  }
};

const getFrequencyStyle = (frequency: string) => {
  let freq = parseFloat(frequency) || 0;
  
  if (freq > 0 && freq <= 1) {
    freq = freq * 100;
  }
  
  // Using panda theme: High frequency = concerning (blackWash), Low frequency = good (tourmaline)
  if (freq >= 70) return { 
    style: {
      backgroundColor: 'rgba(11, 14, 14, 0.1)',
      color: pandaColors.blackWash,
      borderColor: pandaColors.blackWash
    },
    label: "Very High"
  };
  if (freq >= 50) return { 
    style: {
      backgroundColor: 'rgba(78, 115, 122, 0.15)',
      color: pandaColors.tornadoSeason,
      borderColor: pandaColors.tornadoSeason
    },
    label: "High"
  };
  if (freq >= 30) return { 
    style: {
      backgroundColor: 'rgba(123, 123, 91, 0.15)',
      color: pandaColors.kokoda,
      borderColor: pandaColors.kokoda
    },
    label: "Medium"
  };
  if (freq >= 10) return { 
    style: {
      backgroundColor: 'rgba(132, 160, 169, 0.2)',
      color: pandaColors.tourmaline,
      borderColor: pandaColors.tourmaline
    },
    label: "Low"
  };
  return { 
    style: {
      backgroundColor: 'rgba(132, 160, 169, 0.25)',
      color: pandaColors.tourmaline,
      borderColor: pandaColors.tourmaline
    },
    label: "Very Low"
  };
};

const getAcceptanceStyle = (acceptanceRate: string) => {
  const rateStr = acceptanceRate.replace('%', '');
  const rate = parseFloat(rateStr) || 0;
  const normalizedRate = rate > 1 ? rate : rate * 100;
  
  if (normalizedRate >= 70) return { 
    style: {
      backgroundColor: 'rgba(132, 160, 169, 0.25)',
      color: pandaColors.tourmaline,
      borderColor: pandaColors.tourmaline
    },
    label: "Excellent"
  };
  if (normalizedRate >= 50) return { 
    style: {
      backgroundColor: 'rgba(132, 160, 169, 0.15)',
      color: pandaColors.tourmaline,
      borderColor: pandaColors.tourmaline
    },
    label: "Good"
  };
  if (normalizedRate >= 30) return { 
    style: {
      backgroundColor: 'rgba(78, 115, 122, 0.15)',
      color: pandaColors.tornadoSeason,
      borderColor: pandaColors.tornadoSeason
    },
    label: "Average"
  };
  if (normalizedRate >= 15) return { 
    style: {
      backgroundColor: 'rgba(123, 123, 91, 0.15)',
      color: pandaColors.kokoda,
      borderColor: pandaColors.kokoda
    },
    label: "Low"
  };
  return { 
    style: {
      backgroundColor: 'rgba(11, 14, 14, 0.1)',
      color: pandaColors.blackWash,
      borderColor: pandaColors.blackWash
    },
    label: "Very Low"
  };
};

const getTopicStyle = (index: number) => {
  const styles = [
    { color: pandaColors.tourmaline, backgroundColor: 'rgba(132, 160, 169, 0.1)' },
    { color: pandaColors.kokoda, backgroundColor: 'rgba(123, 123, 91, 0.1)' },
    { color: pandaColors.tornadoSeason, backgroundColor: 'rgba(78, 115, 122, 0.1)' },
    { color: pandaColors.dyingLight, backgroundColor: 'rgba(51, 67, 63, 0.1)' }
  ];
  return styles[index % styles.length];
};

const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };

export default function ProblemTable({ problems }: { problems: Problem[] }) {
  const [sortField, setSortField] = useState<SortField>('none');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Show 20 problems per page

  // Get unique difficulties and topics for filters
  const uniqueDifficulties = Array.from(new Set(problems.map(p => p.Difficulty)));
  const uniqueTopics = Array.from(new Set(problems.flatMap(p => p.Topics))).sort();

  // Filtered and sorted problems
  const filteredAndSortedProblems = useMemo(() => {
    const filtered = problems.filter(problem => {
      const matchesSearch = problem.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           problem.Topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDifficulty = difficultyFilter === 'all' || problem.Difficulty === difficultyFilter;
      const matchesTopic = topicFilter === 'all' || problem.Topics.includes(topicFilter);
      
      return matchesSearch && matchesDifficulty && matchesTopic;
    });

    if (sortField === 'none') return filtered;

    return filtered.sort((a, b) => {
      let aValue: string | number | string[] = a[sortField];
      let bValue: string | number | string[] = b[sortField];

      // Special handling for different field types
      if (sortField === 'Difficulty') {
        aValue = difficultyOrder[aValue as keyof typeof difficultyOrder];
        bValue = difficultyOrder[bValue as keyof typeof difficultyOrder];
      } else if (sortField === 'Frequency') {
        aValue = parseFloat(aValue as string) || 0;
        bValue = parseFloat(bValue as string) || 0;
      } else if (sortField === 'Acceptance Rate') {
        aValue = parseFloat((aValue as string).replace('%', '')) || 0;
        bValue = parseFloat((bValue as string).replace('%', '')) || 0;
      } else if (sortField === 'Topics') {
        aValue = (aValue as string[]).join(', ');
        bValue = (bValue as string[]).join(', ');
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [problems, searchTerm, difficultyFilter, topicFilter, sortField, sortDirection]);

  // Reset to page 1 when filters change
  const resetPage = () => setCurrentPage(1);
  
  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedProblems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProblems = filteredAndSortedProblems.slice(startIndex, endIndex);

  // Update search term and reset page
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetPage();
  };

  // Update difficulty filter and reset page
  const handleDifficultyChange = (value: string) => {
    setDifficultyFilter(value);
    resetPage();
  };

  // Update topic filter and reset page
  const handleTopicChange = (value: string) => {
    setTopicFilter(value);
    resetPage();
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortField('none');
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" style={{ color: pandaColors.tornadoSeason }} />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4" style={{ color: pandaColors.tourmaline }} /> : 
      <ArrowDown className="h-4 w-4" style={{ color: pandaColors.tourmaline }} />;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDifficultyFilter('all');
    setTopicFilter('all');
    setSortField('none');
    setCurrentPage(1);
  };

  if (problems.length === 0) {
    return (
      <div 
        className="flex flex-col items-center justify-center py-24 text-center rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: `2px solid ${pandaColors.tornadoSeason}`
        }}
      >
        <div className="relative mb-8">
          <div 
            className="absolute inset-0 rounded-full blur-xl opacity-40"
            style={{ backgroundColor: pandaColors.tourmaline }}
          ></div>
          <Search className="relative h-20 w-20" style={{ color: pandaColors.tourmaline }} />
        </div>
        <h3 
          className="text-2xl font-bold mb-3"
          style={{ color: pandaColors.dyingLight }}
        >
          No problems found
        </h3>
        <p 
          className="max-w-md leading-relaxed"
          style={{ color: pandaColors.dyingLight }}
        >
          Select a company and time period, then click analyze to discover trending coding problems 🐼
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Zen-Inspired Filter Bar */}
      <div 
        className="relative overflow-hidden rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: `2px solid #4e737a`
        }}
      >
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative group">
              <Search 
                className="absolute left-3 top-3 h-4 w-4 transition-colors duration-200" 
                style={{ 
                  color: pandaColors.tornadoSeason,
                }}
              />
              <Input
                placeholder="Search problems or topics..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 h-10 sm:h-11 rounded-2xl transition-all duration-300 hover:shadow-lg focus:shadow-xl font-medium text-sm"
                style={{ 
                  borderColor: pandaColors.tornadoSeason,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: pandaColors.dyingLight
                }}
              />
            </div>
            
            <Select value={difficultyFilter} onValueChange={handleDifficultyChange}>
              <SelectTrigger 
                className="w-full sm:w-36 lg:w-44 h-10 sm:h-11 rounded-2xl transition-all duration-300 hover:shadow-lg focus:shadow-xl font-medium text-sm"
                style={{ 
                  borderColor: pandaColors.tornadoSeason,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: pandaColors.dyingLight
                }}
              >
                <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-2" style={{ color: pandaColors.tourmaline }} />
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent 
                className="rounded-2xl border-2"
                style={{ borderColor: pandaColors.tornadoSeason }}
              >
                <SelectItem value="all" className="rounded-xl m-1 text-sm">All Difficulties</SelectItem>
                {uniqueDifficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty} className="rounded-xl m-1 text-sm">
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={topicFilter} onValueChange={handleTopicChange}>
              <SelectTrigger 
                className="w-full sm:w-40 lg:w-48 h-10 sm:h-11 rounded-2xl transition-all duration-300 hover:shadow-lg focus:shadow-xl font-medium text-sm"
                style={{ 
                  borderColor: pandaColors.tornadoSeason,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: pandaColors.dyingLight
                }}
              >
                <Hash className="h-3 w-3 sm:h-4 sm:w-4 mr-2" style={{ color: pandaColors.kokoda }} />
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent 
                className="rounded-2xl border-2"
                style={{ borderColor: pandaColors.tornadoSeason }}
              >
                <SelectItem value="all" className="rounded-xl m-1 text-sm">All Topics</SelectItem>
                {uniqueTopics.map(topic => (
                  <SelectItem key={topic} value={topic} className="rounded-xl m-1 text-sm">
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(searchTerm || difficultyFilter !== 'all' || topicFilter !== 'all' || sortField !== 'none') && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="h-10 sm:h-11 px-3 sm:px-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105 text-sm"
                style={{ 
                  borderColor: pandaColors.blackWash,
                  color: pandaColors.blackWash,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)'
                }}
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Card View (sm and below) */}
      <div className="block md:hidden space-y-4">
        {paginatedProblems.map((problem, index) => {
          const difficultyStyle = getDifficultyStyle(problem.Difficulty);
          const isEven = index % 2 === 0;
          
          return (
            <div
              key={problem.Title}
              className="relative overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] p-4"
              style={{ 
                backgroundColor: isEven 
                  ? 'rgba(255, 255, 255, 0.95)' 
                  : 'rgba(132, 160, 169, 0.08)',
                border: `2px solid ${pandaColors.tornadoSeason}30`,
                animationDelay: `${index * 50}ms`
              }}
            >
              {/* Header with Difficulty and Link */}
              <div className="flex items-center justify-between mb-3">
                <Badge 
                  variant="secondary" 
                  className="transition-all duration-300 hover:shadow-lg font-semibold cursor-default border-2 px-3 py-1 rounded-2xl"
                  style={{
                    backgroundColor: difficultyStyle.backgroundColor,
                    color: difficultyStyle.color,
                    borderColor: difficultyStyle.borderColor
                  }}
                >
                  {problem.Difficulty}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-10 w-10 p-0 transition-all duration-200 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-110"
                  style={{ 
                    backgroundColor: 'rgba(132, 160, 169, 0.15)',
                    color: pandaColors.blackWash
                  }}
                >
                  <a 
                    href={problem.Link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="Open problem on LeetCode"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </Button>
              </div>
              
              {/* Problem Title */}
              <div className="mb-3">
                <h3 
                  className="font-semibold text-base leading-tight transition-colors duration-200 cursor-default hover:font-bold" 
                  title={problem.Title}
                  style={{ color: pandaColors.dyingLight }}
                >
                  {problem.Title}
                </h3>
              </div>
              
              {/* Additional Info - Topics (first 2 only) */}
              <div className="flex flex-wrap gap-2">
                {problem.Topics.slice(0, 2).map((topic, topicIndex) => {
                  const topicStyle = getTopicStyle(topicIndex);
                  return (
                    <Badge 
                      key={topic} 
                      variant="outline" 
                      className="text-xs transition-all duration-200 cursor-default transform hover:scale-105 font-medium shadow-sm hover:shadow-md border-2 px-2 py-1 rounded-xl"
                      style={{
                        color: topicStyle.color,
                        backgroundColor: topicStyle.backgroundColor,
                        borderColor: topicStyle.color
                      }}
                    >
                      {topic}
                    </Badge>
                  );
                })}
                {problem.Topics.length > 2 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs transition-all duration-200 cursor-help transform hover:scale-105 font-medium shadow-sm border-2 px-2 py-1 rounded-xl"
                    title={problem.Topics.join(', ')}
                    style={{
                      backgroundColor: 'rgba(78, 115, 122, 0.1)',
                      color: pandaColors.tornadoSeason,
                      borderColor: pandaColors.tornadoSeason
                    }}
                  >
                    +{problem.Topics.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View (md and above) */}
      <div 
        className="hidden md:block relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-3xl"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: `2px solid #4e737a`
        }}
      >
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow 
                className="border-b-2 hover:bg-opacity-80 transition-all duration-200"
                style={{ 
                  backgroundColor: 'rgba(132, 160, 169, 0.08)',
                  borderBottomColor: pandaColors.tornadoSeason
                }}
              >
                <TableHead className="w-24 sm:w-32 font-bold px-2 sm:px-4" style={{ color: pandaColors.dyingLight }}>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('Difficulty')}
                    className="h-auto p-0 font-bold justify-start hover:bg-transparent transition-all group text-xs sm:text-sm"
                    style={{ color: pandaColors.dyingLight }}
                  >
                    <Target className="h-3 w-3 sm:h-5 sm:w-5 mr-1 sm:mr-2 group-hover:scale-110 transition-transform" style={{ color: pandaColors.tourmaline }} />
                    <span className="hidden sm:inline">Difficulty</span>
                    <span className="sm:hidden">Diff</span>
                    <span className="ml-1 sm:ml-2">{getSortIcon('Difficulty')}</span>
                  </Button>
                </TableHead>
                <TableHead className="font-bold px-2 sm:px-4" style={{ color: pandaColors.dyingLight }}>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('Title')}
                    className="h-auto p-0 font-bold justify-start hover:bg-transparent transition-all group text-xs sm:text-sm"
                    style={{ color: pandaColors.dyingLight }}
                  >
                    <span className="transition-colors">Problem Title</span>
                    <span className="ml-1 sm:ml-2">{getSortIcon('Title')}</span>
                  </Button>
                </TableHead>
                <TableHead className="w-20 sm:w-32 font-bold px-2 sm:px-4" style={{ color: pandaColors.dyingLight }}>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('Frequency')}
                    className="h-auto p-0 font-bold justify-start hover:bg-transparent transition-all group text-xs sm:text-sm"
                    style={{ color: pandaColors.dyingLight }}
                  >
                    <TrendingUp className="h-3 w-3 sm:h-5 sm:w-5 mr-1 sm:mr-2 group-hover:scale-110 transition-transform" style={{ color: pandaColors.kokoda }} />
                    <span className="hidden sm:inline">Frequency</span>
                    <span className="sm:hidden">Freq</span>
                    <span className="ml-1 sm:ml-2">{getSortIcon('Frequency')}</span>
                  </Button>
                </TableHead>
                <TableHead className="w-24 sm:w-36 font-bold px-2 sm:px-4" style={{ color: pandaColors.dyingLight }}>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('Acceptance Rate')}
                    className="h-auto p-0 font-bold justify-start hover:bg-transparent transition-all group text-xs sm:text-sm"
                    style={{ color: pandaColors.dyingLight }}
                  >
                    <CheckCircle2 className="h-3 w-3 sm:h-5 sm:w-5 mr-1 sm:mr-2 group-hover:scale-110 transition-transform" style={{ color: pandaColors.tornadoSeason }} />
                    <span className="hidden sm:inline">Acceptance</span>
                    <span className="sm:hidden">Acc</span>
                    <span className="ml-1 sm:ml-2">{getSortIcon('Acceptance Rate')}</span>
                  </Button>
                </TableHead>
                <TableHead className="w-16 sm:w-20 font-bold px-2 sm:px-4" style={{ color: pandaColors.dyingLight }}>
                  <span className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    <ExternalLink className="h-3 w-3 sm:h-5 sm:w-5" style={{ color: pandaColors.blackWash }} />
                    <span className="hidden sm:inline">Link</span>
                  </span>
                </TableHead>
                <TableHead className="font-bold px-2 sm:px-4" style={{ color: pandaColors.dyingLight }}>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('Topics')}
                    className="h-auto p-0 font-bold justify-start hover:bg-transparent transition-all group text-xs sm:text-sm"
                    style={{ color: pandaColors.dyingLight }}
                  >
                    <Hash className="h-3 w-3 sm:h-5 sm:w-5 mr-1 sm:mr-2 group-hover:scale-110 transition-transform" style={{ color: pandaColors.kokoda }} />
                    Topics
                    <span className="ml-1 sm:ml-2">{getSortIcon('Topics')}</span>
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {paginatedProblems.map((problem, index) => {
              const difficultyStyle = getDifficultyStyle(problem.Difficulty);
              const frequencyStyle = getFrequencyStyle(problem.Frequency);
              const acceptanceStyle = getAcceptanceStyle(problem["Acceptance Rate"]);
              const isEven = index % 2 === 0;
              
              return (
                <TableRow 
                  key={problem.Title} 
                  className="transition-all duration-300 border-b hover:shadow-lg transform hover:scale-[1.01] hover:z-10 relative group"
                  style={{ 
                    backgroundColor: isEven 
                      ? 'rgba(132, 160, 169, 0.04)' 
                      : 'rgba(255, 255, 255, 0.8)',
                    borderBottomColor: `${pandaColors.tornadoSeason}20`,
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className="transition-all duration-300 hover:shadow-lg font-semibold transform hover:scale-110 cursor-default border-2 px-3 py-1 rounded-2xl"
                      style={{
                        backgroundColor: difficultyStyle.backgroundColor,
                        color: difficultyStyle.color,
                        borderColor: difficultyStyle.borderColor
                      }}
                    >
                      {problem.Difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold max-w-xs">
                    <div 
                      className="truncate transition-colors duration-200 cursor-default hover:font-bold" 
                      title={problem.Title}
                      style={{ color: pandaColors.dyingLight }}
                    >
                      {problem.Title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Badge 
                        variant="outline" 
                        className="transition-all hover:scale-105 font-mono text-sm border-2 px-3 py-1 rounded-2xl font-bold"
                        style={{
                          backgroundColor: frequencyStyle.style.backgroundColor,
                          color: frequencyStyle.style.color,
                          borderColor: frequencyStyle.style.borderColor
                        }}
                      >
                        {(() => {
                          let freq = parseFloat(problem.Frequency) || 0;
                          if (freq > 0 && freq <= 1) {
                            freq = freq * 100;
                          }
                          return freq.toFixed(1) + '%';
                        })()}
                      </Badge>
                      <span 
                        className="text-xs font-medium"
                        style={{ color: pandaColors.kokoda }}
                      >
                        {frequencyStyle.label}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Badge 
                        variant="outline" 
                        className="transition-all hover:scale-105 font-mono text-sm border-2 px-3 py-1 rounded-2xl font-bold"
                        style={{
                          backgroundColor: acceptanceStyle.style.backgroundColor,
                          color: acceptanceStyle.style.color,
                          borderColor: acceptanceStyle.style.borderColor
                        }}
                      >
                        {problem["Acceptance Rate"]}
                      </Badge>
                      <span 
                        className="text-xs font-medium"
                        style={{ color: pandaColors.kokoda }}
                      >
                        {acceptanceStyle.label}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-12 w-12 p-0 transition-all duration-200 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-110"
                      style={{ 
                        backgroundColor: 'rgba(132, 160, 169, 0.1)',
                        color: pandaColors.blackWash
                      }}
                    >
                      <a 
                        href={problem.Link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="Open problem on LeetCode"
                      >
                        <ExternalLink className="h-6 w-6" />
                      </a>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2 max-w-md">
                      {problem.Topics.slice(0, 4).map((topic, topicIndex) => {
                        const topicStyle = getTopicStyle(topicIndex);
                        return (
                          <Badge 
                            key={topic} 
                            variant="outline" 
                            className="text-xs transition-all duration-200 cursor-default transform hover:scale-105 font-medium shadow-sm hover:shadow-md border-2 px-2 py-1 rounded-xl"
                            style={{
                              color: topicStyle.color,
                              backgroundColor: topicStyle.backgroundColor,
                              borderColor: topicStyle.color
                            }}
                          >
                            {topic}
                          </Badge>
                        );
                      })}
                      {problem.Topics.length > 4 && (
                        <Badge 
                          variant="outline" 
                          className="text-xs transition-all duration-200 cursor-help transform hover:scale-105 font-medium shadow-sm border-2 px-2 py-1 rounded-xl"
                          title={problem.Topics.slice(4).join(', ')}
                          style={{
                            backgroundColor: 'rgba(78, 115, 122, 0.1)',
                            color: pandaColors.tornadoSeason,
                            borderColor: pandaColors.tornadoSeason
                          }}
                        >
                          +{problem.Topics.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      {filteredAndSortedProblems.length > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-4 rounded-3xl shadow-lg" 
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: `2px solid ${pandaColors.tornadoSeason}30`
          }}
        >
          {/* Results info */}
          <div className="text-sm font-medium" style={{ color: pandaColors.dyingLight }}>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedProblems.length)} of {filteredAndSortedProblems.length} problems
          </div>
          
          {/* Pagination buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-9 w-9 p-0 rounded-2xl transition-all duration-200 hover:shadow-lg"
              style={{ 
                borderColor: pandaColors.tornadoSeason,
                color: currentPage === 1 ? pandaColors.agreeableGrey : pandaColors.dyingLight,
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                const isActive = pageNum === currentPage;
                
                return (
                  <Button
                    key={pageNum}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="h-9 w-9 p-0 rounded-2xl transition-all duration-200 hover:shadow-lg text-xs font-bold"
                    style={{ 
                      borderColor: pandaColors.tornadoSeason,
                      backgroundColor: isActive 
                        ? pandaColors.tourmaline 
                        : 'rgba(255, 255, 255, 0.9)',
                      color: isActive 
                        ? 'white' 
                        : pandaColors.dyingLight
                    }}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-9 w-9 p-0 rounded-2xl transition-all duration-200 hover:shadow-lg"
              style={{ 
                borderColor: pandaColors.tornadoSeason,
                color: currentPage === totalPages ? pandaColors.agreeableGrey : pandaColors.dyingLight,
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {filteredAndSortedProblems.length === 0 && problems.length > 0 && (
        <div 
          className="flex flex-col items-center justify-center py-20 text-center rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: `2px solid ${pandaColors.kokoda}`
          }}
        >
          <div className="relative mb-8">
            <div 
              className="absolute inset-0 rounded-full blur-xl opacity-30 animate-pulse"
              style={{ backgroundColor: pandaColors.kokoda }}
            ></div>
            <Filter className="relative h-20 w-20" style={{ color: pandaColors.kokoda }} />
          </div>
          <h3 
            className="text-2xl font-bold mb-3"
            style={{ color: pandaColors.dyingLight }}
          >
            No problems match your filters
          </h3>
          <p 
            className="max-w-md mb-8 leading-relaxed"
            style={{ color: pandaColors.dyingLight }}
          >
            Try adjusting your search criteria to find what you&apos;re looking for with peaceful intention
          </p>
          <Button 
            variant="outline" 
            onClick={clearFilters}
            className="transition-all transform hover:scale-105 shadow-lg hover:shadow-xl rounded-2xl px-6 py-3 font-semibold"
            style={{ 
              borderColor: pandaColors.kokoda,
              color: pandaColors.kokoda,
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            <X className="h-5 w-5 mr-2" />
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}