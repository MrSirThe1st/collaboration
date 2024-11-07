// import NodeCache from "node-cache";

// const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes default TTL

// export const cacheMiddleware = (duration) => {
//   return (req, res, next) => {
//     // Skip caching for non-GET requests
//     if (req.method !== "GET") {
//       return next();
//     }

//     const key = `__express__${req.originalUrl || req.url}`;
//     const cachedResponse = cache.get(key);

//     if (cachedResponse) {
//       return res.json(cachedResponse);
//     }

//     // Store the original json method
//     const originalJson = res.json;

//     // Override res.json method
//     res.json = function (body) {
//       // Store the response in cache
//       cache.set(key, body, duration);
//       originalJson.call(this, body);
//     };

//     next();
//   };
// };

// // Cache invalidation helper
// export const invalidateCache = (pattern) => {
//   const keys = cache.keys();
//   keys.forEach((key) => {
//     if (pattern.test(key)) {
//       cache.del(key);
//     }
//   });
// };
