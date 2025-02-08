const generateIdenticon = require('./index.js');
const fs = require('fs');
const sharp = require('sharp');

async function generateImages() {
  const diameter = 500;
  
  for (let i = 1; i <= 20; i++) {
    const seed = Math.random() * 1000;
    const element = generateIdenticon(diameter, seed);
    const svgString = element.innerHTML;
    
    try {
      await sharp(Buffer.from(svgString))
        .png()
        .toFile(`example${i}.png`);
      console.log(`Generated example${i}.png`);
    } catch (err) {
      console.error(`Error generating example${i}.png:`, err);
    }
  }
}

generateImages().catch(console.error);
