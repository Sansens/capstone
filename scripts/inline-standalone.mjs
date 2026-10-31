// Menggabungkan hasil build Vite (JS + CSS) menjadi satu file HTML mandiri.
import fs from "node:fs";
import path from "node:path";

const dir = "dist-standalone";
let html = fs.readFileSync(path.join(dir, "index.standalone.html"), "utf8");

const read = (name) => fs.readFileSync(path.join(dir, "assets", name), "utf8");

// 1) sisipkan CSS
html = html.replace(
  /<link[^>]*rel="stylesheet"[^>]*href="[^"]*assets\/([^"]+)"[^>]*>/g,
  (_m, name) => `<style>\n${read(name)}\n</style>`
);

// 2) hapus modulepreload
html = html.replace(/<link[^>]*rel="modulepreload"[^>]*>/g, "");

// 3) keluarkan JS dari <head>, lalu sisipkan di akhir <body> sebagai script biasa
let bundle = "";
html = html.replace(
  /<script[^>]*src="[^"]*assets\/([^"]+)"[^>]*><\/script>/g,
  (_m, name) => {
    bundle = read(name).replace(/<\/script/gi, "<\\/script");
    return "";
  }
);
// pakai fungsi sebagai pengganti agar karakter seperti $& atau $' tidak diinterpretasi
html = html.replace("</body>", () => `<script>\n${bundle}\n</script>\n  </body>`);

const outDir = "artifacts";
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, "Kelompok-A-RT-website.html");
fs.writeFileSync(out, html);
console.log("Ditulis:", out, (fs.statSync(out).size / 1024).toFixed(0) + " KB");
console.log("Sisa referensi assets/:", (html.match(/assets\//g) || []).length);
