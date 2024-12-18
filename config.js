const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Total number of translation mapping ( DONT USE THIS MAPPING, IT IS ONLY FOR THE REFERENCE )
// const countryLanguageMapping = {
//   in: ["en"],
//   zz: ["en"],
//   ca: ["en", "fr"],
//   cz: ["en", "cs"],
//   ee: ["en", "et", "ru"],
//   fi: ["en", "fi"],
//   hr: ["en", "hr"],
//   pt: ["en", "pt"],
//   at: ["de", "en"],
//   be: ["en", "fr", "nl"],
//   bg: ["bg", "en"],
//   ch: ["de", "en", "fr", "it"],
//   cy: ["el", "en", "ru"],
//   dk: ["da", "en"],
//   es: ["en", "es"],
//   fr: ["en", "fr"],
//   hu: ["en", "hu"],
//   ie: ["en"],
//   it: ["en", "it", "ru"],
//   lt: ["en", "lt", "ru"],
//   lu: ["de", "en", "fr"],
//   mt: ["en", "mt", "it"],
//   no: ["en", "no"],
//   ro: ["en", "ro"],
//   rs: ["en", "sr"],
//   se: ["en", "sv"],
//   si: ["en", "sl"],
//   sk: ["en", "sk"],
// };

// BX Translation mapping ( USE THIS FOR BX TRANSLATIONS ) - 82 combinations
// const countryLanguageMapping = {
//   ca: ["en", "fr"],
//   cz: ["en", "cs"],
//   ee: ["en", "et", "ru"],
//   fi: ["en", "fi"],
//   hr: ["en", "hr"],
//   pt: ["en", "pt"],
//   at: ["en", "de"],
//   be: ["en", "fr"],
//   bg: ["en", "bg"],
//   ch: ["en"],
//   cy: ["en"],
//   dk: ["en", "da"],
//   es: ["en", "es"],
//   fr: ["en", "fr"],
//   hu: ["en", "hu"],
//   ie: ["en"],
//   it: ["en", "it"],
//   lt: ["en", "lt"],
//   lu: ["en", "fr"],
//   mt: ["en", "it"],
//   no: ["en", "no"],
//   ro: ["en", "ro"],
//   rs: ["en", "sr"],
//   se: ["en"],
//   si: ["en", "sl"],
//   sk: ["en", "sk"],

//   // New countries list
//   am: ["en", "hy"],
//   az: ["en", "ru"],
//   by: ["en", "ru"],
//   ba: ["en", "bs"],
//   ge: ["en"],
//   de: ["en", "de"],
//   gr: ["en"],
//   il: ["en", "he"],
//   ks: ["en", "sq"],
//   lv: ["en", "lv", "ru"],
//   mk: ["en", "mk"],
//   me: ["en", "sr"],
//   nl: ["en", "nl"],
//   pl: ["en", "pl"],
//   tr: ["en", "tr"],
//   ua: ["en", "uk", "ru"],
//   gb: ["en"],
// };

// RX Translation mapping ( USE THIS FOR RX TRANSLATIONS ) - 91 combinations
// const countryLanguageMapping = {
//   ca: ["en", "fr"],
//   cz: ["en", "cs"],
//   ee: ["en", "et", "ru"],
//   fi: ["en", "fi"],
//   hr: ["en", "hr"],
//   pt: ["en", "pt"],
//   at: ["en", "de"],
//   be: ["en", "fr", "nl"],
//   bg: ["en", "bg"],
//   ch: ["de", "en", "fr", "it"],
//   cy: ["en", "ru"],
//   dk: ["en", "da"],
//   es: ["en", "es"],
//   fr: ["en", "fr"],
//   hu: ["en", "hu"],
//   ie: ["en"],
//   it: ["en", "it"],
//   lt: ["en", "lt", "ru"],
//   lu: ["en", "fr"],
//   mt: ["en", "mt"],
//   no: ["en", "no"],
//   ro: ["en", "ro"],
//   rs: ["en", "sr"],
//   se: ["en", "sv"],
//   si: ["en", "sl"],
//   sk: ["en", "sk"],

