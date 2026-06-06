/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server-side Gemini API client initialization
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API: Server-side Gemini Creative Writer Endpoint
  app.post('/api/creative-romance', async (req, res) => {
    try {
      const { vibe, character, location } = req.body;

      if (!vibe || !character || !location) {
        res.status(400).json({ error: 'Mohon isi semua parameter adegan.' });
        return;
      }

      const systemInstruction = `
        Anda adalah redaktur sastra romantis dewasa profesional bernama "AI Hasrat". Tugas Anda adalah menulis sebuah rancangan adegan fiksi romantis sensorik yang sangat indah, puitis, mendebarkan, dan aman dalam Bahasa Indonesia berdasarkan masukan pengguna.
        Fokuslah sepenuhnya pada atmosfer, relaksasi pikiran, pancaran kehangatan, suara ambien (seperti rintik hujan atau detak jantung), kontak mata, percakapan bermakna, sentuhan lembut yang menguji kerinduan jiwa, rasa teh hangat, keheningan perapian, serta jalinan asmara emosional secara sopan dan bernilai seni tinggi.
        DILARANG menulis konten berbau eksplisit kasar. Tetap jaga keanggunan gaya bahasa puitis sastrawan kelas dunia. Format tulisan Anda ke dalam struktur pengantar suasana yang kaya imajinasi, diikuti oleh 3 sampai 4 paragraf berisi nukilan adegan yang mendalam dan intens secara emosional.
      `;

      const prompt = `
        Suasana (Vibe): ${vibe}
        Karakter Utama: ${character}
        Lokasi Tempat: ${location}

        Tuliskan kisah romansa sensorik puitis dalam Bahasa Indonesia yang indah berdasarkan ketiga elemen di atas.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.85,
        },
      });

      const story = response.text || '';
      res.json({ story });
    } catch (error: any) {
      console.error('Gemini error:', error);
      res.status(500).json({ 
        error: 'Terjadi kesalahan saat memproses kisah dengan AI.', 
        details: error?.message || String(error)
      });
    }
  });

  // Integration with Vite
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development middleware integrated.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA Fallback inside Express CJS/ESM
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Hasrat Sesaat] Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server boot failure:', err);
});
