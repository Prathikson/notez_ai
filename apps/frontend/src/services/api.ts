const apiUrl = "https://notez-backend-rs5g.onrender.com"

export const uploadFile = async (file: File): Promise<{ audioUrl: string; transcription: string; summary: string }> => {
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

    // Log response data
    console.log('Response:', result);

    if (!result.audioUrl || !result.transcription || !result.summary) {
      throw new Error('Missing audioUrl, transcription, or summary in response');
    }

    return result;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
