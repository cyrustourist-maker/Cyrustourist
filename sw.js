const CYRUS_CACHE = "cyrus-tourist-v6";

const CORE_FILES = [
  "./",
  "index.html",
  "manifest.json",
  "assets/images/logo.png",
  "assets/images/header-fix.css",
  "assets/images/cyrustourist-hero-2026.webp.jpg"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
