'use client';

import { useState, useEffect } from 'react';

interface Habit {
  id: string;
  name: string;
  category: 'wellness' | 'support' | 'mindfulness' | 'physical';
  streak: number;
  lastCompleted: string | null;
  completedToday: boolean;
  isCustom?: boolean;
}

interface Milestone {
  days: number;
  title: string;
  description: string;
  achieved: boolean;
}

interface MoodEntry {
  date: string;
  mood: number; // 1-5 scale
  note?: string;
}
export default function RecoveryTracker() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Morning Meditation', category: 'mindfulness', streak: 0, lastCompleted: null, completedToday: false, isCustom: false },
    { id: '2', name: 'Attend Support Meeting', category: 'support', streak: 0, lastCompleted: null, completedToday: false, isCustom: false },
    { id: '3', name: 'Exercise/Walk', category: 'physical', streak: 0, lastCompleted: null, completedToday: false, isCustom: false },
    { id: '4', name: 'Journal Writing', category: 'wellness', streak: 0, lastCompleted: null, completedToday: false, isCustom: false },
    { id: '5', name: 'Call Sponsor/Friend', category: 'support', streak: 0, lastCompleted: null, completedToday: false, isCustom: false },
    { id: '6', name: 'Gratitude Practice', category: 'mindfulness', streak: 0, lastCompleted: null, completedToday: false, isCustom: false },
  ]);

  const [sobrietyDate, setSobrietyDate] = useState<string>('2024-01-01');
  const [daysSober, setDaysSober] = useState<number | null>(null);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [todaysMood, setTodaysMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState<string>('');
  const [showAddHabit, setShowAddHabit] = useState<boolean>(false);
  const [newHabitName, setNewHabitName] = useState<string>('');
  const [newHabitCategory, setNewHabitCategory] = useState<'wellness' | 'support' | 'mindfulness' | 'physical' | 'custom'>('custom');

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

    // Check if mood was already logged today
    const todayString = today.toDateString();
    const todaysEntry = moodEntries.find(entry => entry.date === todayString);
    if (todaysEntry) {
      setTodaysMood(todaysEntry.mood);
      setMoodNote(todaysEntry.note || '');
    }
  }, [sobrietyDate]);

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
        isCustom: true
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
    if (todaysMood !== null) {
      const today = new Date().toDateString();
      const newEntry: MoodEntry = {
        date: today,
        mood: todaysMood,
        note: moodNote.trim() || undefined
      };
      
      setMoodEntries(prev => {
        const filtered = prev.filter(entry => entry.date !== today);
        return [...filtered, newEntry];
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'wellness': return <span className="w-4 h-4 text-center">❤️</span>;
      case 'support': return <span className="w-4 h-4 text-center">👥</span>;
      case 'mindfulness': return <span className="w-4 h-4 text-center">🛡️</span>;
      case 'physical': return <span className="w-4 h-4 text-center">🏆</span>;
      case 'custom': return <span className="w-4 h-4 text-center">⭐</span>;
      default: return <span className="w-4 h-4 text-center">✅</span>;
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

  const getMoodLabel = (mood: number) => {
    switch (mood) {
      case 1: return 'Very Low';
      case 2: return 'Low';
      case 3: return 'Neutral';
      case 4: return 'Good';
      case 5: return 'Great';
      default: return 'Neutral';
    }
  };

  const completedHabitsToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const recentMoods = moodEntries.slice(-7).reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Momentum
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Habit Tracker</h2>
          <p className="text-gray-600">One day at a time, one habit at a time</p>
        </div>

        {/* Sobriety Counter */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-3xl mr-3">📅</span>
              <h2 className="text-2xl font-bold text-gray-800">Days in Recovery</h2>
            </div>
            <div className="text-6xl font-bold text-blue-600 mb-4">
              {daysSober === null ? '...' : daysSober}
            </div>
            <p className="text-gray-600 mb-6">
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Daily Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Progress</h3>
          <div className="flex items-center mb-4">
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(completedHabitsToday / totalHabits) * 100}%` }}
              ></div>
            </div>
            <span className="ml-4 text-sm font-medium text-gray-600">
              {completedHabitsToday}/{totalHabits} completed
            </span>
          </div>
        </div>

        {/* Mood Tracking */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">How are you feeling today?</h3>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              {[1, 2, 3, 4, 5].map((mood) => (
                <button
                  key={mood}
                  onClick={() => setTodaysMood(mood)}
                  className={`p-4 rounded-xl transition-all duration-200 ${
                    todaysMood === mood
                      ? 'bg-blue-100 border-2 border-blue-500 scale-110'
                      : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-3xl mb-1">{getMoodEmoji(mood)}</div>
                  <div className="text-xs text-gray-600">{getMoodLabel(mood)}</div>
                </button>
              ))}
            </div>
            
            <textarea
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              placeholder="Optional: Add a note about your mood..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={2}
            />
            
            <button
              onClick={logMood}
              disabled={todaysMood === null}
              className={`mt-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                todaysMood !== null
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Log Mood
            </button>
          </div>

          {/* Recent Mood History */}
          {recentMoods.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Recent Mood History</h4>
              <div className="flex gap-2 overflow-x-auto">
                {recentMoods.map((entry, index) => (
                  <div key={index} className="flex-shrink-0 text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">{getMoodEmoji(entry.mood)}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Habits Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Daily Habits</h3>
            <button
              onClick={() => setShowAddHabit(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              + Add Custom Habit
            </button>
          </div>

          {/* Add Habit Modal */}
          {showAddHabit && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Add Custom Habit</h4>
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="Enter habit name..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                />
                <select
                  value={newHabitCategory}
                  onChange={(e) => setNewHabitCategory(e.target.value as any)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                >
                  <option value="custom">Custom</option>
                  <option value="wellness">Wellness</option>
                  <option value="support">Support</option>
                  <option value="mindfulness">Mindfulness</option>
                  <option value="physical">Physical</option>
                </select>
                <div className="flex gap-3">
                  <button
                    onClick={addCustomHabit}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    Add Habit
                  </button>
                  <button
                    onClick={() => {
                      setShowAddHabit(false);
                      setNewHabitName('');
                    }}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all duration-300 hover:shadow-xl ${
                habit.completedToday ? 'border-green-300 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${getCategoryColor(habit.category)}`}>
                    {getCategoryIcon(habit.category)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{habit.name}</h4>
                    <p className="text-sm text-gray-500 capitalize">{habit.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    habit.completedToday
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className={`p-3 rounded-full transition-all duration-200 ${
                        habit.completedToday
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                      }`}
                    >
                      <span className="text-xl">{habit.completedToday ? '✅' : '⭕'}</span>
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
                </span>
                {habit.lastCompleted && (
                  <span className="text-xs text-gray-400">
                    Last: {new Date(habit.lastCompleted).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Recovery Milestones</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  milestone.achieved
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center mb-2">
                  <span className={`text-xl mr-2 ${
                    milestone.achieved ? 'text-yellow-600' : 'text-gray-400'
                  }`}>🏆</span>
                  <h4 className={`font-semibold ${
                    milestone.achieved ? 'text-yellow-800' : 'text-gray-600'
                  }`}>
                    {milestone.title}
                  </h4>
                </div>
                <p className={`text-sm ${
                  milestone.achieved ? 'text-yellow-700' : 'text-gray-500'
                }`}>
                  {milestone.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">{milestone.days} days</p>
              </div>
            ))}
          </div>
          </div>
        </div>

        {/* Emergency Support */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Need Support?</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="tel:988"
              className="flex items-center p-4 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
            >
              <span className="text-2xl mr-3">📞</span>
              <div>
                <div className="font-semibold">Crisis Hotline</div>
                <div className="text-sm opacity-90">988 - Available 24/7</div>
              </div>
            </a>
            <a
              href="https://www.samhsa.gov/find-help/national-helpline"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
            >
              <span className="text-2xl mr-3">💬</span>
              <div>
                <div className="font-semibold">SAMHSA Helpline</div>
                <div className="text-sm opacity-90">1-800-662-4357</div>
              </div>
            </a>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="text-center mt-8 p-6 bg-white/50 rounded-xl">
          <blockquote className="text-lg italic text-gray-700 mb-2">
            "Recovery is not a race. You don't have to feel guilty if it takes you longer than you thought it would."
          </blockquote>
          <p className="text-gray-500">— Remember: Progress, not perfection</p>
        </div>
      </div>
    </div>
  );
}