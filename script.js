
"use strict";

// Change this to your WhatsApp number.
// Use country code + number, with digits only.
// Example format for Barbados: 1246XXXXXXX
const WHATSAPP_NUMBER = "12468406896";

const PRICES = {
  classic: 3,
  oreo: 4
};

const MAX_BROWNIES = 40;

const quantities = {
  classic: 0,
  oreo: 0
};

const classicOutput = document.querySelector("#classic-quantity");
const oreoOutput = document.querySelector("#oreo-quantity");
const classicSummary = document.querySelector("#classic-summary");
const oreoSummary = document.querySelector("#oreo-summary");
const totalOutput = document.querySelector("#order-total");
const capacityMessage = document.querySelector("#capacity-message");
const form = document.querySelector("#order-form");
const formMessage = document.querySelector("#form-message");
const submitButton = document.querySelector("#submit-order");

function getTotalQuantity() {
  return quantities.classic + quantities.oreo;
}

function getOrderTotal() {
  return quantities.classic * PRICES.classic
    + quantities.oreo * PRICES.oreo;
}

function formatMoney(amount) {
  return `BDS $${amount.toFixed(2)}`;
}

function updateOrderDisplay() {
  classicOutput.textContent = quantities.classic;
  oreoOutput.textContent = quantities.oreo;

  classicSummary.textContent =
    `${quantities.classic} × ${formatMoney(PRICES.classic)}`;

  oreoSummary.textContent =
    `${quantities.oreo} × ${formatMoney(PRICES.oreo)}`;

  totalOutput.textContent = formatMoney(getOrderTotal());

  const totalQuantity = getTotalQuantity();

  if (totalQuantity === 0) {
    capacityMessage.textContent =
      "Select your brownies above to get started.";
  } else {
    capacityMessage.textContent =
      `${totalQuantity} of ${MAX_BROWNIES} brownie spaces selected. `
      + "Your request must still be confirmed.";
  }

  document.querySelectorAll(".quantity-btn").forEach((button) => {
    const product = button.dataset.product;
    const action = button.dataset.action;

    button.disabled =
      action === "decrease" && quantities[product] === 0;

    if (action === "increase") {
      button.disabled =
        totalQuantity >= MAX_BROWNIES;
    }
  });

  submitButton.disabled = totalQuantity === 0;
}

document.querySelectorAll(".quantity-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const product = button.dataset.product;
    const action = button.dataset.action;

    if (!product || !(product in quantities)) {
      return;
    }

    if (action === "increase") {
      if (getTotalQuantity() < MAX_BROWNIES) {
        quantities[product] += 1;
      }
    } else if (action === "decrease") {
      quantities[product] = Math.max(
        0,
        quantities[product] - 1
      );
    }

    formMessage.textContent = "";
    updateOrderDisplay();
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent = "";

  if (!form.reportValidity()) {
    return;
  }

  if (getTotalQuantity() === 0) {
    formMessage.textContent =
      "Please select at least one brownie.";
    return;
  }

  if (WHATSAPP_NUMBER.includes("X")) {
    formMessage.textContent =
      "Before ordering, add your WhatsApp number to script.js "
      + "by replacing the placeholder number.";
    return;
  }

  const customerName =
    document.querySelector("#customer-name").value.trim();

  const customerPhone =
    document.querySelector("#customer-phone").value.trim();

  const collection =
    document.querySelector("#collection").value;

  const notes =
    document.querySelector("#notes").value.trim();

  const messageLines = [
    "Hi! I'd like to place an order with The Brown Table.",
    "",
    `Name: ${customerName}`,
    `Contact number: ${customerPhone}`,
    "",
    "My brownie selection:",
    `Classic brownies: ${quantities.classic}`,
    `Oreo brownies: ${quantities.oreo}`,
    `Total brownies: ${getTotalQuantity()}`,
    `Estimated total: ${formatMoney(getOrderTotal())}`,
    "",
    `Preferred collection arrangement: ${collection}`,
    "Requested sales day: Thursday at UWI",
    "",
    `Additional notes: ${notes || "None"}`,
    "",
    `Please note: This is an order request, not a confirmed order.`
  ];

  const whatsappURL =
    `https://wa.me/${WHATSAPP_NUMBER}?text=`
    + encodeURIComponent(messageLines.join("\n"));

  const newWindow = window.open(whatsappURL, "_blank");

  if (newWindow) {
    newWindow.opener = null;
  } else {
    window.location.href = whatsappURL;
  }
});

updateOrderDisplay();
