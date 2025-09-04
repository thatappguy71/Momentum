# Recovery Tracker

A beautiful, responsive web application for tracking your recovery journey with daily check-ins, mood monitoring, and progress visualization.

## Features

- **Daily Check-ins**: Record your mood and thoughts each day
- **Mood Tracking**: Visual mood indicators with color-coded entries
- **Goal Setting**: Set and track daily goals
- **Progress Visualization**: View your streak and overall progress
- **Local Storage**: All data is stored locally in your browser
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Beautiful UI**: Modern design with smooth animations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd recovery-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Local Storage** - Client-side data persistence

## Project Structure

```
recovery-tracker/
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main application component
├── public/                  # Static assets
├── tailwind.config.js       # Tailwind configuration
├── next.config.js          # Next.js configuration
└── package.json            # Dependencies and scripts
```

## Features in Detail

### Daily Entries
- Record your daily mood (Great, Good, Okay, Difficult)
- Add personal notes and reflections
- Set and track daily goals
- All entries are timestamped and stored locally

### Progress Tracking
- View total number of entries
- Track your current streak of consecutive days
- See how many good days you've had
- Visual progress indicators

### Data Persistence
- All data is stored in your browser's local storage
- No account required - completely private
- Data persists between sessions

## Customization

The app uses a comprehensive design system with:
- Custom color palette for different moods
- Smooth animations and transitions
- Responsive grid layouts
- Accessible design patterns

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

If you find this app helpful in your recovery journey, please consider sharing it with others who might benefit from it.

Remember: Recovery is a journey, not a destination. Every day is a step forward. 💪