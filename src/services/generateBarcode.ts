import bwipjs from "bwip-js";
import path from "path";
import fs from "fs/promises";

// Define the printType options
type PrintType = "2-up" | "3-up" | "4-up" | "A4" | "default";

// Define the options type
interface BarcodeOptions {
  bcid: string;
  text: string;
  scale: number;
  height: number;
  includetext: boolean;
  textxalign: any;
  textsize: number;
  backgroundcolor: string;
  paddingwidth: number;
}

const saveBarcode = async (png: any) => {
  const barcodesDir = path.join(__dirname, "..", "barcodes");
  await fs.mkdir(barcodesDir, { recursive: true });
  const fileName = `${Date.now()}-.png`; // Unique file name
  const filePath = path.join(barcodesDir, fileName);

  // Save the barcode image to the 'barcodes' folder
  await fs.writeFile(filePath, png);

  console.log("Barcode saved:", filePath);
};

// Function to generate a barcode image
const generateBarcode = async (
  text: string,
  printType: PrintType = "default"
): Promise<string> => {
  // Define options based on printType
  const options: BarcodeOptions = {
    bcid: "code128",
    text: text,
    scale: 3,
    height: 10,
    includetext: true,
    textxalign: "center",
    textsize: 13,
    backgroundcolor: "FFFFFF",
    paddingwidth: 20,
  };

  // Adjust options based on printType
  switch (printType) {
    case "2-up":
      options.height = 5;
      options.scale = 2;
      break;
    case "3-up":
      options.height = 3.33;
      options.scale = 2;
      break;
    case "4-up":
      options.height = 2.5;
      options.scale = 2;
      break;
    case "A4":
      options.height = 50; // Height in mm (assuming A4 size)
      options.scale = 5; // Adjust scale as needed
      break;
    default:
      break;
  }

  return new Promise((resolve, reject) => {
    bwipjs.toBuffer(options, (err, png) => {
      if (err) {
        reject(err);
      } else {
        saveBarcode(png);
        resolve("Barcode saved successfully");
      }
    });
  });
};

export default generateBarcode;
