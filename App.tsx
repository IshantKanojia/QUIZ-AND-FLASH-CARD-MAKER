
import React, { useState, useCallback } from 'react';
import { OutputType, StudyAids } from './types';
import { generateStudyAids } from './services/geminiService';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { OutputTypeSelector } from './components/OutputTypeSelector';
import { Loader } from './components/Loader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { RobotIcon } from './components/icons';

// @ts-ignore
const { pdfjsLib } = window;

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [selectedOutputs, setSelectedOutputs] = useState<Set<OutputType>>(new Set([OutputType.FLASHCARDS]));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [results, setResults] = useState<StudyAids | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      setFile(null);
      return;
    }
    if (selectedFile && selectedFile.size > 20 * 1024 * 1024) { // 20 MB limit
      setError('File size exceeds 20MB. Please upload a smaller PDF.');
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setError(null);
    setResults(null);
  };

  const handleOutputToggle = (outputType: OutputType) => {
    setSelectedOutputs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(outputType)) {
        newSet.delete(outputType);
      } else {
        newSet.add(outputType);
      }
      return newSet;
    });
  };

  const extractTextFromPdf = useCallback(async (pdfFile: File): Promise<string> => {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    let fullText = '';
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  }, []);

  const handleGenerate = async () => {
    if (!file || selectedOutputs.size === 0) {
      setError('Please select a PDF file and at least one output type.');
      return;
    }

    setIsLoading(true);
    setResults(null);
    setError(null);

    try {
      setLoadingMessage('Extracting text from your PDF...');
      const text = await extractTextFromPdf(file);
      setExtractedText(text);

      // Truncate text if it's too long to avoid hitting API limits
      const maxChars = 100000; 
      const truncatedText = text.length > maxChars ? text.substring(0, maxChars) : text;

      setLoadingMessage('AI is generating your study materials...');
      const generatedResults = await generateStudyAids(truncatedText, Array.from(selectedOutputs));
      
      setResults(generatedResults);

    } catch (err) {
      console.error(err);
      setError('An error occurred while generating study materials. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };
  
  const handleRegenerateQuiz = async () => {
    if (!extractedText) {
      setError('Could not regenerate quiz. Please generate study aids first.');
      return;
    }

    setIsLoading(true);
    setLoadingMessage('AI is generating a new quiz for you...');
    setError(null);

    try {
      const maxChars = 100000;
      const truncatedText = extractedText.length > maxChars ? extractedText.substring(0, maxChars) : extractedText;

      const newQuizResult = await generateStudyAids(truncatedText, [OutputType.QUIZ]);
      
      if (newQuizResult.quiz) {
        setResults(prevResults => ({
          ...(prevResults || {}),
          flashcards: prevResults?.flashcards, // Keep old flashcards
          quiz: newQuizResult.quiz,
        }));
      } else {
         throw new Error("The AI did not return a new quiz.");
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the new quiz. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Transform Your Documents into Knowledge</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Upload a PDF and let AI create flashcards and quizzes for you.</p>
          </div>

          <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg p-6 md:p-8 space-y-8 border border-slate-200 dark:border-slate-700">
            <FileUpload file={file} onFileChange={handleFileChange} />
            <OutputTypeSelector selectedOutputs={selectedOutputs} onToggle={handleOutputToggle} />
            
            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              onClick={handleGenerate}
              disabled={isLoading || !file || selectedOutputs.size === 0}
              className="w-full bg-sky-600 text-white font-bold py-3 px-6 rounded-lg text-lg flex items-center justify-center gap-3 hover:bg-sky-700 transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100"
            >
              {isLoading ? 'Generating...' : 'Generate Study Aids'}
              <RobotIcon />
            </button>
          </div>

          {isLoading && <Loader message={loadingMessage} />}
          {results && !isLoading && <ResultsDisplay results={results} onRegenerateQuiz={handleRegenerateQuiz} />}
        </div>
      </main>
    </div>
  );
}