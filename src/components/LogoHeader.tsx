/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function LogoHeader() {
  return (
    <div className="flex flex-col items-center justify-center pt-8 pb-4 px-4 text-center">
      {/* Visual border wrapper for title brand similar to mockup */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative flex items-center justify-center gap-6 px-10 py-6 rounded-3xl border border-pink-500/20 bg-neutral-900/60 shadow-[0_0_30px_rgba(236,72,153,0.06)] backdrop-blur-md max-w-lg w-full"
      >
        {/* Glow dots */}
        <span className="absolute top-2 right-2 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
        </span>

        {/* Heart Icon button on left side inside a rounded outline box */}
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-pink-500/30 bg-pink-500/5 text-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.15)] animate-pulse hover:scale-105 active:scale-95 transition-all duration-300">
          <Heart className="w-6 h-6 fill-pink-500/60 text-pink-500" />
        </div>

        {/* Brand Text Stack */}
        <div className="flex flex-col items-start select-none">
          {/* HASRAT - Glowing Pink */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-widest leading-none text-pink-500 font-sans [text-shadow:_0_0_20px_rgba(236,72,153,0.6),_0_0_40px_rgba(236,72,153,0.3)]">
            HASRAT
          </h1>
          {/* SESAAT - Silver / White */}
          <span className="text-2xl sm:text-3xl font-bold tracking-[0.25em] leading-none text-gray-100 uppercase mt-1 [text-shadow:_0_0_10px_rgba(255,255,255,0.2)]">
            SESAAT
          </span>
        </div>
      </motion.div>
    </div>
  );
}
