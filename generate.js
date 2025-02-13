const generateIdenticon = require('./index.js');
const fs = require('fs');
const sharp = require('sharp');

async function generateImages() {
  const diameter = 500;
  
  for (let i = 1; i <= 100; i++) {
    const seed = Math.random() * 100000;
    // const seed = "12312131";
    const element = generateIdenticon(diameter, seed);
    const svgString = element.innerHTML;
    
    try {
      await sharp(Buffer.from(svgString))
        .png()
        .toFile(`examples14/example${i}.png`);
      console.log(`Generated example${i}.png`);
    } catch (err) {
      console.error(`Error generating example${i}.png:`, err);
    }
  }
}

generateImages().catch(console.error);
