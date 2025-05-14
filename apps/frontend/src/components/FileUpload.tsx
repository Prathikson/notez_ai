import { useState } from 'react';
import { uploadFile } from '../services/api';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

      {transcription && (
        <motion.div 
          className="bg-[#fffef0]/10 p-4 rounded-xl shadow-inner w-full text-left"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold mb-2">📝 Transcription:</h2>
          <p className="whitespace-pre-wrap text-[#fffef0]/90">{transcription}</p>
        </motion.div>
      )}

      {summary && (
        <motion.div 
          className="bg-[#fffef0]/10 p-4 rounded-xl shadow-inner w-full text-left mt-4"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold mb-2">📜 Summary and Action Items:</h2>
          <p className="font-medium text-[#fffef0]">Summary:</p>
          <p className="whitespace-pre-wrap mb-2 text-[#fffef0]/90">{summary}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FileUpload;
