const isUrl = (url) => {
  try {
    const newUrl = new URL(url);
    return newUrl.protocol === 'http:' || newUrl.protocol === 'http:';
  } catch (error) {
    return false;
  }
};

module.exports = isUrl;
