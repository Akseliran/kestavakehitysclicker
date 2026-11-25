// ================= ELEMENTS =================
const energyEl = document.getElementById("energy");
const messageEl = document.getElementById("message");
const chargeFill = document.getElementById("charge-fill");
const epsEl = document.getElementById("eps-display");
const mainButton = document.getElementById("main-button");

// ================= CRANK SETTINGS (change these!) =================
const MAX_SPIN_SPEED = 2.5;  // revolutions per second at a FULL charge
const SPIN_SMOOTHING = 3;    // higher = reacts faster, lower = heavier flywheel feel
const CLICK_KICK = 0.6;      // how far (in radians) each click jerks the handle
const POLL_MS = 250;         // how often the game asks the server for updates

// ================= CHARGE STATE =================
let chargeLeft = 0;
let chargeMax = 15;
let lastSync = performance.now();

function updateCharge(data) {
    if (data.charge_left === undefined) return;
    chargeLeft = data.charge_left;
    chargeMax = data.charge_max;
    lastSync = performance.now();
}

// ================= STATUS =================
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

// ================= SHOP =================
const shop = document.getElementById("shop");
const shopToggle = document.getElementById("shop-toggle");

shopToggle.addEventListener("click", function () {
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

upgrades.forEach(function (upgrade) {
    const button = document.getElementById(upgrade.id);

    if (!button) return;

    button.addEventListener("click", async function () {
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

// ================= PIXEL HAND CRANK =================
const crankCanvas = document.getElementById("crank");
const ctx = crankCanvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const CX = 32, CY = 32;      // centre of the 64x64 sprite
const ARM = 15;              // arm length in pixels
let angle = 0;
let spin = 0;                // current speed in revolutions per second
let lastFrame = performance.now();

// Draw a square "pixel block" centred on x, y
function px(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x - size / 2), Math.round(y - size / 2), size, size);
}

// Thick pixel line from the hub; each layer is a thinner, lighter pass on top
function pixelLine(a, length, sizes, colors) {
    for (let layer = 0; layer < sizes.length; layer++) {
        for (let d = 0; d <= length; d += 0.5) {
            px(CX + Math.cos(a) * d, CY + Math.sin(a) * d, sizes[layer], colors[layer]);
        }
    }
}

// Dark brown -> bright gold depending on charge (0 to 1)
function glowColor(ratio) {
    const from = [74, 42, 5], to = [255, 213, 74];
    const c = from.map((v, i) => Math.round(v + (to[i] - v) * ratio));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
}

function drawHousing(ratio) {
    // Box with outline and bevel
    ctx.fillStyle = "#1a0f05"; ctx.fillRect(6, 6, 52, 52);
    ctx.fillStyle = "#613200"; ctx.fillRect(8, 8, 48, 48);
    ctx.fillStyle = "#8a4b0a"; ctx.fillRect(8, 8, 48, 2); ctx.fillRect(8, 8, 2, 48);
    ctx.fillStyle = "#3f2000"; ctx.fillRect(8, 54, 48, 2); ctx.fillRect(54, 8, 2, 48);

    // Corner bolts
    for (const [bx, by] of [[11, 11], [51, 11], [11, 51], [51, 51]]) {
        ctx.fillStyle = "#1a0f05"; ctx.fillRect(bx - 1, by - 1, 4, 4);
        ctx.fillStyle = "#D6A84B"; ctx.fillRect(bx, by, 2, 2);
    }

    // Round dial whose rim glows with the charge
    const glow = glowColor(ratio);
    for (let y = 8; y < 56; y++) {
        for (let x = 8; x < 56; x++) {
            const d = Math.hypot(x + 0.5 - CX, y + 0.5 - CY);
            if (d <= 22) {
                ctx.fillStyle = d > 20 ? glow : "#2a1500";
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }
}

function drawCrank() {
    // Short counterweight on the opposite side
    pixelLine(angle + Math.PI, 7, [7, 5], ["#1a0f05", "#8d8672"]);

    // Main arm: outline, metal, highlight
    pixelLine(angle, ARM, [6, 4, 2], ["#1a0f05", "#B8B2A0", "#F1E6C8"]);

    // Gold handle knob at the end of the arm
    const kx = CX + Math.cos(angle) * ARM;
    const ky = CY + Math.sin(angle) * ARM;
    px(kx, ky, 9, "#1a0f05");
    px(kx, ky, 7, "#D6A84B");
    px(kx - 1, ky - 1, 3, "#F1E6C8");

    // Hub in the middle
    px(CX, CY, 11, "#1a0f05");
    px(CX, CY, 9, "#B8B2A0");
    px(CX, CY, 5, "#D6A84B");
    px(CX, CY, 2, "#1a0f05");
}

function animateCrank(now) {
    const dt = Math.min((now - lastFrame) / 1000, 0.1);
    lastFrame = now;

    // Charge estimate that keeps draining between server updates
    const estCharge = Math.max(0, chargeLeft - (now - lastSync) / 1000);
    const ratio = chargeMax ? Math.min(1, estCharge / chargeMax) : 0;

    // Ease the speed toward the target so it winds up and slows down smoothly
    const targetSpin = ratio * MAX_SPIN_SPEED;
    spin += (targetSpin - spin) * Math.min(1, dt * SPIN_SMOOTHING);
    if (targetSpin === 0 && spin < 0.01) spin = 0;
    angle += spin * Math.PI * 2 * dt;

    ctx.clearRect(0, 0, 64, 64);
    drawHousing(ratio);
    drawCrank();

    chargeFill.style.width = ratio * 100 + "%";
    requestAnimationFrame(animateCrank);
}

// ================= MAIN BUTTON (THE CRANK) =================
mainButton.addEventListener("click", async function () {
    angle += CLICK_KICK;   // little jerk of the handle

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

// ================= START =================
requestAnimationFrame(animateCrank);
setInterval(refreshStatus, POLL_MS);
refreshStatus();