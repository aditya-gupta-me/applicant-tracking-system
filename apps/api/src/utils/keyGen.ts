import crypto from "node:crypto";

function generateRandomSecretKey(numberOfRandomBytes: number) {
    const secretKeyHex = crypto.randomBytes(numberOfRandomBytes).toString('hex');

    return secretKeyHex;
}

export default generateRandomSecretKey;