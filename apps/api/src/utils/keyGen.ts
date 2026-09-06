import crypto from "node:crypto";

const secretKeyHex = crypto.randomBytes(32).toString('hex');

console.log("Generated key: ", secretKeyHex);