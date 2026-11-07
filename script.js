// Optional: set your business WhatsApp number in international format, digits only.
// Example format: 1246XXXXXXX (do not include +, spaces, or dashes).
const BUSINESS_WHATSAPP = "";
const PRICE_BDS = 5;
const MAX_ORDER = 40; // enquiry limit, not live inventory tracking
let quantity = 4;
const $ = (id) => document.getElementById(id);
function update() {
  $("quantity").textContent = quantity;
  $("total").textContent = `BDS $${quantity * PRICE_BDS}`;
  $("minus").disabled = quantity <= 1;
  $("plus").disabled = quantity >= MAX_ORDER;
}
$("minus").addEventListener("click", () => {
  quantity = Math.max(1, quantity - 1);
  update();
});
$("plus").addEventListener("click", () => {
  quantity = Math.min(MAX_ORDER, quantity + 1);
  update();
});
$("send").addEventListener("click", () => {
  const name = $("customer").value.trim();
  const pickup = $("pickup").value.trim();
  const notes = $("notes").value.trim();
  if (!name || !pickup) {
    $("feedback").textContent =
      "Please enter your name and preferred collection details.";
    return;
  }
  const message = `Hi! I'd like to preorder from The Brown Table.\n\nName: ${name}\nProtein brownies: ${quantity}\nEstimated total: BDS $${quantity * PRICE_BDS}\nPreferred collection: ${pickup}${notes ? "\nNotes: " + notes : ""}\n\nPlease confirm availability and collection/payment details. Thank you!`;
  $("message-preview").textContent = message;
  $("copy-area").hidden = false;
  if (BUSINESS_WHATSAPP) {
    $("feedback").textContent =
      "Opening WhatsApp with your preorder. Your order is only confirmed when we reply.";
    window.open(
      `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  } else {
    $("feedback").textContent =
      "Your order message is ready. Copy it and send it to The Brown Table on WhatsApp. Add your business number in script.js to enable direct WhatsApp ordering.";
  }
});
$("copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("message-preview").textContent);
    $("feedback").textContent = "Order message copied!";
  } catch {
    $("feedback").textContent =
      "Select the message above and copy it manually.";
  }
});
$("year").textContent = new Date().getFullYear();
update();
