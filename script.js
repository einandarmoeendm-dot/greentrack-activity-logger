// Store the ID of the activity being edited
let editingId = null;

// Storage key
const STORAGE_KEY = "greentrackActivities";

//select the form element
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

console.log("GreenTrack DOM loaded successfully!");

// Load activities from localStorage
function loadActivities() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (savedData === null) {
    return [];
  }

  try {
    const parsedData = JSON.parse(savedData);

    if (Array.isArray(parsedData)) {
      return parsedData;
    }

    return [];
  } catch (error) {
    console.error("Could not load activities:", error);

    return [];
  }
}

// Create the activities array
let activities = loadActivities();

// Save activities to localStorage
function saveActivities() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
}

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
  // Remove the previous displayed activities
  activityList.replaceChildren();

  // Show or hide the empty message
  emptyMessage.style.display = activities.length === 0 ? "block" : "none";

  // Loop through every activity
  activities.forEach(function (activity) {
    // Create an activity card
    const card = document.createElement("div");

    card.classList.add("activity-card");

    // Check whether this activity is being edited
    if (activity.id === editingId) {
      // Create an edit form
      const editForm = document.createElement("form");

      // Create category dropdown
      const category = document.createElement("select");

      ["Electricity", "Water", "Waste", "Transport"].forEach(function (name) {
        const option = document.createElement("option");

        option.value = name;
        option.textContent = name;

        category.appendChild(option);
      });

      category.value = activity.category;

      // Create quantity input
      const quantity = document.createElement("input");

      quantity.type = "number";
      quantity.min = "0.01";
      quantity.step = "any";
      quantity.value = activity.quantity;
      quantity.required = true;

      // Create unit input
      const unit = document.createElement("input");

      unit.type = "text";
      unit.value = activity.unit;
      unit.required = true;

      // Change the unit automatically when category changes
      category.addEventListener("change", function () {
        unit.value = categoryUnits[category.value] || "";
      });

      // Create date input
      const date = document.createElement("input");

      date.type = "date";
      date.value = activity.date;
      date.required = true;

      // Create note input
      const note = document.createElement("textarea");

      note.value = activity.note;
      note.placeholder = "Write a note...";

      // Create Save button
      const saveButton = document.createElement("button");

      saveButton.type = "submit";
      saveButton.textContent = "Save Changes";

      // Create Cancel button
      const cancelButton = document.createElement("button");

      cancelButton.type = "button";
      cancelButton.textContent = "Cancel";
      // Add fields and buttons to the edit form
      editForm.append(
        category,
        quantity,
        unit,
        date,
        note,
        saveButton,
        cancelButton,
      );

      card.appendChild(editForm);

      // Handle editing
      editForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const newQuantity = quantity.valueAsNumber;
        const newUnit = unit.value.trim();

        if (
          !Number.isFinite(newQuantity) ||
          newQuantity <= 0 ||
          !newUnit ||
          !date.value
        ) {
          alert("Please enter valid information.");

          return;
        }

        // Update the selected activity
        activities = activities.map(function (item) {
          if (item.id === activity.id) {
            return {
              ...item,
              category: category.value,
              quantity: newQuantity,
              unit: newUnit,
              date: date.value,
              note: note.value.trim(),
            };
          }

          return item;
        });

        // Save updated activities
        saveActivities();

        // Exit editing mode
        editingId = null;

        // Display updated activities
        renderActivities();
      });

      // Handle cancel
      cancelButton.addEventListener("click", function () {
        editingId = null;

        renderActivities();
      });
    } else {
      // Display normal activity information

      const title = document.createElement("h3");

      title.textContent = activity.category;

      const quantity = document.createElement("p");

      quantity.textContent = activity.quantity + " " + activity.unit;

      const date = document.createElement("p");

      date.textContent = activity.date;

      const note = document.createElement("p");

      note.textContent = activity.note || "No note";

      // Create Edit button
      const editButton = document.createElement("button");

      editButton.type = "button";
      editButton.textContent = "Edit";

      editButton.addEventListener("click", function () {
        editingId = activity.id;

        renderActivities();
      });

      // Create Delete button
      const deleteButton = document.createElement("button");

      deleteButton.type = "button";
      deleteButton.textContent = "Delete";

      deleteButton.addEventListener("click", function () {
        const confirmed = confirm(
          "Are you sure you want to delete this activity?",
        );

        if (confirmed) {
          activities = activities.filter(function (item) {
            return item.id !== activity.id;
          });

          saveActivities();

          editingId = null;

          renderActivities();
        }
      });

      // Add everything to the card
      card.append(title, quantity, date, note, editButton, deleteButton);
    }

    // Display the card
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

  //saved the updated array
  saveActivities();

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
