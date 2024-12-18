const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const { convertToJsonPaths } = require("../config");
const { countries } = require("../data/countries");

// Path to the folder containing Excel files
const excelFolderPath = convertToJsonPaths.excelFolderPath;
if (excelFolderPath === "") {
  console.log("Excel folder path not provided");
  return;
}

if (convertToJsonPaths.outputJsonFileName === "") {
  console.log("Output JSON file name not provided");
  return;
}

// Function to create directories recursively
const mkdirRecursiveSync = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Get the list of Excel files in the Countries folder
const excelFiles = fs
  .readdirSync(excelFolderPath)
  .filter((file) => file.endsWith(".xlsx"));

// Object to hold all translations
const translations = {};

// Iterate over each Excel file in the folder
excelFiles.forEach((fileName) => {
  const filePath = path.join(excelFolderPath, fileName);

  // Read the Excel file
  const workbook = XLSX.readFile(filePath);
  const sheetName = convertToJsonPaths.module; // We assume the relevant sheet is name

  if (!workbook.SheetNames.includes(sheetName)) {
    console.warn(
      `Sheet ${convertToJsonPaths.module} not found in file: ${fileName}`
    );
    return;
  }

  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // Extract headers and rows
  const headers = data[0]; // Headers row
  const rows = data.slice(1); // Data rows

  // Process each row to build translations object
  rows.forEach((row) => {
    const [key, ...rest] = row; // Ignore the "English String" column

    headers.forEach((header, index) => {
      if (header.includes("Final String")) {
        // Try to extract the language code from the header
        const match = header.match(/\[([^\]]+)\]/);
        if (match) {
          const lang = match[1]; // Get the language code from the header

          // Extract country from the fileName (use the first part of the file name)
          // const country = fileName.split(" ")[0];
          const matchedCountry = fileName.match(/\(([^)]+)\)/);
          const country = matchedCountry ? matchedCountry[1].trim() : null;

          if (!translations[country]) translations[country] = {};
          if (!translations[country][lang]) translations[country][lang] = {};

          // Extract the key part by removing the `jsonFileName::` part
          const fileNameKey = key.includes(":") ? key.split(":")[0] : "common";
          const actualKey = key.includes(":") ? key.split(":")[1] : key;

          // Assign the "Final String" value to the key in translations object
          if (translations[country][lang][fileNameKey])
            translations[country][lang][fileNameKey][actualKey] =
              row[index] || "";
          else
            translations[country][lang][fileNameKey] = {
              [actualKey]: row[index] || "",
            };
        } else {
          console.warn(
            `No language code found in header: "${header}". Skipping...`
          );
        }
      }
    });
  });
});

// Set output paths
const outputPath =
  convertToJsonPaths.outputDirPath === ""
    ? "./locales"
    : convertToJsonPaths.outputDirPath;
const outputJsonFileName =
  convertToJsonPaths.outputJsonFileName === ""
    ? "common"
    : convertToJsonPaths.outputJsonFileName;

// Create the locale folders and write the JSON files
for (const country in translations) {
  for (const lang in translations[country]) {
    const dirPath = path.join(outputPath, `${country}-${lang}`);
    mkdirRecursiveSync(dirPath);
    for (const fileName in translations[country][lang]) {
      const filePath = path.join(dirPath, `${fileName}.json`);
      fs.writeFileSync(
        filePath,
        JSON.stringify(translations[country][lang][fileName], null, 2),
        "utf8"
      );
    }
  }
}

console.log("Locale folders and JSON files created successfully.");
