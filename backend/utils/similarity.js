const levenshtein = require("fast-levenshtein");

exports.calculateSimilarity = (text1, text2) => {
    const distance = levenshtein.get(text1, text2);
    const maxLength = Math.max(text1.length, text2.length);
    
    return 1 - (distance / maxLength);
};
