// import { performance } from "perf_hooks";

// export const requestTracker = (req, res, next) => {
//   const start = performance.now();
//   const requestId = Math.random().toString(36).substring(7);

//   // Add request ID to response headers
//   res.setHeader("X-Request-ID", requestId);

//   // Log request start
//   console.log(
//     `[${requestId}] ${req.method} ${
//       req.url
//     } started at ${new Date().toISOString()}`
//   );

//   // Override end method to log response
//   const originalEnd = res.end;
//   res.end = function () {
//     const duration = performance.now() - start;
//     console.log(
//       `[${requestId}] ${req.method} ${req.url} completed in ${duration.toFixed(
//         2
//       )}ms`
//     );
//     originalEnd.apply(this, arguments);
//   };

//   next();
// };
