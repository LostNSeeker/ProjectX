# Job Dashboard Desktop

A desktop application built with Electron that wraps the React-based Job Dashboard frontend.

## Features

- Native desktop application for Windows and macOS
- Real-time job listings from multiple sources
- Search and filter functionality
- Responsive design optimized for desktop
- Native menu and keyboard shortcuts

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- The frontend React app should be running on localhost:3000

## Development Setup

1. **Start the React frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

2. **Start the Electron app:**
   ```bash
   cd ../job-dashboard-desktop
   npm install
   npm run electron-dev
   ```

## Building for Production

### Build for macOS
```bash
npm run dist-mac
```

### Build for Windows
```bash
npm run dist-win
```

### Build for all platforms
```bash
npm run dist
```

## Project Structure

```
job-dashboard-desktop/
├── public/
│   ├── electron.js          # Main Electron process
│   └── index.html           # Loading page
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## Scripts

- `npm run electron-dev` - Start Electron in development mode
- `npm run electron` - Start Electron with production build
- `npm run build` - Build the React frontend
- `npm run dist` - Build and package the desktop app
- `npm run dist-mac` - Build for macOS
- `npm run dist-win` - Build for Windows

## Configuration

The Electron app is configured to:
- Load the React app from `http://localhost:3000` in development
- Load from the built files in production
- Handle external links by opening them in the default browser
- Provide native menus and keyboard shortcuts
- Support both Windows and macOS platforms

## Troubleshooting

1. **App won't start:** Make sure the React frontend is running on localhost:3000
2. **Build fails:** Ensure all dependencies are installed and the frontend builds successfully
3. **External links not working:** Check that the URL handling is properly configured

## Distribution

The built applications will be available in the `dist/` directory after running the build commands.
