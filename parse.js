import { readFile, writeFile } from "fs/promises";
import { BinaryReader } from "./binaryReader.js";

// Usage: node parse.js <file>
const fileName = process.argv[2];

if (!fileName) {
  console.error("Usage: node parse.js <file>");
  process.exit(1);
}

async function parseFile(fileName) {
  try {
    // Read file
    const data = await readFile(fileName);

    // Create reader and verify file header
    console.log("Loading file...");
    const reader = new BinaryReader(data);
    if (reader.readUtf8String(8) !== "UnityPrf") {
      console.error("Invalid file format! Expected UnityPrf header.");
      return;
    }

    // Skip reading version
    reader.seekRelative(8);

    // Read all entries
    let prefs = {};
    while (reader.offset < data.length) {
      const nameLen = reader.readUInt8();
      if (nameLen === 0) break;
      const name = reader.readUtf8String(nameLen);
      const type = reader.readUInt8();
      let value;
      if (type < 0x80) {
        value = reader.readUtf8String(type);
      } else if (type === 0x80) {
        const strLen = reader.readInt32();
        value = reader.readUtf8String(strLen);
      } else if (type === 0xfd) {
        value = reader.readFloat();
      } else if (type === 0xfe) {
        value = reader.readInt32();
      }
      prefs[name] = value;
    }
    console.log("PlayerPrefs read successfully!", prefs);

    // Write to file
    const outputFileName = fileName + ".json";
    console.log("Writing to file:", outputFileName);
    const json = JSON.stringify(prefs, null, 2);
    await writeFile(outputFileName, json);
    console.log("File written successfully!");
  } catch (err) {
    console.error("Error:", err);
  }
}

parseFile(fileName);
