import fetch from 'node-fetch';
require('dotenv').config();

const API_URL = 'https://api.printful.com'; // Base URL for Printful API
const TOKEN = process.env.PRINTFUL_PRIVATE_TOKEN;

export const fetchPrintfulData = async (endpoint: string): Promise<PrintfulResponse> => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: PrintfulResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};


interface PrintfulProduct {
    id: number;
    name: string;
    // Add other fields as needed
  }
  
  interface PrintfulResponse {
    result: PrintfulProduct[];
    // Add other fields as needed
  }
  
