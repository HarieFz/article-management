import { AES, enc } from "crypto-js";
import { CRYPTO_KEY } from "../constants";

export const encrypt = (data: any) => {
  const ciphertext = AES.encrypt(JSON.stringify(data), CRYPTO_KEY).toString();
  return ciphertext;
};

export const decrypt = (ciphertext: any) => {
  try {
    if (!ciphertext) {
      return null;
    }

    const bytes = AES.decrypt(ciphertext, CRYPTO_KEY);
    const decrypted = JSON.parse(bytes.toString(enc.Utf8));

    if (!decrypted) {
      return null;
    }

    return decrypted;
  } catch (error) {
    return error;
  }
};
