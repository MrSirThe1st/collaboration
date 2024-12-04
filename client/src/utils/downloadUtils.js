// utils/downloadUtils.js
export const downloadFile = async (url, filename) => {
  try {
    // For Cloudinary URLs, modify to force download
    if (url.includes("cloudinary")) {
      // Get the version and public ID from the URL
      const urlParts = url.split("/upload/");
      if (urlParts.length !== 2) throw new Error("Invalid Cloudinary URL");

      // Construct URL with force download flag
      url = `${urlParts[0]}/upload/fl_attachment/${urlParts[1]}`;
    }

    const response = await fetch(url, {
      method: "GET",
      // Remove credentials as they're not needed for public Cloudinary URLs
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download error:", error);
    throw error;
  }
};
