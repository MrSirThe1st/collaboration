// import DOMPurify from "dompurify";

// // Create a safe sanitize function
// export const sanitizeHtml = (content) => {
//   if (!content) return "";

//   // If content is not a string, convert it to string
//   const htmlString = typeof content === "string" ? content : String(content);

//   // Configure DOMPurify to only allow safe elements and attributes
//   const sanitizedHtml = DOMPurify.sanitize(htmlString, {
//     ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "ul", "ol", "li", "br"],
//     ALLOWED_ATTR: ["href", "target", "rel"],
//     FORBID_TAGS: ["script", "style", "iframe", "form", "object"],
//     FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
//   });

//   return sanitizedHtml;
// };

// // For text-only content where no HTML is expected at all
// export const sanitizeText = (content) => {
//   if (!content) return "";
//   return String(content).replace(/[<>]/g, (char) =>
//     char === "<" ? "&lt;" : "&gt;"
//   );
// };

// // For URL validation
// export const isSafeUrl = (url) => {
//   if (!url) return false;
//   try {
//     const parsedUrl = new URL(url);
//     return ["http:", "https:"].includes(parsedUrl.protocol);
//   } catch {
//     return false;
//   }
// };
