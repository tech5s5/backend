import axios from 'axios';

export const simplifyText = async (contractText) => {
  try {
    const response = await axios.post('http://localhost:8000/api/simplify', {
      contract: contractText,  // ✅ send with correct key
    });
    return response.data.simplified_contract;
  } catch (error) {
    console.error("Error simplifying text:", error);
    throw error;
  }
};
