import React from "react";
import { Icon } from "../components/ui.jsx";

/* ---------- helpers ---------- */
const C = {
  brown: "#4d2a00",
  brownMid: "#6b4519",
  orange: "#cc6f00",
  amber: "#f2a900",
  cream: "#f9e6a8",
  line: "#c9b48f",
  soft: "#fffdf6",
};

function Actor({ x, y, label }) {
  return (
    <g>
      <circle cx={x} cy={y} r="11" fill={C.soft} stroke={C.brown} strokeWidth="1.8" />
      <path
        d={`M${x} ${y + 11} V${y + 38} M${x - 16} ${y + 22} H${x + 16} M${x} ${y + 38} L${x - 13} ${y + 58} M${x} ${y + 38} L${x + 13} ${y + 58}`}
        stroke={C.brown}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <text x={x} y={y + 76} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.brown}>
        {label}
      </text>
    </g>
  );
}

function UseCase({ cx, cy, label, rx = 86 }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry="23" fill="#fffaf0" stroke={C.orange} strokeWidth="1.4" />
      <text x={cx} y={cy + 3.6} textAnchor="middle" fontSize="10.2" fill={C.brown} fontWeight="600">
        {label}
      </text>
    </g>
  );
}

function Entity({ x, y, w, name, attrs }) {
  const rowH = 17;
  const headH = 26;
  const h = headH + attrs.length * rowH + 6;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="7" fill="#fffdf6" stroke={C.brown} strokeWidth="1.4" />
      <path d={`M${x} ${y + headH} H${x + w}`} stroke={C.brown} strokeWidth="1.4" />
      <rect x={x} y={y} width={w} height={headH} rx="7" fill={C.brown} />
      <rect x={x} y={y + headH - 8} width={w} height="8" fill={C.brown} />
      <text x={x + w / 2} y={y + 17} textAnchor="middle" fontSize="10.4" fontWeight="800" fill={C.cream} letterSpacing="0.8">
        {name}
      </text>
      {attrs.map((a, i) => (
        <g key={a.n}>
          <text
            x={x + 10}
            y={y + headH + 14 + i * rowH}
            fontSize="8.4"
            fontWeight="800"
            fill={a.k === "PK" ? C.orange : C.brownMid}
          >
            {a.k || ""}
          </text>
          <text
            x={x + 30}
            y={y + headH + 14 + i * rowH}
            fontSize="10"
            fill={C.brown}
            textDecoration={a.k === "PK" ? "underline" : "none"}
            fontStyle={a.k === "FK" ? "italic" : "normal"}
          >
            {a.n}
          </text>
        </g>
      ))}
      <title>{name}</title>
    </g>
  );
}

function Conn({ children }) {
  return (
    <g stroke={C.orange} strokeWidth="1.3" fill="none" strokeLinecap="round" strokeDasharray="0">
      {children}
    </g>
  );
}

