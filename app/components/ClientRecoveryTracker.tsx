'use client'

import { useState, useEffect } from 'react'
import { 
  Heart, 
  Calendar, 
  TrendingUp, 
  Smile, 
  Meh, 
  Frown,
  Plus,
  CheckCircle,
  Target,
  Award,
  Sun,
  Moon,
  Activity
} from 'lucide-react'

interface DailyEntry {
  id: string
  date: string
  mood: 'great' | 'good' | 'okay' | 'difficult'
  notes: string
  goals: string[]
  completed: boolean
}

export default function ClientRecoveryTracker() {
  const [entries, setEntries] = useState<DailyEntry[]>([])
  const [currentMood, setCurrentMood] = useState<'great' | 'good' | 'okay' | 'difficult'>('good')
  const [notes, setNotes] = useState('')
  const [newGoal, setNewGoal] = useState('')
  const [goals, setGoals] = useState<string[]>([])
  const [showAddEntry, setShowAddEntry] = useState(false)

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('recoveryEntries')
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('recoveryEntries', JSON.stringify(entries))
  }, [entries])

  const addEntry = () => {
    const newEntry: DailyEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood: currentMood,
      notes,
      goals: [...goals],
      completed: true
    }

    setEntries(prev => [newEntry, ...prev])
    
    // Reset form
    setNotes('')
    setGoals([])
    setShowAddEntry(false)
  }

  const addGoal = () => {
    if (newGoal.trim() && !goals.includes(newGoal.trim())) {
      setGoals(prev => [...prev, newGoal.trim()])
      setNewGoal('')
    }
  }

  const removeGoal = (goalToRemove: string) => {
    setGoals(prev => prev.filter(goal => goal !== goalToRemove))
  }

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'great': return <Smile className="w-6 h-6 text-green-500" />
      case 'good': return <Smile className="w-6 h-6 text-blue-500" />
      case 'okay': return <Meh className="w-6 h-6 text-yellow-500" />
      case 'difficult': return <Frown className="w-6 h-6 text-red-500" />
      default: return <Meh className="w-6 h-6 text-gray-500" />
    }
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'great': return 'bg-green-100 border-green-200'
      case 'good': return 'bg-blue-100 border-blue-200'
      case 'okay': return 'bg-yellow-100 border-yellow-200'
      case 'difficult': return 'bg-red-100 border-red-200'
      default: return 'bg-gray-100 border-gray-200'
    }
  }

  const getStreak = () => {
    let streak = 0
    const today = new Date()
    
    for (let i = 0; i < entries.length; i++) {
      const entryDate = new Date(entries[i].date)
      const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === streak) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  const currentStreak = getStreak()

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-red-500 mr-3 animate-bounce-gentle" />
            <h1 className="text-4xl font-bold text-gray-900">Recovery Tracker</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track your daily progress, monitor your mood, and celebrate your recovery journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center animate-slide-up">
            <div className="flex items-center justify-center mb-2">
              <Activity className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{entries.length}</h3>
            <p className="text-gray-600">Total Entries</p>
          </div>
          
          <div className="card p-6 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-center mb-2">
              <Target className="w-8 h-8 text-success-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{currentStreak}</h3>
            <p className="text-gray-600">Day Streak</p>
          </div>
          
          <div className="card p-6 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-center mb-2">
              <Award className="w-8 h-8 text-warning-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {entries.filter(e => e.mood === 'great' || e.mood === 'good').length}
            </h3>
            <p className="text-gray-600">Good Days</p>
          </div>
        </div>

        {/* Add Entry Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowAddEntry(!showAddEntry)}
            className="btn-primary px-8 py-3 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Today's Entry
          </button>
        </div>

        {/* Add Entry Form */}
        {showAddEntry && (
          <div className="card p-6 mb-8 animate-slide-up">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-primary-500" />
              How are you feeling today?
            </h2>

            {/* Mood Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select your mood:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'great', label: 'Great', icon: Smile, color: 'text-green-500' },
                  { value: 'good', label: 'Good', icon: Smile, color: 'text-blue-500' },
                  { value: 'okay', label: 'Okay', icon: Meh, color: 'text-yellow-500' },
                  { value: 'difficult', label: 'Difficult', icon: Frown, color: 'text-red-500' }
                ].map(({ value, label, icon: Icon, color }) => (
                  <button
                    key={value}
                    onClick={() => setCurrentMood(value as any)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      currentMood === value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${color}`} />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional):
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input min-h-[100px] resize-none"
                placeholder="How was your day? Any thoughts or reflections..."
              />
            </div>

            {/* Goals */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Today's Goals:
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                  className="input flex-1"
                  placeholder="Add a goal for today..."
                />
                <button
                  onClick={addGoal}
                  className="btn-secondary px-4"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              {goals.length > 0 && (
                <div className="space-y-2">
                  {goals.map((goal, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm">{goal}</span>
                      <button
                        onClick={() => removeGoal(goal)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                onClick={addEntry}
                className="btn-success flex-1 py-3"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Save Entry
              </button>
              <button
                onClick={() => setShowAddEntry(false)}
                className="btn-secondary px-6 py-3"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Entries List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-primary-500" />
            Your Journey
          </h2>
          
          {entries.length === 0 ? (
            <div className="card p-8 text-center">
              <Sun className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No entries yet</h3>
              <p className="text-gray-500">Start your recovery journey by adding your first entry!</p>
            </div>
          ) : (
            entries.map((entry, index) => (
              <div
                key={entry.id}
                className={`card p-6 ${getMoodColor(entry.mood)} animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    {getMoodIcon(entry.mood)}
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {entry.mood} Day
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-success-500" />
                </div>

                {entry.notes && (
                  <div className="mb-4">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {entry.notes}
                    </p>
                  </div>
                )}

                {entry.goals.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Goals:</h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.goals.map((goal, goalIndex) => (
                        <span
                          key={goalIndex}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/50 text-gray-700"
                        >
                          <Target className="w-3 h-3 mr-1" />
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Remember: Recovery is a journey, not a destination. Every day is a step forward. 💪
          </p>
        </div>
      </div>
    </div>
  )
}