import axios from 'axios';

export const fetchNoun = async () => {
  try {
    const response = await axios.get('https://api.noun-api.com/v1/noun');
    return response.data;
  } catch (error) {
    console.error('Error fetching Noun:', error);
  }
};
