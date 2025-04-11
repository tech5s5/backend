import { useState } from "react";
import { useDropzone } from "react-dropzone";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.js?url";
import { simplifyText } from '../services/api';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function UploadSection({ setOriginalText, setSimplifiedText }) {
  const [textInput, setTextInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
    },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      setIsProcessing(true);
      setErrorMessage("");
      const file = acceptedFiles[0];

      try {
        if (file.type === "application/pdf") {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({
            data: arrayBuffer,
            disableFontLoading: true,
            useSystemFonts: true
          }).promise;
          
          let extractedText = "";
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            
            if (!textContent.items || textContent.items.length === 0) {
              throw new Error("PDF appears to be image-based - text extraction failed");
            }
            
            extractedText += textContent.items
              .map((item) => item.str)
              .join(" ")
              .replace(/\s+/g, " ") + "\n\n";
          }

          if (!extractedText.trim()) {
            throw new Error("Failed to extract text from PDF - file may be scanned or corrupted");
          }

          setOriginalText(extractedText);
          setTextInput(extractedText);
          console.log("Successfully extracted PDF text:", extractedText);

        } else if (file.type === "text/plain") {
          const text = await file.text();
          setOriginalText(text);
          setTextInput(text);
        }
      } catch (error) {
        console.error("Text extraction failed:", error);
        setErrorMessage(
          error.message || "Failed to extract text. Please ensure the PDF contains selectable text."
        );
        setOriginalText("");
        setTextInput("");
      }
      setIsProcessing(false);
    },
  });

  const handleSubmit = async () => {
    if (!textInput.trim()) {
      setErrorMessage("Please provide some text to simplify");
      return;
    }

    setErrorMessage("");
    setOriginalText(textInput);
    setIsProcessing(true);

    try {
      const simplified = await simplifyText(textInput);
      setSimplifiedText(simplified);
    } catch (error) {
      setErrorMessage("Failed to simplify text. Please try again.");
      console.error("Simplification error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl mt-6 border-2 border-dashed border-blue-100 dark:border-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
        📑 AI Contract Simplifier
      </h2>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* File Upload Area */}
      <div
        {...getRootProps()}
        className={`mb-6 p-8 text-center cursor-pointer rounded-xl transition-all
          ${
            isDragActive
              ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
              : "bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-600"
          }`}
      >
        <input {...getInputProps()} />
        <div className="text-gray-600 dark:text-gray-300">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-lg">
            {isDragActive ? "Drop file here" : "Drag & drop file, or click to upload"}
          </p>
          <p className="text-sm mt-2">Supports PDF and TXT files (text-based only)</p>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        <span className="px-4 text-gray-500 dark:text-gray-400">or</span>
        <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
      </div>

      {/* Text Input */}
      <div className="mb-6">
        <textarea
          value={textInput}
          onChange={(e) => {
            setTextInput(e.target.value);
            setErrorMessage("");
          }}
          rows={6}
          placeholder="Paste contract text here..."
          className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl
            focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900
            transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isProcessing}
        className={`w-full py-3 px-6 text-lg font-semibold rounded-xl transition-all
          ${
            isProcessing
              ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-lg hover:shadow-xl"
          }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        ) : (
          "Simplify Document ✨"
        )}
      </button>

      {/* Output Preview */}    
      {textInput && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            📄 Extracted Text Preview:
          </h3>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl max-h-80 overflow-y-auto text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
            {textInput.length > 500 
              ? `${textInput.substring(0, 500)}... (truncated)`
              : textInput}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Showing first {Math.min(textInput.length, 500)} characters
          </p>
        </div>
      )}
    </div>
  );
}

export default UploadSection;