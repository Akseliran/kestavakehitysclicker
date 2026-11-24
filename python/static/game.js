    const energyEl = document.getElementById("energy");
    const messageEl = document.getElementById("message");

    async function refreshStatus() {
      const res = await fetch("/status");
      const data = await res.json();
      energyEl.textContent = data.energy.toFixed(1);
    }

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