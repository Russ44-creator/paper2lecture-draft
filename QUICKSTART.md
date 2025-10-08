# Quick Start Guide

This guide will help you get Paper2Lecture running on your machine in under 5 minutes.

## Prerequisites

Before you begin, make sure you have:

1. **Node.js 18+** installed
   - Check version: `node --version`
   - Download: [https://nodejs.org/](https://nodejs.org/)

2. **Chrome Canary** or **Chrome Dev** (for Gemini Nano)
   - Download: [https://www.google.com/chrome/canary/](https://www.google.com/chrome/canary/)

## Installation Steps

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/paper2lecture.git
cd paper2lecture

# Install all dependencies
npm install
```

This will install:
- React 18
- TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- PDF.js (PDF processing)
- All development tools

### 2. Start the App

```bash
npm run dev
```

You should see:

```
VITE v6.0.1  ready in 565 ms

➜  Local:   http://localhost:5173/
```

### 3. Open in Browser

Open [http://localhost:5173](http://localhost:5173) in Chrome Canary/Dev

You should see the Paper2Lecture interface with a file upload area.

## Enable Gemini Nano (Optional but Recommended)

To use on-device AI (free, private, fast):

### 1. Open Chrome Flags

Navigate to: `chrome://flags`

### 2. Enable These Flags

Search for and enable:

- `#prompt-api-for-gemini-nano` → **Enabled**
- `#optimization-guide-on-device-model` → **Enabled BypassPerfRequirement**
- `#summarization-api-for-gemini-nano` → **Enabled**
- `#writer-api-for-gemini-nano` → **Enabled**
- `#rewriter-api-for-gemini-nano` → **Enabled**

### 3. Restart Chrome

Click "Relaunch" button at the bottom of the flags page.

### 4. Verify Setup

Open DevTools Console (F12) and run:

```javascript
await ai.languageModel.capabilities()
```

If you see `{ available: "readily" }`, Gemini Nano is ready!

If you see `{ available: "after-download" }`, wait a few minutes for the model to download (~1-2GB).

## Alternative: Use Gemini API

If you don't want to use Chrome Canary or Gemini Nano:

### 1. Get API Key

Visit [Google AI Studio](https://aistudio.google.com/app/apikey) and create a free API key.

### 2. Create .env File

In the project root, create a `.env` file:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

### 3. Restart Dev Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

The app will automatically use Gemini API if Gemini Nano is not available.

## Next Steps

- Try uploading a research paper PDF
- Explore the code in `src/` directory
- Read [DESIGN.md](./DESIGN.md) for architecture details
- Check [README.md](./README.md) for full documentation

## Common Issues

### Port Already in Use

If port 5173 is busy:

```bash
# Kill the process or Vite will auto-select next port
# Check the terminal output for the actual port number
```

### Dependencies Not Installing

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Rebuild TypeScript
npm run build
```

### Gemini Nano Not Downloading

- Check your internet connection
- Make sure you have ~2GB free space
- Wait 5-10 minutes and refresh Chrome
- Check `chrome://components/` for "Optimization Guide On Device Model"

## Development Workflow

```bash
# Start dev server (auto-reload on file changes)
npm run dev

# Check for code errors
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Getting Help

- Check [README.md](./README.md) for detailed documentation
- Review [DESIGN.md](./DESIGN.md) for architecture
- Open an issue on GitHub

Happy coding!
