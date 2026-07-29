import React from 'react';
import { X, Github, Cloud, Download, Key, CheckCircle2, Terminal, ExternalLink } from 'lucide-react';

interface ExportNetlifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportNetlifyModal: React.FC<ExportNetlifyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B3022]/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#F7F8F3] rounded-[32px] max-w-2xl w-full shadow-2xl border border-[#1B3022]/10 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#1B3022] p-6 sm:p-8 text-[#F7F8F3] flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-white/10 rounded-full backdrop-blur-md">
              <Cloud className="w-6 h-6 text-[#A7C957]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#A7C957]">
                Free Deployment Guide
              </span>
              <h2 className="editorial-serif text-2xl sm:text-3xl font-light italic text-[#F7F8F3]">
                Export to GitHub & Netlify
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-[#F7F8F3]/70 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto text-[#1B3022] text-xs">
          {/* Overview Callout */}
          <div className="p-4 bg-[#E8EDE0] rounded-[20px] border border-[#1B3022]/10 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-[#6A994E] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#1B3022]">Pre-Configured for Netlify & Serverless Deployment</p>
              <p className="text-xs text-[#1B3022]/75 mt-1 leading-relaxed">
                This project includes a pre-built <code className="bg-white px-1.5 py-0.5 rounded border border-[#1B3022]/10 font-mono text-[11px]">netlify.toml</code> and <code className="bg-white px-1.5 py-0.5 rounded border border-[#1B3022]/10 font-mono text-[11px]">netlify/functions/chat.js</code> serverless handler. You can export the repository, push to GitHub, and deploy to Netlify for free!
              </p>
            </div>
          </div>

          {/* Step 1 */}
          <div className="bg-white border border-[#1B3022]/10 rounded-[20px] p-5 space-y-2 shadow-2xs">
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 rounded-full bg-[#1B3022] text-[#A7C957] font-bold text-xs flex items-center justify-center">1</span>
              <h3 className="editorial-serif text-xl font-normal italic text-[#1B3022] flex items-center gap-2">
                <Download className="w-4 h-4 text-[#6A994E]" /> Download Code Files
              </h3>
            </div>
            <p className="text-xs text-[#1B3022]/70 pl-9">
              In the AI Studio header menu, click <strong>Settings &gt; Export Project as ZIP</strong> or <strong>Push to GitHub</strong>.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-[#1B3022]/10 rounded-[20px] p-5 space-y-3 shadow-2xs">
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 rounded-full bg-[#1B3022] text-[#A7C957] font-bold text-xs flex items-center justify-center">2</span>
              <h3 className="editorial-serif text-xl font-normal italic text-[#1B3022] flex items-center gap-2">
                <Github className="w-4 h-4 text-[#6A994E]" /> Push to GitHub Repository
              </h3>
            </div>
            <div className="pl-9 space-y-2 text-xs text-[#1B3022]/70">
              <p>Initialize git and push to your GitHub account:</p>
              <div className="bg-[#1B3022] text-[#A7C957] p-4 rounded-[16px] font-mono text-[11px] overflow-x-auto space-y-1">
                <div>git init</div>
                <div>git add .</div>
                <div>git commit -m "Initial commit of EcoBuddy AI"</div>
                <div>git remote add origin https://github.com/YOUR_USERNAME/eco-buddy-ai.git</div>
                <div>git push -u origin main</div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-[#1B3022]/10 rounded-[20px] p-5 space-y-3 shadow-2xs">
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 rounded-full bg-[#1B3022] text-[#A7C957] font-bold text-xs flex items-center justify-center">3</span>
              <h3 className="editorial-serif text-xl font-normal italic text-[#1B3022] flex items-center gap-2">
                <Cloud className="w-4 h-4 text-[#6A994E]" /> Connect Repository to Netlify
              </h3>
            </div>
            <ol className="pl-9 list-disc list-inside space-y-2 text-xs text-[#1B3022]/75">
              <li>Log in to <a href="https://app.netlify.com" target="_blank" rel="noopener noreferrer" className="text-[#6A994E] underline font-bold inline-flex items-center gap-1">Netlify.com <ExternalLink className="w-3 h-3" /></a>.</li>
              <li>Click <strong>"Add new site" &gt; "Import an existing project" &gt; GitHub</strong>.</li>
              <li>Select your <code className="bg-[#F7F8F3] px-1.5 py-0.5 rounded border border-[#1B3022]/10 font-mono">eco-buddy-ai</code> repository.</li>
              <li>Build command: <code className="bg-[#F7F8F3] px-1.5 py-0.5 rounded border border-[#1B3022]/10 font-mono">npm run build</code>, Publish directory: <code className="bg-[#F7F8F3] px-1.5 py-0.5 rounded border border-[#1B3022]/10 font-mono">dist</code>.</li>
            </ol>
          </div>

          {/* Step 4 */}
          <div className="bg-[#E8EDE0] border border-[#1B3022]/20 rounded-[20px] p-5 space-y-3 shadow-2xs">
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 rounded-full bg-[#1B3022] text-[#A7C957] font-bold text-xs flex items-center justify-center">4</span>
              <h3 className="editorial-serif text-xl font-normal italic text-[#1B3022] flex items-center gap-2">
                <Key className="w-4 h-4 text-[#6A994E]" /> Set Gemini API Key Environment Variable
              </h3>
            </div>
            <div className="pl-9 space-y-2 text-xs text-[#1B3022]/80">
              <p>In Netlify Site Dashboard:</p>
              <p className="font-semibold">Go to <strong>Site configuration &gt; Environment variables &gt; Add a variable</strong>:</p>
              <div className="bg-white p-3 rounded-[14px] border border-[#1B3022]/10 font-mono text-[11px] flex flex-col sm:flex-row items-start sm:items-center justify-between text-[#1B3022] gap-2">
                <span>Key: <strong className="text-[#6A994E]">GEMINI_API_KEY</strong></span>
                <span>Value: <em>[Your Gemini API Key from Google AI Studio]</em></span>
              </div>
              <p className="text-[11px] text-[#1B3022]/70 mt-1">
                You can generate a free Gemini API key anytime at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline font-bold text-[#6A994E]">aistudio.google.com/app/apikey</a>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#E8EDE0]/50 p-4 px-8 border-t border-[#1B3022]/10 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-[#1B3022] hover:bg-[#A7C957] text-[#F7F8F3] hover:text-[#1B3022] font-bold rounded-full text-[10px] uppercase tracking-widest transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

