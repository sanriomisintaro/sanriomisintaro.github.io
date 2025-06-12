// daftar.js
//API disuaikan dengan yang ada pada API Public pu.go.id (terakhir update 13 Juni 2025)
var apiUrl = 'https://sigi.pu.go.id/portalpupr/rest/services/sigi_postgis/tpa_fulltable_v2/FeatureServer/0/query?where=1=1&outfields=*&returngeometry=true&orderByFields=objectid%20ASC&resultOffset=0&resultRecordCount=100000&f=json';

var allData = [];
var currentLang = "id"; // default bahasa

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        allData = data.features.map(feature => {
            var attr = feature.attributes;
            var geom = feature.geometry;
            return {
                lat: geom.y,
                lng: geom.x,
                namaTPA: attr.namobj,
                kabKota: attr.kab_kot,
                provinsi: attr.propinsi,
                kapasitas: attr.kaptpa
            };
        });

        tampilkanTabel(allData);
        setupFilter();

        // Setelah selesai loading maka hide overlay, tampilkan filter
        document.getElementById('loading-overlay').style.display = 'none';
        document.getElementById('filter-form').style.display = 'block';
    })
    .catch(error => {
        console.error('Gagal mengambil data API:', error);
        document.getElementById('loading-text').textContent = 'Gagal mengambil data.';
    });

function tampilkanTabel(data) {
    var table = document.getElementById('tpa-table');
    var tbody = table.querySelector('tbody');
    tbody.innerHTML = ''; // Kosongkan isi tabel dulu

    data.forEach(d => {
        var row = document.createElement('tr');

        row.innerHTML = `
            <td><strong>${d.namaTPA}</strong></td>
            <td>${d.provinsi}</td>
            <td>${d.kabKota}</td>
            <td>${d.kapasitas} m³</td>
            <td>
                <a href="https://www.google.com/maps?q=${d.lat},${d.lng}" target="_blank" class="gmaps-button">Gmaps</a>
                <a href="https://bing.com/maps/default.aspx?cp=${d.lat}~${d.lng}" target="_blank" class="bingmaps-button">Bing Maps</a>
            </td>
        `;

        tbody.appendChild(row);
    });

    document.getElementById('loading-text').style.display = 'none';
    table.style.display = 'table';
}

function setupFilter() {
    var filterField = document.getElementById('filter-field');
    var filterInput = document.getElementById('filter-input');

    filterInput.addEventListener('input', function() {
        var keyword = filterInput.value.toLowerCase();
        var field = filterField.value;

        var filteredData = allData.filter(d => {
            var valueToCheck = '';

            if (field === 'provinsi') valueToCheck = d.provinsi.toLowerCase();
            else if (field === 'kabKota') valueToCheck = d.kabKota.toLowerCase();
            else if (field === 'namaTPA') valueToCheck = d.namaTPA.toLowerCase();

            return valueToCheck.includes(keyword);
        });

        tampilkanTabel(filteredData);
    });
}

// Fungsi update bahasa
function updateLanguage(lang) {
    currentLang = lang; // simpan bahasa saat ini
    var t = texts[lang].daftar;

    // Update judul dan sumber
    document.querySelector("h1").textContent = t.title;
    document.querySelector("p em").textContent = t.source;

    // Update label filter
    document.querySelector("label[for='filter-field']").textContent = t.filterLabel;
    document.getElementById("filter-input").placeholder = t.filterPlaceholder;

    // Update header tabel
    var ths = document.querySelectorAll("#tpa-table thead th");
    t.tableHeaders.forEach((text, index) => {
        ths[index].textContent = text;
    });

    // Update Maps label di HP
    document.styleSheets[0].insertRule(
        `@media (max-width: 600px) {
            table td:nth-of-type(5):before {
                content: "${texts[lang].common.mapsLabel}";
                display: block;
                font-weight: bold;
                margin-bottom: 5px;
            }
        }`,
        document.styleSheets[0].cssRules.length
    );

    // Update link Menu Utama
    document.getElementById("menu-utama-link").textContent = texts[lang].common.menuUtama;
}

// Set bahasa default saat load
updateLanguage("id");

// Saat user pilih bahasa
document.getElementById("language-select").addEventListener("change", function() {
    updateLanguage(this.value);
});
