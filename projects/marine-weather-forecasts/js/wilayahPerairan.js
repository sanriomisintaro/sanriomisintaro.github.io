export async function loadWilayahOptions(inputElement, datalistElement) {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.style.display = 'flex';

  try {
    const response = await fetch('https://peta-maritim.bmkg.go.id/public_api/static/wilayah_perairan.json');
    const data = await response.json();

    if (!Array.isArray(data.features)) throw new Error("Format data tidak sesuai");

    const wilayahList = data.features
      .map(f => ({
        kode: f.properties.WP_1,
        nama: f.properties.WP_IMM
      }))
      .filter(item => item.kode && item.nama && /^[A-Z]\./.test(item.kode));

    wilayahList.sort((a, b) => a.kode.localeCompare(b.kode, 'id', { numeric: true }));

    datalistElement.innerHTML = '';
    wilayahList.forEach(item => {
      const option = document.createElement('option');
      option.value = `${item.kode}_${item.nama}`;
      datalistElement.appendChild(option);
    });

  } catch (error) {
    console.error('Gagal memuat wilayah perairan:', error);
  } finally {
    if (overlay) overlay.style.display = 'none';
  }
}
