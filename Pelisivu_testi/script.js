//Nää on tehty chatgpt



const shop = document.getElementById("shop");
const shopToggle = document.getElementById("shop-toggle");

// Open and close shop
shopToggle.addEventListener("click", function() {

    shop.classList.toggle("open");
    shopToggle.classList.toggle("open");

    if (shop.classList.contains("open")) {
        shopToggle.textContent = "Sulje ▶";
    } else {
        shopToggle.textContent = "Päivitykset ◀";
    }

});

// Buy upgrades
const buyButtons = document.querySelectorAll(".buy-btn");

buyButtons.forEach(function(button) {

    let purchases = 0;

    button.addEventListener("click", function() {

        // Register purchase
        purchases++;

        // Update purchase counter
        const counter = button.parentElement.querySelector(".buy-count");

        counter.textContent = purchases + " ostettu";

        console.log(
            "Upgrade:",
            button.parentElement.querySelector("span").textContent,
            "Total purchases:",
            purchases
        );

    });

});

// Main button
const mainButton = document.getElementById("main-button");

mainButton.addEventListener("click", function() {
    console.log("Nappula clicked!");
});
