
const utils = {
  isValidHttpUrl: (url) => {
    let checkUrl;
    try {
      checkUrl = new URL(url);
    } catch (_) {
      return false;
    }
    return checkUrl.protocol === 'http:' || checkUrl.protocol === 'https:';
  }
};

module.exports = utils;
