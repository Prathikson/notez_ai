import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';


export const extractAudio = (inputPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const outputPath = inputPath.replace(/\.[^/.]+$/, '.mp3');

    ffmpeg(inputPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .output(outputPath)
      .on('end', () => {
        resolve(outputPath);
      })
      .on('error', reject)
      .run();
  });
};
