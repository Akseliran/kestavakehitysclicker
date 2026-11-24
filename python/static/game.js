    const energyEl = document.getElementById("energy");
    const messageEl = document.getElementById("message");

    async function refreshStatus() {
      const res = await fetch("/status");
      const data = await res.json();
      energyEl.textContent = data.energy.toFixed(1);
    }

    document.getElementById("save").addEventListener("click", async () => {
    const res = await fetch("/save");
    const data = await res.json();

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "save.json";
    a.click();

  URL.revokeObjectURL(url);
});


async function loadFromFile(file) {
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const res = await fetch("/load", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    messageEl.textContent = await res.json();
    refreshStatus();
  } catch (err) {
    messageEl.textContent = "Could not read that file";
  }
}

const loadBtn = document.getElementById("load");
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = ".json,application/json";

loadBtn.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => {
  loadFromFile(fileInput.files[0]);
  fileInput.value = "";
});


loadBtn.addEventListener("dragover", (e) => e.preventDefault());
loadBtn.addEventListener("drop", (e) => {
  e.preventDefault();
  loadFromFile(e.dataTransfer.files[0]);
});

    setInterval(async () => {
      const res = await fetch("/eps");
      const data = await res.json();
      energyEl.textContent = data.energy.toFixed(1);
    }, 10);

    document.getElementById("clickBtn").addEventListener("click", async () => {
      const res = await fetch("/click");
      const data = await res.json();
      energyEl.textContent = data.energy.toFixed(1);
    });

    document.getElementById("upgradeBtn").addEventListener("click", async () => {
      const res = await fetch("/upgrade");
      const text = await res.json();
      messageEl.textContent = text;
      refreshStatus();
    });
        document.getElementById("upgradeBtn2").addEventListener("click", async () => {
      const res = await fetch("/upgrade2");
      const text = await res.json();
      messageEl.textContent = text;
      refreshStatus();
    });
        document.getElementById("upgradeBtn3").addEventListener("click", async () => {
      const res = await fetch("/upgrade3");
      const text = await res.json();
      messageEl.textContent = text;
      refreshStatus();
    });
        document.getElementById("upgradeBtn4").addEventListener("click", async () => {
      const res = await fetch("/upgrade4");
      const text = await res.json();
      messageEl.textContent = text;
      refreshStatus();
    });
        document.getElementById("upgradeBtn5").addEventListener("click", async () => {
      const res = await fetch("/upgrade5");
      const text = await res.json();
      messageEl.textContent = text;
      refreshStatus();
    });
        document.getElementById("upgradeBtn6").addEventListener("click", async () => {
      const res = await fetch("/upgrade6");
      const text = await res.json();
      messageEl.textContent = text;
      refreshStatus();
    });

    refreshStatus();