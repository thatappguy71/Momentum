'use client';

import { useState, useEffect } from 'react';

interface Habit {
  id: string;
  name: string;
  category: 'wellness' | 'support' | 'mindfulness' | 'physical' | 'custom';
  streak: number;
  lastCompleted: string | null;
  completedToday: boolean;
  isCustom?: boolean;
  reminderTime?: string;
}

interface Milestone {
  days: number;
  title: string;
  description: string;
  achieved: boolean;
}

interface MoodEntry {
  date: string;
  mood: number;
  energy: number;
  sleep: number;
  note?: string;
  triggers?: string[];
}

interface EmergencyContact {
  name: string;
  phone: string;
  description: string;
  url?: string;
}

interface RegionSupport {
  crisis: EmergencyContact;
  addiction: EmergencyContact;
}

interface SponsorContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface Meeting {
  id: string;
  name: string;
  location: string;
  time: string;
  day: string;
  type: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  category: string;
}

interface GratitudeEntry {
  id: string;
  date: string;
  text: string;
}

export default function RecoveryTracker() {
  const [currentTab, setCurrentTab] = useState<'home' | 'habits' | 'mood' | 'support' | 'tools'>('home');
  const [darkMode, setDarkMode] = useState(false);
  
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Morning Meditation', category: 'mindfulness', streak: 0, lastCompleted: null, completedToday: false, isCustom: false, reminderTime: '08:00' },
    { id: '2', name: 'Attend Support Meeting', category: 'support', streak: 0, lastCompleted: null, completedToday: false, isCustom: false, reminderTime: '19:00' },
    { id: '3', name: 'Exercise/Walk', category: 'physical', streak: 0, lastCompleted: null, completedToday: false, isCustom: false, reminderTime: '17:00' },
    { id: '4', name: 'Journal Writing', category: 'wellness', streak: 0, lastCompleted: null, completedToday: false, isCustom: false, reminderTime: '21:00' },
    { id: '5', name: 'Call Sponsor/Friend', category: 'support', streak: 0, lastCompleted: null, completedToday: false, isCustom: false, reminderTime: '12:00' },
    { id: '6', name: 'Gratitude Practice', category: 'mindfulness', streak: 0, lastCompleted: null, completedToday: false, isCustom: false, reminderTime: '22:00' },
  ]);

  const [sobrietyDate, setSobrietyDate] = useState<string>('2024-01-01');
  const [daysSober, setDaysSober] = useState<number | null>(null);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [todaysMood, setTodaysMood] = useState<number | null>(null);
  const [todaysEnergy, setTodaysEnergy] = useState<number | null>(null);
  const [todaysSleep, setTodaysSleep] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState<string>('');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  
  const [showAddHabit, setShowAddHabit] = useState<boolean>(false);
  const [newHabitName, setNewHabitName] = useState<string>('');
  const [newHabitCategory, setNewHabitCategory] = useState<'wellness' | 'support' | 'mindfulness' | 'physical' | 'custom'>('custom');
  const [newHabitTime, setNewHabitTime] = useState<string>('09:00');
  
  const [userRegion, setUserRegion] = useState<string>('US');
  const [sponsorContacts, setSponsorContacts] = useState<SponsorContact[]>([
    { id: '1', name: 'John (Sponsor)', phone: '+1-555-0123', relationship: 'Sponsor' },
    { id: '2', name: 'Sarah (Accountability)', phone: '+1-555-0456', relationship: 'Accountability Partner' }
  ]);
  
  const [meetings, setMeetings] = useState<Meeting[]>([
    { id: '1', name: 'Morning AA', location: 'Community Center', time: '08:00', day: 'Monday', type: 'AA' },
    { id: '2', name: 'Evening NA', location: 'Church Hall', time: '19:00', day: 'Wednesday', type: 'NA' }
  ]);
  
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: '30 Days Sober', description: 'Reach 30 consecutive days', targetDate: '2024-02-01', completed: false, category: 'Recovery' },
    { id: '2', title: 'Complete Step 4', description: 'Finish moral inventory', targetDate: '2024-03-01', completed: false, category: 'Program Work' }
  ]);
  
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([]);
  const [newGratitude, setNewGratitude] = useState<string>('');
  
  const [meditationTime, setMeditationTime] = useState<number>(5);
  const [meditationActive, setMeditationActive] = useState<boolean>(false);
  const [meditationTimer, setMeditationTimer] = useState<number>(0);
  
  const [breathingActive, setBreathingActive] = useState<boolean>(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState<number>(4);

  const commonTriggers = ['Stress', 'Loneliness', 'Anger', 'Boredom', 'Social Pressure', 'Work', 'Relationships', 'Money', 'Health', 'Other'];
  
  const copingStrategies = [
    'Call your sponsor',
    'Attend a meeting',
    'Practice deep breathing',
    'Go for a walk',
    'Write in journal',
    'Listen to music',
    'Take a shower',
    'Call a friend',
    'Read recovery literature',
    'Practice gratitude'
  ];

  const dailyReadings = [
    "Recovery is not a race. You don't have to feel guilty if it takes you longer than you thought it would.",
    "One day at a time. This moment is all we have, and it's enough.",
    "Progress, not perfection. Every step forward matters.",
    "You are stronger than your addiction. You have already proven this by seeking recovery.",
    "Healing is not linear. There will be good days and challenging days, and both are part of the journey.",
    "Your past does not define your future. Today is a new opportunity to grow.",
    "Recovery is about discovering who you are without substances, and that person is worth fighting for."
  ];

  const affirmations = [
    "I am worthy of love and recovery",
    "I choose healing over hurting",
    "I am stronger than my cravings",
    "I deserve a life of peace and joy",
    "I am grateful for my progress",
    "I trust in my ability to overcome",
    "I am building a better future"
  ];

  const regions: Record<string, RegionSupport> = {
    US: {
      crisis: { name: '988 Lifeline', phone: '988', description: 'Crisis support', url: 'tel:988' },
      addiction: { name: 'SAMHSA Helpline', phone: '1-800-662-4357', description: 'Addiction support', url: 'tel:1-800-662-4357' }
    },
    CA: {
      crisis: { name: 'Crisis Services Canada', phone: '1-833-456-4566', description: 'Crisis support', url: 'tel:1-833-456-4566' },
      addiction: { name: 'Drug Rehab Services', phone: '1-877-254-3348', description: 'Addiction support', url: 'tel:1-877-254-3348' }
    },
    UK: {
      crisis: { name: 'Samaritans', phone: '116 123', description: 'Crisis support', url: 'tel:116123' },
      addiction: { name: 'Frank Drug Helpline', phone: '0300 123 6600', description: 'Addiction support', url: 'tel:03001236600' }
    },
    AU: {
      crisis: { name: 'Lifeline Australia', phone: '13 11 14', description: 'Crisis support', url: 'tel:131114' },
      addiction: { name: 'DirectLine', phone: '1800 888 236', description: 'Addiction support', url: 'tel:1800888236' }
    }
  };

  const currentEmergencyContacts = regions[userRegion] || regions.US;

  const milestones: Milestone[] = [
    { days: 1, title: 'First Day', description: 'You took the first step', achieved: daysSober !== null && daysSober >= 1 },
    { days: 7, title: 'One Week', description: 'Seven days of strength', achieved: daysSober !== null && daysSober >= 7 },
    { days: 30, title: 'One Month', description: 'A full month of recovery', achieved: daysSober !== null && daysSober >= 30 },
    { days: 60, title: '60 Days', description: 'Two months strong', achieved: daysSober !== null && daysSober >= 60 },
    { days: 90, title: '90 Days', description: 'Three months of progress', achieved: daysSober !== null && daysSober >= 90 },
    { days: 180, title: '6 Months', description: 'Half a year of healing', achieved: daysSober !== null && daysSober >= 180 },
    { days: 270, title: '9 Months', description: 'Nine months of growth', achieved: daysSober !== null && daysSober >= 270 },
    { days: 365, title: '1 Year', description: 'A full year of recovery', achieved: daysSober !== null && daysSober >= 365 },
    { days: 730, title: '2 Years', description: 'Two years of strength', achieved: daysSober !== null && daysSober >= 730 },
    { days: 1095, title: '3 Years', description: 'Three years of transformation', achieved: daysSober !== null && daysSober >= 1095 },
  ];

  useEffect(() => {
    const today = new Date();
    const startDate = new Date(sobrietyDate);
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysSober(diffDays);

    const todayString = today.toDateString();
    const todaysEntry = moodEntries.find(entry => entry.date === todayString);
    if (todaysEntry) {
      setTodaysMood(todaysEntry.mood);
      setTodaysEnergy(todaysEntry.energy);
      setTodaysSleep(todaysEntry.sleep);
      setMoodNote(todaysEntry.note || '');
      setSelectedTriggers(todaysEntry.triggers || []);
    }
  }, [sobrietyDate, moodEntries]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (meditationActive && meditationTimer > 0) {
      interval = setInterval(() => {
        setMeditationTimer(prev => {
          if (prev <= 1) {
            setMeditationActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [meditationActive, meditationTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathingCount(prev => {
          if (prev <= 1) {
            setBreathingPhase(current => {
              if (current === 'inhale') return 'hold';
              if (current === 'hold') return 'exhale';
              return 'inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breathingActive]);

  const toggleHabit = (habitId: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const today = new Date().toDateString();
        const wasCompletedToday = habit.completedToday;
        
        return {
          ...habit,
          completedToday: !wasCompletedToday,
          lastCompleted: !wasCompletedToday ? today : habit.lastCompleted,
          streak: !wasCompletedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        };
      }
      return habit;
    }));
  };

  const addCustomHabit = () => {
    if (newHabitName.trim()) {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: newHabitName.trim(),
        category: newHabitCategory,
        streak: 0,
        lastCompleted: null,
        completedToday: false,
        isCustom: true,
        reminderTime: newHabitTime
      };
      setHabits(prev => [...prev, newHabit]);
      setNewHabitName('');
      setShowAddHabit(false);
    }
  };

  const removeHabit = (habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
  };

  const logMood = () => {
    if (todaysMood !== null && todaysEnergy !== null && todaysSleep !== null) {
      const today = new Date().toDateString();
      const newEntry: MoodEntry = {
        date: today,
        mood: todaysMood,
        energy: todaysEnergy,
        sleep: todaysSleep,
        note: moodNote.trim() || undefined,
        triggers: selectedTriggers.length > 0 ? selectedTriggers : undefined
      };
      
      setMoodEntries(prev => {
        const filtered = prev.filter(entry => entry.date !== today);
        return [...filtered, newEntry];
      });
    }
  };

  const addGratitude = () => {
    if (newGratitude.trim()) {
      const entry: GratitudeEntry = {
        id: Date.now().toString(),
        date: new Date().toDateString(),
        text: newGratitude.trim()
      };
      setGratitudeEntries(prev => [entry, ...prev]);
      setNewGratitude('');
    }
  };

  const startMeditation = () => {
    setMeditationTimer(meditationTime * 60);
    setMeditationActive(true);
  };

  const stopMeditation = () => {
    setMeditationActive(false);
    setMeditationTimer(0);
  };

  const toggleBreathing = () => {
    setBreathingActive(!breathingActive);
    if (!breathingActive) {
      setBreathingPhase('inhale');
      setBreathingCount(4);
    }
  };

  const handleSOS = () => {
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
    alert('Emergency support activated. Remember: This feeling will pass. You are not alone.');
  };

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'wellness': return '❤️';
      case 'support': return '👥';
      case 'mindfulness': return '🧘';
      case 'physical': return '🏃';
      case 'custom': return '⭐';
      default: return '✅';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'wellness': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'support': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'mindfulness': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'physical': return 'bg-green-100 text-green-700 border-green-200';
      case 'custom': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getMoodEmoji = (mood: number) => {
    switch (mood) {
      case 1: return '😢';
      case 2: return '😕';
      case 3: return '😐';
      case 4: return '😊';
      case 5: return '😄';
      default: return '😐';
    }
  };

  const getEnergyEmoji = (energy: number) => {
    switch (energy) {
      case 1: return '🔋';
      case 2: return '🔋';
      case 3: return '🔋';
      case 4: return '🔋';
      case 5: return '⚡';
      default: return '🔋';
    }
  };

  const getSleepEmoji = (sleep: number) => {
    switch (sleep) {
      case 1: return '😴';
      case 2: return '😪';
      case 3: return '😐';
      case 4: return '😊';
      case 5: return '✨';
      default: return '😐';
    }
  };

  const completedHabitsToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const recentMoods = moodEntries.slice(-7).reverse();
  const todaysReading = dailyReadings[new Date().getDay()];
  const todaysAffirmation = affirmations[new Date().getDay()];

  const themeClasses = darkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900';

  const cardClasses = darkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-100';

  const renderHome = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Momentum
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
        <h2 className="text-xl font-semibold mb-2">Recovery Companion</h2>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>One day at a time, one habit at a time</p>
      </div>

      {/* SOS Button */}
      <button
        onClick={handleSOS}
        className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        🆘 EMERGENCY SUPPORT
      </button>

      {/* Sobriety Counter */}
      <div className={`${cardClasses} rounded-2xl shadow-lg p-6 border`}>
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-2xl mr-2">📅</span>
            <h2 className="text-lg font-bold">Days in Recovery</h2>
          </div>
          <div className="text-5xl font-bold text-blue-600 mb-4">
            {daysSober === null ? '...' : daysSober}
          </div>
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Since {new Date(sobrietyDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <div className="flex justify-center">
            <input
              type="date"
              value={sobrietyDate}
              onChange={(e) => setSobrietyDate(e.target.value)}
              className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Daily Progress */}
      <div className={`${cardClasses} rounded-2xl shadow-lg p-4 border`}>
        <h3 className="text-lg font-bold mb-3">Today's Progress</h3>
        <div className="flex items-center mb-4">
          <div className={`flex-1 rounded-full h-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completedHabitsToday / totalHabits) * 100}%` }}
            ></div>
          </div>
          <span className={`ml-4 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {completedHabitsToday}/{totalHabits} completed
          </span>
        </div>
      </div>

      {/* Daily Reading */}
      <div className={`${cardClasses} rounded-2xl shadow-lg p-4 border`}>
        <h3 className="text-lg font-bold mb-3 flex items-center">
          <span className="mr-2">📖</span>
          Daily Reading
        </h3>
        <blockquote className={`italic mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          "{todaysReading}"
        </blockquote>
      </div>

      {/* Daily Affirmation */}
      <div className={`${cardClasses} rounded-2xl shadow-lg p-4 border`}>
        <h3 className="text-lg font-bold mb-3 flex items-center">
          <span className="mr-2">💪</span>
          Daily Affirmation
        </h3>
        <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {todaysAffirmation}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`${cardClasses} rounded-xl shadow-lg p-4 border text-center`}>
          <div className="text-2xl font-bold text-blue-600">{habits.reduce((sum, h) => sum + h.streak, 0)}</div>
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Streak Days</div>
        </div>
        <div className={`${cardClasses} rounded-xl shadow-lg p-4 border text-center`}>
          <div className="text-2xl font-bold text-green-600">{milestones.filter(m => m.achieved).length}</div>
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Milestones Achieved</div>
        </div>
      </div>
    </div>
  );

  const renderHabits = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Daily Habits</h3>
        <button
          onClick={() => setShowAddHabit(true)}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
        >
          + Add Habit
        </button>
      </div>

      {/* Add Habit Modal */}
      {showAddHabit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardClasses} rounded-xl p-4 w-full mx-4 border`}>
            <h4 className="text-lg font-bold mb-4">Add Habit</h4>
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="Enter habit name..."
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 text-sm ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
              }`}
            />
            <select
              value={newHabitCategory}
              onChange={(e) => setNewHabitCategory(e.target.value as any)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 text-sm ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
              }`}
            >
              <option value="custom">Custom</option>
              <option value="wellness">Wellness</option>
              <option value="support">Support</option>
              <option value="mindfulness">Mindfulness</option>
              <option value="physical">Physical</option>
            </select>
            <input
              type="time"
              value={newHabitTime}
              onChange={(e) => setNewHabitTime(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 text-sm ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
              }`}
            />
            <div className="flex gap-3">
              <button
                onClick={addCustomHabit}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
              >
                Add Habit
              </button>
              <button
                onClick={() => {
                  setShowAddHabit(false);
                  setNewHabitName('');
                }}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                  darkMode ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className={`${cardClasses} rounded-xl shadow-lg p-4 border-2 transition-all duration-300 hover:shadow-xl ${
              habit.completedToday ? 'border-green-300 bg-green-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-3 ${getCategoryColor(habit.category)}`}>
                  <span className="w-4 h-4 text-center">{getCategoryIcon(habit.category)}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{habit.name}</h4>
                  <p className={`text-sm capitalize ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {habit.category} • {habit.reminderTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    habit.completedToday
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : darkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                  }`}
                >
                  <span className="text-lg">{habit.completedToday ? '✅' : '⭕'}</span>
                </button>
                {habit.isCustom && (
                  <button
                    onClick={() => removeHabit(habit.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Remove habit"
                  >
                    <span className="text-sm">🗑️</span>
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className={`font-medium ${
                habit.streak > 0 ? 'text-blue-600' : darkMode ? 'text-gray-400' : 'text-gray-400'
              }`}>
                🔥 {habit.streak} day streak
              </span>
              {habit.lastCompleted && (
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                  Last: {new Date(habit.lastCompleted).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Summary */}
      <div className={`${cardClasses} rounded-2xl shadow-lg p-4 border`}>
        <h3 className="text-lg font-bold mb-4">Weekly Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((completedHabitsToday / totalHabits) * 100)}%
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {habits.filter(h => h.streak >= 7).length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Week+ Streaks</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMood = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">Mood & Wellness Tracking</h3>
      
      {/* Mood Logging */}
      <div className={`${cardClasses} rounded-2xl shadow-lg p-4 border`}>
        <h4 className="font-bold mb-4">How are you feeling today?</h4>
        
        {/* Mood */}
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mood</label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((mood) => (
              <button
                key={mood}
                onClick={() => setTodaysMood(mood)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  todaysMood === mood
                    ? 'bg-blue-100 border-2 border-blue-500 scale-110'
                    : darkMode ? 'bg-gray-700 border-2 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="text-xl mb-1 flex items-center justify-center h-6">{getMoodEmoji(mood)}</div>
                <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{mood}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Energy */}
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Energy Level</label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((energy) => (
              <button
                key={energy}
                onClick={() => setTodaysEnergy(energy)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  todaysEnergy === energy
                    ? 'bg-yellow-100 border-2 border-yellow-500 scale-110'
                    : darkMode ? 'bg-gray-700 border-2 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="text-xl mb-1 flex items-center justify-center h-6">{getEnergyEmoji(energy)}</div>
                <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{energy}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Sleep Quality */}
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sleep Quality</label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((sleep) => (
              <button
                key={sleep}
                onClick={() => setTodaysSleep(sleep)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  todaysSleep === sleep
                    ? 'bg-purple-100 border-2 border-purple-500 scale-110'
                    : darkMode ? 'bg-gray-700 border-2 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="text-xl mb-1 flex items-center justify-center h-6">{getSleepEmoji(sleep)}</div>
                <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{sleep}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Triggers */}
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Triggers (if any)</label>
          <div className="grid grid-cols-2 gap-2">
            {commonTriggers.map((trigger) => (
              <button
                key={trigger}
                onClick={() => toggleTrigger(trigger)}
                className={`p-2 rounded-lg text-sm transition-all duration-200 ${
                  selectedTriggers.includes(trigger)
                    ? 'bg-red-100 border-2 border-red-500 text-red-700'
                    : darkMode ? 'bg-gray-700 border-2 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-gray-50 border-2 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {trigger}
              </button>
            ))}
          </div>
        </div>
        
        <textarea
          value={moodNote}
          onChange={(e) => setMoodNote(e.target.value)}
          placeholder="Optional: Add a note about your day..."
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm mb-4 ${
            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
          }`}
          rows={3}
        />
        
        <button
          onClick={logMood}
          disabled={todaysMood === null || todaysEnergy === null || todaysSleep === null}
          className={`w-full px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
            todaysMood !== null && todaysEnergy !== null && todaysSleep !== null
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : darkMode ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Log Today's Wellness
        </button>
      </div>

      {/* Recent Mood History */}
      {recentMoods.length > 0 && (
        <div className={`${cardClasses} rounded-2xl shadow-lg p-4 border`}>
          <h4 className="font-semibold mb-3 text-sm">Recent Wellness History</h4>
          <div className="space-y-3">
            {recentMoods.map((entry, index) => (
              <div key={index} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex gap-2">
                    <span title="Mood">{getMoodEmoji(entry.mood)}</span>
                    <span title="Energy">{getEnergyEmoji(entry.energy)}</span>
                    <span title="Sleep">{getSleepEmoji(entry.sleep)}</span>
                  </div>
                </div>
                {entry.note && (
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{entry.note}</p>
                )}
                {entry.triggers && entry.triggers.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.triggers.map((trigger, i) => (
                      <span key={i} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        {trigger}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gratitude Journal */}
      <div className={`${cardClasses} rounded-2xl shadow-lg p-4 border`}>
        <h4 className="font-bold mb-4 flex items-center">
          <span className="mr-2">🙏</span>
          Gratitude Journal
        </h4>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newGratitude}
            onChange={(e) => setNewGratitude(e.target.value)}
            placeholder="What are you grateful for today?"
            className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
            }`}
          />
          <button
            onClick={addGratitude}
            disabled={!newGratitude.trim()}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              newGratitude.trim()
                ? 'bg-green-500 text-white hover:bg-green-600'
                : darkMode ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Add
          </button>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {gratitudeEntries.map((entry) => (
            <div key={entry.id} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className="text-sm">{entry.text}</p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {new Date(entry.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">Support Network</h3>

      {/* Emergency Support */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-lg p-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold">Emergency Support</h4>
          <select
            value={userRegion}
            onChange={(e) => setUserRegion(e.target.value)}
            className="px-2 py-1 bg-white/20 text-white rounded-lg border border-white/30 text-xs"
          >
            <option value="US" className="text-gray-800">United States</option>
            <option value="CA" className="text-gray-800">Canada</option>
            <option value="UK" className="text-gray-800">United Kingdom</option>
            <option value="AU" className="text-gray-800">Australia</option>
          </select>
        </div>
        <div className="space-y-3">
          <a
            href={currentEmergencyContacts.crisis.url}
            className="flex items-center p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
          >
            <span className="text-xl mr-3">📞</span>
            <div>
              <div className="font-semibold text-sm">{currentEmergencyContacts.crisis.name}</div>
              <div className="text-sm opacity-90">{currentEmergencyContacts.crisis.description}</div>
            </div>
          </a>
          <a
            href={currentEmergencyContacts.addiction.url}
            className="flex items-center p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
          >
            <span className="text-xl mr-3">💬</span>
            <div>
              <div className="font-semibold text-sm">{currentEmergencyContacts.addiction.name}</div>
              <div className="text-sm opacity-90">{currentEmergencyContacts.addiction.description}</div>
            </div>
          </a>
        </div>
      </div>

      {/* Sponsor/Accountability Contacts */}
      <div className={`${cardClasses} rounded-2xl shadow-lg p-4 border`}>
        <h4 className="font-bold mb-4 flex items-center">
          <span className="mr-2">👥</span>
          Support Contacts
        </h4>
        <div className="space-y-3">
          {sponsorContacts.map((contact) => (
            <div key={contact.id} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-semibold text-sm">{contact.name}</h5>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{contact.relationship}</p>
                </div>
                <a
                  href={`tel:${contact.phone}`}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  📞 Call
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meetings */}
      <div className={`${cardClasses} rounded-2xl shadow-lg p-4 border`}>
        <h4 className="font-bold mb-4 flex items-center">
          <span className="mr-2">🏢</span>
          My Meetings
        </h4>
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <div key={meeting.id} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-semibold text-sm">{meeting.name}</h5>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {meeting.day}s at {meeting.time}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{meeting.location}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  meeting.type === 'AA' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>
                  {meeting.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div className={`${cardClasses} rounded-2xl shadow-lg p-4 border`}>
        <h4 className="font-bold mb-4 flex items-center">
          <span className="mr-2">🎯</span>
          Recovery Goals
        </h4>
        <div className="space-y-3">
          {goals.map((goal) => (
            <div key={goal.id} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h5 className="font-semibold text-sm">{goal.title}</h5>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>{goal.description}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Target: {new Date(goal.targetDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    goal.category === 'Recovery' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {goal.category}
                  </span>
                  {goal.completed && <span className="text-green-500">✅</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className={`${cardClasses} rounded-2xl shadow-lg p-4 border`}>
        <h4 className="font-bold mb-4 flex items-center">
          <span className="mr-2">🏆</span>
          Recovery Milestones
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {milestones.slice(0, 8).map((milestone, index) => (
            <div
              key={index}
              className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                milestone.achieved
                  ? 'border-yellow-300 bg-yellow-50'
                  : darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center mb-2">
                <span className={`text-lg mr-2 ${
                  milestone.achieved ? 'text-yellow-600' : darkMode ? 'text-gray-400' : 'text-gray-400'
                }`}>🏆</span>
                <h5 className={`font-semibold text-xs ${
                  milestone.achieved ? 'text-yellow-800' : darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {milestone.title}
                </h5>
              </div>
              <p className={`text-xs ${
                milestone.achieved ? 'text-yellow-700' : darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {milestone.description}
              </p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{milestone.days} days</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTools = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">Wellness Tools</h3>

      {/* Meditation Timer */}
      <div className={`${cardClasses} rounded-2xl shadow-lg p-4 border`}>
        <h4 className="font-bold mb-4 flex items-center">
          <span className="mr-2">🧘</span>
          Meditation Timer
        </h4>
        {!meditationActive ? (
          <div>
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Duration (minutes)
              </label>
              <select
                value={meditationTime}
                onChange={(e) => setMeditationTime(Number(e.target.value))}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
              >
                <option value={1}>1 minute</option>
                <option value={3}>3 minutes</option>
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={20}>20 minutes</option>
              </select>
            </div>
            <button
              onClick={startMeditation}
              className="w-full px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
              Start Meditation
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl font-bold text-purple-600 mb-4">
              {Math.floor(meditationTimer / 60)}:{(meditationTimer % 60).toString().padStart(2, '0')}
            </div>
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Focus on your breath. Let thoughts pass like clouds.
            </p>
            <button
              onClick={stopMeditation}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Stop
            </button>
          </div>
        )}
      </div>

      {/* Breathing Exercise */}
      <div className={`${cardClasses} rounded-2xl shadow-lg p-4 border`}>
        <h4 className="font-bold mb-4 flex items-center">
          <span className="mr-2">🫁</span>
          Breathing Exercise
        </h4>
        {!breathingActive ? (
          <div className="text-center">
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              4-4-4 breathing pattern for stress relief
            </p>
            <button
              onClick={toggleBreathing}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Start Breathing Exercise
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {breathingCount}
            </div>
            <div className="text-2xl font-semibold mb-4 capitalize">
              {breathingPhase}
            </div>
            <div className={`text-lg mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {breathingPhase === 'inhale' && 'Breathe in slowly...'}
              {breathingPhase === 'hold' && 'Hold your breath...'}
              {breathingPhase === 'exhale' && 'Breathe out slowly...'}
            </div>
            <button
              onClick={toggleBreathing}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Stop
            </button>
          </div>
        )}
      </div>

      {/* Coping Strategies */}
      <div className={`${cardClasses} rounded-2xl shadow-lg p-4 border`}>
        <h4 className="font-bold mb-4 flex items-center">
          <span className="mr-2">🛡️</span>
          Coping Strategies
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {copingStrategies.map((strategy, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border transition-colors hover:bg-opacity-50 ${
                darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <p className="text-sm">{strategy}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleSOS}
          className="p-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          🆘 SOS
        </button>
        <a
          href={currentEmergencyContacts.crisis.url}
          className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-center"
        >
          📞 Crisis Line
        </a>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${themeClasses} transition-colors duration-300`}>
      <div className="max-w-sm mx-auto">
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-between items-center p-4">
          <div></div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Content */}
        <div className="p-4 pb-20">
          {currentTab === 'home' && renderHome()}
          {currentTab === 'habits' && renderHabits()}
          {currentTab === 'mood' && renderMood()}
          {currentTab === 'support' && renderSupport()}
          {currentTab === 'tools' && renderTools()}
        </div>

        {/* Bottom Navigation */}
        <div className={`fixed bottom-0 left-0 right-0 ${cardClasses} border-t`}>
          <div className="max-w-sm mx-auto">
            <div className="flex justify-around py-2">
              {[
                { id: 'home', icon: '🏠', label: 'Home' },
                { id: 'habits', icon: '✅', label: 'Habits' },
                { id: 'mood', icon: '😊', label: 'Mood' },
                { id: 'support', icon: '👥', label: 'Support' },
                { id: 'tools', icon: '🛠️', label: 'Tools' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as any)}
                  className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                    currentTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="text-lg mb-1">{tab.icon}</span>
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}