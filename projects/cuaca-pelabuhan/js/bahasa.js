const translations = {
  id: {
    title: "Informasi Cuaca Pelabuhan, Sumber: BMKG",
    inputPlaceholder: "Ketik nama pelabuhan...",
    forecastTitle: "Prakiraan Cuaca Laut",
    errorLoad: "Gagal memuat data.",
    loading: "Memuat data dari BMKG...",
    harbor: "Pelabuhan",
    code: "Kode Area",
    regionLabel: label => `${label}`
  },
  en: {
    title: "Harbor Weather Information, Source: BMKG",
    inputPlaceholder: "Type port name...",
    forecastTitle: "Marine Weather Forecast",
    errorLoad: "Failed to load data.",
    loading: "Loading data from BMKG...",
    harbor: "Harbor",
    code: "Area Code",
    regionLabel: label => `${label}`
  }
};

window.fieldLabels = {
  id: {
    issued: "Dikeluarkan",
    valid_from: "Berlaku Dari",
    valid_to: "Berlaku Sampai",
    warning_desc: "Peringatan",
    weather: "Cuaca",
    weather_desc: "Deskripsi Cuaca",
    wind_from: "Arah Angin Dari",
    wind_to: "Arah Angin Ke",
    wind_speed_min: "Kecepatan Angin Min",
    wind_speed_max: "Kecepatan Angin Maks",
    current_from: "Arus Dari",
    current_to: "Arus Ke",
    current_speed_min: "Kecepatan Arus Min",
    current_speed_max: "Kecepatan Arus Maks",
    wave_cat: "Kategori Gelombang",
    wave_desc: "Deskripsi Gelombang",
    visibility: "Jarak Pandang",
    rh_min: "Kelembaban Min",
    rh_max: "Kelembaban Maks",
    temp_min: "Suhu Min",
    temp_max: "Suhu Maks",
    low_tide: "Surut",
    low_tide_time: "Waktu Surut",
    high_tide: "Pasang",
    high_tide_time: "Waktu Pasang"
  },
  en: {
    issued: "Issued",
    valid_from: "Valid From",
    valid_to: "Valid To",
    warning_desc: "Warning Desc",
    weather: "Weather",
    weather_desc: "Weather Desc",
    wind_from: "Wind From",
    wind_to: "Wind To",
    wind_speed_min: "Wind Speed Min",
    wind_speed_max: "Wind Speed Max",
    current_from: "Current From",
    current_to: "Current To",
    current_speed_min: "Current Speed Min",
    current_speed_max: "Current Speed Max",
    wave_cat: "Wave Cat",
    wave_desc: "Wave Desc",
    visibility: "Visibility",
    rh_min: "Rh Min",
    rh_max: "Rh Max",
    temp_min: "Temp Min",
    temp_max: "Temp Max",
    low_tide: "Low Tide",
    low_tide_time: "Low Tide Time",
    high_tide: "High Tide",
    high_tide_time: "High Tide Time"
  }
};


let currentLang = localStorage.getItem("lang") || "id";

// function applyTranslations(lang = "id") {
//   currentLang = lang;
//   const t = translations[lang];

//   // Title
//   const title_top = document.querySelector("#judulTop");
//   if (title_top) title_top.innerText = t.title;

//   // Harbor and Code text
//   const harbor_name = document.querySelector("#pelabuhan");
//   if (harbor_name) harbor_name.innerText = t.harbor;
  
//   const code_name = document.querySelector("#kode");
//   if (code_name) code_name.innerText = t.code;

//   // Placeholder input
//   const input = document.getElementById("pelabuhanInput");
//   if (input) input.placeholder = t.inputPlaceholder;

//   // Card title
//   document.querySelectorAll(".info-box-title").forEach(el => {
//     el.innerText = t.forecastTitle;
//   });

//   // Spinner text
//   const spinnerText = document.querySelector("#spinner .spinner-content");
//   if (spinnerText) spinnerText.innerText = t.loading;

//   if (typeof currentWilayah === "string" && document.getElementById("judulInfo")) {
//   document.getElementById("judulInfo").innerHTML =
//     `<h2><span id="kode">Kode</span>: ${translations[lang].regionLabel(currentWilayah)}</h2>`;
// }

//   // Simpan bahasa
//   localStorage.setItem("lang", lang);

//   // 🔁 Render ulang data jika sudah pernah diambil
//   if (window.lastDataFetched) {
//     const hasilContainer = document.getElementById("hasilData");
//     let items = [];

//     if (window.lastDataFetched.data && typeof window.lastDataFetched.data === 'object') {
//       items = Array.isArray(window.lastDataFetched.data)
//         ? window.lastDataFetched.data.slice(0, 2)
//         : [window.lastDataFetched.data];
//     } else if (Array.isArray(window.lastDataFetched)) {
//       items = window.lastDataFetched.slice(0, 2);
//     } else if (typeof window.lastDataFetched === 'object') {
//       items = [window.lastDataFetched];
//     }

//     const cardHTML = items.map(item => createTableStyleCard(item)).join("").trim();
//     hasilContainer.innerHTML = cardHTML;
//   }

// }

// function getTranslation(key) {
//   return translations[currentLang][key] || key;
// }
function getTranslation(key) {
  return translations[currentLang]?.[key] || key;
}
