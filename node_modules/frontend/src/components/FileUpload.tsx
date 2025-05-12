import { useState } from 'react';
import { uploadFile } from '../services/api'; 
import { motion } from 'framer-motion';

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
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

    // Optional: infer filename from the original URL
    const filename = url.split('/').pop() || 'audio.mp3';
    link.download = filename;

    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl); // Clean up

  } catch (error) {
    console.error("Download error:", error);
  }
};

  return (
    <motion.div 
      className="flex flex-col items-center mt-36 p-6 max-w-xl mx-auto bg-white shadow-lg rounded-xl mt-8"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-semibold text-blue-600 mb-6">NoteZ AI</h1>

      <motion.input
        type="file"
        accept="video/mp4"
        onChange={handleFileChange}
        disabled={isUploading}
        className="mb-4 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <motion.button
        onClick={handleUpload}
        disabled={isUploading || !file}
        className="bg-blue-500 text-white px-6 py-3 rounded-full mb-4 hover:bg-blue-600 active:bg-blue-700 focus:outline-none transition-all duration-300"
      >
        {isUploading ? 'Uploading...' : 'Upload and Convert'}
      </motion.button>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      {audioUrl && (
        <motion.div
          className="mb-4"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button 
            onClick={() => handleDownload(audioUrl)} 
            className="text-blue-600 font-medium text-lg bg-gray-200 py-2 px-4 rounded-full hover:bg-gray-300 transition-all duration-200"
          >
            ⬇️ Download MP3
          </motion.button>
        </motion.div>
      )}

      {transcription && (
        <motion.div 
          className="bg-gray-100 p-4 rounded-xl shadow-md w-full text-left"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold mb-2">📝 Transcription:</h2>
          <p className="whitespace-pre-wrap text-gray-700">{transcription}</p>
        </motion.div>
      )}

      {summary && (
        <motion.div 
          className="bg-gray-100 p-4 rounded-xl shadow-md w-full text-left mt-4"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold mb-2">📜 Summary and Action Items:</h2>
          <p className="font-medium">Summary:</p>
          <p className="whitespace-pre-wrap mb-2 text-gray-700">{summary}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FileUpload;
