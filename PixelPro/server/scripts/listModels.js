import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('No GEMINI_API_KEY found in environment.');
      process.exit(1);
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Attempt to list models. The client exposes different methods across versions;
    // try common method names and print helpful errors.
    if (typeof genAI.listModels === 'function') {
      const res = await genAI.listModels();
      console.log('Models (listModels):', JSON.stringify(res, null, 2));
      return;
    }

    if (typeof genAI.getModels === 'function') {
      const res = await genAI.getModels();
      console.log('Models (getModels):', JSON.stringify(res, null, 2));
      return;
    }

    console.log('No listModels/getModels method available on GoogleGenerativeAI client.');
    console.log('Attempting to fetch a known model to see supported names...');

    // Try a quick generative model fetch to produce a clearer error
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      console.log('Successfully created model client for gemini-1.5-flash (may or may not be valid)');
    } catch (err) {
      console.error('Error while creating generative model client:', err?.message || err);
    }
  } catch (error) {
    console.error('Unexpected error listing models:', error);
    process.exit(1);
  }
}

listModels();