//   // New countries list
//   am: ["en", "hy"],
//   az: ["en", "az", "ru"],
//   by: ["en", "be"],
//   ba: ["en", "bs"],
//   ge: ["en", "ka"],
//   de: ["en", "de"],
//   gr: ["en", "el"],
//   il: ["en", "he"],
//   ks: ["en", "sq"],
//   lv: ["en", "lv", "ru"],
//   mk: ["en", "mk"],
//   me: ["en", "sr"],
//   nl: ["en", "nl"],
//   pl: ["en", "pl"],
//   tr: ["en", "tr"],
//   ua: ["en", "uk"],
//   gb: ["en"],
// };

// BX languages - 36
const RXAllLanguages = [
  "az",
  "be",
  "bg",
  "bs",
  "cs",
  "da",
  "de",
  "el",
  "en",
  "es",
  "et",
  "fi",
  "fr",
  "he",
  "hr",
  "hu",
  "hy",
  "it",
  "ka",
  "lt",
  "lv",
  "mk",
  "mt",
  "nl",
  "no",
  "pl",
  "pt",
  "ro",
  "ru",
  "sk",
  "sl",
  "sq",
  "sr",
  "sv",
  "tr",
  "uk",
];

// BX languages - 28
const BXAllLanguages = [
  "en",
  "fr",
  "cs",
  "et",
  "ru",
  "fi",
  "hr",
  "pt",
  "de",
  "bg",
  "da",
  "es",
  "hu",
  "it",
  "lt",
  "sl",
  "sk",
  "hy",
  "bs",
  "he",
  "sq",
  "lv",
  "mk",
  "sr",
  "nl",
  "pl",
  "tr",
  "uk",
];

// Combined languages - 36
const combinedLanguages = [
  "en","fr","cs","et","ru","fi","hr","pt","de",
  "bg","da","es","hu","it","lt","sl","sk","hy","bs","he",
  "sq","lv","mk","sr","nl","pl","tr","uk",
  "az","be","el","ka","mt","no","ro","sv",
];

// Union Language Mapping - 94
const countryLanguageMapping = {
  // ca: ["en", "fr"],
  // cz: ["en", "cs"],
  // ee: ["en", "et", "ru"],
  // fi: ["en", "fi"],
  // hr: ["en", "hr"],
  // pt: ["en", "pt"],
  // at: ["en", "de"],
  // be: ["en", "fr", "nl"],
  // bg: ["en", "bg"],
  // ch: ["de", "en", "fr", "it"],
  // cy: ["en", "ru"],
  // dk: ["en", "da"],
  // es: ["en", "es"],
  // fr: ["en", "fr"],
  // hu: ["en", "hu"],
  // ie: ["en"],
  // it: ["en", "it"],
  // lt: ["en", "lt", "ru"],
  // lu: ["en", "fr"],
  // mt: ["en", "mt", "it"],
  // no: ["en", "no"],
  // ro: ["en", "ro"],
  // rs: ["en", "sr"],
  // se: ["en", "sv"],
  // si: ["en", "sl"],
  // sk: ["en", "sk"],

  // // New countries list
  // am: ["en", "hy"],
  // az: ["en", "az", "ru"],
  // by: ["en", "be", "ru"],
  // ba: ["en", "bs"],
  // ge: ["en", "ka"],
  // de: ["en", "de"],
  // gr: ["en", "el"],
  // il: ["en", "he"],
  // ks: ["en", "sq"],
  // lv: ["en", "lv", "ru"],
  mk: ["en", "mk"],
  me: ["en", "sr"],
  nl: ["en", "nl"],
  pl: ["en", "pl"],
  tr: ["en", "tr"],
  ua: ["en", "uk", "ru"],
  gb: ["en"],
};

// Languages needed to add in RX - 3
// const languagesNeededInRX = {
//   mt: ["it"],
//   by: ["ru"],
//   ua: ["ru"],
// };

// Languages needed to add in BX - 12
// const countryLanguageMapping = {
//   be: ["nl"],
//   ch: ["it", "fr", "de"],
//   cy: ["ru"],
//   lt: ["ru"],
//   mt: ["mt"],
//   se: ["sv"],
//   az: ["az"],
//   by: ["be"],
//   gr: ["el"],
//   ge: ["ka"],
// };

