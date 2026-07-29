import "dotenv/config";
import fs from "fs";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const file = fs.readFileSync("./test-image.webp.webp");

const formData = new FormData();

formData.append(
  "file",
  new Blob([file], { type: "image/webp" }),
  "test-image.webp"
);

const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

console.log("Testing Cloudinary Upload API...");
console.log("Cloud Name:", cloudName);
console.log("API Key:", apiKey);

try {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
    },
    body: formData,
  });

  console.log("HTTP STATUS:", response.status);

  console.log(
    "X-Cld-Error:",
    response.headers.get("x-cld-error")
  );

  const text = await response.text();

  console.log("RESPONSE:");
  console.log(text);

} catch (error) {
  console.log("REQUEST ERROR:", error);
}