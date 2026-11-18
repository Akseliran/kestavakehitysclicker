from flask import Flask, send_from_directory, jsonify

app = Flask(__name__)

game = {
    "energy": 0.0,
    "click_power": 1,
    "cursorUpgrades": 1,
    "eps": 0,
    "cursorOwned": 1
}

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/click')
def click():
    gain = game["click_power"] + game["eps"] * 0.1 * game["cursorUpgrades"]
    game["energy"] += gain
    return jsonify(energy=game["energy"])

@app.route('/upgrade')
def buy_clickUpgrade():
    price = 10 * 1.15**game["cursorOwned"]
    if game["energy"] >= price:   # >= so exact amount works
        game["energy"] -= price
        game["cursorOwned"] += 1
        game["cursorUpgrades"] *= 1.05
        return jsonify(f"You bought an upgrade! Now you have {game['cursorOwned']} of them!")
    else:
        return jsonify("You don't have enough energy to buy that!")

@app.route("/status")
def checkStatus():
    return jsonify(game)

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)