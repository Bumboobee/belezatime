export const getFirstWords = (text, numberOfWords = 2) => {
  if (!text) return "";

  const words = text.trim().split(" ");

  if (words.length > numberOfWords) {
    return words.slice(0, numberOfWords).join(" ");
  }

  return text;
};

//create a function that will return the first and the last strign of a text

export const getFirstAndLastWord = (text) => {
  if (!text) return "";

  const words = text.trim().split(" ");

  if (words.length > 1) {
    return `${words[0]} ${words[words.length - 1]}`;
  }

  return text;
};
