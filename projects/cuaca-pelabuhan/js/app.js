const pelabuhanMap = {};
window.currentLang = localStorage.getItem("lang") || "id";

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("pelabuhanInput");
  const datalist = document.getElementById("pelabuhanList");
  const judulInfo = document.getElementById("judulInfo");
  const hasilContainer = document.getElementById("hasilData");
  const mapContainer = document.getElementById("mapContainer");
  const spinner = document.getElementById("spinner");

  // Spinner aktif saat awal load
  spinner.classList.add("active");

  // Ambil daftar pelabuhan
  fetch("data/pelabuhan-list.json")
    .then(res => res.json())
    .then(list => {
      list.forEach(item => {
        const label = `${item.code}_${item.name}`;
        const opt = document.createElement("option");
        opt.value = label;
        datalist.appendChild(opt);
        pelabuhanMap[label] = item.url;
      });
    })
    .catch(err => {
      console.error("❌ Gagal memuat daftar pelabuhan:", err);
      hasilContainer.innerHTML = "<p style='color:red;'>Gagal memuat daftar pelabuhan.</p>";
    })
    .finally(() => {
      spinner.classList.remove("active");
    });

  input.addEventListener("change", () => {
    const selected = input.value.trim();
    if (!pelabuhanMap[selected]) return;

    const endpoint = pelabuhanMap[selected];
    const wilayah = selected.replace('_', '<br><span id="pelabuhan">Pelabuhan</span>: ');

    //judulInfo.innerHTML = `<h2>${wilayah}</h2>`;
    judulInfo.innerHTML = `<h2><span id="kode">Kode Area</span>: ${translations[currentLang].regionLabel(wilayah)}</h2>`;
    spinner.classList.add("active");
    hasilContainer.innerHTML = "";
    mapContainer.innerHTML = "";

    fetch(endpoint)
      .then(res => res.json())
      .then(json => {
        window.lastDataFetched = json; // 🔁 simpan global
        let items = [];

        if (json.data && typeof json.data === 'object') {
          items = Array.isArray(json.data) ? json.data.slice(0, 2) : [json.data];
        } else if (Array.isArray(json)) {
          items = json.slice(0, 2);
        } else if (typeof json === 'object') {
          items = [json];
        }

        if (!items.length) {
          hasilContainer.innerHTML = "<p>Data dari pelabuhan ini tidak tersedia atau belum lengkap.</p>";
          return;
        }

        const cardHTML = items.map(item => createTableStyleCard(item)).join("").trim();
        hasilContainer.innerHTML = cardHTML || "<p>Tidak ada data yang layak ditampilkan.</p>";

        const lat = json.latitude;
        const lon = json.longitude;
        if (lat && lon) {
          const mapURL = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.05},${lat - 0.05},${lon + 0.05},${lat + 0.05}&layer=mapnik&marker=${lat},${lon}`;
          mapContainer.innerHTML = `
            <div class="map-frame">
              <iframe src="${mapURL}" frameborder="0"></iframe>
            </div>`;
        }
      })
      .catch(err => {
        hasilContainer.innerHTML = `<p style="color:red;">Gagal mengambil data dari BMKG.</p>`;
        console.error(err);
      })
      .finally(() => {
        spinner.classList.remove("active");
        input.value = "";
        input.blur();
      });
  });
});

// ✅ Format data dalam bentuk seperti tabel
function createTableStyleCard(data) {

  const skipKeys = ['port_id', 'name', 'type', 'latitude', 'longitude', 'info'];
  const fullWidthKeys = ['issued', 'warning_desc', 'visibility'];

  // const fieldLabels = {
  //   issued: "Issued",
  //   valid_from: "Valid From",
  //   valid_to: "Valid To",
  //   warning_desc: "Warning Desc",
  //   weather: "Weather",
  //   weather_desc: "Weather Desc",
  //   wind_from: "Wind From",
  //   wind_to: "Wind To",
  //   wind_speed_min: "Wind Speed Min",
  //   wind_speed_max: "Wind Speed Max",
  //   current_from: "Current From",
  //   current_to: "Current To",
  //   current_speed_min: "Current Speed Min",
  //   current_speed_max: "Current Speed Max",
  //   wave_cat: "Wave Cat",
  //   wave_desc: "Wave Desc",
  //   visibility: "Visibility",
  //   rh_min: "Rh Min",
  //   rh_max: "Rh Max",
  //   temp_min: "Temp Min",
  //   temp_max: "Temp Max",
  //   low_tide: "Low Tide",
  //   low_tide_time: "Low Tide Time",
  //   high_tide: "High Tide",
  //   high_tide_time: "High Tide Time"
  // };

  const keys = Object.keys(data).filter(k => !skipKeys.includes(k));
  const rows = [];
  let tempRow = [];

  keys.forEach((key, index) => {
    const label = (window.fieldLabels?.[window.currentLang]?.[key]) || key.replace(/_/g, " ");
    // const label = fieldLabels[key] || key.replace(/_/g, " ");
    //const label = fieldLabels[currentLang][key] || key.replace(/_/g, " ");
    //const label = (fieldLabels[currentLang] && fieldLabels[currentLang][key]) || key.replace(/_/g, " ");
    //const label = (window.fieldLabels[window.currentLang] && window.fieldLabels[window.currentLang][key]) || key.replace(/_/g, " ");
    const value = data[key] ?? "-";

    const isFull = fullWidthKeys.includes(key);
    const cellHTML = `<div class="cell${isFull ? ' full' : ''}"><strong>${label}:</strong> ${value}</div>`;

    if (isFull) {
      if (tempRow.length) {
        rows.push(`<div class="row">${tempRow.join("")}</div>`);
        tempRow = [];
      }
      rows.push(`<div class="row">${cellHTML}</div>`);
    } else {
      tempRow.push(cellHTML);
      if (tempRow.length === 2 || index === keys.length - 1) {
        rows.push(`<div class="row">${tempRow.join("")}</div>`);
        tempRow = [];
      }
    }
  });

  return `
    <div class="info-box">
      <div class="info-box-title">Data Cuaca</div>
      ${rows.join("")}
    </div>`;
}



//let currentLang = localStorage.getItem("lang") || "id";

function applyTranslations(lang = "id") {
  window.currentLang = lang;
  localStorage.setItem("lang", lang);
  const t = translations[lang];

  // Title
  const title_top = document.querySelector("#judulTop");
  if (title_top) title_top.innerText = t.title;

  // Harbor and Code text
  const harbor_name = document.querySelector("#pelabuhan");
  if (harbor_name) harbor_name.innerText = t.harbor;
  
  const code_name = document.querySelector("#kode");
  if (code_name) code_name.innerText = t.code;

  // Placeholder input
  const input = document.getElementById("pelabuhanInput");
  if (input) input.placeholder = t.inputPlaceholder;

  // Card title
  document.querySelectorAll(".info-box-title").forEach(el => {
    el.innerText = t.forecastTitle;
  });

  // Spinner text
  const spinnerText = document.querySelector("#spinner .spinner-content");
  if (spinnerText) spinnerText.innerText = t.loading;

  if (typeof currentWilayah === "string" && document.getElementById("judulInfo")) {
  document.getElementById("judulInfo").innerHTML =
    `<h2><span id="kode">Kode</span>: ${translations[lang].regionLabel(currentWilayah)}</h2>`;
}

  
  // 🔁 Render ulang data jika sudah pernah diambil
  if (window.lastDataFetched) {
  const hasilContainer = document.getElementById("hasilData");
  let items = [];

  if (window.lastDataFetched.data && typeof window.lastDataFetched.data === 'object') {
    items = Array.isArray(window.lastDataFetched.data)
      ? window.lastDataFetched.data.slice(0, 2)
      : [window.lastDataFetched.data];
  } else if (Array.isArray(window.lastDataFetched)) {
    items = window.lastDataFetched.slice(0, 2);
  } else if (typeof window.lastDataFetched === 'object') {
    items = [window.lastDataFetched];
  }

  const cardHTML = items.map(item => createTableStyleCard(item)).join("").trim();
  hasilContainer.innerHTML = cardHTML;
}

  if (window.lastDataFetched) {
  const hasilContainer = document.getElementById("hasilData");
  let items = [];

  if (window.lastDataFetched.data && typeof window.lastDataFetched.data === 'object') {
    items = Array.isArray(window.lastDataFetched.data)
      ? window.lastDataFetched.data.slice(0, 2)
      : [window.lastDataFetched.data];
  } else if (Array.isArray(window.lastDataFetched)) {
    items = window.lastDataFetched.slice(0, 2);
  } else if (typeof window.lastDataFetched === 'object') {
    items = [window.lastDataFetched];
  }

  const cardHTML = items.map(item => createTableStyleCard(item)).join("").trim();
  hasilContainer.innerHTML = cardHTML;
}

}

// Inisialisasi dropdown
document.addEventListener("DOMContentLoaded", () => {
  const selector = document.getElementById("languageSelector");
  if (selector) {
    selector.value = currentLang;
    selector.addEventListener("change", () => {
      applyTranslations(selector.value);
    });
  }

  applyTranslations(currentLang);
});
