import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  BookOpen, 
  Code, 
  Database, 
  Network, 
  Calculator,
  Layers,
  Globe,
  Cpu,
  Search,
  Clock,
  TrendingUp,
  Star,
  Play,
  CheckCircle,
  Lock,
  Brain,
  FileText,
  Video,
  ChevronRight,
  Award,
  Target,
  DollarSign,
  Users,
  Building,
  LineChart,
  Briefcase,
  Microscope,
  Dna,
  TestTube,
  HeartPulse,
  Pill
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { callGeminiAPI } from '../../utils/gemini-api';
import { toast } from 'sonner';

interface CourseLibraryProps {
  onBack: () => void;
}

interface Course {
  id: string;
  title: string;
  category: string;
  icon: any;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  modules: number;
  enrolled: boolean;
  progress: number;
  rating: number;
  students: string;
  description: string;
  topics: string[];
  color: string;
}

export function CourseLibrary({ onBack }: CourseLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const courses: Course[] = [
    {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      category: 'Programming',
      icon: Layers,
      difficulty: 'Intermediate',
      duration: '12 weeks',
      modules: 48,
      enrolled: true,
      progress: 65,
      rating: 4.8,
      students: '12.5k',
      description: 'Master fundamental and advanced data structures with algorithmic problem-solving techniques.',
      topics: ['Arrays & Linked Lists', 'Trees & Graphs', 'Dynamic Programming', 'Sorting Algorithms', 'Hash Tables', 'Recursion'],
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'python',
      title: 'Python Programming',
      category: 'Programming',
      icon: Code,
      difficulty: 'Beginner',
      duration: '8 weeks',
      modules: 32,
      enrolled: true,
      progress: 85,
      rating: 4.9,
      students: '18.2k',
      description: 'Learn Python from basics to advanced concepts including OOP, file handling, and libraries.',
      topics: ['Python Basics', 'OOP Concepts', 'Data Structures', 'File Handling', 'Libraries & Modules', 'Web Scraping'],
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'engineering-math',
      title: 'Engineering Mathematics',
      category: 'Mathematics',
      icon: Calculator,
      difficulty: 'Intermediate',
      duration: '10 weeks',
      modules: 40,
      enrolled: true,
      progress: 45,
      rating: 4.6,
      students: '9.8k',
      description: 'Comprehensive course covering calculus, linear algebra, differential equations, and more.',
      topics: ['Calculus', 'Linear Algebra', 'Differential Equations', 'Transforms', 'Complex Numbers', 'Probability'],
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'computer-networks',
      title: 'Computer Networks',
      category: 'Networking',
      icon: Network,
      difficulty: 'Intermediate',
      duration: '10 weeks',
      modules: 35,
      enrolled: false,
      progress: 0,
      rating: 4.7,
      students: '11.3k',
      description: 'Deep dive into network protocols, architecture, and security fundamentals.',
      topics: ['OSI Model', 'TCP/IP', 'Network Security', 'Routing & Switching', 'Wireless Networks', 'Network Design'],
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'daa',
      title: 'Design & Analysis of Algorithms',
      category: 'Programming',
      icon: Brain,
      difficulty: 'Advanced',
      duration: '12 weeks',
      modules: 42,
      enrolled: false,
      progress: 0,
      rating: 4.8,
      students: '8.9k',
      description: 'Advanced algorithmic techniques, complexity analysis, and optimization strategies.',
      topics: ['Greedy Algorithms', 'Divide & Conquer', 'Backtracking', 'Graph Algorithms', 'NP-Completeness', 'Approximation'],
      color: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'fullstack',
      title: 'Full Stack Development',
      category: 'Web Development',
      icon: Globe,
      difficulty: 'Advanced',
      duration: '16 weeks',
      modules: 56,
      enrolled: false,
      progress: 0,
      rating: 4.9,
      students: '15.7k',
      description: 'Complete web development bootcamp covering frontend, backend, and deployment.',
      topics: ['React & TypeScript', 'Node.js & Express', 'Databases', 'RESTful APIs', 'Authentication', 'Cloud Deployment'],
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'dbms',
      title: 'Database Management Systems',
      category: 'Database',
      icon: Database,
      difficulty: 'Intermediate',
      duration: '10 weeks',
      modules: 38,
      enrolled: true,
      progress: 30,
      rating: 4.7,
      students: '10.4k',
      description: 'Master relational databases, SQL, normalization, and transaction management.',
      topics: ['SQL Fundamentals', 'Normalization', 'Indexing', 'Transactions', 'NoSQL Basics', 'Query Optimization'],
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'os',
      title: 'Operating Systems',
      category: 'Systems',
      icon: Cpu,
      difficulty: 'Advanced',
      duration: '12 weeks',
      modules: 45,
      enrolled: false,
      progress: 0,
      rating: 4.6,
      students: '9.1k',
      description: 'Comprehensive study of OS concepts including processes, memory, and file systems.',
      topics: ['Process Management', 'Memory Management', 'File Systems', 'Concurrency', 'Deadlocks', 'Scheduling'],
      color: 'from-red-500 to-pink-600'
    },
    {
      id: 'java',
      title: 'Java Programming',
      category: 'Programming',
      icon: Code,
      difficulty: 'Beginner',
      duration: '10 weeks',
      modules: 36,
      enrolled: false,
      progress: 0,
      rating: 4.8,
      students: '14.2k',
      description: 'Learn Java programming from fundamentals to advanced OOP and frameworks.',
      topics: ['Java Basics', 'OOP in Java', 'Collections', 'Multithreading', 'JDBC', 'Spring Framework'],
      color: 'from-rose-500 to-red-600'
    },
    {
      id: 'ml',
      title: 'Machine Learning Fundamentals',
      category: 'AI/ML',
      icon: Brain,
      difficulty: 'Advanced',
      duration: '14 weeks',
      modules: 50,
      enrolled: false,
      progress: 0,
      rating: 4.9,
      students: '16.8k',
      description: 'Introduction to machine learning algorithms, models, and practical applications.',
      topics: ['Supervised Learning', 'Unsupervised Learning', 'Neural Networks', 'Model Evaluation', 'Feature Engineering', 'Deep Learning Basics'],
      color: 'from-violet-500 to-purple-600'
    },
    {
      id: 'cpp',
      title: 'C++ Programming',
      category: 'Programming',
      icon: Code,
      difficulty: 'Intermediate',
      duration: '10 weeks',
      modules: 40,
      enrolled: false,
      progress: 0,
      rating: 4.7,
      students: '11.9k',
      description: 'Master C++ with focus on OOP, STL, and modern C++ features.',
      topics: ['C++ Fundamentals', 'OOP Concepts', 'STL', 'Pointers & Memory', 'Templates', 'Modern C++'],
      color: 'from-sky-500 to-blue-600'
    },
    {
      id: 'web-security',
      title: 'Web Security & Ethical Hacking',
      category: 'Security',
      icon: Network,
      difficulty: 'Advanced',
      duration: '12 weeks',
      modules: 44,
      enrolled: false,
      progress: 0,
      rating: 4.8,
      students: '7.6k',
      description: 'Learn web application security, vulnerabilities, and ethical hacking techniques.',
      topics: ['OWASP Top 10', 'Penetration Testing', 'Cryptography', 'SQL Injection', 'XSS & CSRF', 'Security Best Practices'],
      color: 'from-emerald-500 to-green-600'
    },
    // Business & Management Courses
    {
      id: 'business-strategy',
      title: 'Business Strategy & Management',
      category: 'Business',
      icon: Briefcase,
      difficulty: 'Intermediate',
      duration: '10 weeks',
      modules: 30,
      enrolled: false,
      progress: 0,
      rating: 4.7,
      students: '13.2k',
      description: 'Learn strategic planning, competitive analysis, and business model innovation.',
      topics: ['Strategic Planning', 'SWOT Analysis', 'Porter\'s Five Forces', 'Business Models', 'Competitive Strategy', 'Innovation Management'],
      color: 'from-amber-500 to-yellow-600'
    },
    {
      id: 'digital-marketing',
      title: 'Digital Marketing & Analytics',
      category: 'Marketing',
      icon: TrendingUp,
      difficulty: 'Beginner',
      duration: '8 weeks',
      modules: 28,
      enrolled: false,
      progress: 0,
      rating: 4.8,
      students: '19.5k',
      description: 'Master digital marketing strategies, SEO, social media, and data analytics.',
      topics: ['SEO & SEM', 'Social Media Marketing', 'Content Marketing', 'Email Campaigns', 'Google Analytics', 'Marketing Automation'],
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 'financial-management',
      title: 'Financial Management & Accounting',
      category: 'Business',
      icon: DollarSign,
      difficulty: 'Intermediate',
      duration: '12 weeks',
      modules: 42,
      enrolled: false,
      progress: 0,
      rating: 4.6,
      students: '10.8k',
      description: 'Comprehensive finance course covering accounting, budgeting, and financial analysis.',
      topics: ['Financial Accounting', 'Cost Management', 'Budgeting', 'Financial Ratios', 'Investment Analysis', 'Risk Management'],
      color: 'from-green-600 to-emerald-600'
    },
    {
      id: 'entrepreneurship',
      title: 'Entrepreneurship & Startup Management',
      category: 'Business',
      icon: Briefcase,
      difficulty: 'Advanced',
      duration: '14 weeks',
      modules: 48,
      enrolled: false,
      progress: 0,
      rating: 4.9,
      students: '14.7k',
      description: 'Launch and scale your startup with insights on funding, product development, and growth.',
      topics: ['Business Planning', 'Product-Market Fit', 'Fundraising', 'Scaling Strategies', 'Team Building', 'Exit Strategies'],
      color: 'from-orange-600 to-red-600'
    },
    {
      id: 'supply-chain',
      title: 'Supply Chain & Operations Management',
      category: 'Business',
      icon: Building,
      difficulty: 'Intermediate',
      duration: '10 weeks',
      modules: 35,
      enrolled: false,
      progress: 0,
      rating: 4.5,
      students: '8.9k',
      description: 'Optimize supply chain operations, logistics, and inventory management.',
      topics: ['Logistics Management', 'Inventory Control', 'Procurement', 'Lean Operations', 'Quality Management', 'Six Sigma'],
      color: 'from-teal-500 to-cyan-600'
    },
    {
      id: 'hr-management',
      title: 'Human Resource Management',
      category: 'Business',
      icon: Users,
      difficulty: 'Beginner',
      duration: '8 weeks',
      modules: 26,
      enrolled: false,
      progress: 0,
      rating: 4.6,
      students: '12.3k',
      description: 'Learn talent acquisition, employee development, and organizational behavior.',
      topics: ['Recruitment', 'Performance Management', 'Training & Development', 'Compensation', 'Employee Relations', 'HR Analytics'],
      color: 'from-violet-500 to-purple-600'
    },
    // Biotechnology & Life Sciences Courses
    {
      id: 'molecular-biology',
      title: 'Molecular Biology & Genetics',
      category: 'Biotechnology',
      icon: Dna,
      difficulty: 'Intermediate',
      duration: '14 weeks',
      modules: 50,
      enrolled: false,
      progress: 0,
      rating: 4.8,
      students: '9.2k',
      description: 'Explore DNA structure, gene expression, and genetic engineering techniques.',
      topics: ['DNA & RNA', 'Gene Expression', 'CRISPR Technology', 'Genetic Engineering', 'PCR Techniques', 'Genomics'],
      color: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'biochemistry',
      title: 'Biochemistry Fundamentals',
      category: 'Biotechnology',
      icon: TestTube,
      difficulty: 'Intermediate',
      duration: '12 weeks',
      modules: 44,
      enrolled: false,
      progress: 0,
      rating: 4.7,
      students: '10.1k',
      description: 'Study biomolecules, metabolic pathways, and biochemical processes.',
      topics: ['Proteins & Enzymes', 'Metabolism', 'Cellular Respiration', 'Photosynthesis', 'Signal Transduction', 'Biochemical Analysis'],
      color: 'from-green-500 to-lime-600'
    },
    {
      id: 'bioinformatics',
      title: 'Bioinformatics & Computational Biology',
      category: 'Biotechnology',
      icon: Brain,
      difficulty: 'Advanced',
      duration: '16 weeks',
      modules: 52,
      enrolled: false,
      progress: 0,
      rating: 4.9,
      students: '7.8k',
      description: 'Apply computational methods to analyze biological data and genomic sequences.',
      topics: ['Sequence Analysis', 'Genomic Databases', 'Protein Structure Prediction', 'Phylogenetics', 'Machine Learning in Biology', 'RNA-Seq Analysis'],
      color: 'from-cyan-500 to-teal-600'
    },
    {
      id: 'medical-biotech',
      title: 'Medical Biotechnology',
      category: 'Biotechnology',
      icon: HeartPulse,
      difficulty: 'Advanced',
      duration: '14 weeks',
      modules: 48,
      enrolled: false,
      progress: 0,
      rating: 4.8,
      students: '8.5k',
      description: 'Learn about drug development, gene therapy, and personalized medicine.',
      topics: ['Drug Discovery', 'Gene Therapy', 'Vaccine Development', 'Stem Cell Technology', 'Personalized Medicine', 'Clinical Trials'],
      color: 'from-red-500 to-pink-600'
    },
    {
      id: 'microbiology',
      title: 'Microbiology & Immunology',
      category: 'Biotechnology',
      icon: Microscope,
      difficulty: 'Intermediate',
      duration: '12 weeks',
      modules: 40,
      enrolled: false,
      progress: 0,
      rating: 4.7,
      students: '9.7k',
      description: 'Study microorganisms, immune system function, and infectious diseases.',
      topics: ['Bacteria & Viruses', 'Immune System', 'Infectious Diseases', 'Antibiotics', 'Microbial Genetics', 'Immunotherapy'],
      color: 'from-purple-500 to-violet-600'
    },
    {
      id: 'pharmaceutical',
      title: 'Pharmaceutical Sciences',
      category: 'Biotechnology',
      icon: Pill,
      difficulty: 'Advanced',
      duration: '14 weeks',
      modules: 46,
      enrolled: false,
      progress: 0,
      rating: 4.6,
      students: '6.9k',
      description: 'Explore drug formulation, pharmacology, and pharmaceutical manufacturing.',
      topics: ['Pharmacology', 'Drug Formulation', 'Quality Control', 'Regulatory Affairs', 'Drug Delivery Systems', 'Pharmacokinetics'],
      color: 'from-orange-500 to-amber-600'
    },
    // Additional Specialized Courses
    {
      id: 'data-analytics',
      title: 'Data Analytics & Visualization',
      category: 'Data Science',
      icon: LineChart,
      difficulty: 'Intermediate',
      duration: '10 weeks',
      modules: 38,
      enrolled: false,
      progress: 0,
      rating: 4.8,
      students: '15.4k',
      description: 'Master data analysis, statistical methods, and visualization techniques.',
      topics: ['Statistical Analysis', 'Data Visualization', 'Excel & Tableau', 'SQL for Analytics', 'Predictive Analytics', 'Business Intelligence'],
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'project-management',
      title: 'Project Management Professional',
      category: 'Business',
      icon: Target,
      difficulty: 'Intermediate',
      duration: '10 weeks',
      modules: 34,
      enrolled: false,
      progress: 0,
      rating: 4.7,
      students: '11.6k',
      description: 'Learn project planning, execution, and agile methodologies.',
      topics: ['Project Planning', 'Agile & Scrum', 'Risk Management', 'Stakeholder Management', 'Resource Allocation', 'Project Tools'],
      color: 'from-indigo-500 to-blue-600'
    }
  ];

  const categories = ['all', 'Programming', 'Mathematics', 'Networking', 'Web Development', 'Database', 'Systems', 'AI/ML', 'Security', 'Business', 'Marketing', 'Biotechnology', 'Data Science'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const enrolledCourses = courses.filter(c => c.enrolled);
  const availableCourses = courses.filter(c => !c.enrolled);

  const askAIAboutCourse = async (course: Course) => {
    setIsLoadingAI(true);
    try {
      const prompt = `As an educational advisor, provide a brief overview (3-4 sentences) about why studying "${course.title}" is important for computer science/engineering students. Mention key career benefits and real-world applications.`;
      
      const response = await callGeminiAPI(prompt);
      setAiResponse(response);
      (window as any).todaiSpeak?.(response.slice(0, 200) + '...');
    } catch (error) {
      toast.error('Failed to get AI insights');
    } finally {
      setIsLoadingAI(false);
    }
  };

  useEffect(() => {
    (window as any).todaiSpeak?.('Welcome to the Course Library. Explore comprehensive courses designed for your success.');
  }, []);

  const DifficultyBadge = ({ level }: { level: string }) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-700',
      'Intermediate': 'bg-yellow-100 text-yellow-700',
      'Advanced': 'bg-red-100 text-red-700'
    };
    return <Badge className={colors[level as keyof typeof colors]}>{level}</Badge>;
  };

  const CourseCard = ({ course, onClick }: { course: Course; onClick: () => void }) => {
    const Icon = course.icon;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.02 }}
        onClick={onClick}
        className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-100"
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm text-gray-700">{course.rating}</span>
          </div>
        </div>
        
        <h3 className="text-gray-900 mb-2">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center gap-2 mb-4">
          <DifficultyBadge level={course.difficulty} />
          <Badge variant="outline">{course.category}</Badge>
        </div>

        {course.enrolled && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="text-gray-900">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {course.modules} modules
            </span>
          </div>
          <span className="text-gray-500">{course.students} students</span>
        </div>
      </motion.div>
    );
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
              <h1 className="text-gray-900">Course Library</h1>
              <p className="text-gray-600">Comprehensive courses for all students - Engineering, Business, Biotech & more</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-purple-100 text-purple-700">
              <TrendingUp className="w-4 h-4 mr-1" />
              {enrolledCourses.length} Active
            </Badge>
            <Badge className="bg-blue-100 text-blue-700">
              <Target className="w-4 h-4 mr-1" />
              {availableCourses.length} Available
            </Badge>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search courses by title or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Course Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white p-1 rounded-xl shadow-sm">
            <TabsTrigger value="all" className="rounded-lg">All Courses</TabsTrigger>
            <TabsTrigger value="enrolled" className="rounded-lg">My Courses ({enrolledCourses.length})</TabsTrigger>
            <TabsTrigger value="available" className="rounded-lg">Explore ({availableCourses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => {
                    setSelectedCourse(course);
                    askAIAboutCourse(course);
                  }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="enrolled" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.filter(course => {
                const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    course.description.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
                return matchesSearch && matchesCategory;
              }).map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => {
                    setSelectedCourse(course);
                    askAIAboutCourse(course);
                  }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="available" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.filter(course => {
                const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    course.description.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
                return matchesSearch && matchesCategory;
              }).map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => {
                    setSelectedCourse(course);
                    askAIAboutCourse(course);
                  }}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Course Detail Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCourse(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Header */}
              <div className={`bg-gradient-to-br ${selectedCourse.color} p-8 text-white`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-white mb-2">{selectedCourse.title}</h2>
                    <p className="text-white/90 mb-4">{selectedCourse.description}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 fill-white" />
                        <span>{selectedCourse.rating}</span>
                      </div>
                      <div className="bg-white/20 px-3 py-1 rounded-full">
                        {selectedCourse.students} students
                      </div>
                      <div className="bg-white/20 px-3 py-1 rounded-full">
                        {selectedCourse.difficulty}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl">
                    <Clock className="w-5 h-5 text-blue-600 mb-2" />
                    <div className="text-gray-900">{selectedCourse.duration}</div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-xl">
                    <BookOpen className="w-5 h-5 text-green-600 mb-2" />
                    <div className="text-gray-900">{selectedCourse.modules}</div>
                    <div className="text-sm text-gray-600">Modules</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl">
                    <Award className="w-5 h-5 text-orange-600 mb-2" />
                    <div className="text-gray-900">Certificate</div>
                    <div className="text-sm text-gray-600">On completion</div>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-900">AI Career Insights</span>
                  </div>
                  {isLoadingAI ? (
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent" />
                      <span>Getting insights...</span>
                    </div>
                  ) : aiResponse ? (
                    <p className="text-gray-700 leading-relaxed">{aiResponse}</p>
                  ) : null}
                </div>

                {/* Topics Covered */}
                <div>
                  <h3 className="text-gray-900 mb-3">Topics Covered</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedCourse.topics.map((topic, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-3">
                  {selectedCourse.enrolled ? (
                    <>
                      <Button className={`flex-1 bg-gradient-to-r ${selectedCourse.color} text-white`}>
                        <Play className="w-4 h-4 mr-2" />
                        Continue Learning
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <FileText className="w-4 h-4 mr-2" />
                        View Resources
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className={`flex-1 bg-gradient-to-r ${selectedCourse.color} text-white`}>
                        Enroll Now
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Add to Wishlist
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}