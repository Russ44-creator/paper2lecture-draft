import { useState, useEffect } from 'react'
import { extractTextFromPDF, isPDF, getTextPreview } from '@/services/pdfExtractor'
import { analyzePaperStructure, isGeminiNanoAvailable } from '@/services/geminiNano'
import { GeminiDiagnostic } from '@/components/GeminiDiagnostic'
import type { PDFData, PaperAnalysis } from '@/types'

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [status, setStatus] = useState<string>('Ready')
  const [pdfData, setPdfData] = useState<PDFData | null>(null)
  const [paperAnalysis, setPaperAnalysis] = useState<PaperAnalysis | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [geminiAvailable, setGeminiAvailable] = useState<boolean | null>(null)

  // Check Gemini Nano availability on component mount
  useEffect(() => {
    isGeminiNanoAvailable().then(setGeminiAvailable);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!isPDF(file)) {
        setError('Please select a valid PDF file')
        setStatus('Error: Invalid file type')
        return
      }

      setSelectedFile(file)
      setStatus(`Selected: ${file.name}`)
      setError(null)
      setPdfData(null)
      setPaperAnalysis(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatus('Please select a PDF file first')
      return
    }

    setIsProcessing(true)
    setError(null)
    setStatus(`Extracting text from ${selectedFile.name}...`)

    try {
      // Step 1: Extract text from PDF
      const data = await extractTextFromPDF(selectedFile)
      setPdfData(data)
      setStatus(`Extracted ${data.pageCount} pages. Analyzing with Gemini Nano...`)

      // Step 2: Analyze with Gemini Nano (if available)
      if (geminiAvailable) {
        try {
          const analysis = await analyzePaperStructure(data.text)
          setPaperAnalysis(analysis)
          setStatus(`Analysis complete! Found ${analysis.sections.length} sections.`)
        } catch (analysisError) {
          console.error('Gemini analysis failed:', analysisError)
          setStatus(`Extracted ${data.pageCount} pages (AI analysis unavailable)`)
          // Don't throw - we still have the PDF text
        }
      } else {
        setStatus(`Extracted ${data.pageCount} pages (Gemini Nano not available)`)
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      setStatus(`Error: ${errorMessage}`)
      console.error('PDF extraction error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Paper2Lecture
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            AI-Powered Research Paper Summarizer
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Gemini Nano Diagnostic */}
        <div className="mb-6">
          <GeminiDiagnostic />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Upload a Research Paper
          </h2>

          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Select a PDF file to get started
            </p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                dark:file:bg-blue-900 dark:file:text-blue-200"
            />
          </div>

          {selectedFile && !pdfData && (
            <div className="mt-6">
              <button
                onClick={handleUpload}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Upload and Process PDF'}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">
                Error: {error}
              </p>
            </div>
          )}

          <div className="mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Status: <span className="font-medium">{status}</span>
            </p>
          </div>
        </div>

        {/* Display Gemini Nano Warning if not available */}
        {pdfData && geminiAvailable === false && (
          <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h3 className="font-medium text-yellow-900 dark:text-yellow-200 mb-2">
              AI Analysis Unavailable
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              Gemini Nano is not available. Enable Chrome AI flags to get intelligent paper analysis.
              See README for setup instructions.
            </p>
          </div>
        )}

        {/* Display AI-Powered Paper Analysis */}
        {paperAnalysis && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              AI-Powered Paper Analysis
            </h2>

            {/* Title and Authors */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {paperAnalysis.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Authors:</strong> {paperAnalysis.authors.join(', ')}
              </p>
            </div>

            {/* Abstract */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                Abstract
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-300 whitespace-pre-wrap">
                {paperAnalysis.abstract}
              </p>
            </div>

            {/* Key Findings */}
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-900 dark:text-green-200 mb-2">
                Key Findings
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-green-800 dark:text-green-300">
                {paperAnalysis.keyFindings.map((finding, idx) => (
                  <li key={idx}>{finding}</li>
                ))}
              </ul>
            </div>

            {/* Sections */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Paper Sections
              </h4>
              <div className="space-y-3">
                {paperAnalysis.sections.map((section, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                      {section.heading}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Methodology and Conclusions */}
            {paperAnalysis.methodology && (
              <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-medium text-purple-900 dark:text-purple-200 mb-2">
                  Methodology
                </h4>
                <p className="text-sm text-purple-800 dark:text-purple-300">
                  {paperAnalysis.methodology}
                </p>
              </div>
            )}

            {paperAnalysis.conclusions && (
              <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="font-medium text-orange-900 dark:text-orange-200 mb-2">
                  Conclusions
                </h4>
                <p className="text-sm text-orange-800 dark:text-orange-300">
                  {paperAnalysis.conclusions}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Display Extracted PDF Data */}
        {pdfData && !paperAnalysis && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Extracted PDF Content
            </h2>

            {/* PDF Metadata */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Document Information
              </h3>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                {pdfData.title && (
                  <p><strong>Title:</strong> {pdfData.title}</p>
                )}
                {pdfData.author && (
                  <p><strong>Author:</strong> {pdfData.author}</p>
                )}
                <p><strong>Pages:</strong> {pdfData.pageCount}</p>
                <p><strong>Characters:</strong> {pdfData.text.length.toLocaleString()}</p>
              </div>
            </div>

            {/* Text Preview */}
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Text Preview (first 1000 characters)
              </h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                  {getTextPreview(pdfData.text, 1000)}
                </pre>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSelectedFile(null)
                  setPdfData(null)
                  setPaperAnalysis(null)
                  setStatus('Ready')
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
              >
                Upload Another PDF
              </button>
              <button
                onClick={() => console.log('Full text:', pdfData.text)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Log Full Text to Console
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
