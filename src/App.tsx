/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import AgeVerification from './components/AgeVerification';
import LogoHeader from './components/LogoHeader';
import ParagraphIntro from './components/ParagraphIntro';
import HubSelector from './components/HubSelector';
import TontonanHub from './components/TontonanHub';
import AsmrHub from './components/AsmrHub';
import HasratHub from './components/HasratHub';
import TelegramHub from './components/TelegramHub';

export default function App() {
  // Selected gate/hub: 'stories' (Tontonan Viral), 'hasrat' (Hasrat Viral), 'asmr' (ASMR Viral)
  const [selectedHub, setSelectedHub] = useState<'stories' | 'hasrat' | 'asmr' | 'telegram_grup' | 'telegram_channel'>('stories');

  return (
    <div className="relative min-h-screen bg-[#030303] text-neutral-100 flex flex-col justify-between overflow-x-hidden selection:bg-pink-500 selection:text-white">
      {/* 18+ Age Restriction Screen Gatekeeper */}
      <AgeVerification />

      {/* Decorative Subtle Background Blooms */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none select-none">
        <div className="absolute top-[-100px] left-[15%] w-[450px] h-[450px] rounded-full bg-pink-900/10 blur-[130px] animate-pulse"></div>
        <div className="absolute top-[100px] right-[10%] w-[400px] h-[400px] rounded-full bg-rose-950/10 blur-[150px]"></div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col justify-start">
        
        {/* Glow Header Brand Logo - matches mockup */}
        <LogoHeader />

        {/* Highlighted Welcome text - matches mockup */}
        <ParagraphIntro />

        {/* Experience Selector Toggles - matches mockup */}
        <HubSelector
          selectedHub={selectedHub}
          onSelectHub={(hub) => setSelectedHub(hub)}
        />

        {/* Immersive Sub-Hub Container */}
        <div className="w-full relative min-h-[300px]">
          <AnimatePresence mode="wait">
            {selectedHub === 'stories' ? (
              <motion.div
                key="stories-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <TontonanHub />
              </motion.div>
            ) : selectedHub === 'hasrat' ? (
              <motion.div
                key="hasrat-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <HasratHub />
              </motion.div>
            ) : selectedHub === 'asmr' ? (
              <motion.div
                key="asmr-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <AsmrHub />
              </motion.div>
            ) : selectedHub === 'telegram_grup' ? (
              <motion.div
                key="telegram-grup-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <TelegramHub type="grup" />
              </motion.div>
            ) : (
              <motion.div
                key="telegram-channel-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <TelegramHub type="channel" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>

      {/* Humble Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 border-t border-neutral-900 mt-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
        <div className="flex items-center gap-1.5 select-none">
          <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500/10 animate-pulse" />
          <span className="font-mono font-bold tracking-wider text-neutral-500 uppercase">
            HASRAT SESAAT
          </span>
          <span className="text-neutral-700">|</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        
        <p className="text-center md:text-right max-w-md leading-relaxed">
          Seluruh karya sastra dan audio di dalam platform ini dilindungi oleh undang-undang privasi pengguna. Silakan menyeduh kenyamanan Anda dengan bertanggung jawab.
        </p>
      </footer>
    </div>
  );
}
