const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const { convertToExcelPaths } = require("../config.js");
const { gatherTranslations } = require("./utils.js");
const { countries } = require("../data/countries.js");
const { languages } = require("../data/languages.js");

if (convertToExcelPaths.baseDirPath == "") {
  console.log("Directory (Say locales) path not provided");
  return;
}

if (convertToExcelPaths.jsonFileName == "") {
  console.log("Json file name not provided");
  return;
}

// Gather all translations from the locales directory
const translations = gatherTranslations(
  convertToExcelPaths.jsonFileName,
  convertToExcelPaths.baseDirPath
);

// Create the 'Countries' folder if it doesn't exist
const countriesFolderPath = path.join(
  convertToExcelPaths.outputExcelPath,
  "countries_v2"
);
if (!fs.existsSync(countriesFolderPath)) {
  fs.mkdirSync(countriesFolderPath, { recursive: true });
}

// Prepare data for each country and create or update individual Excel files
let keys = Object.keys(
  translations[Object.keys(translations)[0]][
    Object.keys(translations[Object.keys(translations)[0]])[0]
  ]
);

for (let country in translations) {
  let countryData = [];

  // Create headers for the individual country sheet, including "English String" first
  let countryColumns = ["Key", "English String [en]"];
  for (let lang in translations[country]) {
    if (lang !== "en") {
      countryColumns.push(
        `AI Translated String (${languages[lang]}) [${lang}]`
      );
      countryColumns.push(`Final String (${languages[lang]}) [${lang}]`);
    }
  }
  countryData.push(countryColumns);

  // Fill the rows with data for that specific country
  keys.forEach((key) => {
    let row = [
      key,
      translations[country]["en"] ? translations[country]["en"][key] || "" : "", // English String
    ];

    // Add translations for all languages except English ("en")
    for (let lang in translations[country]) {
      if (lang !== "en") {
        row.push(translations[country][lang][key] || ""); // AI Translated String
        row.push(""); // Empty cell for Final String to be filled later
      }
    }
    countryData.push(row);
  });

  // Convert the country-specific data to a worksheet
  if (Object.keys(countryData?.[0])?.length > 2) {
    let countryWorksheet = XLSX.utils.aoa_to_sheet(countryData);

    // Define the Excel file name as the country name
    const countryExcelFileName = `${countries[country]} (${country}) v2.xlsx`;
    if (countries[country]) {
      const countryExcelFilePath = path.join(
        countriesFolderPath,
        countryExcelFileName
      );

      let countryWorkbook;

      // Check if the file already exists
      if (fs.existsSync(countryExcelFilePath)) {
        // Load the existing workbook
        countryWorkbook = XLSX.readFile(countryExcelFilePath);
      } else {
        // Create a new workbook if file doesn't exist
        countryWorkbook = XLSX.utils.book_new();
      }

      // Remove existing convertToExcelPaths.module sheet if it exists, so we can update it
      if (countryWorkbook.SheetNames.includes(convertToExcelPaths.module)) {
        delete countryWorkbook.Sheets[convertToExcelPaths.module];
        countryWorkbook.SheetNames = countryWorkbook.SheetNames.filter(
          (sheet) => sheet !== convertToExcelPaths.module
        );
      }

      // Append the updated convertToExcelPaths.module sheet with country data
      XLSX.utils.book_append_sheet(
        countryWorkbook,
        countryWorksheet,
        convertToExcelPaths.module
      );

      // Save the updated or new workbook
      XLSX.writeFile(countryWorkbook, countryExcelFilePath);
    }
  }
}

console.log("Individual Excel files for each country updated successfully.");
