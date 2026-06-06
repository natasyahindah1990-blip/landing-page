/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Video, Sparkles, ExternalLink, Play } from 'lucide-react';

export default function TontonanHub() {
  const [tontonanUrl] = useState<string>(() => {
    return localStorage.getItem('hasrat_linked_url') || 'https://www.Asupanlendir.com';
  });

  const handleOpenLink = () => {
    try {
      window.open(tontonanUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error("Gagal membuka tautan:", err);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-6 font-sans">
      {/* Container header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300 font-sans tracking-wide flex items-center gap-2">
            <Video className="w-8 h-8 text-pink-500 animate-pulse" />
            <span>TONTONAN VIRAL</span>
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Kumpulan video viral paling dicari dan tontonan terpanas malam ini.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03, shadow: '0 0 20px rgba(236,72,153,0.4)' }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpenLink}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.35)] transition-all cursor-pointer"
        >
          <Play className="w-4 h-4 text-white fill-current" />
          <span>Buka Portal Utama ({tontonanUrl.replace(/^https?:\/\/(www\.)?/, '')})</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* Featured Banner with dynamic neon effect */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={handleOpenLink}
        className="relative overflow-hidden rounded-3xl border border-pink-500/40 bg-neutral-900/60 p-6 md:p-10 mb-10 cursor-pointer hover:border-pink-500 transition-all shadow-[0_0_30px_rgba(236,72,153,0.1)] group"
      >
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-pink-500/10 blur-3xl pointer-events-none group-hover:bg-pink-500/15 transition-all"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-900/40 border border-pink-500/30 text-pink-400 text-xs font-bold font-mono tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin" />
              <span>REKOMENDASI VIDEO HOT</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight font-sans">
              Nikmati Ribuan Video Panas & Romantis Terupdate
            </h3>
            
            <p className="text-neutral-400 text-sm leading-relaxed">
              Tontonan terbaik pemuas hasrat malam hari. Akses lancar tanpa blokir, tanpa buffering lambat, kualitas visual terbaik dan gratis selamanya.
            </p>
          </div>

          <div className="flex-shrink-0">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-600 group-hover:bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all transform group-hover:scale-105">
              <ExternalLink className="w-7 h-7" />
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
