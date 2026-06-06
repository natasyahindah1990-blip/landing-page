/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Heart, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AgeVerification() {
  const [show, setShow] = useState<boolean>(false);
  const [isDecline, setIsDecline] = useState<boolean>(false);

  useEffect(() => {
    const verified = localStorage.getItem('hasrat_sesaat_verified');
    if (!verified) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('hasrat_sesaat_verified', 'true');
    setShow(false);
  };

  const handleDecline = () => {
    setIsDecline(true);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 px-4 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-pink-500/30 bg-neutral-950 p-8 shadow-2xl shadow-pink-500/10 text-center"
        >
          {/* Neon background decorations */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-pink-500/10 blur-3xl pointers-event-none"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-rose-500/10 blur-3xl pointers-event-none"></div>

          {!isDecline ? (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-500/10 text-pink-500 mb-6 border border-pink-500/20 active:scale-95 transition-transform duration-300">
                <Flame className="w-8 h-8 animate-pulse text-pink-500" />
              </div>

              {/* Glowing title */}
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2 font-sans">
                <span className="text-pink-500 [text-shadow:_0_0_15px_rgba(236,72,153,0.5)]">HASRAT</span> SESAAT
              </h2>
              
              <div className="flex justify-center items-center gap-1.5 mb-6 text-pink-400/80 text-xs tracking-widest uppercase font-mono">
                <Heart className="w-3.5 h-3.5 fill-pink-500 animate-pulse text-pink-500" />
                <span>Pintu Masuk Khusus Dewasa</span>
              </div>

              <div className="space-y-4 text-neutral-400 text-sm leading-relaxed mb-8">
                <p>
                  Situs ini menampilkan koleksi <strong className="text-pink-400">tontonan video viral</strong>, video pemuas hasrat, dan <strong className="text-pink-400">audio ASMR sensual</strong> yang didesain khusus untuk keheningan malam yang mendebarkan.
                </p>
                <p className="text-xs text-neutral-500 bg-neutral-900/60 p-3 rounded-lg border border-neutral-800/50">
                  Untuk melanjutkan, Anda harus mengonfirmasi bahwa Anda telah berusia <strong className="text-pink-400">18 tahun atau lebih</strong>. Kami menghormati privasi dan keamanan digital Anda sepenuhnya.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  id="btn-decline-age"
                  onClick={handleDecline}
                  className="flex-1 px-5 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:text-white hover:bg-neutral-800/40 hover:border-neutral-700 transition-all duration-300 font-medium text-sm cursor-pointer"
                >
                  Belum 18 Tahun
                </button>
                <button
                  id="btn-confirm-age"
                  onClick={handleAccept}
                  className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-medium text-sm hover:from-pink-500 hover:to-rose-500 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 active:scale-[0.98] border border-pink-400/20 cursor-pointer"
                >
                  Saya Berusia 18+
                </button>
              </div>
            </>
          ) : (
            <div className="py-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 mb-6 border border-rose-500/20">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-4">Akses Terbatas</h2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                Konten di dalam <strong className="text-pink-400">Hasrat Sesaat</strong> hanya ditujukan khusus bagi pengguna dewasa yang telah matang. Jika Anda belum berusia 18 tahun, Anda tidak dapat menjelajahi tontonan viral maupun asmr kami.
              </p>

              <button
                id="btn-back-home"
                onClick={() => window.location.href = 'https://www.google.com'}
                className="w-full px-5 py-3 rounded-xl bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all duration-300 border border-neutral-800 font-medium text-sm cursor-pointer"
              >
                Keluar dari Website
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
