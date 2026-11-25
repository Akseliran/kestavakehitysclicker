// haetaan napit ja muut elementit
const aloitaNappi = document.getElementById("start-btn");
const jatkaNappi = document.getElementById("load-btn");
const asetuksetNappi = document.getElementById("options");
const takaisinNappi = document.getElementById("options-back");

const paavalikko = document.getElementById("main-menu");
const asetukset = document.getElementById("options-menu");
const viesti = document.getElementById("menu-message");
const tiedosto = document.getElementById("load-file");
const aaniSlider = document.getElementById("volume");
const aaniTeksti = document.getElementById("volume-value");


// Aloita uusi peli
aloitaNappi.addEventListener("click", function () {
    localStorage.removeItem("saveData"); // poistetaan vanha tallennus
    window.location.href = "../Pelisivu_testi/index.html";
});


// Jatka peliä
jatkaNappi.addEventListener("click", function () {
    tiedosto.click(); // avaa tiedoston valinnan
});

tiedosto.addEventListener("change", function () {
    const valittu = tiedosto.files[0];

    const lukija = new FileReader();
    lukija.onload = function () {
        try {
            const data = JSON.parse(lukija.result);
            localStorage.setItem("saveData", JSON.stringify(data));
            window.location.href = "../Pelisivu/Pelisivun.html?continue=1";
        } catch (error) {
            viesti.textContent = "Tallennustiedostoa ei voitu lukea";
        }
    };
    lukija.readAsText(valittu);
});


// Asetukset
asetuksetNappi.addEventListener("click", function () {
    paavalikko.classList.add("hidden");
    asetukset.classList.remove("hidden");
});

takaisinNappi.addEventListener("click", function () {
    asetukset.classList.add("hidden");
    paavalikko.classList.remove("hidden");
});


// Äänenvoimakkuus
if (localStorage.getItem("volume") != null) {
    aaniSlider.value = localStorage.getItem("volume");
}
aaniTeksti.textContent = aaniSlider.value;

aaniSlider.addEventListener("input", function () {
    aaniTeksti.textContent = aaniSlider.value;
    localStorage.setItem("volume", aaniSlider.value);
});
