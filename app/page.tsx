'use client';

import { useState, useEffect } from 'react';

interface Habit {
  id: string;
  name: string;
  category: 'wellness' | 'support' | 'mindfulness' | 'physical';
  streak: number;
  lastCompleted: string | null;
  completedToday: boolean;
}

interface Milestone {
  days: number;
  title: string;
  description: string;
  achieved: boolean;
}

export default function RecoveryTracker() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Morning Meditation', category: 'mindfulness', streak: 0, lastCompleted: null, completedToday: false },
    { id: '2', name: 'Attend Support Meeting', category: 'support', streak: 0, lastCompleted: null, completedToday: false },
    { id: '3', name: 'Exercise/Walk', category: 'physical', streak: 0, lastCompleted: null, completedToday: false },
    { id: '4', name: 'Journal Writing', category: 'wellness', streak: 0, lastCompleted: null, completedToday: false },
    { id: '5', name: 'Call Sponsor/Friend', category: 'support', streak: 0, lastCompleted: null, completedToday: false },
    { id: '6', name: 'Gratitude Practice', category: 'mindfulness', streak: 0, lastCompleted: null, completedToday: false },
  ]);

  const [sobrietyDate, setSobrietyDate] = useState<string>('2024-01-01');
  const [daysSober, setDaysSober] = useState<number>(0);

  const milestones: Milestone[] = [
    { days: 1, title: 'First Day', description: 'You took the first step', achieved: daysSober >= 1 },
    { days: 7, title: 'One Week', description: 'Seven days of strength', achieved: daysSober >= 7 },
    { days: 30, title: 'One Month', description: 'A full month of recovery', achieved: daysSober >= 30 },
    { days: 90, title: '90 Days', description: 'Three months of progress', achieved: daysSober >= 90 },
    { days: 180, title: '6 Months', description: 'Half a year of healing', achieved: daysSober >= 180 },
    { days: 365, title: 'One Year', description: 'A full year of recovery', achieved: daysSober >= 365 },
  ];

  useEffect(() => {
    const today = new Date();
    const startDate = new Date(sobrietyDate);
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysSober(diffDays);
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'wellness': return <span className="w-4 h-4 text-center">❤️</span>;
      case 'support': return <span className="w-4 h-4 text-center">👥</span>;
      case 'mindfulness': return <span className="w-4 h-4 text-center">🛡️</span>;
      case 'physical': return <span className="w-4 h-4 text-center">🏆</span>;
      default: return <span className="w-4 h-4 text-center">✅</span>;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'wellness': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'support': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'mindfulness': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'physical': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const completedHabitsToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Recovery Journey</h1>
          <p className="text-gray-600">One day at a time, one habit at a time</p>
        </div>

        {/* Sobriety Counter */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-3xl mr-3">📅</span>
              <h2 className="text-2xl font-bold text-gray-800">Days in Recovery</h2>
            </div>
            <div className="text-6xl font-bold text-blue-600 mb-4">{daysSober}</div>
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

        {/* Habits Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
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
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                  }`}
                >
                  <span className="text-xl">{habit.completedToday ? '✅' : '⭕'}</span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {habit.streak > 0 ? `${habit.streak} day streak` : 'Start your streak!'}
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