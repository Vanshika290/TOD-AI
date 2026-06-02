# 📋 Daily Goals & Study Planner - Feature Documentation

## Overview

The Daily Goals feature is a comprehensive study planning tool integrated into Tod AI that allows students to organize their learning activities, track progress, and stay focused on their academic objectives.

## 🌟 Key Features

### 1. **Add Custom Goals**
Students can manually add study goals with:
- **Subject**: The subject or area of study (e.g., Math, Science, Programming)
- **Topic**: Specific topic to learn (e.g., Fractions, Photosynthesis, Binary Trees)
- **Priority**: Low, Medium, or High priority levels
- **Estimated Time**: Time needed to complete (in minutes)

### 2. **AI-Powered Goal Suggestions**
- Click "AI Suggest" button to get intelligent study goal recommendations
- AI generates 3-4 personalized goals based on:
  - Student type (school vs college)
  - Student name for personalization
  - Diverse subject coverage
  - Appropriate difficulty level

### 3. **Progress Tracking**
- Visual progress bar showing completion percentage
- Real-time updates as goals are checked off
- Completion celebration when all goals are done
- Statistics showing total goals, completed count, and total time

### 4. **Goal Management**
- ✅ Mark goals as complete/incomplete
- ✏️ Edit goal details inline
- 🗑️ Delete goals
- Priority color coding:
  - 🟦 Low: Blue
  - 🟨 Medium: Yellow
  - 🟥 High: Red

### 5. **Daily Reset**
- Goals are stored per day
- Each day starts fresh with a clean slate
- Previous days' goals are automatically archived
- Encourages daily planning habits

## 🎨 Design Variations

### School Student Version
- **Colorful UI**: Purple, pink, orange gradients
- **Fun Language**: "Today's Learning Goals! 🎯"
- **Emoji-Rich**: Lots of emojis for engagement
- **Simple Labels**: "What to Learn?", "How Important?"
- **Encouraging Messages**: "Awesome! You completed all your goals today!"

### College Student Version
- **Professional UI**: Blue, purple gradients on white
- **Formal Language**: "Daily Study Goals"
- **Minimalist Design**: Clean and focused
- **Academic Labels**: "Subject", "Topic", "Priority"
- **Professional Tone**: "Excellent work! All goals completed!"

## 📍 Location

The Daily Goals component appears in:
- **School Dashboard**: Right sidebar, between Badges and Next Challenge
- **College Dashboard**: Right sidebar, at the top

## 💾 Data Storage

- **Local Storage**: Goals saved in browser's localStorage
- **Key Format**: `todai_goals_YYYY-MM-DD`
- **Automatic**: Saves on every change
- **Privacy**: All data stays on user's device

## 🤖 AI Integration

### AI Goal Generation

**For School Students:**
```
Prompt: "Suggest 3-4 fun and engaging study topics for a [student name] in grades K-8. 
Include different subjects like math, science, reading, and creative activities."
```

**For College Students:**
```
Prompt: "Suggest 3-4 productive study goals for a college student named [student name]. 
Include diverse subjects and topics that promote deep learning."
```

### Response Format
The AI returns goals in format: `Subject | Topic | Time (minutes)`

Example responses:
- School: `Math | Practice addition with fun games | 30`
- College: `Data Structures | Study binary search trees implementation | 45`

## 📊 Statistics Display

Bottom stats panel shows:
1. **Total Goals**: Number of goals for the day
2. **Completed**: Number checked off
3. **Total Minutes**: Sum of all estimated times

## 🎯 User Flow

### Adding a Goal

1. Click "Add Goal" button
2. Form slides down with 4 fields:
   - Subject (text input)
   - Topic (text input)
   - Priority (dropdown: low/medium/high)
   - Estimated Time (number input, defaults to 30 mins)
3. Click "Add Goal" to save
4. Goal appears in the list
5. Form closes automatically

### Using AI Suggestions

1. Click "AI Suggest" button
2. System checks for API key
3. Shows loading spinner
4. AI generates 3-4 goals
5. Goals automatically added to list
6. First goal gets high priority, rest medium

### Completing Goals

1. Click the circle icon next to a goal
2. Icon changes to checkmark (✓)
3. Goal text gets strikethrough
4. Background changes to green/gray tint
5. Progress bar updates
6. If all done, celebration message appears

### Editing Goals

1. Click edit (pencil) icon
2. Text fields appear inline
3. Edit subject and topic
4. Click anywhere to save
5. Changes persist immediately

### Deleting Goals

1. Click trash icon
2. Goal removed instantly
3. Progress bar updates
4. Stats recalculate

## 🎨 Visual Elements

### Priority Badges
```
Low:    Blue badge with "low" text
Medium: Yellow badge with "medium" text  
High:   Red badge with "high" text
```