/* ---------- 1. USE CASE ---------- */
function UseCaseDiagram() {
  const left = [120, 180, 240, 300];
  const wargaUC = [
    "Kirim laporan mandiri",
    "Ajukan surat digital",
    "Pantau status laporan",
    "Perbarui data diri",
  ];
  const adminY = [120, 176];
  const adminUC = ["Kelola akun & hak akses", "Kelola jenis surat"];
  const pengurusY = [268, 322, 376, 430, 484];
  const pengurusUC = [
    "Kelola data warga",
    "Catat warga pindah",
    "Tindak lanjuti laporan",
    "Verifikasi pengajuan surat",
    "Pencarian data warga",
  ];

  return (
    <svg viewBox="0 0 900 620" role="img" aria-label="Use case diagram sistem pelaporan mandiri dan basis data warga">
      <rect x="250" y="36" width="420" height="520" rx="20" fill="#fffdf6" stroke={C.line} strokeWidth="1.6" strokeDasharray="6 5" />
      <text x="460" y="62" textAnchor="middle" fontSize="10.6" fontWeight="800" fill={C.brownMid} letterSpacing="0.9">
        SISTEM PELAPORAN MANDIRI &amp; BASIS DATA WARGA
      </text>

      <Actor x="120" y="170" label="Warga" />
      <Actor x="800" y="140" label="Admin Sistem" />
      <Actor x="800" y="380" label="Pengurus RT" />

      <Conn>
        {left.map((y) => (
          <line key={y} x1="146" y1="205" x2="264" y2={y} />
        ))}
        {adminY.map((y) => (
          <line key={"a" + y} x1="760" y1="160" x2="656" y2={y} />
        ))}
        {pengurusY.map((y) => (
          <line key={"p" + y} x1="760" y1="410" x2="656" y2={y} />
        ))}
      </Conn>

      {left.map((y, i) => (
        <UseCase key={wargaUC[i]} cx="350" cy={y} label={wargaUC[i]} />
      ))}
      {adminY.map((y, i) => (
        <UseCase key={adminUC[i]} cx="570" cy={y} label={adminUC[i]} />
      ))}
      {pengurusY.map((y, i) => (
        <UseCase key={pengurusUC[i]} cx="570" cy={y} label={pengurusUC[i]} />
      ))}
    </svg>
  );
}

/* ---------- 2. FLOWCHART ---------- */
function FlowNode({ x = 230, y, w = 300, h = 44, lines, fill = "#fffaf0", strong = false }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="9" fill={fill} stroke={C.brown} strokeWidth="1.4" />
      {lines.map((t, i) => (
        <text
          key={t}
          x={x + w / 2}
          y={y + h / 2 + (i - (lines.length - 1) / 2) * 13 + 3.5}
          textAnchor="middle"
          fontSize="10.6"
          fontWeight={strong ? 700 : 500}
          fill={C.brown}
        >
          {t}
        </text>
      ))}
    </g>
  );
}

function Diamond({ cy, lines, h = 72, w = 300, x = 230 }) {
  const cx = x + w / 2;
  return (
    <g>
      <path
        d={`M${cx} ${cy - h / 2} L${x + w} ${cy} L${cx} ${cy + h / 2} L${x} ${cy} Z`}
        fill={C.cream}
        stroke={C.brown}
        strokeWidth="1.4"
      />
      {lines.map((t, i) => (
        <text
          key={t}
          x={cx}
          y={cy + (i - (lines.length - 1) / 2) * 12 + 3.5}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill={C.brown}
        >
          {t}
        </text>
      ))}
    </g>
  );
}

