/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Video, BookOpen, Headphones, ChevronDown, Link2, Check, X, ExternalLink, Heart, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HubSelectorProps {
  selectedHub: 'stories' | 'hasrat' | 'asmr' | 'telegram_grup' | 'telegram_channel' | null;
  onSelectHub: (hub: 'stories' | 'hasrat' | 'asmr' | 'telegram_grup' | 'telegram_channel') => void;
}

export default function HubSelector({ selectedHub, onSelectHub }: HubSelectorProps) {
  const [linkedUrl, setLinkedUrl] = useState<string>(() => {
    return localStorage.getItem('hasrat_linked_url') || 'https://www.Asupanlendir.com';
  });
  const [linkedUrlHasrat, setLinkedUrlHasrat] = useState<string>(() => {
    return localStorage.getItem('hasrat_linked_url_hasrat') || 'https://www.Asupanlendir.com';
  });
  const [linkedUrlStory, setLinkedUrlStory] = useState<string>(() => {
    return localStorage.getItem('hasrat_linked_url_story') || 'https://www.Asupanlendir.com';
  });
  const [linkedUrlTelegramGrup, setLinkedUrlTelegramGrup] = useState<string>(() => {
    return localStorage.getItem('hasrat_linked_url_telegram_grup') || 'https://t.me/Asupanlendir_grup';
  });
  const [linkedUrlTelegramChannel, setLinkedUrlTelegramChannel] = useState<string>(() => {
    return localStorage.getItem('hasrat_linked_url_telegram_channel') || 'https://t.me/Asupanlendir_channel';
  });
  const [tempUrl, setTempUrl] = useState<string>('');
  const [editTarget, setEditTarget] = useState<'stories' | 'hasrat' | 'asmr' | 'telegram_grup' | 'telegram_channel' | null>(null);
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true);

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    let formattedUrl = tempUrl.trim();
    if (!formattedUrl) {
      setIsValidUrl(false);
      return;
    }
    // Simple protocol prepending
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    try {
      new URL(formattedUrl);
      if (editTarget === 'stories') {
        localStorage.setItem('hasrat_linked_url', formattedUrl);
        setLinkedUrl(formattedUrl);
      } else if (editTarget === 'hasrat') {
        localStorage.setItem('hasrat_linked_url_hasrat', formattedUrl);
        setLinkedUrlHasrat(formattedUrl);
      } else if (editTarget === 'asmr') {
        localStorage.setItem('hasrat_linked_url_story', formattedUrl);
        setLinkedUrlStory(formattedUrl);
      } else if (editTarget === 'telegram_grup') {
        localStorage.setItem('hasrat_linked_url_telegram_grup', formattedUrl);
        setLinkedUrlTelegramGrup(formattedUrl);
      } else if (editTarget === 'telegram_channel') {
        localStorage.setItem('hasrat_linked_url_telegram_channel', formattedUrl);
        setLinkedUrlTelegramChannel(formattedUrl);
      }
      setIsValidUrl(true);
      setEditTarget(null);
    } catch {
      setIsValidUrl(false);
    }
  };

  const handleCardClick = () => {
    onSelectHub('stories');
    try {
      window.open(linkedUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error("Gagal membuka tautan video viral:", err);
    }
  };

  const handleCardHasratClick = () => {
    onSelectHub('hasrat');
    try {
      window.open(linkedUrlHasrat, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error("Gagal membuka tautan hasrat viral:", err);
    }
  };

  const handleCard2Click = () => {
    onSelectHub('asmr');
    try {
      window.open(linkedUrlStory, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error("Gagal membuka tautan asmr viral:", err);
    }
  };

  const handleCardTelegramGrupClick = () => {
    onSelectHub('telegram_grup');
    try {
      window.open(linkedUrlTelegramGrup, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error("Gagal membuka tautan telegram grup:", err);
    }
  };

  const handleCardTelegramChannelClick = () => {
    onSelectHub('telegram_channel');
    try {
      window.open(linkedUrlTelegramChannel, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error("Gagal membuka tautan telegram channel:", err);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-8 mb-12 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* Card 1: TONTONAN VIRAL */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          id="card-hub-stories"
          onClick={handleCardClick}
          className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 p-6 text-center transition-all duration-300 ${
            selectedHub === 'stories'
              ? 'border-pink-500 bg-neutral-900 shadow-[0_0_25px_rgba(236,72,153,0.25)]'
              : 'border-pink-500/40 hover:border-pink-500 bg-neutral-950/70 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]'
          }`}
        >
          {/* Neon background light for story */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-pink-500/10 blur-3xl pointer-events-none"></div>

          <div className="mb-4 flex items-center justify-between">
            <span className="text-[10px] font-bold text-red-500 tracking-[0.25em] uppercase font-mono bg-red-950/40 px-2.5 py-1 rounded-full border border-red-900/40">
              HOT VIRAL
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTempUrl(linkedUrl);
                setIsValidUrl(true);
                setEditTarget('stories');
              }}
              title="Atur Tautan Video/Website"
              className="p-1 px-2.5 rounded-md bg-neutral-900 border border-neutral-800 hover:border-pink-500 hover:text-pink-400 text-xs text-neutral-300 flex items-center gap-1 transition-all z-10 hover:bg-neutral-800"
            >
              <Link2 className="w-3 h-3 text-pink-500" />
              <span>Atur Link</span>
            </button>
          </div>

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pink-500/10 text-pink-500 border border-pink-500/20 mb-5 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
            <Video className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-bold tracking-wider text-rose-100 font-sans [text-shadow:_0_0_10px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2">
            <span>TONTONAN VIRAL</span>
            <ExternalLink className="w-4 h-4 text-pink-500 opacity-60" />
          </h3>
          <p className="text-xs text-neutral-400 mt-2 font-mono">
            Koleksi Kilat Hot Terpopuler
          </p>
        </motion.div>

        {/* Card 2: HASRAT VIRAL */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          id="card-hub-hasrat"
          onClick={handleCardHasratClick}
          className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 p-6 text-center transition-all duration-300 ${
            selectedHub === 'hasrat'
              ? 'border-pink-500 bg-neutral-900 shadow-[0_0_25px_rgba(236,72,153,0.25)]'
              : 'border-pink-500/40 hover:border-pink-500 bg-neutral-950/70 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]'
          }`}
        >
          {/* Neon background light for Hasrat */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-pink-500/10 blur-3xl pointer-events-none"></div>

          <div className="mb-4 flex items-center justify-between">
            <span className="text-[10px] font-bold text-pink-400 tracking-[0.25em] uppercase font-mono bg-pink-950/40 px-2.5 py-1 rounded-full border border-pink-900/40">
              VIRAL CANDY
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTempUrl(linkedUrlHasrat);
                setIsValidUrl(true);
                setEditTarget('hasrat');
              }}
              title="Atur Tautan Video/Website"
              className="p-1 px-2.5 rounded-md bg-neutral-900 border border-neutral-800 hover:border-pink-500 hover:text-pink-400 text-xs text-neutral-300 flex items-center gap-1 transition-all z-10 hover:bg-neutral-800"
            >
              <Link2 className="w-3 h-3 text-pink-500" />
              <span>Atur Link</span>
            </button>
          </div>

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pink-500/10 text-pink-500 border border-pink-500/20 mb-5 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
            <Heart className="w-7 h-7 text-pink-500" />
          </div>

          <h3 className="text-xl font-bold tracking-wider text-rose-100 font-sans [text-shadow:_0_0_10px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2">
            <span>HASRAT VIRAL</span>
            <ExternalLink className="w-4 h-4 text-pink-500 opacity-60" />
          </h3>
          <p className="text-xs text-neutral-400 mt-2 font-mono">
            Koleksi Berisi Sensasi Terbaik
          </p>
        </motion.div>

        {/* Card 3: CERITA VIRAL (Exclusive ASMR) */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          id="card-hub-asmr"
          onClick={handleCard2Click}
          className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 p-6 text-center transition-all duration-300 ${
            selectedHub === 'asmr'
              ? 'border-pink-500 bg-neutral-900 shadow-[0_0_25px_rgba(236,72,153,0.25)]'
              : 'border-pink-500/40 hover:border-pink-500 bg-neutral-950/70 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]'
          }`}
        >
          {/* Subtle light for ASMR */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-pink-500/10 blur-3xl pointer-events-none"></div>

          <div className="mb-4 flex items-center justify-between">
            <span className="text-[10px] font-bold text-pink-400 tracking-[0.25em] uppercase font-mono bg-pink-950/40 px-2.5 py-1 rounded-full border border-pink-900/40">
              EXCLUSIVE
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTempUrl(linkedUrlStory);
                setIsValidUrl(true);
                setEditTarget('asmr');
              }}
              title="Atur Tautan ASMR/Website"
              className="p-1 px-2.5 rounded-md bg-neutral-900 border border-neutral-800 hover:border-pink-500 hover:text-pink-400 text-xs text-neutral-300 flex items-center gap-1 transition-all z-10 hover:bg-neutral-800"
            >
              <Link2 className="w-3 h-3 text-pink-500" />
              <span>Atur Link</span>
            </button>
          </div>

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pink-500/10 text-pink-500 border border-pink-500/20 mb-5 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
            <BookOpen className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-bold tracking-wider text-rose-100 font-sans [text-shadow:_0_0_10px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2">
            <span>CERITA VIRAL</span>
            <ExternalLink className="w-4 h-4 text-pink-500 opacity-60" />
          </h3>
          <p className="text-xs text-neutral-400 mt-2 font-mono">
            ASMR & ASMR Fetish
          </p>
        </motion.div>

        {/* Card 4: GRUP TELEGRAM */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          id="card-hub-telegram-grup"
          onClick={handleCardTelegramGrupClick}
          className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 p-6 text-center transition-all duration-300 ${
            selectedHub === 'telegram_grup'
              ? 'border-pink-500 bg-neutral-900 shadow-[0_0_25px_rgba(236,72,153,0.25)]'
              : 'border-pink-500/40 hover:border-pink-500 bg-neutral-950/70 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]'
          }`}
        >
          {/* Subtle light for Telegram Info */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-pink-500/10 blur-3xl pointer-events-none"></div>

          <div className="mb-4 flex items-center justify-between">
            <span className="text-[10px] font-bold text-pink-400 tracking-[0.25em] uppercase font-mono bg-pink-950/40 px-2.5 py-1 rounded-full border border-pink-900/40">
              TELEGRAM
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTempUrl(linkedUrlTelegramGrup);
                setIsValidUrl(true);
                setEditTarget('telegram_grup');
              }}
              title="Atur Tautan Grup Telegram"
              className="p-1 px-2.5 rounded-md bg-neutral-900 border border-neutral-800 hover:border-pink-500 hover:text-pink-400 text-xs text-neutral-300 flex items-center gap-1 transition-all z-10 hover:bg-neutral-800"
            >
              <Link2 className="w-3 h-3 text-pink-500" />
              <span>Atur Link</span>
            </button>
          </div>

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pink-500/10 text-pink-500 border border-pink-500/20 mb-5 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
            <Send className="w-6 h-6 text-pink-500 rotate-45 transform -translate-x-0.5 translate-y-0.5" />
          </div>

          <h3 className="text-xl font-bold tracking-wider text-rose-100 font-sans [text-shadow:_0_0_10px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2">
            <span>GRUP TELEGRAM</span>
            <ExternalLink className="w-4 h-4 text-pink-500 opacity-60" />
          </h3>
          <p className="text-xs text-neutral-400 mt-2 font-mono">
            Diskusi & Berbagi Video
          </p>
        </motion.div>

        {/* Card 5: CHANNEL TELEGRAM */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          id="card-hub-telegram-channel"
          onClick={handleCardTelegramChannelClick}
          className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 p-6 text-center transition-all duration-300 ${
            selectedHub === 'telegram_channel'
              ? 'border-pink-500 bg-neutral-900 shadow-[0_0_25px_rgba(236,72,153,0.25)]'
              : 'border-pink-500/40 hover:border-pink-500 bg-neutral-950/70 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]'
          }`}
        >
          {/* Subtle light for Telegram Channel */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-pink-500/10 blur-3xl pointer-events-none"></div>

          <div className="mb-4 flex items-center justify-between">
            <span className="text-[10px] font-bold text-pink-400 tracking-[0.25em] uppercase font-mono bg-pink-950/40 px-2.5 py-1 rounded-full border border-pink-900/40">
              TELEGRAM
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTempUrl(linkedUrlTelegramChannel);
                setIsValidUrl(true);
                setEditTarget('telegram_channel');
              }}
              title="Atur Tautan Channel Telegram"
              className="p-1 px-2.5 rounded-md bg-neutral-900 border border-neutral-800 hover:border-pink-500 hover:text-pink-400 text-xs text-neutral-300 flex items-center gap-1 transition-all z-10 hover:bg-neutral-800"
            >
              <Link2 className="w-3 h-3 text-pink-500" />
              <span>Atur Link</span>
            </button>
          </div>

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pink-500/10 text-pink-500 border border-pink-500/20 mb-5 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
            <Send className="w-6 h-6 text-pink-500 rotate-45 transform -translate-x-0.5 translate-y-0.5" />
          </div>

          <h3 className="text-xl font-bold tracking-wider text-rose-100 font-sans [text-shadow:_0_0_10px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2">
            <span>CHANNEL TELEGRAM</span>
            <ExternalLink className="w-4 h-4 text-pink-500 opacity-60" />
          </h3>
          <p className="text-xs text-neutral-400 mt-2 font-mono">
            Pusat Update Tercepat
          </p>
        </motion.div>

      </div>

      {/* Exploration Footer similar to mockup */}
      <div className="flex flex-col items-center justify-center gap-1 mt-10 text-neutral-500 select-none animate-bounce">
        <span className="text-[10px] tracking-[0.3em] font-mono uppercase text-neutral-400">
          EKSPLOR KONTEN UTAMA
        </span>
        <ChevronDown className="w-5 h-5 text-neutral-400" />
      </div>

      {/* Edit URL Modals with AnimatePresence */}
      <AnimatePresence>
        {editTarget !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditTarget(null)}
              className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md"
            ></motion.div>

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-neutral-900 border border-pink-500/30 rounded-2xl p-6 shadow-[0_0_35px_rgba(236,72,153,0.15)] z-10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {editTarget === 'stories' ? (
                    <Video className="w-5 h-5 text-pink-500" />
                  ) : editTarget === 'hasrat' ? (
                    <Heart className="w-5 h-5 text-pink-500" />
                  ) : editTarget === 'telegram_grup' || editTarget === 'telegram_channel' ? (
                    <Send className="w-5 h-5 text-sky-400 rotate-45 transform" />
                  ) : (
                    <BookOpen className="w-5 h-5 text-pink-500" />
                  )}
                  <h3 className="text-lg font-bold text-white font-sans">
                    {editTarget === 'stories' 
                      ? 'Atur Tautan Tontonan Viral' 
                      : editTarget === 'hasrat'
                      ? 'Atur Tautan Hasrat Viral'
                      : editTarget === 'telegram_grup'
                      ? 'Atur Tautan Grup Telegram'
                      : editTarget === 'telegram_channel'
                      ? 'Atur Tautan Channel Telegram'
                      : 'Atur Tautan Cerita Viral'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveUrl} className="space-y-4">
                <div>
                  <label htmlFor="input-viral-url" className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                    Tautan Website (URL)
                  </label>
                  <input
                    id="input-viral-url"
                    type="text"
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    placeholder="Contoh: https://www.youtube.com atau tiktok.com"
                    autoFocus
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500 focus:shadow-[0_0_15px_rgba(236,72,153,0.2)] transition-all font-mono"
                  />
                  {!isValidUrl && (
                    <p className="text-xs text-red-500 mt-1.5 font-mono">
                      Harap masukkan tautan website yang valid!
                    </p>
                  )}
                </div>

                <div className="text-xs text-neutral-500 leading-relaxed bg-neutral-950/50 p-3 rounded-lg border border-neutral-800">
                  <p>✓ Tautan akan disimpan secara lokal sehingga pilihan Anda tetap tersimpan saat membuka portal ini kembali.</p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditTarget(null)}
                    className="px-4 py-2 text-xs font-mono uppercase text-neutral-400 border border-neutral-800 rounded-lg hover:border-neutral-600 hover:text-white transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-mono uppercase text-white bg-pink-600 hover:bg-pink-500 rounded-lg shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Simpan</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
