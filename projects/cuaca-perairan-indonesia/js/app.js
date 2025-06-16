import { loadWilayahOptions } from './wilayahPerairan.js';
import { tampilkanDataGelombang } from './gelombang.js';

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('wilayahInput');
  const datalist = document.getElementById('wilayahList');
  const resultContainer = document.getElementById('result');
  const waveContainer = document.getElementById('wave');
  const footer = document.getElementById('footerInfo');
  const wilayahInfo = document.getElementById('wilayahInfo');
  const toggleThemeBtn = document.getElementById('toggleTheme');

  // Load datalist wilayah dari API
  loadWilayahOptions(input, datalist);

  async function handleInputSelection() {
    const value = input.value;
    if (!value || !value.includes('_')) return;

    const url = `https://peta-maritim.bmkg.go.id/public_api/perairan/${encodeURIComponent(value)}.json`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Data tidak ditemukan');
      const data = await response.json();

      // Tampilkan info di footer
      if (data.info) {
        footer.innerHTML = `<div class="info-banner">${data.info}</div>`;
      } else {
        footer.innerHTML = "";
      }

      // Kosongkan dan hilangkan fokus input
      input.value = "";
      input.blur();

      // Tampilkan nama wilayah di bawah input
      if (wilayahInfo) {
        wilayahInfo.innerHTML = `<div class="wilayah-title">Wilayah: ${value}</div>`;
      }

      // Tampilkan data cuaca
      let html = "";

      if (Array.isArray(data.data)) {
        html += `<h3>Cuaca Laut</h3>`;

        data.data.forEach(item => {
          let warningClass = 'none';
          let warningText = 'Tidak ada peringatan';
          let warningIcon = '✅';

          if (item.warning_desc && item.warning_desc.trim() !== '') {
            const warning = item.warning_desc.toLowerCase();
            warningIcon = '⚠️';

            if (warning.includes('tinggi') || warning.includes('ekstrem')) {
              warningClass = 'high';
            } else if (warning.includes('waspada') || warning.includes('sedang')) {
              warningClass = 'medium';
            } else {
              warningClass = 'low';
            }

            warningText = item.warning_desc;
          }

          html += `
            <div class="weather-card">
              <div class="weather-header">
                <h4>${item.time_desc}</h4>
                <small>${item.valid_from} – ${item.valid_to}</small>
              </div>
              <div class="warning ${warningClass}">
                ${warningIcon} ${warningText}
              </div>
              <p><strong>Cuaca:</strong> ${item.weather_desc}</p>
              <p><strong>Angin:</strong> ${item.wind_from} – ${item.wind_to} (${item.wind_speed_min}–${item.wind_speed_max} kt)</p>
              <p><strong>Gelombang:</strong> ${item.wave_desc} (${item.wave_cat})</p>
            </div>`;
        });
      }

      resultContainer.innerHTML = html;

      const kodeWilayah = value.split('_')[0];
      tampilkanDataGelombang(kodeWilayah, waveContainer);

    } catch (err) {
      resultContainer.innerHTML = `<p>Error memuat data cuaca: ${err.message}</p>`;
    }
  }

  // Trigger saat user memilih wilayah
  input.addEventListener('input', () => {
    if (input.value.includes('_')) {
      handleInputSelection();
    }
  });

  // Trigger saat tekan Enter
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      handleInputSelection();
    }
  });

  // Tema: dark/light toggle
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

  // Terapkan preferensi tema saat load
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
});
