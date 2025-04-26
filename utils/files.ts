// utils/storage.ts

import JSZip from "jszip";
import { toast } from "react-toastify";

/**
 * Converts bytes to gigabytes with optional decimal precision.
 * @param bytes - The number of bytes.
 * @param precision - The number of decimal places (default is 2).
 * @returns The size in gigabytes as a number.
 */
export function bytesToGB(bytes: number, precision: number = 2): number {
  const gb = bytes / 1024 ** 3;
  return parseFloat(gb.toFixed(precision));
}

export function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  // Convert Uint8Array to a binary string
  const binaryString = String.fromCharCode.apply(null, uint8Array as any);

  // Convert the binary string to Base64
  return btoa(binaryString);
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result.split(",")[1]); // remove the data URL prefix
      } else {
        reject("Failed to read blob as base64 string.");
      }
    };

    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(blob);
  });
}

export function base64ToFile(
  base64String: string,
  fileName: string,
  mimeType: string = "application/octet-stream"
): File {
  const binaryString = atob(base64String);
  const byteArray = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }

  return new File([byteArray], fileName, { type: mimeType });
}

// Define the structure of the files array
interface FileObject {
  name: string;
  file: Blob | File; // File can be either Blob or File
}

export const exportToZip = async (filesArray: FileObject[]): Promise<void> => {
  const zip = new JSZip();

  // Loop through the array and add each file to the ZIP
  filesArray.forEach((fileObject) => {
    const { name, file } = fileObject;

    // Add the file to the zip with the specified name
    zip.file(name + ".txtn", file);
  });

  // Generate the ZIP file asynchronously as a blob
  const zipContent = await zip.generateAsync({ type: "blob" });

  // Create a temporary link element to trigger the download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(zipContent);
  link.download = "TEXTEN_EXPORT.zip"; // You can set a custom name for the ZIP file
  link.click(); // Trigger the download
};

export const extractTextFromFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        resolve(text);
      };
      reader.readAsText(file);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