// Translation of Json files configuration
/**
 * @var inputPath - Input file path should be containing input JSON file for translation.
 * If input file path is not provided, defaultly sets to ./input.json
 *
 * @var outputPath - If OutputPath is not provided defaultly creates locales folder and all mapping folder are created.
 * Else all the files are created in given output path
 *
 * @var outputJsonFileName - Used for creating or updating output json file name
 *
 * @var isExcelSheetNeeded - 'true' if you need excel sheet or default set to false
 *
 * @var outputExcelPath - Creates excel file of all translations, if  not provided creates excel file in the same folder.
 */
const fileName = [
  // "common"
  // "auth"
  // "bx_v1"
  // "bx_v2"
  // "bx_v3"
  // "bx_v4"
  // "bx_v5"
  // "bx_v6"
  // "bx_v7"
  // "bx_v8"
  // "course.find_course"
  // "course.new_course"
  // "course.participants"
  // "course.view_course"
  // "enum"
  // "login_page"
  // "language",
  "ganesh"
];
const paths = {
  inputPath: "./input.json",
  // inputPath: `/home/ajay-darisi/Documents/AOLD/MVP/BX/bx-fe/public/locales/en/${fileName[0]}.json`,
  // inputPath: `/home/ajay-darisi/Documents/AOLD/MVP/RX/rx/public/locales/en/${fileName[0]}.json`,
  // inputPath: `/home/ajay-darisi/Documents/AOLD/MVP/CAPS/caps-fe/src/utils/locales/en/${fileName[0]}.json`,
  // outputPath: "",
  // outputPath: "/home/ajay-darisi/Documents/AOLD/MVP/RX/rx/public/locales",
  outputPath: "/home/ajay-darisi/Documents/AOLD/MVP/BX/bx-fe/public/locales",
  // outputPath:
  //   "/home/ajay-darisi/Documents/AOLD/MVP/CAPS/caps-fe/src/utils/locales",
  outputJsonFileName: fileName[0],
  // isExcelSheetNeeded: false,
  // outputExcelPath: "",
};

// Converts Json files to Excel sheet configuration
/**
 * @var baseDirPath - Directory of translation folders path.
 *
 * @var jsonFileName - Json file name that need to be converted.
 *
 * @var outputExcelPath - Path where excel sheet to be created. default : at the same folder
 *
 * @var excelFileName - Name of the excel sheet name that need to be created, default : translations
 *
 */

const convertToExcelPaths = {
  excelFolderName: "countries_v3",
  outputExcelPath: "",
  // baseDirPath: "/home/ajay-darisi/Documents/AOLD/MVP/BX/bx-fe/public/locales", // compulsory
  // firstVersionPath: "./data/bx_v1.json",
  // module: "BX",
  baseDirPath: "/home/ajay-darisi/Documents/AOLD/MVP/RX/rx/public/locales", // compulsory
  firstVersionPath: "./data/rx_v1.json",
  module: "RX",
};

// Converts Excel sheet to Json files configuration
/**
 * @var excelFilePath - Path of the excel sheet that need to be converted to Json files.
 *
 * @var outputDirPath - Path of the folder, where Json files to be created. default : creates locales folder in it.
 *
 * @var outputJsonFileName - Name of the Json file that need to be created. default : common
 *
 */
const convertToJsonPaths = {
  excelFolderPath:
    "/home/ajay-darisi/Documents/AOLD/MVP/translator/translator/countries_v2", // Compulsory
  outputDirPath: "/home/ajay-darisi/Documents/AOLD/MVP/BX/bx-fe/public/locales",
  module: "BX",
  // outputJsonFileName: "common", //Compulsory
};

/**
 *
 */
const convertToLanguages = {
  inputPath: "./input.json",
  languages: ["az", "be", "el", "ka", "mt", "sv"],
  outputPath:
    "/home/ajay-darisi/Documents/AOLD/MVP/translator/translator/bxfelanguages-language.json",
};

module.exports = {
  generationConfig,
  countryLanguageMapping,
  paths,
  convertToExcelPaths,
  convertToJsonPaths,
  convertToLanguages,
};
