const Settings = require('../models/Settings');

/**
 * AI Moderation utility to scan text for sensitive/offensive keywords
 * @param {string} text - The content to scan
 * @returns {object} - { isFlagged: boolean, keywords: string[] }
 */
const checkContent = async (text) => {
  if (!text) return { isFlagged: false, keywords: [] };

  // Default common sensitive keywords if DB is empty
  const defaultKeywords = ['đm', 'vcl', 'cl', 'ngu', 'dốt', 'chửi', 'xúc phạm', 'mất dạy', 'vô văn hóa'];
  
  try {
    const settings = await Settings.findOne({ key: 'sensitive_keywords' });
    const keywords = settings ? settings.value : defaultKeywords;
    
    const flagged = [];
    const lowerText = text.toLowerCase();
    
    keywords.forEach(word => {
      if (lowerText.includes(word.toLowerCase())) {
        flagged.push(word);
      }
    });

    return {
      isFlagged: flagged.length > 0,
      keywords: flagged
    };
  } catch (error) {
    console.error('Moderation error:', error);
    return { isFlagged: false, keywords: [] };
  }
};

module.exports = { checkContent };
