import { useState, useRef } from 'react';
import { uploadFile } from '../services/api';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Copy } from 'lucide-react';
import PdfExporter from './PdfExporter';

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null); // show copy status

    // const isProUser = true;
  const isProUser = true;
  const resultRef = useRef<HTMLDivElement>(null);





  const handleFileChange = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    setAudioUrl(null);
    setTranscription(null);
    setSummary(null);

    try {
      const { audioUrl, transcription, summary } = await uploadFile(file);
      setAudioUrl(audioUrl);
      setTranscription(transcription);
      setSummary(summary);
    } catch (error) {
      setError('Failed to upload and convert the file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch the MP3 file");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = url.split('/').pop() || 'audio.mp3';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleCopy = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileChange,
    accept: '.mp4',
    multiple: false
  });

  return (
    <motion.div
      className="flex flex-col items-center mt-36 p-6 w-4/5 mx-auto rounded-xl backdrop-blur-lg shadow-2xl border border-white/10"
      style={{ backgroundColor: '#003934', color: '#fffef0' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-semibold mb-6">Notez AI</h1>

      {/* Drop Zone */}
      <motion.div
        {...getRootProps()}
        className="border-2 border-dashed border-[#fffef0]/50 p-8 w-full text-center rounded-xl cursor-pointer hover:bg-[#fffef0]/10 transition-all duration-300 ease-in-out mb-6"
      >
        <input {...getInputProps()} />
        <p className="text-lg font-medium">
          {file ? file.name : "🫳 Drag & Drop your MP4 file here, or click to select a file."}
        </p>
      </motion.div>

      {/* Upload Button */}
      <motion.button
        onClick={handleUpload}
        disabled={isUploading || !file}
        className="bg-gradient-to-br from-white to-[#fffef0] text-[#003934] px-6 py-3 rounded-full mb-4 font-semibold shadow-md hover:opacity-90 transition-all duration-300"
      >
        {isUploading ? 'Uploading...' : 'Upload and Convert'}
      </motion.button>

      {error && <div className="text-red-400 mb-2">{error}</div>}

      {audioUrl && (
        <motion.div
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            onClick={() => handleDownload(audioUrl)}
            className="text-[#003934] bg-[#fffef0] font-semibold text-lg py-2 px-4 rounded-full hover:bg-white transition-all duration-200"
          >
            ⬇️ Download MP3
          </motion.button>
        </motion.div>
      )}

      <div ref={resultRef}>

      {transcription && (
        <motion.div 
          className="bg-[#fffef0]/10 p-4 rounded-xl shadow-inner w-full text-left relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">📝 Transcription:</h2>
            <motion.button
              onClick={() => handleCopy(transcription, 'transcription')}
              whileTap={{ scale: 0.9 }}
              className="text-[#fffef0] hover:text-white"
              title="Copy to clipboard"
            >
              <Copy size={18} />
            </motion.button>
          </div>
          {copied === 'transcription' && (
            <motion.span
              className="text-sm text-green-400 absolute top-1 right-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Copied!
            </motion.span>
          )}
          <p className="whitespace-pre-wrap text-[#fffef0]/90">{transcription}</p>
        </motion.div>
      )}

      {summary && (
        <motion.div
          className="bg-[#fffef0]/10 p-4 rounded-xl shadow-inner w-full text-left mt-4 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">📜 Summary and Action Items:</h2>
            <motion.button
              onClick={() => handleCopy(summary, 'summary')}
              whileTap={{ scale: 0.9 }}
              className="text-[#fffef0] hover:text-white"
              title="Copy to clipboard"
            >
              <Copy size={18} />
            </motion.button>
          </div>
          {copied === 'summary' && (
            <motion.span
              className="text-sm text-green-400 absolute top-1 right-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Copied!
            </motion.span>
          )}
          
          <p className="font-medium text-[#fffef0]">Summary:</p>
          <p className="whitespace-pre-wrap mb-2 text-[#fffef0]/90">{summary}</p>
        </motion.div>
      )}
      </div>
      {/* {transcription && summary &&(
        <PdfExporter refToExport={resultRef} isProUser={isProUser} />
      )} */}
    </motion.div>
  );
};

export default FileUpload;
