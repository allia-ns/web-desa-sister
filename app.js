const fmt = n => (n === null || n === undefined) ? "—" : Number(n).toLocaleString("id-ID");
const ids = Object.keys(DESA);

function uc(judul = "Under Construction", teks = "Data untuk bagian ini sedang dikumpulkan.") {
  return `<div class="uc"><span>⚠</span><h4>${judul}</h4><p>${teks}</p></div>`;
}

function orang(o, d, utama = false) {
  const gambar = o.foto
    ? `<img src="${o.foto}" alt="${o.nama}" loading="lazy">`
    : `<div class="ph">${o.nama[0]}</div>`;
  return `<div class="person ${utama ? "utama" : ""}">${gambar}<b>${o.nama}</b><small>${o.jabatan}</small></div>`;
}

function compass(b) {
  const lab = (cls, arah, isi) =>
    `<div class="cp ${cls}"><small>${arah}</small><b>${isi ?? "—"}</b></div>`;
  return `
    <div class="compass">
      ${lab("n", "UTARA", b.utara)}
      ${lab("w", "BARAT", b.barat)}
      <div class="rose">
        <svg viewBox="-100 -100 200 200" aria-label="Mata angin">
          <circle r="92" class="ring"/>
          <circle r="62" class="ring thin"/>
          <polygon points="0,-70 14,0 -14,0" class="ptr n"/>
          <polygon points="0,70 14,0 -14,0" class="ptr s"/>
          <polygon points="70,0 0,14 0,-14" class="ptr"/>
          <polygon points="-70,0 0,14 0,-14" class="ptr"/>
          <circle r="6" class="hub"/>
          <text y="-72" class="lt">U</text>
          <text y="80" class="lt">S</text>
          <text x="75" y="4" class="lt">T</text>
          <text x="-75" y="4" class="lt">B</text>
        </svg>
      </div>
      ${lab("e", "TIMUR", b.timur)}
      ${lab("s", "SELATAN", b.selatan)}
    </div>`;
}

function renderLayout() {
  const links = ids.map(i => `<a href="desa.html?d=${i}">Desa ${DESA[i].nama}</a>`).join("");
  document.body.insertAdjacentHTML("afterbegin", `
    <div class="topbar"><div class="wrap">
      <span>✆ (0271) 611767 | ✉ kecamatanmojolaban@gmail.com </span><span id="clock"></span>
    </div></div>
    <header class="nav"><div class="wrap navin">
      <a class="brand" href="index.html"><span class="logo"><img src="img/logo.png" alt="Logo"></span>
        <span>Kecamatan Mojolaban<small>Palur · Gadingan · Plumbon</small></span></a>
      <button class="burger" id="burger" aria-label="Menu">☰</button>
      <nav id="menu">
        <a href="index.html">Beranda</a>
        <div class="dd"><a href="index.html#desa">Desa ▾</a><div class="ddm">${links}</div></div>
      </nav>
    </div></header>`);
  document.body.insertAdjacentHTML("beforeend", `
    <footer><div class="wrap">
      <p><b>Kecamatan Mojolaban</b>, Kabupaten Sukoharjo, Jawa Tengah</p>
      <p class="mut">Tugas Sistem Terdistribusi · Data 2025–2026 (sumber: BPS & website pemerintah desa)</p>
    </div></footer>`);
  document.getElementById("burger").onclick = () => document.getElementById("menu").classList.toggle("open");
  const tick = () => document.getElementById("clock").textContent =
    new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "medium", timeStyle: "medium" }) + " WIB";
  tick(); setInterval(tick, 1000);
}

