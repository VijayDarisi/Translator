const { translate } = require("@vitalets/google-translate-api");

async function gtranslate(input, languageCode) {
  const preparedInput = updateKeys(flattenObject(input));
  const { text } = await translate(JSON.stringify(preparedInput, null, 2), {
    from: "en",
    to: languageCode,
  });
  const translatedText = unflattenObject(updateKeys(JSON.parse(text), true));
  return translatedText;
}

function flattenObject(obj, parentKey = "", result = {}) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        flattenObject(obj[key], newKey, result); // Recursively flatten for nested objects
      } else {
        result[newKey] = obj[key]; // Add the non-object value
      }
    }
  }
  return result;
}

function unflattenObject(flatObj) {
  const result = {};
  for (const flatKey in flatObj) {
    if (flatObj.hasOwnProperty(flatKey)) {
      const keys = flatKey.split(".");
      keys.reduce((acc, key, index) => {
        if (index === keys.length - 1) {
          acc[key] = flatObj[flatKey]; // Assign value at the last key
        } else {
          acc[key] = acc[key] || {}; // Ensure the key exists
        }
        return acc[key];
      }, result);
    }
  }
  return result;
}

function updateKeys(obj, unset) {
  if (typeof obj !== "object" || obj === null) {
    return obj; // Base case: if it's not an object, return as is
  }

  // Iterate over each key in the object
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = unset ? key.substring(2, key.length - 2) : `__${key}__`; // Append and prepend '__'

    // Recursively apply the function if the value is an object
    acc[newKey] = updateKeys(obj[key], unset);
    return acc;
  }, {});
}

module.exports  = {gtranslate}