export async function fetchDaftarPelabuhan() {
  const targetUrl = 'https://peta-maritim.bmkg.go.id/public_api/pelabuhan';
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

  try {
    const res = await fetch(proxyUrl);
    const htmlText = await res.text();

    // Debug: tampilkan cuplikan HTML
    console.log('🧪 Cuplikan HTML:', htmlText.slice(0, 500));

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    const table = doc.querySelector('table');
    if (!table) {
      console.warn('⚠️ Tabel pelabuhan tidak ditemukan.');
      return [];
    }

    const rows = Array.from(table.querySelectorAll('tr')).slice(1); // skip header row
    console.log('🔎 Jumlah baris terdeteksi:', rows.length);

    const list = [];

    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      const link = row.querySelector('a');

      if (cells.length >= 3 && link) {
        const code = cells[1].textContent.trim();
        const name = link.textContent.trim();
        const href = link.getAttribute('href');
        const url = `https://peta-maritim.bmkg.go.id${href}`;

        list.push({ code, name, url });
      }
    });

    console.log('✅ Pelabuhan ditemukan:', list.length);
    return list;
  } catch (err) {
    console.error('❌ Gagal mengambil atau mem-parsing data pelabuhan:', err);
    return [];
  }
}