/* ---------- BERANDA ---------- */
function renderHome() {
  const all = ids.map(i => DESA[i]);
  const sum = f => all.reduce((a, d) => a + f(d), 0);
  document.getElementById("stats").innerHTML = [
    ["Desa", ids.length], ["Penduduk (3 desa)", fmt(sum(d => d.penduduk.total))],
    ["Luas (km²)", fmt(+sum(d => d.luasKm2).toFixed(2))], ["Dusun/Dukuh", sum(d => d.jumlahDusun)],
  ].map(([l, v]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`).join("");

  document.getElementById("desa-cards").innerHTML = ids.map(i => {
    const d = DESA[i];
    return `<a class="dcard" href="desa.html?d=${i}" style="--acc:${d.warna}">
      <h3>Desa ${d.nama}</h3><p class="mut">${d.visi}</p>
      <ul><li>𓀞 ${fmt(d.penduduk.total)} jiwa</li><li>🗺 ${fmt(d.luasKm2)} km²</li><li>🏘 ${d.jumlahDusun} dusun</li></ul>
      <span class="go">Lihat profil →</span></a>`;
  }).join("");

  document.getElementById("kec-visi").innerHTML = KECAMATAN.visiKabupaten
    ? `<p>${KECAMATAN.visiKabupaten}</p>` : uc("Visi & Misi Kabupaten Sukoharjo");
}

/* ---------- HALAMAN DESA ---------- */
function renderDesa() {
  const id = new URLSearchParams(location.search).get("d");
  const d = DESA[id];
  if (!d) { location.replace("index.html"); return; }
  document.title = `Desa ${d.nama} · Kecamatan Mojolaban`;
  document.documentElement.style.setProperty("--acc", d.warna);

  const p = d.penduduk;
  const pctL = +(p.laki / (p.laki + p.perempuan) * 100).toFixed(1);
  const pctP = +(100 - pctL).toFixed(1);
  const kv = rows => `<dl class="kv">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v ?? "—"}</dd>`).join("")}</dl>`;
  const sec = (idn, judul, isi) => `<section id="${idn}" class="sec"><div class="wrap"><h2>${judul}</h2>${isi}</div></section>`;

  const switcher = ids.map(i => `<a class="${i === id ? "on" : ""}" href="desa.html?d=${i}">${DESA[i].nama}</a>`).join("");

  document.getElementById("desa-root").innerHTML = `
    <div class="banner"><div class="wrap"><h1>Desa ${d.nama}</h1>
      <p class="crumb"><a href="index.html">Beranda</a> › Desa › ${d.nama}</p></div></div>
    <div class="subnav"><div class="wrap">
      <div class="tabs"><a href="#profil">Profil</a><a href="#wilayah">Wilayah</a><a href="#penduduk">Penduduk</a>
      <a href="#pemerintahan">Pemerintahan</a><a href="#pendidikan">Pendidikan</a><a href="#layanan">Layanan</a><a href="#galeri">Galeri</a><a href="#lokasi">Lokasi</a></div>
      <div class="switch">Pindah desa: ${switcher}</div></div></div>

    ${sec("profil", "Profil Desa", `
      <div class="visi"><small>VISI</small><p>${d.visi}</p></div>
      <h3>Misi</h3><ol class="misi">${d.misi.map(m => `<li>${m}</li>`).join("")}</ol>
      ${kv([["Kepala Desa", d.kepalaDesa], ["Alamat Kantor", d.alamatKantor], ["Kode Pos", d.kodePos],
            ["Koordinat", d.koordinat], ["Website", d.website ? `<a href="${d.website}" target="_blank" rel="noopener">${d.website}</a>` : null]])}`)}

    ${sec("wilayah", "Wilayah & Geografi", `
      <div class="grid4">
        <div class="stat"><b>${fmt(d.luasKm2)}</b><span>Luas (km²)</span></div>
        <div class="stat"><b>${d.jarakKabupatenKm}</b><span>Jarak ke ibukota kab. (km)</span></div>
        <div class="stat"><b>${d.rw}/${d.rt}</b><span>Jumlah RW / RT</span></div>
        <div class="stat"><b>${d.bts === null ? "—" : d.bts}</b><span>Menara BTS</span></div>
      </div>
      <h3>Batas Wilayah</h3>
      ${compass(d.batas)}      
      <h3>Penggunaan Lahan</h3>
      ${kv([["Lahan sawah", fmt(d.lahan.sawah) + " ha"], ["Lahan bukan sawah", fmt(d.lahan.bukanSawah) + " ha"],
            ["Lahan bukan pertanian", fmt(d.lahan.bukanPertanian) + " ha"]])}
      <h3>${d.jumlahDusun} Dusun/Dukuh</h3>
      <div class="chips">${d.dusun.map(x => `<span>${x}</span>`).join("")}</div>`)}

    ${sec("penduduk", "Kependudukan", `
      <div class="pop">
        <div class="pop-cards">
          <div class="stat"><b>${fmt(p.total)}</b><span>Jumlah penduduk</span></div>
          <div class="stat"><b>${fmt(d.kk)}</b><span>Kepala keluarga</span></div>
          <div class="stat l-p"><b>${fmt(p.perempuan)}</b><span>Perempuan</span></div>
          <div class="stat l-l"><b>${fmt(p.laki)}</b><span>Laki-laki</span></div>
        </div>
        <figure class="pie-box">
          <div class="pie" style="--l:${pctL}%" role="img"
               aria-label="Laki-laki ${pctL}%, perempuan ${pctP}%"></div>
          <figcaption class="legend">
            <span><i class="dot l"></i>Laki-laki ${pctL}%</span>
            <span><i class="dot p"></i>Perempuan ${pctP}%</span>
          </figcaption>
        </figure>
      </div>`)}

    ${sec("pemerintahan", "Pemerintahan Desa", `
      ${d.perangkat.slice(0, 1).map(o => orang(o, d, true)).join("")}
      <div class="people">${d.perangkat.slice(1).map(o => orang(o, d)).join("")}</div>
      ${d.perangkat.length < 3 ? uc("Perangkat desa lainnya", "Daftar perangkat desa & staf sedang dilengkapi.") : ""}`)}

    ${sec("pendidikan", "Fasilitas Pendidikan", `<ul class="list2">${d.pendidikan.map(x => `<li>${x}</li>`).join("")}</ul>`)}
    
    ${sec("layanan", "Layanan Desa", d.layanan
      ? `<ul class="list2">${d.layanan.map(x => `<li>${x}</li>`).join("")}</ul>`
      : uc("Layanan Desa"))}
    
    ${sec("galeri", "Galeri", d.galeri
      ? `<div class="gallery">${d.galeri.map(g =>
          `<figure><img src="${g.img}" alt="${g.ket ?? "Galeri Desa " + d.nama}" loading="lazy">
          ${g.ket ? `<figcaption>${g.ket}</figcaption>` : ""}</figure>`).join("")}</div>`
      : uc("Galeri Kegiatan"))}
    
      ${sec("lokasi", "Lokasi Kantor Desa", `
      <p>${d.alamatKantor}</p>
      ${d.lokasi
        ? `<div class="map"><iframe src="${d.lokasi.embed}" title="Peta kantor Desa ${d.nama}"
             loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`
        : uc("Peta Lokasi", "Peta kantor desa belum ditambahkan.")}`)}
    `;
}

renderLayout();
if (document.getElementById("desa-root")) renderDesa();
if (document.getElementById("desa-cards")) renderHome();