
from flask import Flask, jsonify, send_from_directory

app = Flask(__name__, static_folder=None)

# Game variables
energy = 0.0
energy_per_click = 1.0
energy_per_second = 0.0

import time

# ---- Crank settings
CHARGE_MAX = 15            # Kuinka iso lataus
CHARGE_PER_CLICK = 1.0     # Paljonko yksi klikkaus lataa
BASE_EPS = 1.0             # Paljonko se antaa energiaa per/s
CLICK_GIVES_ENERGY = False  # pelkkä klikkaaminenkin antaa myös energiaa jos TRUE
# ----------------------------------------

charge = 0.0               # seconds of charge currently in the bar
last_update = time.time()


def update_energy():
    """Drain the charge in real time and pay out energy for the time used."""
    global energy, charge, last_update
    now = time.time()
    elapsed = now - last_update

    charged_seconds = min(elapsed, charge)   # can't earn more than the charge left
    energy += charged_seconds * (BASE_EPS + energy_per_second)
    charge -= charged_seconds

    last_update = now


def charge_left():
    return max(0.0, charged_until - time.time())

# Upgrade information
upgrades = {
    1: {"price": 10, "click_bonus": 1, "eps_bonus": 0},
    2: {"price": 100, "click_bonus": 0, "eps_bonus": 1},
    3: {"price": 500, "click_bonus": 5, "eps_bonus": 0},
    4: {"price": 1000, "click_bonus": 0, "eps_bonus": 10},
    5: {"price": 2500, "click_bonus": 25, "eps_bonus": 0},
    6: {"price": 5000, "click_bonus": 0, "eps_bonus": 50}
}

# Serve the game files
@app.route("/")
def home():
    return send_from_directory(".", "index.html")

@app.route("/style.css")
def style():
    return send_from_directory(".", "style.css")

@app.route("/script.js")
def script():
    return send_from_directory(".", "script.js")

@app.route("/img/<path:filename>")
def images(filename):
    return send_from_directory("img", filename)


@app.route("/status")
def status():
    update_energy()
    return jsonify(
        energy=energy,
        energy_per_click=energy_per_click,
        eps=BASE_EPS + energy_per_second,
        charge_left=charge,
        charge_max=CHARGE_MAX
    )


@app.route("/click")
def click():
    global energy, charge

    update_energy()
    charge = min(CHARGE_MAX, charge + CHARGE_PER_CLICK)

    if CLICK_GIVES_ENERGY:
        energy += energy_per_click

    return jsonify(
        energy=energy,
        charge_left=charge,
        charge_max=CHARGE_MAX
    )

# Purchase upgrades
def buy_upgrade(number):
    global energy, energy_per_click, energy_per_second

    update_energy()

    upgrade = upgrades[number]
    price = upgrade["price"]

    if energy < price:
        return jsonify(
            message=f"Not enough energy! You need {price} energy."
        )

    energy -= price

    energy_per_click += upgrade["click_bonus"]
    energy_per_second += upgrade["eps_bonus"]

    return jsonify(
        message=f"Upgrade {number} purchased!",
        energy=energy
    )


@app.route("/upgrade")
def upgrade1():
    return buy_upgrade(1)

@app.route("/upgrade2")
def upgrade2():
    return buy_upgrade(2)

@app.route("/upgrade3")
def upgrade3():
    return buy_upgrade(3)

@app.route("/upgrade4")
def upgrade4():
    return buy_upgrade(4)

@app.route("/upgrade5")
def upgrade5():
    return buy_upgrade(5)

@app.route("/upgrade6")
def upgrade6():
    return buy_upgrade(6)

#run game
if __name__ == "__main__":
    app.run(debug=True)
