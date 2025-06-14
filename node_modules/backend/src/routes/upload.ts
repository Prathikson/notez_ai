import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { extractAudio } from '../services/ffmpeg';
import fs from 'fs';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
import { getAudioDurationInSeconds } from 'get-audio-duration';

dotenv.config();

const router = express.Router();
const url = process.env.URL!;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Multer storage configuration
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// POST /upload
router.post('/', upload.single('file'), async (req: Request & { file?: Express.Multer.File }, res: Response): Promise<void> => {
  try {
    console.log('File uploaded:', req.file?.originalname);

    const uploadedFilePath = req.file?.path;
    if (!uploadedFilePath) {
      console.error('No file uploaded');
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    console.log('Converting to MP3...');
    const audioPath = await extractAudio(uploadedFilePath);
    if (!audioPath) {
      console.error('Audio conversion failed');
      res.status(500).json({ error: 'Audio conversion failed' });
      return;
    }

    const audioFileName = path.basename(audioPath);
    const absoluteAudioPath = path.resolve('uploads', audioFileName);
    const audioUrl = `${url}/uploads/${audioFileName}`;

    // Get duration of the audio file (in seconds)
    const durationSec = await getAudioDurationInSeconds(absoluteAudioPath);
    console.log('Audio duration (seconds):', durationSec);

    // Transcribe the audio with OpenAI Whisper
    console.log('Transcribing audio...');
    const transcriptionResult = await openai.audio.transcriptions.create({
      file: fs.createReadStream(absoluteAudioPath),
      model: 'whisper-1',
      response_format: 'json',
    });

    const transcriptionText = transcriptionResult.text;
    console.log('Transcription result:', transcriptionText);

    // Summarize and extract action items using GPT
    console.log('Summarizing and extracting action items...');
    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an assistant that summarizes meetings and extracts clear action items.',
        },
        {
          role: 'user',
          content: `Here is a meeting transcript:\n\n${transcriptionText}\n\nPlease provide a concise summary and a list of action items.`,
        },
      ],
      temperature: 0.7,
    });

    const gptOutput = gptResponse.choices[0]?.message?.content || 'No summary available';
    console.log('GPT output:', gptOutput);

    // Send response with audio URL, transcription, summary, and duration
    res.status(200).json({
      audioUrl,
      transcription: transcriptionText,
      summary: gptOutput,
      durationSec, // <--- duration included here
    });
  } catch (err) {
    console.error('Error in upload route:', err);
    res.status(500).json({ error: 'Conversion, transcription, or summarization failed' });
  }
});

export default router;
