// peta.js
var map = L.map('map').setView([-2.5, 117.5], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

//API disuaikan dengan yang ada pada API Public pu.go.id (terakhir update 13 Juni 2025)
var apiUrl = 'https://sigi.pu.go.id/portalpupr/rest/services/sigi_postgis/tpa_fulltable_v2/FeatureServer/0/query?where=1=1&outfields=*&returngeometry=true&orderByFields=objectid%20ASC&resultOffset=0&resultRecordCount=100000&f=json';

var allData = [];
var markersLayer = L.layerGroup().addTo(map);
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

        populateProvinsi();
        showAllMarkers();

        // Setelah selesai loading maka hide overlay, tampilkan filter
        document.getElementById('loading-overlay').style.display = 'none';
        document.getElementById('filter-form').style.display = 'block';
        document.getElementById('loading-text').style.display = 'none';
    })
    .catch(error => {
        console.error('Gagal mengambil data API:', error);
        document.getElementById('loading-text').textContent = 'Gagal mengambil data.';
    });

function populateProvinsi() {
    var provinsiSelect = document.getElementById('provinsi');
    var provinsiSet = new Set(allData.map(d => d.provinsi));
    Array.from(provinsiSet).sort().forEach(prov => {
        var opt = document.createElement('option');
        opt.value = prov;
        opt.textContent = prov;
        provinsiSelect.appendChild(opt);
    });
}

document.getElementById('provinsi').addEventListener('change', function() {
    var selectedProv = this.value;
    var kabKotaSelect = document.getElementById('kabkota');
    kabKotaSelect.innerHTML = '<option value="">-- Pilih Kab/Kota --</option>';

    if (selectedProv === '') {
        kabKotaSelect.disabled = true;
    } else {
        var kabKotaSet = new Set(allData
            .filter(d => d.provinsi === selectedProv)
            .map(d => d.kabKota));
        Array.from(kabKotaSet).sort().forEach(kab => {
            var opt = document.createElement('option');
            opt.value = kab;
            opt.textContent = kab;
            kabKotaSelect.appendChild(opt);
        });
        kabKotaSelect.disabled = false;
    }
});

document.getElementById('btn-tampilkan').addEventListener('click', function() {
    var loadingText = document.getElementById('loading-text');
    loadingText.style.display = 'inline';

    setTimeout(() => {
        var provinsi = document.getElementById('provinsi').value;
        var kabkota = document.getElementById('kabkota').value;

        markersLayer.clearLayers();

        var filteredData = allData.filter(d => {
            if (provinsi && d.provinsi !== provinsi) return false;
            if (kabkota && d.kabKota !== kabkota) return false;
            return true;
        });

        filteredData.forEach(d => {
            var marker = L.marker([d.lat, d.lng]).bindPopup(
                `<strong>${d.namaTPA}</strong><br/>
                 ${d.kabKota}, ${d.provinsi}<br/>
                 Kapasitas: ${d.kapasitas} m³<br/>
                 <a href="https://www.google.com/maps?q=${d.lat},${d.lng}" target="_blank" class="gmaps-button">Gmaps</a>
                 <a href="https://bing.com/maps/default.aspx?cp=${d.lat}~${d.lng}" target="_blank" class="bingmaps-button">Bing Maps</a>`
            );
            markersLayer.addLayer(marker);
        });

        if (filteredData.length === 0) {
            map.setView([-2.5, 117.5], 5);
        } else {
            map.setView([filteredData[0].lat, filteredData[0].lng], 9);
        }

        loadingText.style.display = 'none';
    }, 500);
});

function showAllMarkers() {
    markersLayer.clearLayers();

    allData.forEach(d => {
        var marker = L.marker([d.lat, d.lng]).bindPopup(
            `<strong>${d.namaTPA}</strong><br/>
             ${d.kabKota}, ${d.provinsi}<br/>
             Kapasitas: ${d.kapasitas} m³<br/>
             <a href="https://www.google.com/maps?q=${d.lat},${d.lng}" target="_blank" class="gmaps-button">Gmaps</a>
             <a href="https://bing.com/maps/default.aspx?cp=${d.lat}~${d.lng}" target="_blank" class="bingmaps-button">Bing Maps</a>`
        );
        markersLayer.addLayer(marker);
    });
}

// Fungsi update bahasa
function updateLanguage(lang) {
    currentLang = lang; 
    var t = texts[lang].peta;

    // Update judul dan sumber
    document.querySelector("h1").textContent = t.title;
    document.querySelector("p em").textContent = t.source;

    // Update label form
    document.querySelector("label[for='provinsi']").textContent = t.provinsiLabel;
    document.querySelector("label[for='kabkota']").textContent = t.kabkotaLabel;
    document.getElementById("btn-tampilkan").textContent = t.tampilkanButton;

}

// Set bahasa default saat load
updateLanguage("id");

// Saat user pilih bahasa
document.getElementById("language-select").addEventListener("change", function() {
    updateLanguage(this.value);
});
