export async function tampilkanDataGelombang(kodeWilayah, container) {
  try {
    const response = await fetch('https://peta-maritim.bmkg.go.id/public_api/overview/gelombang.json');
    const data = await response.json();

    // Ambil data berdasarkan kode wilayah sebagai key
    const wilayah = data[kodeWilayah];
    if (!wilayah) {
      container.innerHTML = '<p><em>Data gelombang tidak tersedia untuk wilayah ini.</em></p>';
      return;
    }

    // Bangun tampilan kartu gelombang
    let html = `
      <div class="wave-card">
        <div class="wave-header">
          <h3>Gelombang Laut</h3>
          <span class="wave-issued">Dikeluarkan: ${wilayah.issued}</span>
        </div>
        <div class="wave-levels">
    `;

    ['today', 'tomorrow', 'h2', 'h3'].forEach(key => {
      const label = key === 'today' ? 'Hari Ini'
        : key === 'tomorrow' ? 'Besok' : key.toUpperCase().replace('H', 'H+');
      const levelValue = wilayah[key];
      const levelClass = levelValue.toLowerCase().replace(/\s+/g, '');
      html += `
        <div class="wave-item">
          <strong>${label}:</strong>
          <span class="level ${levelClass}">${levelValue || '-'}</span>
        </div>`;
    });

    html += `
        </div> <!-- .wave-levels -->
      </div> <!-- .wave-card -->
    `;
    container.innerHTML = html;
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p>Error mengambil data gelombang.</p>';
  }
}
