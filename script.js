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

let activities = [];

// 3. Automatically fill unit based on category

const categoryUnits = {
  Electricity: "kWh",
  Water: "L",
  Waste: "kg",
  Transport: "km",
};

categoryInput.addEventListener("change", function () {
  const selectedCategory = categoryInput.value;

  unitInput.value = categoryUnits[selectedCategory] || "";
});

// 4. Display activities on the webpage

function renderActivities() {
  // Clear the previous displayed activities
  activityList.replaceChildren();

  // Check whether the array is empty
  if (activities.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }

  // Go through every activity
  activities.forEach(function (activity) {
    // Create a new card
    const card = document.createElement("div");

    card.classList.add("activity-card");

    // Create category heading
    const title = document.createElement("h3");

    title.textContent = activity.category;

    // Create quantity text
    const quantity = document.createElement("p");

    quantity.textContent = activity.quantity + " " + activity.unit;

    // Create date text
    const date = document.createElement("p");

    date.textContent = activity.date;

    // Create note text
    const note = document.createElement("p");

    note.textContent = activity.note || "No note";

    // Put elements inside the card
    card.append(title, quantity, date, note);

    // Put card inside the activity list
    activityList.appendChild(card);
  });
}

// 5. Handle form submission

activityForm.addEventListener("submit", function (event) {
  // Prevent the browser from reloading the page
  event.preventDefault();

  // Get input values
  const category = categoryInput.value;

  const quantity = quantityInput.valueAsNumber;

  const unit = unitInput.value.trim();

  const date = dateInput.value;

  const note = noteInput.value.trim();

  // Validate the information
  if (
    !category ||
    !Number.isFinite(quantity) ||
    quantity <= 0 ||
    !unit ||
    !date
  ) {
    alert("Please enter valid activity information.");

    return;
  }

  // Create a new activity object
  const newActivity = {
    id: Date.now(),
    category: category,
    quantity: quantity,
    unit: unit,
    date: date,
    note: note,
  };

  // Add the new activity to the array
  activities.push(newActivity);

  // Display the updated activities
  renderActivities();

  // Clear the form
  activityForm.reset();

  // Restore today's date
  setToday();

  // Show success message
  alert("Activity added successfully!");
});

// Set today's date in local time

function setToday() {
  const today = new Date();

  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

  dateInput.value = today.toISOString().slice(0, 10);
}

// Set the date when the page first loads
setToday();
// Display the initial empty activity list
renderActivities();
