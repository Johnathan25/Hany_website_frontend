const normalizeArabic = (text) => {
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F]/g, "") 
    .replace(/[أإآا]/g, "ا")         
    .replace(/ى/g, "ي")              
    .replace(/ة/g, "ه")              
    .trim();
};

export default normalizeArabic;