function Term({ cy, label, fill = C.brown, color = C.cream }) {
  return (
    <g>
      <rect x="330" y={cy - 19} width="100" height="38" rx="19" fill={fill} />
      <text x="380" y={cy + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={color} letterSpacing="0.6">
        {label}
      </text>
    </g>
  );
}

function Flowchart() {
  const cx = 380;
  return (
    <svg viewBox="0 0 760 860" role="img" aria-label="Flowchart pengajuan surat digital">
      <defs>
        <marker id="fc-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
          <path d="M0 0 L8 4.5 L0 9 z" fill={C.orange} />
        </marker>
      </defs>

      <Term cy="30" label="MULAI" />
      <FlowNode y="72" lines={["Warga membuka menu", "Pengajuan Surat Digital"]} strong />
      <Diamond cy="182" lines={["Jenis surat", "dipilih?"]} />
      <FlowNode y="232" lines={["Warga mengisi data pemohon", "(nama, NIK, kontak, alamat)"]} />
      <Diamond cy="336" lines={["Data valid?"]} h="68" />
      <FlowNode y="386" lines={["Unggah berkas persyaratan", "(KTP, KK, dokumen pendukung)"]} />
      <FlowNode y="448" lines={["Kirim pengajuan ke sistem"]} />
      <FlowNode y="510" lines={["Pengurus RT memverifikasi", "kelengkapan & kesesuaian data"]} />
      <Diamond cy="618" lines={["Lengkap &", "sesuai?"]} h="76" />
      <FlowNode y="676" lines={["Sistem menerbitkan nomor surat", "& dokumen siap diunduh"]} />
      <FlowNode y="738" lines={["Notifikasi WhatsApp ke warga"]} />
      <Term cy="816" label="SELESAI" />

      <Conn>
        <line x1={cx} y1="49" x2={cx} y2="70" markerEnd="url(#fc-arrow)" />
        <line x1={cx} y1="116" x2={cx} y2="145" markerEnd="url(#fc-arrow)" />
        <line x1={cx} y1="218" x2={cx} y2="230" markerEnd="url(#fc-arrow)" />
        <line x1={cx} y1="276" x2={cx} y2="301" markerEnd="url(#fc-arrow)" />
        <line x1={cx} y1="370" x2={cx} y2="384" markerEnd="url(#fc-arrow)" />
        <line x1={cx} y1="430" x2={cx} y2="446" markerEnd="url(#fc-arrow)" />
        <line x1={cx} y1="492" x2={cx} y2="508" markerEnd="url(#fc-arrow)" />
        <line x1={cx} y1="554" x2={cx} y2="579" markerEnd="url(#fc-arrow)" />
        <line x1={cx} y1="656" x2={cx} y2="674" markerEnd="url(#fc-arrow)" />
        <line x1={cx} y1="720" x2={cx} y2="736" markerEnd="url(#fc-arrow)" />
        <line x1={cx} y1="782" x2={cx} y2="795" markerEnd="url(#fc-arrow)" />
      </Conn>

      {/* Tidak: jenis belum dipilih */}
      <Conn>
        <path d="M230 182 H166 V94" markerEnd="url(#fc-arrow)" />
        <path d="M230 336 H150 V250" markerEnd="url(#fc-arrow)" />
        <path d="M530 618 H636 V408" markerEnd="url(#fc-arrow)" />
      </Conn>

      <text x="196" y="174" fontSize="9.6" fontWeight="700" fill={C.orange}>Tidak</text>
      <text x="196" y="328" fontSize="9.6" fontWeight="700" fill={C.orange}>Tidak</text>
      <text x="546" y="610" fontSize="9.6" fontWeight="700" fill={C.orange}>Tidak</text>
      <text x="392" y="232" fontSize="9.6" fontWeight="700" fill={C.orange}>Ya</text>
      <text x="392" y="386" fontSize="9.6" fontWeight="700" fill={C.orange}>Ya</text>
      <text x="392" y="676" fontSize="9.6" fontWeight="700" fill={C.orange}>Ya</text>

      <text x="150" y="264" fontSize="9" fill={C.brownMid}>tampilkan pesan validasi</text>
      <text x="640" y="410" fontSize="9" fill={C.brownMid} transform="rotate(90 640 410)" textAnchor="middle">
        berkas dikembalikan ke warga
      </text>
    </svg>
  );
}

/* ---------- 3. ERD ---------- */
function ERD() {
  return (
    <svg viewBox="0 0 980 660" role="img" aria-label="Entity relationship diagram basis data warga">
      <defs>
        <marker id="erd-dot" markerWidth="6" markerHeight="6" refX="3" refY="3">
          <circle cx="3" cy="3" r="2.4" fill={C.orange} />
        </marker>
      </defs>

      <Entity
        x="20" y="30" w="200" name="USER"
        attrs={[{ k: "PK", n: "id_user" }, { k: "", n: "username" }, { k: "", n: "password" }, { k: "", n: "role" }]}
      />
      <Entity
        x="305" y="30" w="230" name="WARGA"
        attrs={[
          { k: "PK", n: "nik" },
          { k: "", n: "nama_lengkap" },
          { k: "", n: "alamat" },
          { k: "", n: "blok_rumah" },
          { k: "", n: "no_hp" },
          { k: "FK", n: "no_kk" },
          { k: "FK", n: "id_user" },
        ]}
      />
      <Entity
        x="610" y="30" w="210" name="KARTU_KELUARGA"
        attrs={[{ k: "PK", n: "no_kk" }, { k: "", n: "kepala_keluarga" }, { k: "", n: "jumlah_anggota" }]}
      />
      <Entity
        x="20" y="290" w="200" name="JENIS_SURAT"
        attrs={[{ k: "PK", n: "id_jenis" }, { k: "", n: "kode_surat" }, { k: "", n: "nama_surat" }, { k: "", n: "estimasi_hari" }]}
      />
      <Entity
        x="305" y="300" w="230" name="PENGAJUAN_SURAT"
        attrs={[
          { k: "PK", n: "id_pengajuan" },
          { k: "FK", n: "nik" },
          { k: "FK", n: "id_jenis" },
          { k: "", n: "tanggal_ajuan" },
          { k: "", n: "keperluan" },
          { k: "", n: "status" },
        ]}
      />
      <Entity
        x="610" y="300" w="210" name="LAPORAN"
        attrs={[
          { k: "PK", n: "id_laporan" },
          { k: "FK", n: "nik" },
          { k: "", n: "kategori" },
          { k: "", n: "judul" },
          { k: "", n: "status" },
          { k: "", n: "tanggal" },
        ]}
      />
      <Entity
        x="610" y="504" w="210" name="MUTASI_WARGA"
        attrs={[{ k: "PK", n: "id_mutasi" }, { k: "FK", n: "nik" }, { k: "", n: "jenis_mutasi" }, { k: "", n: "tanggal" }]}
      />

      <Conn>
        {/* USER 1 — 1 WARGA */}
        <path d="M220 80 H262 V100 H305" markerStart="url(#erd-dot)" markerEnd="url(#erd-dot)" />
        {/* KK 1 — N WARGA */}
        <path d="M610 70 H560 V62 H535" markerStart="url(#erd-dot)" markerEnd="url(#erd-dot)" />
        {/* WARGA 1 — N PENGAJUAN */}
        <path d="M420 192 V300" markerStart="url(#erd-dot)" markerEnd="url(#erd-dot)" />
        {/* JENIS 1 — N PENGAJUAN */}
        <path d="M220 344 H305" markerStart="url(#erd-dot)" markerEnd="url(#erd-dot)" />
        {/* WARGA 1 — N LAPORAN */}
        <path d="M500 192 V236 H700 V300" markerStart="url(#erd-dot)" markerEnd="url(#erd-dot)" />
        {/* WARGA 1 — N MUTASI */}
        <path d="M535 160 H568 V540 H610" markerStart="url(#erd-dot)" markerEnd="url(#erd-dot)" />
      </Conn>

      <text x="248" y="72" fontSize="10" fontWeight="800" fill={C.orange}>1</text>
      <text x="292" y="94" fontSize="10" fontWeight="800" fill={C.orange}>1</text>
      <text x="548" y="56" fontSize="10" fontWeight="800" fill={C.orange}>N</text>
      <text x="590" y="64" fontSize="10" fontWeight="800" fill={C.orange}>1</text>
      <text x="428" y="246" fontSize="10" fontWeight="800" fill={C.orange}>N</text>
      <text x="428" y="196" fontSize="10" fontWeight="800" fill={C.orange}>1</text>
      <text x="252" y="338" fontSize="10" fontWeight="800" fill={C.orange}>1</text>
      <text x="282" y="358" fontSize="10" fontWeight="800" fill={C.orange}>N</text>
      <text x="690" y="226" fontSize="10" fontWeight="800" fill={C.orange}>N</text>
      <text x="512" y="186" fontSize="10" fontWeight="800" fill={C.orange}>1</text>
      <text x="576" y="520" fontSize="10" fontWeight="800" fill={C.orange}>N</text>
    </svg>
  );
}

export default function Sistem() {
  const kartu = [
    { ikon: "users", judul: "3 aktor", teks: "Warga, Admin Sistem, dan Pengurus RT dengan hak akses berbeda." },
    { ikon: "layers", judul: "11 use case", teks: "Dari pengajuan surat digital hingga pencarian basis data warga." },
    { ikon: "file", judul: "7 entitas", teks: "WARGA, KARTU_KELUARGA, USER, JENIS_SURAT, PENGAJUAN_SURAT, LAPORAN, MUTASI_WARGA." },
  ];

  return (
    <>
      <div className="card card-pad" style={{ marginBottom: 18 }}>
        <span className="eyebrow">Tugas 1</span>
        <h2 style={{ fontSize: 20 }}>Perancangan sistem pelaporan mandiri &amp; basis data warga</h2>
        <p className="muted small-text" style={{ marginTop: 6, maxWidth: "70ch" }}>
          Halaman ini memuat hasil perancangan yang menjadi dasar implementasi antarmuka pada
          tugas 2–4: diagram use case, flowchart pengajuan surat digital, dan entity relationship
          diagram (ERD) basis data.
        </p>
        <div className="grid grid-3" style={{ marginTop: 18 }}>
          {kartu.map((k) => (
            <div key={k.judul} className="layanan-card" style={{ padding: 16 }}>
              <div className="layanan-ico amber" style={{ width: 36, height: 36, borderRadius: 10 }}>
                <Icon name={k.ikon} size={17} />
              </div>
              <h3 style={{ fontSize: 14 }}>{k.judul}</h3>
              <p>{k.teks}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="section" style={{ marginTop: 0 }}>
        <div className="section-head">
          <div>
            <span className="eyebrow">1A · Use case diagram</span>
            <h2 style={{ fontSize: 18 }}>Aktor dan fungsi sistem</h2>
            <p>Warga berinteraksi dengan layanan mandiri, pengurus mengelola data, admin mengatur sistem.</p>
          </div>
        </div>
        <div className="diagram">
          <UseCaseDiagram />
          <p className="diagram-cap">
            <strong>Penjelasan:</strong> Warga dapat mengirim laporan mandiri, mengajukan surat
            digital, memantau status, dan memperbarui data diri. Pengurus RT mengelola data warga,
            mencatat mutasi, menindaklanjuti laporan, memverifikasi pengajuan, serta melakukan
            pencarian data. Admin sistem mengelola akun, hak akses, dan jenis surat.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">1B · Flowchart</span>
            <h2 style={{ fontSize: 18 }}>Alur pengajuan surat digital</h2>
            <p>Termasuk dua titik validasi: data pemohon dan kelengkapan berkas oleh pengurus.</p>
          </div>
        </div>
        <div className="diagram" style={{ maxWidth: 720 }}>
          <Flowchart />
          <p className="diagram-cap">
            <strong>Penjelasan:</strong> Sistem menolak pengajuan yang datanya tidak valid dan
            mengembalikan berkas yang belum lengkap. Jika lolos verifikasi, sistem menerbitkan
            nomor surat, dokumen siap diunduh, dan notifikasi dikirim ke WhatsApp warga.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">1C · ERD</span>
            <h2 style={{ fontSize: 18 }}>Relasi basis data warga</h2>
            <p>Satu warga memiliki banyak pengajuan surat dan laporan (relasi 1 : N).</p>
          </div>
        </div>
        <div className="diagram">
          <ERD />
          <p className="diagram-cap">
            <strong>Penjelasan relasi:</strong> WARGA terhubung ke KARTU_KELUARGA (N:1) dan USER
            (1:1) untuk akun layanan. Setiap pengajuan surat merujuk satu jenis surat dan satu
            warga. Laporan serta mutasi warga menyimpan referensi NIK sebagai pencatat riwayat.
          </p>
        </div>
      </section>
    </>
  );
}