### Icons Used
- 🎯 Target: Main goals icon
- ✨ Sparkles: AI suggest button
- ➕ Plus: Add goal button
- ⏰ Clock: Time indicator
- ✅ Check: Completed indicator
- ⭕ Circle: Incomplete indicator
- ✏️ Edit: Edit button
- 🗑️ Trash: Delete button
- 🏆 Award: Completion celebration

## 💡 Example Use Cases

### School Student
```
Subject: Math 🔢
Topic: Practice multiplication tables
Priority: High 🟥
Time: 20 minutes

Subject: Reading 📚
Topic: Finish chapter 3 of my book
Priority: Medium 🟨
Time: 30 minutes

Subject: Science 🔬  
Topic: Learn about the solar system
Priority: Low 🟦
Time: 25 minutes
```

### College Student
```
Subject: Algorithms
Topic: Implement quicksort algorithm
Priority: High
Time: 60 minutes

Subject: Database Systems
Topic: Study SQL join operations
Priority: High
Time: 45 minutes

Subject: Operating Systems
Topic: Review process synchronization
Priority: Medium
Time: 40 minutes
```

## 🔄 State Management

### Goal Object Structure
```typescript
interface Goal {
  id: string;              // Unique ID (timestamp-based)
  subject: string;         // Subject name
  topic: string;           // Topic description
  completed: boolean;      // Completion status
  priority: 'low' | 'medium' | 'high';  // Priority level
  estimatedTime: string;   // Time in minutes
  createdAt: Date;         // Creation timestamp
}
```

### Component Props
```typescript
interface DailyGoalsProps {
  studentType: 'school' | 'college';  // Determines UI style
  userName: string;                    // For personalization
}
```

## 🚀 Performance

- **Lightweight**: Minimal re-renders
- **Fast Loading**: Instant localStorage access
- **Smooth Animations**: Motion/Framer Motion for fluid UX
- **Responsive**: Works on all screen sizes

## ♿ Accessibility

- Keyboard navigation supported
- Clear button labels
- High contrast colors
- Screen reader friendly
- Focus indicators

## 🔮 Future Enhancements

Potential improvements:
- [ ] Multi-day goal planning (weekly/monthly view)
- [ ] Goal templates for common subjects
- [ ] Study session timer integration
- [ ] Pomodoro technique integration
- [ ] Goal sharing with parents/teachers
- [ ] Achievement badges for streaks
- [ ] Calendar view of goals
- [ ] Export goals to PDF
- [ ] Goal categories/tags
- [ ] Reminder notifications
- [ ] Study time analytics
- [ ] Goal difficulty adjustment based on completion time

## 📱 Responsive Design

- **Desktop**: Full-width component with all features
- **Tablet**: Adjusted grid layout
- **Mobile**: Stacked layout, optimized for touch

## 🎓 Educational Benefits

1. **Planning Skills**: Teaches daily organization
2. **Time Management**: Estimates and tracks time
3. **Prioritization**: Learns to identify important tasks
4. **Goal Setting**: Practices SMART goal principles
5. **Self-Monitoring**: Tracks own progress
6. **Accountability**: Visual reminder of commitments
7. **Motivation**: Completion rewards and celebrations

## 🔐 Privacy & Data

- **Local Only**: No server uploads
- **User Control**: Can delete anytime
- **Daily Reset**: Fresh start each day
- **No Tracking**: No analytics or monitoring

## 💻 Technical Details

### Dependencies
- React (hooks: useState, useEffect)
- Motion/Framer Motion (animations)
- Lucide React (icons)
- Gemini AI API (goal suggestions)

### File Location
`/components/DailyGoals.tsx`

### Integration Points
- `/components/school/SchoolDashboard.tsx`
- `/components/college/CollegeDashboard.tsx`

### localStorage Keys
- `todai_goals_[DATE]` - Daily goals
- `gemini_api_key` - API key for AI features

## 📝 Code Example

```tsx
// Using in a dashboard
import { DailyGoals } from './components/DailyGoals';

function Dashboard() {
  return (
    <div>
      <DailyGoals 
        studentType="school"  // or "college"
        userName="Alex"        // Student's name
      />
    </div>
  );
}
```

## 🎯 Success Metrics

The feature is successful when students:
1. ✅ Add goals daily
2. ✅ Complete 70%+ of goals
3. ✅ Use AI suggestions regularly
4. ✅ Return to check progress
5. ✅ Feel organized and motivated

## 🆘 Troubleshooting

### Goals Not Saving
- Check browser localStorage is enabled
- Try clearing browser cache
- Refresh the page

### AI Suggestions Not Working
- Verify API key is set up
- Check internet connection
- Ensure Gemini API is enabled

### Goals Disappeared
- Check if viewing correct date
- Goals reset daily automatically
- Check browser localStorage quota

---

**Happy Planning with Tod AI! 📚🎯**

The Daily Goals feature helps students stay organized, focused, and motivated on their learning journey!
