const NodeCache = require('node-cache');

// stdTTL: 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

/**
 * Clear all cache keys starting with a prefix
 * @param {string} prefix 
 */
const clearByPrefix = (prefix) => {
  const keys = cache.keys();
  const filteredKeys = keys.filter(key => key.startsWith(prefix));
  if (filteredKeys.length > 0) {
    cache.del(filteredKeys);
    console.log(`[Cache] Cleared ${filteredKeys.length} keys with prefix: ${prefix}`);
  }
};

module.exports = {
  cache,
  clearByPrefix
};
