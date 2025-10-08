# Paper2Lecture

> Transform dense research papers into interactive, digestible summaries using Google's Gemini AI

**Paper2Lecture** is an intelligent web application that leverages **Gemini Nano** (on-device AI) and **Gemini API** to help you understand complex academic papers through AI-powered summarization, contextual Q&A, and auto-generated diagrams.

---

## Features

- **PDF Upload & Processing** - Upload research papers and get instant analysis
- **AI-Powered Summarization** - Break down papers into digestible sections using Gemini
- **Contextual Q&A** - Highlight text and ask questions about specific sections
- **Auto-Generated Diagrams** - Visualize complex concepts with Mermaid diagrams
- **Privacy-First** - Uses on-device Gemini Nano (no data leaves your browser)
- **Hybrid AI Strategy** - Falls back to Gemini API for advanced features
- **Offline Support** - All papers and summaries stored locally (IndexedDB)
- **Modern UI** - Clean, responsive interface built with Tailwind CSS

---

## Architecture

Paper2Lecture uses a **hybrid AI strategy**:

1. **Primary: Gemini Nano** (Chrome Built-in AI)
   - Runs on-device (100% private)
   - No API key required
   - Free and fast
   - Perfect for summaries and Q&A

2. **Fallback: Gemini API** (Cloud)
   - Handles advanced features (multimodal, long context)
   - Works in any browser
   - Requires API key (free tier available)

```
┌─────────────────────────────────────────────┐
│          Paper2Lecture Web App              │
├─────────────────────────────────────────────┤
│  PDF Upload → Text Extraction → AI Engine  │
│                                             │
│  AI Engine:                                 │
│  ├─ Gemini Nano (on-device) ← Primary      │
│  └─ Gemini API (cloud) ← Fallback          │
│                                             │
│  Storage: IndexedDB (local, private)        │
└─────────────────────────────────────────────┘
```

---

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **AI**: Gemini Nano (Chrome Built-in AI) + Gemini API
- **PDF**: PDF.js
- **Diagrams**: Mermaid.js
- **State**: Zustand
- **Storage**: Dexie.js (IndexedDB wrapper)
- **Deployment**: Vercel / Netlify

---

## Prerequisites

### For Gemini Nano (Recommended)

1. **Chrome 127+** (Canary or Dev channel)
   - Download: [Chrome Canary](https://www.google.com/chrome/canary/)

2. **Enable AI Flags**
   - Navigate to `chrome://flags`
   - Enable these flags:
     - `#prompt-api-for-gemini-nano` → **Enabled**
     - `#optimization-guide-on-device-model` → **Enabled BypassPerfRequirement**
     - `#summarization-api-for-gemini-nano` → **Enabled**
     - `#writer-api-for-gemini-nano` → **Enabled**
     - `#rewriter-api-for-gemini-nano` → **Enabled**
   - Restart Chrome
   - Wait for Gemini Nano to download (~1-2GB, automatic)

3. **Verify Setup**
   ```javascript
   // Open DevTools Console and run:
   await ai.languageModel.capabilities()
   // Should return: { available: "readily" }
   ```

### For Gemini API (Fallback)

- Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- Free tier: 15 requests/minute, 1500 requests/day

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/paper2lecture.git
cd paper2lecture
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables (Optional)

Create a `.env` file for Gemini API fallback:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note**: If Gemini Nano is available, the app will use it by default (no API key needed!)

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in Chrome Canary/Dev

### 5. Build for Production

```bash
npm run build
npm run preview
```

---

## How to Use

### 1. Upload a Paper
- Drag & drop a PDF or click "Upload Paper"
- Supported: Text-based PDFs (scanned PDFs coming soon)

### 2. Get AI Summary
- App automatically generates:
  - Overall summary
  - Section-by-section breakdown
  - Key points and takeaways

### 3. Ask Questions
- Highlight any text in the PDF
- Click "Ask about this" or type your question
- Get AI-powered explanations with context

### 4. Explore Diagrams
- Auto-generated diagrams for complex concepts
- Interactive Mermaid visualizations
- Click to expand and explore

### 5. Manage Papers
- All papers stored locally (private)
- Switch between papers in sidebar
- Offline access after initial processing

---

## Project Structure

```
paper2lecture/
├── public/
│   └── favicon.ico
├── src/
│   ├── App.tsx                    # Root component
│   ├── main.tsx                   # Entry point
│   ├── components/
│   │   ├── layout/                # Header, Sidebar, Layout
│   │   ├── paper/                 # PDF upload & viewer
│   │   ├── summary/               # Summary display
│   │   ├── interaction/           # Q&A interface
│   │   └── diagram/               # Diagram rendering
│   ├── services/
│   │   ├── aiEngine.ts           # Gemini Nano + API coordinator
│   │   ├── paperParser.ts        # PDF text extraction
│   │   ├── diagramGenerator.ts   # Mermaid diagram generation
│   │   └── storage.ts            # IndexedDB wrapper
│   ├── hooks/
│   │   ├── useGeminiNano.ts      # Gemini Nano hook
│   │   ├── useGeminiAPI.ts       # Gemini API hook
│   │   ├── usePaper.ts           # Paper state
│   │   └── useHighlight.ts       # Text selection
│   ├── store/
│   │   └── paperStore.ts         # Zustand store
│   └── types/
│       └── index.ts              # TypeScript definitions
├── DESIGN.md                      # Design document
├── package.json
├── vite.config.ts
└── README.md
```

---

## Configuration

### AI Provider Priority

Edit `src/services/aiEngine.ts` to customize AI routing:

```typescript
const AI_PROVIDER_PRIORITY = {
  // Try Gemini Nano first (free, private)
  primary: 'gemini-nano',

  // Fallback to Gemini API (powerful, multimodal)
  fallback: 'gemini-api',

  // Use cloud for advanced features
  useCloudFor: ['vision', 'long-context']
};
```

### Gemini Models

```typescript
// Fast and efficient (default)
model: "gemini-2.0-flash-exp"

// Long context (2M tokens for huge papers)
model: "gemini-1.5-pro"

// Cost-effective
model: "gemini-1.5-flash"
```

---

## Roadmap

### v1.0 (MVP) - Current
- [x] PDF upload and text extraction
- [x] Gemini Nano integration
- [x] AI summarization
- [x] Contextual Q&A
- [x] Text highlighting
- [x] Basic diagram generation

### v1.5 (Next)
- [ ] Gemini API fallback
- [ ] Multiple diagram types
- [ ] Dark mode
- [ ] Export summaries (Markdown/PDF)
- [ ] Keyboard shortcuts

### v2.0 (Future)
- [ ] Multi-paper concept graph
- [ ] Cross-paper comparison
- [ ] Multimodal support (extract diagrams from PDFs)
- [ ] Long context support (Gemini 1.5 Pro)
- [ ] Chrome Extension version
- [ ] Mobile responsive design

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Google Chrome Team** - Chrome Built-in AI APIs
- **Google AI** - Gemini Nano & Gemini API
- **Mozilla** - PDF.js
- **Mermaid** - Diagram generation
- **shadcn** - UI components

---

## Resources

- [Chrome Built-in AI Documentation](https://developer.chrome.com/docs/ai/built-in)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Design Document](./DESIGN.md)
- [Google AI Studio](https://aistudio.google.com/)

---

**Built for**: [Chrome Built-in AI Challenge 2025](https://developer.chrome.com/docs/ai/built-in)
