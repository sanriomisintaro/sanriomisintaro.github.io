import { loadWilayahOptions } from './wilayahPerairan.js';
import { tampilkanDataGelombang } from './gelombang.js';
import { assessRisk } from './riskAssessment.js';
import { assessRiskFuzzy } from './riskAssessmentFuzzy.js';

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('wilayahInput');
  const datalist = document.getElementById('wilayahList');
  const resultContainer = document.getElementById('result');
  const waveContainer = document.getElementById('wave');
  const footer = document.getElementById('footerInfo');
  const wilayahInfo = document.getElementById('wilayahInfo');
  const toggleThemeBtn = document.getElementById('toggleTheme');

  // Load datalist wilayah
  loadWilayahOptions(input, datalist);

  async function handleInputSelection() {
    const value = input.value;
    if (!value || !value.includes('_')) return;

    const kodeWilayah = value.split('_')[0];
    const url = `https://peta-maritim.bmkg.go.id/public_api/perairan/${encodeURIComponent(value)}.json`;

    try {
      resultContainer.innerHTML = `<p>Loading data...</p>`;
      waveContainer.innerHTML = "";

      const response = await fetch(url);
      if (!response.ok) throw new Error('Data tidak ditemukan');
      const data = await response.json();

      // Tampilkan info footer
      footer.innerHTML = data.info
        ? `<div class="info-banner">${data.info}</div>`
        : "";

      // Reset input
      input.value = "";
      input.blur();

      // Tampilkan nama wilayah
      if (wilayahInfo) {
        wilayahInfo.innerHTML = `<div class="wilayah-title">Wilayah: ${value}</div>`;
      }

      // Render data cuaca laut
      let html = "";
      if (Array.isArray(data.data)) {
        html += `<h3>Cuaca Laut</h3>`;

        data.data.forEach(item => {
          console.log("Forecast Item:", item);

          // --- Get wind average and max
          const windMin = parseFloat(item.wind_speed_min) || 0;
          const windMax = parseFloat(item.wind_speed_max) || 0;
          const windAvg = (windMin + windMax) / 2;

          const waveCategory = item.wave_cat;
          const rainfall = item.weather;

          // --- BMKG Official Warning
          let bmkgWarningHtml = "";
          if (item.warning_desc && item.warning_desc.toLowerCase() !== "nil") {
            bmkgWarningHtml = `
              <div class="bmkg-warning">
                ⚠️ <strong>BMKG Warning:</strong> ${item.warning_desc}
              </div>
            `;
          }

          // --- Log for debug
          console.log("Inputs for Fuzzy Expected (Avg):", {
            wind_speed: windAvg,
            wave_category: waveCategory,
            rainfall: rainfall
          });
          console.log("Inputs for Fuzzy Caution (Max):", {
            wind_speed: windMax,
            wave_category: waveCategory,
            rainfall: rainfall
          });

          // --- Run Fuzzy twice
          const riskResultFuzzyAvg = assessRiskFuzzy({
            wind_speed_max: windAvg,
            wave_category: waveCategory,
            rainfall: rainfall
          });

          const riskResultFuzzyMax = assessRiskFuzzy({
            wind_speed_max: windMax,
            wave_category: waveCategory,
            rainfall: rainfall
          });

          console.log("Fuzzy Risk Result (Expected):", riskResultFuzzyAvg);
          console.log("Fuzzy Risk Result (Caution/Max):", riskResultFuzzyMax);

          // --- Rule-based single (use max wind for conservative)
          const riskResult = assessRisk({
            wind_speed_max: windMax,
            wave_category: waveCategory,
            rainfall: rainfall
          });

          console.log("Rule-Based Risk Result:", riskResult);

          // --- Build output HTML
          html += `
            <div class="weather-card">
              <div class="weather-header">
                <h4>${item.time_desc}</h4>
                <small>${item.valid_from} – ${item.valid_to}</small>
              </div>

              ${bmkgWarningHtml}

              <p><strong>Cuaca:</strong> ${item.weather_desc}</p>
              <p><strong>Angin:</strong> ${item.wind_from} – ${item.wind_to} (${item.wind_speed_min}–${item.wind_speed_max} kt)</p>
              <p><strong>Gelombang:</strong> ${item.wave_desc} (${item.wave_cat})</p>

              <div class="assessment-block">
                <div class="assessment-summary">
                  <strong>Rule-Based Assessment:</strong> ${riskResult.level}
                  <button class="toggle-detail">Detail ▼</button>
                </div>
                <div class="assessment-detail" style="display: none;">
                  ${riskResult.explanation}
                </div>
              </div>

              <div class="assessment-block">
                <div class="assessment-summary">
                  <strong>Fuzzy Assessment (Expected Conditions):</strong> ${riskResultFuzzyAvg.level} (Score: ${riskResultFuzzyAvg.score.toFixed(2)})
                  <button class="toggle-detail">Detail ▼</button>
                </div>
                <div class="assessment-detail" style="display: none;">
                  ${riskResultFuzzyAvg.explanation}
                </div>
              </div>
              <div class="assessment-block">
                <div class="assessment-summary">
                  <strong>Fuzzy Assessment (Caution / Max Wind):</strong> ${riskResultFuzzyMax.level} (Score: ${riskResultFuzzyMax.score.toFixed(2)})
                  <button class="toggle-detail">Detail ▼</button>
                </div>
                <div class="assessment-detail" style="display: none;">
                  ${riskResultFuzzyMax.explanation}
                </div>
              </div>
            </div>
          `;
        });
      }

      resultContainer.innerHTML = html;

      // Enable toggle functionality for all "Detail" buttons
      document.querySelectorAll('.toggle-detail').forEach(button => {
        button.addEventListener('click', () => {
          const detail = button.parentElement.nextElementSibling;
          if (detail.style.display === 'none') {
            detail.style.display = 'block';
            button.textContent = 'Detail ▲';
          } else {
            detail.style.display = 'none';
            button.textContent = 'Detail ▼';
          }
        });
      });

      // Tampilkan data gelombang
      tampilkanDataGelombang(kodeWilayah, waveContainer);

    } catch (err) {
      resultContainer.innerHTML = `<p>Error memuat data cuaca: ${err.message}</p>`;
    }
  }

  // Event listener input
  input.addEventListener('input', () => {
    if (input.value.includes('_')) {
      handleInputSelection();
    }
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      handleInputSelection();
    }
  });

  // Theme toggle
  function applyTheme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark');
  }

  function toggleTheme() {
    const current = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
  }

  toggleThemeBtn.addEventListener('click', toggleTheme);
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
});


{
  "valid_from": "2025-07-03 12:00 UTC",
  "valid_to": "2025-07-04 00:00 UTC",
  "weather": "Hujan Ringan",
  "wind_speed_min": 2,
  "wind_speed_max": 19,
  "wave_cat": "Rendah",
  "weather_desc": "Perairan Sabang - Banda Aceh diperkirakan hujan ringan...",
  "warning_desc": "Waspada Angin Kencang"
}