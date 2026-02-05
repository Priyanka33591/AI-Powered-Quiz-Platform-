import { createWorker } from 'tesseract.js';

export const extractTextFromImage = async (imageBuffer) => {
  try {
    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(imageBuffer);
    await worker.terminate();
    return text;
  } catch (error) {
    console.error('Error extracting text from image:', error);
    throw new Error('Failed to extract text from image');
  }
};

