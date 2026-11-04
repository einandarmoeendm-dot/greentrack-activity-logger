// Select the form element
const activityForm = document.getElementById("activityForm");

// Select the category dropdown
const categoryInput = document.getElementById("category");

// Select the quantity input
const quantityInput = document.getElementById("quantity");

// Select the unit input
const unitInput = document.getElementById("unit");

// Select the date input
const dateInput = document.getElementById("date");

// Select the note input
const noteInput = document.getElementById("note");

// Select the activity list container
const activityList = document.getElementById("activityList");

// Select the empty message
const emptyMessage = document.getElementById("emptyMessage");

// Change the heading using JavaScript
document.querySelector("header h1").textContent = "GreenTrack 🌱";

// Change the empty message
emptyMessage.textContent = "No activities yet — log your first one!";

// Set today's date
dateInput.value = new Date().toISOString().split("T")[0];

console.log("GreenTrack DOM loaded successfully!");
