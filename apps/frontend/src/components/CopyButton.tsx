import React, { useState } from 'react';
import { Copy } from 'lucide-react';

interface CopyButtonProps {
  content: string;
  label: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ content, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-[#fffef0] hover:text-white relative"
      title={`Copy ${label} to clipboard`}
      type="button"
    >
      <Copy size={18} />
      {copied && (
        <span className="text-sm text-green-400 absolute -top-5 right-0 animate-fade-in">
          Copied!
        </span>
      )}
    </button>
  );
};

export default CopyButton;
