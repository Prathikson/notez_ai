const apiUrl = import.meta.env.MODE === 'development'
  ? import.meta.env.VITE_API_URL
  : import.meta.env.VITE_API_PRODUCTION_URL;

export const uploadFile = async (
  file: File
): Promise<{ audioUrl: string; transcription: string; summary: string; durationSec: number }> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    console.log('Uploading file...');
    const response = await fetch(`${apiUrl}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`File upload failed: ${errorText}`);
    }

    const result = await response.json();
    console.log('Upload successful:', result);
    const { audioUrl, transcription, summary, durationSec } = result;


    if (
  !audioUrl ||
  !transcription ||
  !summary ||
  typeof durationSec !== 'number' ||
  durationSec <= 0
) {
  throw new Error('Missing audioUrl, transcription, summary, or durationSec in response');
}

    return result;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
