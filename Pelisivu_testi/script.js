
const energyEl = document.getElementById("energy");
const messageEl = document.getElementById("message");

// Update energy display
const chargeFill = document.getElementById("charge-fill");
const epsEl = document.getElementById("eps-display");

function updateCharge(data) {
    const pct = data.charge_max ? (data.charge_left / data.charge_max) * 100 : 0;
    chargeFill.style.width = pct + "%";
}

async function refreshStatus() {
    try {
        const res = await fetch("/status");
        if (!res.ok) throw new Error("Status request failed");

        const data = await res.json();
        energyEl.textContent = Number(data.energy).toFixed(1);
        epsEl.textContent = data.charge_left > 0
            ? data.eps + " energy/s"
            : "Not charged - click to crank!";
        updateCharge(data);
    } catch (err) {
        console.error("Could not update energy:", err);
    }
}

// Open and close shop
const shop = document.getElementById("shop");
const shopToggle = document.getElementById("shop-toggle");

shopToggle.addEventListener("click", function() {
    shop.classList.toggle("open");
    shopToggle.classList.toggle("open");

    shopToggle.textContent = shop.classList.contains("open")
        ? "Sulje ▶"
        : "Kauppa ◀";
});

// Upgrade buttons
const upgrades = [
    { id: "upgradeBtn", endpoint: "/upgrade" },
    { id: "upgradeBtn2", endpoint: "/upgrade2" },
    { id: "upgradeBtn3", endpoint: "/upgrade3" },
    { id: "upgradeBtn4", endpoint: "/upgrade4" },
    { id: "upgradeBtn5", endpoint: "/upgrade5" },
    { id: "upgradeBtn6", endpoint: "/upgrade6" }
];

upgrades.forEach(function(upgrade) {
    const button = document.getElementById(upgrade.id);

    if (!button) return;

    button.addEventListener("click", async function() {
        try {
            const res = await fetch(upgrade.endpoint);
            const data = await res.json();

            messageEl.textContent =
                typeof data === "string" ? data : data.message || "";

            await refreshStatus();
        } catch (err) {
            messageEl.textContent = "Upgrade failed!";
            console.error(err);
        }
    });
});

// Main energy button
const mainButton = document.getElementById("main-button");

mainButton.addEventListener("click", async function() {
    try {
        const res = await fetch("/click");
        if (!res.ok) throw new Error("Click request failed");

        const data = await res.json();

        energyEl.textContent = Number(data.energy).toFixed(1);
        updateCharge(data);
    } catch (err) {
        messageEl.textContent = "Could not generate energy!";
        console.error(err);
    }
});

// Automatically update energy
setInterval(refreshStatus, 250);

// Initial energy
refreshStatus();
