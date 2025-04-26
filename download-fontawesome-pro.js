const fs = require("fs");
const path = require("path");
const axios = require("axios");

const CSS_URL =
  "https://site-assets.fontawesome.com/releases/v6.7.2/css/all.css";
const OUTPUT_DIR = path.join(__dirname, "public", "fontawesome");
const CSS_OUTPUT = path.join(OUTPUT_DIR, "all.css");
const WEBFONTS_DIR = path.join(OUTPUT_DIR, "webfonts");

// Ensure folders exist
fs.mkdirSync(WEBFONTS_DIR, { recursive: true });

async function downloadFile(url, filepath) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(filepath, response.data);
  console.log(`✅ Saved: ${filepath}`);
}

(async () => {
  try {
    console.log("📥 Downloading CSS...");
    const { data: cssContent } = await axios.get(CSS_URL);

    // Find all font URLs
    const fontUrls = [...cssContent.matchAll(/url\(([^)]+)\)/g)]
      .map((match) => match[1].replace(/["']/g, ""))
      .filter((url) => url.startsWith("../webfonts/"))
      .map((url) => url.replace("../webfonts/", ""));

    // Rewrite CSS to use local paths
    const localCss = cssContent.replace(/\.\.\/webfonts\//g, "./webfonts/");
    fs.writeFileSync(CSS_OUTPUT, localCss);
    console.log(`✅ CSS saved and rewritten: ${CSS_OUTPUT}`);

    // Download font files
    for (const fontFile of fontUrls) {
      const fontUrl = CSS_URL.replace("/css/all.css", `/webfonts/${fontFile}`);
      const fontPath = path.join(WEBFONTS_DIR, fontFile);
      await downloadFile(fontUrl, fontPath);
    }

    console.log("🎉 All files downloaded and saved locally.");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
})();
