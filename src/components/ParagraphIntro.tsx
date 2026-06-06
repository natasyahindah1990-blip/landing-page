/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function ParagraphIntro() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 md:p-8 text-center leading-relaxed text-neutral-300"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-32 rounded-full bg-pink-500/5 blur-3xl pointer-events-none"></div>

        {/* Beautiful paragraph exactly matching screenshot highlighting */}
        <p className="text-base sm:text-lg text-neutral-300/90 font-medium">
          Selamat Datang di{' '}
          <span className="text-pink-500 font-semibold tracking-wide [text-shadow:_0_0_12px_rgba(244,63,94,0.3)] animate-pulse">
            Hasrat Sesaat
          </span>
          . Kami menyediakan{' '}
          <span className="text-pink-400 font-semibold hover:text-pink-300 transition-colors duration-300">
            video sensasi terbaik
          </span>{' '}
          dan{' '}
          <span className="text-pink-400 font-semibold hover:text-pink-300 transition-colors duration-300">
            video pemuas hasrat
          </span>
          , dan rasakan kepuasan sensual secara{' '}
          <span className="text-white font-bold border-b border-white hover:border-pink-500 transition-colors pb-0.5 inline-block cursor-help">
            Gratis & Aman
          </span>
          .
        </p>

        {/* Hover Sparkles label */}
        <div className="flex justify-center gap-1.5 mt-4 text-xs text-neutral-500 select-none">
          <Sparkles className="w-3.5 h-3.5 text-pink-500/60" />
          <span>Silakan pilih gerbang sensasi Anda di bawah</span>
        </div>
      </motion.div>
    </div>
  );
}
