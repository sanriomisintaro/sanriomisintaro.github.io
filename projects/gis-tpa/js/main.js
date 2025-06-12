// index.js
var currentLang = "id"; // default bahasa

function updateLanguage(lang) {
    currentLang = lang;
    var t = texts[lang].index;

    // Update judul halaman
    //anda bisa langsung gunakan tag juga seperti di bawah, atau panggil dengan getElementById.
    //document.querySelector("h1").textContent = t.title;
    document.getElementById("judul").textContent = t.title;

    // Update tombol
    document.getElementById("button-daftar").textContent = t.buttonDaftar;
    document.getElementById("button-peta").textContent = t.buttonPeta;

    // Update tulisan dibawah title tengah
    document.querySelector("p").textContent = t.textAtas;
}

// Set bahasa default saat load
updateLanguage("id");

// Saat user pilih bahasa
document.getElementById("language-select").addEventListener("change", function() {
    updateLanguage(this.value);
});
