// Optional: Add interactivity or analytics
document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById("ecoGameFrame");

  // Example: Log when game loads
  iframe.addEventListener("load", () => {
    console.log("EcoQuest game loaded successfully!");
  });

  // Future: You can use postMessage to communicate between iframe and parent
});