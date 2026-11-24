from flask import Flask, request, send_from_directory, jsonify

app = Flask(__name__)

game = {
    "energy": 0.0,
    "click_power": 1,
    "cursorUpgrades": 1,
    "eps": 0,
    "cursorOwned": 1,
    "cursorOwned2": 1,
    "cursorOwned3": 1,
    "cursorOwned4": 1,
    "cursorOwned5": 1,
    "cursorOwned6": 1
}




@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route("/save")
def save():
    return jsonify(game)

@app.route("/load", methods=["POST"])
def load():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify("Invalid save file"), 400

    for key, value in data.items():
        if key in game and isinstance(value, (int, float)) and isinstance(game[key], (int, float)):
            game[key] = value

    return jsonify("Game loaded")

@app.route('/click')
def click():
    gain = game["click_power"] + game["eps"] * 0.1 * game["cursorUpgrades"]
    game["energy"] += gain
    return jsonify(energy=game["energy"])

@app.route('/upgrade')
def buy_clickUpgrade():
    price = 10 * 1.15**game["cursorOwned"]
    if game["energy"] >= price:
        game["energy"] -= price
        game["cursorOwned"] += 1
        game["eps"]  += 0.1
        return jsonify(f"You bought an upgrade! Now you have {game['cursorOwned']} of them!")
    else:
        return jsonify("You don't have enough energy to buy that!")
    
@app.route('/upgrade2')
def buy_clickUpgrade2():
    price = 100 * 1.15**game["cursorOwned2"]
    if game["energy"] >= price:
        game["energy"] -= price
        game["cursorOwned2"] += 1
        game["eps"]  += 1
        return jsonify(f"You bought an upgrade! Now you have {game['cursorOwned']} of them!")
    else:
        return jsonify("You don't have enough energy to buy that!")

@app.route('/upgrade3')
def buy_clickUpgrade3():
    price = 1000 * 1.15**game["cursorOwned3"]
    if game["energy"] >= price:
        game["energy"] -= price
        game["cursorOwned3"] += 1
        game["eps"]  += 10
        return jsonify(f"You bought an upgrade! Now you have {game['cursorOwned']} of them!")
    else:
        return jsonify("You don't have enough energy to buy that!")

@app.route('/upgrade4')
def buy_clickUpgrade4():
    price = 10000 * 1.15**game["cursorOwned4"]
    if game["energy"] >= price:
        game["energy"] -= price
        game["cursorOwned4"] += 1
        game["eps"]  += 100
        return jsonify(f"You bought an upgrade! Now you have {game['cursorOwned']} of them!")
    else:
        return jsonify("You don't have enough energy to buy that!")

@app.route('/upgrade5')
def buy_clickUpgrade5():
    price = 100000 * 1.15**game["cursorOwned5"]
    if game["energy"] >= price:
        game["energy"] -= price
        game["cursorOwned5"] += 1
        game["eps"]  += 1000
        return jsonify(f"You bought an upgrade! Now you have {game['cursorOwned']} of them!")
    else:
        return jsonify("You don't have enough energy to buy that!")

@app.route('/upgrade6')
def buy_clickUpgrade6():
    price = 1000000 * 1.15**game["cursorOwned6"]
    if game["energy"] >= price:
        game["energy"] -= price
        game["cursorOwned6"] += 1
        game["eps"]  += 10000
        return jsonify(f"You bought an upgrade! Now you have {game['cursorOwned']} of them!")
    else:
        return jsonify("You don't have enough energy to buy that!")


@app.route('/eps')
def energy_per_second(): 
    game["energy"] += game["eps"]/100
    return jsonify(energy=game["energy"])

@app.route("/status")
def checkStatus():
    return jsonify(game)

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)