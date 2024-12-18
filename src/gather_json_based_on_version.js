const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const { convertToExcelPaths } = require("../config.js");
const { countries } = require("../data/countries.js");
const { languages } = require("../data/languages.js");

if (convertToExcelPaths.baseDirPath == "") {
  console.log("Directory (Say locales) path not provided");
  return;
}

// Path to the main folder containing subfolders
const mainFolderPath = path.resolve(convertToExcelPaths.baseDirPath);
const secondJsonPath = path.resolve(convertToExcelPaths.firstVersionPath);

// Check if the second JSON file exists
if (!fs.existsSync(secondJsonPath)) {
  console.error("Second JSON file not found");
  process.exit(1);
}

let enJson = {};

// Read and parse the second JSON file
const secondJson = JSON.parse(fs.readFileSync(secondJsonPath, "utf-8"));

// Function to compare and find missing keys with prefixed keys
const findMissingKeys = (firstObj, secondObj, fileName) => {
  const missingKeys = {};

  for (let key in firstObj) {
    if (
      !(
        secondObj.hasOwnProperty(key) &&
        (enJson ? enJson[key] == secondObj[key] : true)
      )
    ) {
      // Prefix the key with fileName::key if key is missing or value is different
      missingKeys[`${fileName}:${key}`] = firstObj[key];
    }
  }

  return missingKeys;
};

const flattenObject = (obj, parent = "", res = {}) => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const propName = parent ? `${parent}.${key}` : key;
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        flattenObject(obj[key], propName, res);
      } else {
        res[propName] = obj[key];
      }
    }
  }
  return res;
};

let translations = {};
// Function to process each folder
const processFolder = (folderPath, isItForEn) => {
  const paths = folderPath?.split("/");
  const locale = paths[paths?.length - 1];

  if (locale != "en") {
    const [country, language] = locale.split("-");

    // Iterate over all JSON files in the subfolder
    const files = fs.readdirSync(folderPath);

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);

      if (path.extname(file) === ".json") {
        // Ensure it's a JSON file
        const fileName = path.basename(file, ".json"); // Get the base file name without .json extension

        // Read and parse each JSON file
        const firstJson = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        const flattenedObject = flattenObject(firstJson);

        if (isItForEn) enJson = { ...enJson, ...flattenedObject };

        // Compare with the second JSON file
        const missingKeys = findMissingKeys(
          flattenedObject,
          secondJson,
          fileName
        );

        if (Object.keys(translations).includes(country)) {
          if (Object.keys(translations[country]).includes(language)) {
            translations[country][language] = {
              ...translations[country][language],
              ...missingKeys,
            };
          } else
            translations[country] = {
              ...translations[country],
              [language]: missingKeys,
            };
        } else {
          translations[country] = { [language]: missingKeys };
        }
        // Merge the missing keys into the translations object
        // console.log(translations);
      }
    });

    // Create the output JSON file inside the folder
    // const outputFilePath = path.join(folderPath, outputFileName);
    // fs.writeFileSync(
    //   outputFilePath,
    //   JSON.stringify(translations, null, 2),
    //   "utf-8"
    // );

    // console.log(
    //   `New JSON file created with missing keys at: ${outputFilePath}`
    // );
  }
};

// Iterate over the subfolders in the main folder
fs.readdir(mainFolderPath, (err, folders) => {
  if (err) {
    console.error("Unable to scan main folder:", err);
    return;
  }

  const enfolderPath = path.join(mainFolderPath, folders[1]);
  // Check if it's a folder
  if (fs.lstatSync(enfolderPath).isDirectory()) {
    processFolder(enfolderPath, true);
  }

  folders.forEach((folder) => {
    const folderPath = path.join(mainFolderPath, folder);

    // Check if it's a folder
    if (fs.lstatSync(folderPath).isDirectory()) {
      processFolder(folderPath, false);
    }
  });

  // Create the 'Countries' folder if it doesn't exist
  const countriesFolderPath = path.join(
    convertToExcelPaths.outputExcelPath,
    convertToExcelPaths.excelFolderName ?? "countries_vx"
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
        translations[country]["en"]
          ? translations[country]["en"][key] || ""
          : "", // English String
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

  // console.log(translations);

  console.log("Individual Excel files for each country updated successfully.");
});
