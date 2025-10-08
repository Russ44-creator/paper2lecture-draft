import { useState } from 'react'

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [status, setStatus] = useState<string>('Ready')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setStatus(`Selected: ${file.name}`)
    }
  }

  const handleUpload = () => {
    if (!selectedFile) {
      setStatus('Please select a PDF file first')
      return
    }

    setStatus(`Processing ${selectedFile.name}...`)
    // TODO: Add PDF extraction logic here
    setTimeout(() => {
      setStatus(`Uploaded: ${selectedFile.name}`)
    }, 1000)
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

          {selectedFile && (
            <div className="mt-6">
              <button
                onClick={handleUpload}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Upload and Process PDF
              </button>
            </div>
          )}

          <div className="mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Status: <span className="font-medium">{status}</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
