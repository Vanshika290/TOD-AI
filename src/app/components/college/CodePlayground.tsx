import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Play, 
  Code, 
  Save, 
  Share2, 
  Download,
  Terminal,
  FileCode,
  Settings,
  Sparkles,
  Copy,
  Check,
  Lightbulb,
  Bug,
  Zap
} from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { callGeminiAPI } from '../../utils/gemini-api';

interface CodePlaygroundProps {
  onBack: () => void;
}

interface CodeTemplate {
  name: string;
  language: string;
  code: string;
  description: string;
}

export function CodePlayground({ onBack }: CodePlaygroundProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const templates: Record<string, CodeTemplate[]> = {
    python: [
      {
        name: 'Hello World',
        language: 'python',
        code: `# Python Hello World
print("Hello, World!")

# Variable example
name = "Tod AI"
print(f"Welcome to {name}")`,
        description: 'Basic Python program'
      },
      {
        name: 'Binary Search',
        language: 'python',
        code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Test
arr = [1, 3, 5, 7, 9, 11, 13, 15]
target = 7
result = binary_search(arr, target)
print(f"Element found at index: {result}")`,
        description: 'Binary Search Algorithm'
      },
      {
        name: 'Fibonacci Series',
        language: 'python',
        code: `def fibonacci(n):
    if n <= 1:
        return n
    
    fib = [0, 1]
    for i in range(2, n + 1):
        fib.append(fib[i-1] + fib[i-2])
    
    return fib

# Generate first 10 Fibonacci numbers
n = 10
result = fibonacci(n)
print(f"First {n} Fibonacci numbers:")
print(result)`,
        description: 'Fibonacci sequence generator'
      }
    ],
    javascript: [
      {
        name: 'Hello World',
        language: 'javascript',
        code: `// JavaScript Hello World
console.log("Hello, World!");

// Variable example
const name = "Tod AI";
console.log(\`Welcome to \${name}\`);`,
        description: 'Basic JavaScript program'
      },
      {
        name: 'Array Methods',
        language: 'javascript',
        code: `// Array manipulation
const numbers = [1, 2, 3, 4, 5];

// Map: double each number
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

// Filter: get even numbers
const evens = numbers.filter(n => n % 2 === 0);
console.log("Evens:", evens);

// Reduce: sum all numbers
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log("Sum:", sum);`,
        description: 'Array manipulation methods'
      }
    ],
    java: [
      {
        name: 'Hello World',
        language: 'java',
        code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        String name = "Tod AI";
        System.out.println("Welcome to " + name);
    }
}`,
        description: 'Basic Java program'
      },
      {
        name: 'Linked List',
        language: 'java',
        code: `class Node {
    int data;
    Node next;
    
    Node(int data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    Node head;
    
    void insert(int data) {
        Node newNode = new Node(data);
        if (head == null) {
            head = newNode;
        } else {
            Node current = head;
            while (current.next != null) {
                current = current.next;
            }
            current.next = newNode;
        }
    }
    
    void display() {
        Node current = head;
        while (current != null) {
            System.out.print(current.data + " -> ");
            current = current.next;
        }
        System.out.println("null");
    }
}

public class Main {
    public static void main(String[] args) {
        LinkedList list = new LinkedList();
        list.insert(1);
        list.insert(2);
        list.insert(3);
        list.display();
    }
}`,
        description: 'Linked List implementation'
      }
    ],
    cpp: [
      {
        name: 'Hello World',
        language: 'cpp',
        code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    
    string name = "Tod AI";
    cout << "Welcome to " << name << endl;
    
    return 0;
}`,
        description: 'Basic C++ program'
      },
      {
        name: 'Sorting Algorithm',
        language: 'cpp',
        code: `#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}

int main() {
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    
    cout << "Original array: ";
    for (int num : arr) cout << num << " ";
    cout << endl;
    
    bubbleSort(arr);
    
    cout << "Sorted array: ";
    for (int num : arr) cout << num << " ";
    cout << endl;
    
    return 0;
}`,
        description: 'Bubble Sort implementation'
      }
    ]
  };

  useEffect(() => {
    // Load default template
    if (templates[selectedLanguage] && templates[selectedLanguage].length > 0) {
      setCode(templates[selectedLanguage][0].code);
    }
    (window as any).todaiSpeak?.('Welcome to Code Playground. Write, run, and debug your code with AI assistance.');
  }, []);

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    if (templates[lang] && templates[lang].length > 0) {
      setCode(templates[lang][0].code);
      setOutput('');
    }
  };

  const loadTemplate = (template: CodeTemplate) => {
    setCode(template.code);
    setOutput('');
    toast.success(`Loaded: ${template.name}`);
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    
    // Simulate code execution (in a real app, this would use a code execution API)
    setTimeout(() => {
      setOutput(`✓ Code executed successfully!\n\n--- Output ---\n[Simulated output for demonstration]\n${selectedLanguage === 'python' ? 'Hello, World!\nWelcome to Tod AI' : 'Hello, World!'}\n\n--- Execution Time ---\n0.05s\n\n💡 Tip: In production, integrate with a code execution service like Judge0 or similar.`);
      setIsRunning(false);
      toast.success('Code executed successfully');
    }, 1500);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getAIHelp = async (type: 'explain' | 'optimize' | 'debug') => {
    setIsLoadingAI(true);
    try {
      let prompt = '';
      switch (type) {
        case 'explain':
          prompt = `Explain this ${selectedLanguage} code in simple terms:\n\n${code}`;
          break;
        case 'optimize':
          prompt = `Suggest optimizations for this ${selectedLanguage} code:\n\n${code}`;
          break;
        case 'debug':
          prompt = `Check this ${selectedLanguage} code for potential bugs and suggest fixes:\n\n${code}`;
          break;
      }
      
      const response = await callGeminiAPI(prompt);
      setAiSuggestion(response);
      (window as any).todaiSpeak?.('AI suggestion ready. Check the suggestions panel.');
    } catch (error) {
      toast.error('Failed to get AI help');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'python' ? 'py' : selectedLanguage === 'java' ? 'java' : 'js'}`;
    a.click();
    toast.success('Code saved successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-white">Code Playground</h1>
              <p className="text-gray-400">Write, run, and debug code with AI assistance</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Python
                  </div>
                </SelectItem>
                <SelectItem value="javascript">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    JavaScript
                  </div>
                </SelectItem>
                <SelectItem value="java">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Java
                  </div>
                </SelectItem>
                <SelectItem value="cpp">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    C++
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Code Editor - Left Side */}
          <div className="lg:col-span-2 space-y-4">
            {/* Toolbar */}
            <div className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  onClick={runCode}
                  disabled={isRunning}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  {isRunning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Code
                    </>
                  )}
                </Button>
                
                <Button variant="ghost" onClick={copyCode} className="text-white hover:bg-white/10">
                  {isCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {isCopied ? 'Copied!' : 'Copy'}
                </Button>
                
                <Button variant="ghost" onClick={saveCode} className="text-white hover:bg-white/10">
                  <Download className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => getAIHelp('explain')}
                  className="text-blue-400 hover:bg-blue-500/10"
                  disabled={isLoadingAI}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Explain
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => getAIHelp('optimize')}
                  className="text-purple-400 hover:bg-purple-500/10"
                  disabled={isLoadingAI}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Optimize
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => getAIHelp('debug')}
                  className="text-orange-400 hover:bg-orange-500/10"
                  disabled={isLoadingAI}
                >
                  <Bug className="w-4 h-4 mr-2" />
                  Debug
                </Button>
              </div>
            </div>

            {/* Code Editor */}
            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
              <div className="bg-gray-900 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm text-gray-400 ml-2">
                  main.{selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'python' ? 'py' : selectedLanguage === 'java' ? 'java' : 'js'}
                </span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-[500px] bg-gray-800 text-gray-100 p-6 font-mono text-sm resize-none focus:outline-none"
                style={{ fontFamily: 'Monaco, Consolas, monospace' }}
                spellCheck={false}
              />
            </div>

            {/* Output Terminal */}
            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
              <div className="bg-gray-900 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">Output</span>
              </div>
              <div className="p-6 h-48 overflow-y-auto">
                <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                  {output || '// Run your code to see the output here...'}
                </pre>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Code Templates */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <FileCode className="w-5 h-5 text-purple-400" />
                <h3 className="text-white">Code Templates</h3>
              </div>
              <div className="space-y-2">
                {templates[selectedLanguage]?.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => loadTemplate(template)}
                    className="w-full text-left p-3 rounded-lg bg-gray-900 hover:bg-gray-700 transition-colors border border-gray-700"
                  >
                    <div className="text-white text-sm mb-1">{template.name}</div>
                    <div className="text-xs text-gray-400">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Suggestions */}
            {(isLoadingAI || aiSuggestion) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl p-5 border border-purple-500/30"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="text-white">AI Suggestions</h3>
                </div>
                {isLoadingAI ? (
                  <div className="flex items-center gap-2 text-gray-300">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-400 border-t-transparent" />
                    <span className="text-sm">Analyzing code...</span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {aiSuggestion}
                  </div>
                )}
              </motion.div>
            )}

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-5 border border-blue-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-blue-400" />
                <h3 className="text-white">Quick Tips</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <p>• Click "Explain" for code explanations</p>
                <p>• Use "Optimize" for performance tips</p>
                <p>• Try "Debug" to find potential issues</p>
                <p>• Save your code for later reference</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
