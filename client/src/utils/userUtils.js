export const getInitials = (username) => {
  if (!username) return "??";
  return username
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};


export const getAvatarColor = (username) => {
  if (!username) return "#888888";

  const colors = [
    "#374151", // Matte Dark Gray
    "#9a3412", // Matte Burnt Orange
    "#1e4a2f", // Matte Deep Green
    "#4338ca", // Matte Muted Indigo
    "#78350f", // Matte Warm Brown
    "#6b21a8", // Matte Purple
    "#8b5cf6", // Matte Lavender
    "#9d174d", // Matte Deep Rose
  ];


  const index = username
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return colors[index % colors.length];
};
