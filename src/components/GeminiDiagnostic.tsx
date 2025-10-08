import { useState, useEffect } from 'react';

interface DiagnosticResult {
  chromeVersion: string;
  aiApiExists: boolean;
  languageModelExists: boolean;
  summarizerExists: boolean;
  writerExists: boolean;
  capabilities?: any;
  error?: string;
}

export function GeminiDiagnostic() {
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const runDiagnostic = async () => {
    setIsChecking(true);
    const diagnostic: DiagnosticResult = {
      chromeVersion: navigator.userAgent,
      aiApiExists: !!window.ai,
      languageModelExists: !!window.ai?.languageModel,
      summarizerExists: !!window.ai?.summarizer,
      writerExists: false,
    };

    try {
      if (window.ai?.languageModel) {
        const caps = await window.ai.languageModel.capabilities();
        diagnostic.capabilities = caps;
      }
    } catch (error) {
      diagnostic.error = error instanceof Error ? error.message : 'Unknown error';
    }

    setResult(diagnostic);
    setIsChecking(false);
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  if (!result && isChecking) {
    return (
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-blue-800 dark:text-blue-200">Running diagnostic...</p>
      </div>
    );
  }

  if (!result) return null;

  const allGood = result.aiApiExists && result.languageModelExists && result.capabilities?.available === 'readily';

  return (
    <div className={`p-4 rounded-lg border ${
      allGood
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    }`}>
      <h3 className={`font-semibold mb-3 ${
        allGood ? 'text-green-900 dark:text-green-200' : 'text-red-900 dark:text-red-200'
      }`}>
        Gemini Nano Diagnostic
      </h3>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className={result.aiApiExists ? 'text-green-600' : 'text-red-600'}>
            {result.aiApiExists ? '✓' : '✗'}
          </span>
          <span className={allGood ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}>
            window.ai exists: {result.aiApiExists ? 'Yes' : 'No'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={result.languageModelExists ? 'text-green-600' : 'text-red-600'}>
            {result.languageModelExists ? '✓' : '✗'}
          </span>
          <span className={allGood ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}>
            Language Model API: {result.languageModelExists ? 'Yes' : 'No'}
          </span>
        </div>

        {result.capabilities && (
          <div className="flex items-center gap-2">
            <span className={result.capabilities.available === 'readily' ? 'text-green-600' : 'text-yellow-600'}>
              {result.capabilities.available === 'readily' ? '✓' : '⚠'}
            </span>
            <span className={allGood ? 'text-green-800 dark:text-green-300' : 'text-yellow-800 dark:text-yellow-300'}>
              Status: {result.capabilities.available}
            </span>
          </div>
        )}

        {result.error && (
          <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded text-red-800 dark:text-red-200">
            Error: {result.error}
          </div>
        )}
      </div>

      {!allGood && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-900 dark:text-yellow-200 font-medium mb-2">
            Setup Required:
          </p>
          <ol className="text-xs text-yellow-800 dark:text-yellow-300 list-decimal list-inside space-y-1">
            {!result.aiApiExists && (
              <>
                <li>Open <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">chrome://flags</code></li>
                <li>Enable "Prompt API for Gemini Nano"</li>
                <li>Enable "Optimization Guide On Device Model" → BypassPerfRequirement</li>
                <li>Click "Relaunch" button</li>
              </>
            )}
            {result.capabilities?.available === 'after-download' && (
              <li>Gemini Nano is downloading (~1-2GB). Please wait 5-10 minutes.</li>
            )}
          </ol>
        </div>
      )}

      <button
        onClick={runDiagnostic}
        className="mt-3 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
      >
        Re-check Status
      </button>
    </div>
  );
}
