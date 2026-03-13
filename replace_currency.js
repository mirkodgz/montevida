const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function processFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace literal "$ " or "$" before dynamic variables. 
    // Example: ${item.price} -> S/. {item.price}
    // Example: <span className="text-dark">${item.discountedPrice}</span>

    // We are looking for text nodes rendering dollar signs immediately before curly brace or number
    content = content.replace(/>\$({\w+)/g, ">S/. $1");
    content = content.replace(/>\$(\d+)/g, ">S/. $1");
    // Some are like: Price: ${product.price}
    content = content.replace(/Price: \$({\w+)/g, "Precio: S/. $1");
    content = content.replace(/Price: \$/g, "Precio: S/. ");
    // Some are like Total: $
    content = content.replace(/Total:\s*\$/g, "Total: S/. ");
    // Some are like <p>${totalPrice}</p>
    content = content.replace(/>\$({\w+.*})/g, ">S/. $1");
    // specific patterns:
    content = content.replace(/>\$({product\.price})/g, ">S/. $1");
    content = content.replace(/>\$({product\.discountedPrice})/g, ">S/. $1");
    content = content.replace(/>\$({item\.price})/g, ">S/. $1");
    content = content.replace(/>\$({item\.discountedPrice})/g, ">S/. $1");
    // shopDetails pricing:
    content = content.replace(/\$({\(product\.discountedPrice)/g, "S/. $1");
    content = content.replace(/\$({\(product\.price)/g, "S/. $1");

    const count = (content.match(/S\/\./g) || []).length;

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated currency in ${filePath} (${count} occurrences)`);
    }
}

walkDir('./src/components', processFile);
walkDir('./src/app', processFile);
