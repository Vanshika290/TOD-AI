import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Video,
  Headphones,
  Download,
  Star,
  Search,
  Filter,
  Clock,
  TrendingUp,
  Bookmark,
  Share2,
  Eye,
  ThumbsUp,
  Link as LinkIcon,
  Code,
  Calculator,
  Database,
  Network,
  Brain,
  Award,
  Globe
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner@2.0.3';
import { callGeminiAPI } from '../../utils/gemini-api';

interface StudyResourcesProps {
  onBack: () => void;
}

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'article' | 'podcast' | 'interactive';
  subject: string;
  description: string;
  author: string;
  duration?: string;
  pages?: number;
  rating: number;
  downloads: string;
  thumbnail: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isFavorite: boolean;
}

export function StudyResources({ onBack }: StudyResourcesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<string>('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Complete DSA Study Guide',
      type: 'pdf',
      subject: 'Data Structures',
      description: 'Comprehensive guide covering all major data structures with examples and practice problems.',
      author: 'Dr. Smith',
      pages: 350,
      rating: 4.9,
      downloads: '15.2k',
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
      tags: ['DSA', 'Algorithms', 'Interview Prep'],
      difficulty: 'Intermediate',
      isFavorite: false
    },
    {
      id: '2',
      title: 'Advanced Python Programming',
      type: 'video',
      subject: 'Programming',
      description: 'Video series covering advanced Python concepts including decorators, generators, and metaclasses.',
      author: 'Tech Academy',
      duration: '8 hours',
      rating: 4.8,
      downloads: '22.5k',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
      tags: ['Python', 'Advanced', 'OOP'],
      difficulty: 'Advanced',
      isFavorite: false
    },
    {
      id: '3',
      title: 'Database Design Principles',
      type: 'article',
      subject: 'Database',
      description: 'Learn database normalization, indexing strategies, and query optimization techniques.',
      author: 'DB Experts',
      duration: '45 min read',
      rating: 4.7,
      downloads: '9.8k',
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400',
      tags: ['SQL', 'Database', 'Optimization'],
      difficulty: 'Intermediate',
      isFavorite: false
    },
    {
      id: '4',
      title: 'Computer Networks Fundamentals',
      type: 'pdf',
      subject: 'Networking',
      description: 'Essential networking concepts including TCP/IP, OSI model, and network protocols.',
      author: 'Prof. Johnson',
      pages: 280,
      rating: 4.6,
      downloads: '11.3k',
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
      tags: ['Networks', 'TCP/IP', 'Protocols'],
      difficulty: 'Beginner',
      isFavorite: false
    },
    {
      id: '5',
      title: 'Machine Learning Crash Course',
      type: 'video',
      subject: 'AI/ML',
      description: 'Hands-on introduction to machine learning algorithms and practical applications.',
      author: 'AI Institute',
      duration: '12 hours',
      rating: 4.9,
      downloads: '28.7k',
      thumbnail: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400',
      tags: ['ML', 'AI', 'Neural Networks'],
      difficulty: 'Advanced',
      isFavorite: false
    },
    {
      id: '6',
      title: 'Engineering Mathematics Podcast',
      type: 'podcast',
      subject: 'Mathematics',
      description: 'Audio series explaining complex mathematical concepts in an easy-to-understand manner.',
      author: 'Math Simplified',
      duration: '6 hours',
      rating: 4.5,
      downloads: '7.2k',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
      tags: ['Calculus', 'Linear Algebra', 'Math'],
      difficulty: 'Intermediate',
      isFavorite: false
    },
    {
      id: '7',
      title: 'Interactive Web Development Tutorial',
      type: 'interactive',
      subject: 'Web Development',
      description: 'Learn full-stack development with hands-on coding exercises and projects.',
      author: 'Web Masters',
      duration: '20 hours',
      rating: 4.8,
      downloads: '19.4k',
      thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400',
      tags: ['React', 'Node.js', 'Full Stack'],
      difficulty: 'Intermediate',
      isFavorite: false
    },
    {
      id: '8',
      title: 'Algorithm Design Patterns',
      type: 'pdf',
      subject: 'Algorithms',
      description: 'Study guide for common algorithm design patterns used in competitive programming.',
      author: 'Code Champions',
      pages: 420,
      rating: 4.9,
      downloads: '16.8k',
      thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400',
      tags: ['Algorithms', 'Competitive Programming', 'Patterns'],
      difficulty: 'Advanced',
      isFavorite: false
    },
    {
      id: '9',
      title: 'Operating Systems Explained',
      type: 'video',
      subject: 'Operating Systems',
      description: 'Visual explanation of OS concepts including processes, threads, and memory management.',
      author: 'System Architects',
      duration: '10 hours',
      rating: 4.7,
      downloads: '13.5k',
      thumbnail: 'https://images.unsplash.com/photo-1629654291663-b91ad427698f?w=400',
      tags: ['OS', 'Processes', 'Memory'],
      difficulty: 'Intermediate',
      isFavorite: false
    },
    {
      id: '10',
      title: 'System Design Interview Prep',
      type: 'article',
      subject: 'System Design',
      description: 'Complete guide to acing system design interviews with real-world examples.',
      author: 'Interview Experts',
      duration: '60 min read',
      rating: 4.9,
      downloads: '21.3k',
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
      tags: ['System Design', 'Interview', 'Scalability'],
      difficulty: 'Advanced',
      isFavorite: false
    }
  ];

  const subjects = ['all', 'Data Structures', 'Programming', 'Database', 'Networking', 'AI/ML', 'Mathematics', 'Web Development', 'Algorithms', 'Operating Systems', 'System Design'];
  const resourceTypes = ['all', 'pdf', 'video', 'article', 'podcast', 'interactive'];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
    return matchesSearch && matchesType && matchesSubject;
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
    toast.success(favorites.includes(id) ? 'Removed from favorites' : 'Added to favorites');
  };

  const getAIRecommendations = async () => {
    setIsLoadingAI(true);
    try {
      const prompt = 'As a study advisor for engineering students, suggest 5 key study resources or topics that computer science students should focus on to excel in their careers. Keep it concise and actionable.';
      const response = await callGeminiAPI(prompt);
      setAiRecommendations(response);
      (window as any).todaiSpeak?.('AI recommendations are ready. Check the recommendations panel.');
    } catch (error) {
      toast.error('Failed to get AI recommendations');
    } finally {
      setIsLoadingAI(false);
    }
  };

  useEffect(() => {
    (window as any).todaiSpeak?.('Welcome to Study Resources. Access premium learning materials curated for your success.');
    getAIRecommendations();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'video': return Video;
      case 'article': return BookOpen;
      case 'podcast': return Headphones;
      case 'interactive': return Code;
      default: return FileText;
    }
  };

  const getSubjectIcon = (subject: string) => {
    if (subject.includes('Data Structures') || subject.includes('Algorithms')) return Brain;
    if (subject.includes('Programming') || subject.includes('Web')) return Code;
    if (subject.includes('Database')) return Database;
    if (subject.includes('Network')) return Network;
    if (subject.includes('Math')) return Calculator;
    if (subject.includes('AI/ML')) return Brain;
    return BookOpen;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-gray-900">Study Resources Hub</h1>
              <p className="text-gray-600">Premium learning materials for engineering students</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-purple-100 text-purple-700">
              <TrendingUp className="w-4 h-4 mr-1" />
              {filteredResources.length} Resources
            </Badge>
            <Badge className="bg-blue-100 text-blue-700">
              <Bookmark className="w-4 h-4 mr-1" />
              {favorites.length} Saved
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search resources by title, topic, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {resourceTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedType === type
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type !== 'all' && (() => {
                  const Icon = getTypeIcon(type);
                  return <Icon className="w-4 h-4" />;
                })()}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {subjects.slice(0, 8).map(subject => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  selectedSubject === subject
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {subject.charAt(0).toUpperCase() + subject.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Resources Grid */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="bg-white p-1 rounded-xl shadow-sm">
                <TabsTrigger value="all">All Resources</TabsTrigger>
                <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredResources.map((resource, index) => {
                    const TypeIcon = getTypeIcon(resource.type);
                    const SubjectIcon = getSubjectIcon(resource.subject);
                    
                    return (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
                      >
                        {/* Thumbnail */}
                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100">
                          <img
                            src={resource.thumbnail}
                            alt={resource.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3 flex gap-2">
                            <button
                              onClick={() => toggleFavorite(resource.id)}
                              className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                                favorites.includes(resource.id)
                                  ? 'bg-red-500 text-white'
                                  : 'bg-white/80 text-gray-700 hover:bg-white'
                              }`}
                            >
                              <Bookmark className={`w-4 h-4 ${favorites.includes(resource.id) ? 'fill-white' : ''}`} />
                            </button>
                          </div>
                          <div className="absolute bottom-3 left-3">
                            <Badge className="bg-white/90 text-gray-900">
                              <TypeIcon className="w-3 h-3 mr-1" />
                              {resource.type.toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-gray-900 flex-1 line-clamp-1">{resource.title}</h3>
                            <div className="flex items-center gap-1 ml-2">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm text-gray-700">{resource.rating}</span>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{resource.description}</p>

                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="text-xs">{resource.difficulty}</Badge>
                            <Badge variant="outline" className="text-xs">
                              <SubjectIcon className="w-3 h-3 mr-1" />
                              {resource.subject}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {resource.duration || `${resource.pages} pages`}
                            </span>
                            <span className="flex items-center gap-1">
                              <Download className="w-4 h-4" />
                              {resource.downloads}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            <Button variant="outline" size="icon">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="favorites">
                <div className="grid md:grid-cols-2 gap-6">
                  {favorites.length === 0 ? (
                    <div className="col-span-2 text-center py-12">
                      <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No favorites yet. Start bookmarking resources!</p>
                    </div>
                  ) : (
                    resources.filter(r => favorites.includes(r.id)).map((resource, index) => {
                      const TypeIcon = getTypeIcon(resource.type);
                      return (
                        <motion.div
                          key={resource.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all"
                        >
                          <h3 className="text-gray-900 mb-2">{resource.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                          <Button variant="outline" className="w-full">
                            <TypeIcon className="w-4 h-4 mr-2" />
                            Open Resource
                          </Button>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </TabsContent>

              <TabsContent value="recent">
                <div className="bg-white rounded-2xl p-8 text-center">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Your recently viewed resources will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Recommendations */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-5 border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-purple-600" />
                <h3 className="text-gray-900">AI Recommendations</h3>
              </div>
              {isLoadingAI ? (
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent" />
                  <span className="text-sm">Loading...</span>
                </div>
              ) : aiRecommendations ? (
                <p className="text-sm text-gray-700 leading-relaxed">{aiRecommendations}</p>
              ) : null}
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-gray-900 mb-3">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['DSA', 'Python', 'Java', 'SQL', 'React', 'Machine Learning', 'Algorithms', 'System Design'].map(tag => (
                  <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-gray-100">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-blue-600" />
                <h3 className="text-gray-900">Quick Links</h3>
              </div>
              <div className="space-y-2">
                {['GitHub Student Pack', 'LeetCode', 'HackerRank', 'GeeksforGeeks'].map(link => (
                  <button key={link} className="w-full text-left p-2 rounded-lg hover:bg-white transition-colors flex items-center gap-2 text-sm text-gray-700">
                    <LinkIcon className="w-4 h-4" />
                    {link}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
