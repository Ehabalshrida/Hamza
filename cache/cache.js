const cache = {};

const setCache = (key, data) => {
  cache[key] = {
    data,
    timestamp: Date.now(),
    ttl: 3600000, // cashed data expired after one hour
  };
};
const getCache = (key) => {
  if (cache[key] && cache[key].timestamp + cache[key].ttl > Date.now()) {
    return cache[key].data;
  } else {
    delete cache[key];
    return null;
  }
};
const cacheMiddleware = (req, res, next) => {
  const cacheKey = req.originalUrl || req.url;

  const cachedData = getCache(cacheKey);

  if (cachedData) {
    console.log(`Cache hit for ${cacheKey}`);
    res.json(cachedData);
  } else {
    console.log(`Cache miss for ${cacheKey}`);
    res.sendResponse = res.json;
    res.json = (data) => {
      setCache(cacheKey, data);
      res.sendResponse(data);
    };
    next();
  }
};
module.exports = { cacheMiddleware };
