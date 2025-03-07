// import https from "https";
// import fs from "fs";
// import path from "path";
// import tls from "tls";

// export const setupTLSServer = (app) => {
//   // Modern TLS configuration options
//   const tlsOptions = {
//     // Specify minimum TLS version - only allow 1.2 and 1.3
//     minVersion: tls.TLS1_2_VERSION,
//     // Prefer the server's cipher suite order
//     honorCipherOrder: true,
//     // Modern cipher suites for TLS 1.2 and 1.3
//     cipherSuites: [
//       "TLS_AES_128_GCM_SHA256", // TLS 1.3
//       "TLS_AES_256_GCM_SHA384", // TLS 1.3
//       "TLS_CHACHA20_POLY1305_SHA256", // TLS 1.3
//     ],
//     // For TLS 1.2 (when 1.3 isn't available)
//     ciphers: [
//       "ECDHE-ECDSA-AES128-GCM-SHA256",
//       "ECDHE-RSA-AES128-GCM-SHA256",
//       "ECDHE-ECDSA-AES256-GCM-SHA384",
//       "ECDHE-RSA-AES256-GCM-SHA384",
//     ].join(":"),
//     // Certificate configuration
//     key: fs.readFileSync(
//       path.join(process.cwd(), "certificates", "private.key")
//     ),
//     cert: fs.readFileSync(
//       path.join(process.cwd(), "certificates", "certificate.crt")
//     ),
//     // If you have intermediate certificates
//     ca:
//       process.env.NODE_ENV === "production"
//         ? [
//             fs.readFileSync(
//               path.join(process.cwd(), "certificates", "chain.pem")
//             ),
//           ]
//         : undefined,
//   };

//   // Create HTTPS server with TLS
//   const tlsServer = https.createServer(tlsOptions, app);

//   // Security headers middleware
//   app.use((req, res, next) => {
//     // Strict Transport Security - tell browsers to always use HTTPS
//     res.setHeader(
//       "Strict-Transport-Security",
//       "max-age=31536000; includeSubDomains; preload"
//     );
//     // Prevent clickjacking
//     res.setHeader("X-Frame-Options", "DENY");
//     // Enable XSS filter
//     res.setHeader("X-XSS-Protection", "1; mode=block");
//     // Disable MIME type sniffing
//     res.setHeader("X-Content-Type-Options", "nosniff");
//     // Referrer policy
//     res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
//     next();
//   });

//   // Redirect HTTP to HTTPS
//   app.use((req, res, next) => {
//     if (!req.secure) {
//       return res.redirect(301, `https://${req.headers.host}${req.url}`);
//     }
//     next();
//   });

//   return tlsServer;
// };

// export const getServerPort = () => ({
//   http: process.env.HTTP_PORT || 80,
//   https: process.env.HTTPS_PORT || 443,
// });

// export const isProduction = () => process.env.NODE_ENV === "production";
