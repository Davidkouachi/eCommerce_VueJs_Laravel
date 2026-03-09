import CryptoJS from "crypto-js";

const SECRET_KEY = "MaCléUltraSecrète!2025"; // ⚠️ idéalement dans .env

// 🔒 Fonction de chiffrement
export function encrypt(value) {
  if (!value) return null;
  return CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
}

// 🔓 Fonction de déchiffrement
export function decrypt(cipherText) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return null;
  }
}

// 🧰 Fonctions de manipulation sécurisée du localStorage
export function setSecureItem(key, value) {
  try {
    const jsonValue = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, encrypt(jsonValue));
  } catch (err) {
    console.error("Erreur setSecureItem:", err);
  }
}

export function getSecureItem(key) {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;

    const decrypted = decrypt(encrypted);
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  } catch (err) {
    console.error("Erreur getSecureItem:", err);
    return null;
  }
}

export function removeSecureItem(key) {
  localStorage.removeItem(key);
}

export function clearSecureStorage() {
  localStorage.clear();
}
