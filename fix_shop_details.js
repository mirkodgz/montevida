const fs = require('fs');
const file = 'src/components/ShopDetails/index.tsx';
let data = fs.readFileSync(file, 'utf8');

let startStr = '<div className="flex flex-col gap-4.5 border-y border-gray-3 mt-7.5 mb-9 py-9">';
let endStr = '<div className="flex flex-wrap items-center gap-4.5">';

let startIndex = data.indexOf(startStr);
let endIndex = data.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    console.log("Found block, removing it...");
    data = data.substring(0, startIndex) + data.substring(endIndex);
} else {
    console.log("Could not find block. Indexes:", startIndex, endIndex);
}

// Replace Purchase Now -> Comprar
data = data.replace('Purchase Now', 'Comprar');

fs.writeFileSync(file, data);
console.log("Done.");
