import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Copy, Check } from 'lucide-react';
import { uploadFile } from '../services/api';
// import PdfExporter from './PdfExporter'; // Uncomment when needed

const USER_ROLES = {
  FREE: 'free',
  USER: 'user',
  PRO: 'pro',
};

// const FREE_MAX_DURATION_SEC = 2 * 60;
// const USER_MAX_DURATION_SEC = 20 * 60;
const FREE_MAX_CONVERSIONS = 3;

const mockUser = {
  role: USER_ROLES.FREE,
  conversionsUsed: 0,
};

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [copied, setCopied] = useState<'transcription' | 'summary' | null>(null);
  const [durationSec, setDurationSec] = useState<number | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  const resetAll = () => {
    setFile(null);
    setError(null);
    setAudioUrl(null);
    setTranscription(null);
    setSummary(null);
    setDurationSec(null);
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    resetAll();
    const newFile = acceptedFiles[0];

    if (newFile.type !== 'video/mp4') {
      setError('Only MP4 files are accepted.');
      return;
    }

    setFile(newFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    if (mockUser.role === USER_ROLES.FREE && mockUser.conversionsUsed >= FREE_MAX_CONVERSIONS) {
      setError(`Free users can convert max ${FREE_MAX_CONVERSIONS} files.`);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadFile(file);
      const { audioUrl, transcription, summary, durationSec } = result;

      if (
        !audioUrl ||
        !transcription ||
        !summary ||
        typeof durationSec !== 'number' ||
        durationSec <= 0
      ) {
        throw new Error('Missing audioUrl, transcription, summary, or durationSec in response');
      }

      // if (
      //   (mockUser.role === USER_ROLES.FREE && durationSec > FREE_MAX_DURATION_SEC) ||
      //   (mockUser.role === USER_ROLES.USER && durationSec > USER_MAX_DURATION_SEC)
      // ) {
      //   throw new Error('File duration exceeds your plan’s limit.');
      // }

      setAudioUrl(audioUrl);
      setTranscription(transcription);
      setSummary(summary);
      setDurationSec(durationSec);
      // TODO: Update conversionsUsed in real app
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
      resetAll();
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch file');
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = url.split('/').pop() || 'audio.mp3';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError('Failed to download MP3 file.');
    }
  };

  const handleCopy = (text: string, type: 'transcription' | 'summary') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'video/mp4': ['.mp4'] },
    multiple: false,
  });

  return (
    <div
      className="flex flex-col items-center mt-36 p-6 w-4/5 mx-auto rounded-xl backdrop-blur-lg shadow-2xl border border-white/10"
      style={{ backgroundColor: '#003934', color: '#fffef0' }}
    >
      <h1 className="text-4xl font-semibold mb-6">Notez AI</h1>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-[#fffef0]/50 p-8 w-full text-center rounded-xl cursor-pointer hover:bg-[#fffef0]/10 transition-all duration-300 ease-in-out mb-6"
      >
        <input {...getInputProps()} />
        <p className="text-lg font-medium">
          {file ? file.name : '🫳 Drag & Drop your MP4 file here, or click to select a file.'}
        </p>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={isUploading || !file}
        className="bg-gradient-to-br from-white to-[#fffef0] text-[#003934] px-6 py-3 rounded-full mb-4 font-semibold shadow-md hover:opacity-90 transition-all duration-300 disabled:opacity-40"
      >
        {isUploading ? 'Uploading...' : 'Upload and Convert'}
      </button>

      {error && <div className="text-red-400 mb-2">{error}</div>}

      {audioUrl && (
        <div className="mb-4">
          <button
            onClick={() => handleDownload(audioUrl)}
            className="text-[#003934] bg-[#fffef0] font-semibold text-lg py-2 px-4 rounded-full hover:bg-white transition-all duration-200"
          >
            ⬇️ Download MP3
          </button>
        </div>
      )}

      <div ref={resultRef} className="w-full">
  {transcription && (
    <section className="bg-[#fffef0]/10 p-4 rounded-xl shadow-inner w-full text-left relative mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">📝 Transcription:</h2>
        <button
          onClick={() => handleCopy(transcription, 'transcription')}
          title="Copy to clipboard"
          className="text-[#fffef0] hover:text-white transition"
        >
          {copied === 'transcription' ? (
            <Check size={18} className="text-green-400" />
          ) : (
            <Copy size={18} />
          )}
        </button>
      </div>
      <p className="whitespace-pre-wrap text-[#fffef0]/90">{transcription}</p>
    </section>
  )}

  {summary && (
    <section className="bg-[#fffef0]/10 p-4 rounded-xl shadow-inner w-full text-left relative">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">📜 Summary and Action Items:</h2>
        <button
          onClick={() => handleCopy(summary, 'summary')}
          title="Copy to clipboard"
          className="text-[#fffef0] hover:text-white transition"
        >
          {copied === 'summary' ? (
            <Check size={18} className="text-green-400" />
          ) : (
            <Copy size={18} />
          )}
        </button>
      </div>
      <p className="font-medium text-[#fffef0]">Summary:</p>
      <p className="whitespace-pre-wrap mb-2 text-[#fffef0]/90">{summary}</p>
    </section>
  )}
</div>


      {/* PDF Export Placeholder */}
      {/* {transcription && summary && (
        <PdfExporter refToExport={resultRef} />
      )} */}
    </div>
  );
};

export default FileUpload;
