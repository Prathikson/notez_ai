import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { extractAudio } from '../services/ffmpeg';
import fs from 'fs';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';

const router = express.Router();
dotenv.config();

const production = process.env.PRODUCTION_URL!;

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
    // Log to confirm file upload
    console.log('File uploaded:', req.file?.originalname);

    const uploadedFilePath = req.file?.path;
    if (!uploadedFilePath) {
      console.error('No file uploaded');
      res.status(400).json({ error: 'No file uploaded' });
      return; // Ensure no response is returned here, only res.status() is called
    }

    // Convert to MP3 using FFmpeg
    console.log('Converting to MP3...');
    const audioPath = await extractAudio(uploadedFilePath);
    if (!audioPath) {
      console.error('Audio conversion failed');
      res.status(500).json({ error: 'Audio conversion failed' });
      return; // Same here, no direct return
    }

    const audioFileName = path.basename(audioPath);
    const absoluteAudioPath = path.resolve('uploads', audioFileName);
    // const audioUrl = `http://localhost:5000/uploads/${audioFileName}`;
    const audioUrl = `${production}/uploads/${audioFileName}`;

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

    console.log('Sending response:', {
  audioUrl,
  transcription: transcriptionText,
  summary: gptOutput,
});

    // Send response with audio URL, transcription, and summary
    res.status(200).json({
      audioUrl,
      transcription: transcriptionText,
      summary: gptOutput,
    });
  } catch (err) {
    console.error('Error in upload route:', err);
    res.status(500).json({ error: 'Conversion, transcription, or summarization failed' });
  }
});

export default router;
