// // secureStorage.js

// const DEVICE_FINGERPRINT =
//   navigator.userAgent + navigator.language + navigator.platform;

// const SECRET_KEY = "Ecommerce2026Secure";
// const FINAL_KEY = SECRET_KEY + DEVICE_FINGERPRINT;


// // --------------------------------------------------
// // UTF8 <-> BASE64
// // --------------------------------------------------

// function utf8ToBase64(str) {
//   return btoa(unescape(encodeURIComponent(str)));
// }

// function base64ToUtf8(str) {
//   return decodeURIComponent(escape(atob(str)));
// }


// // --------------------------------------------------
// // XOR simple
// // --------------------------------------------------

// function xorEncrypt(str, key) {
//   let result = "";
//   for (let i = 0; i < str.length; i++) {
//     result += String.fromCharCode(
//       str.charCodeAt(i) ^ key.charCodeAt(i % key.length)
//     );
//   }
//   return result;
// }


// // --------------------------------------------------
// // génération clé dérivée
// // --------------------------------------------------

// function deriveKey(secret, salt = "") {
//   let hash = 0;
//   const combined = secret + salt;

//   for (let i = 0; i < combined.length; i++) {
//     hash = (hash << 5) - hash + combined.charCodeAt(i);
//     hash |= 0;
//   }

//   let key = "";

//   for (let i = 0; i < 16; i++) {
//     key += String.fromCharCode((hash >> (i * 2)) & 0xff);
//   }

//   return key;
// }


// // --------------------------------------------------
// // signature simple anti modification
// // --------------------------------------------------

// function createSignature(data) {
//   let hash = 0;

//   for (let i = 0; i < data.length; i++) {
//     hash = (hash << 5) - hash + data.charCodeAt(i);
//     hash |= 0;
//   }

//   return hash.toString(16);
// }


// // --------------------------------------------------
// // CHIFFREMENT
// // --------------------------------------------------

// function encryptLocal(value) {
//   const str = typeof value === "string" ? value : JSON.stringify(value);

//   const salt = Date.now().toString(); // sel dynamique
//   const key = deriveKey(FINAL_KEY, salt);

//   const encrypted = xorEncrypt(str, key);

//   const payload = salt + ":" + encrypted;

//   const signature = createSignature(payload);

//   return utf8ToBase64(signature + "|" + payload);
// }


// // --------------------------------------------------
// // DECHIFFREMENT
// // --------------------------------------------------

// function decryptLocal(cipherText) {
//   try {
//     const decoded = base64ToUtf8(cipherText);

//     const [signature, payload] = decoded.split("|");

//     if (!signature || !payload) return null;

//     // vérification anti modification
//     if (createSignature(payload) !== signature) {
//       console.warn("SecureStorage: données modifiées");
//       return null;
//     }

//     const [salt, encrypted] = payload.split(":");

//     const key = deriveKey(FINAL_KEY, salt);

//     const decrypted = xorEncrypt(encrypted, key);

//     try {
//       return JSON.parse(decrypted);
//     } catch {
//       return decrypted;
//     }

//   } catch {
//     return null;
//   }
// }


// // --------------------------------------------------
// // API PUBLIQUE
// // --------------------------------------------------

// export function setSecureItem(key, value) {
//   try {
//     const encrypted = encryptLocal(value);
//     localStorage.setItem(key, encrypted);
//   } catch (err) {
//     console.error("Erreur setSecureItem:", err);
//   }
// }

// export function getSecureItem(key) {
//   try {
//     const encrypted = localStorage.getItem(key);
//     if (!encrypted) return null;

//     return decryptLocal(encrypted);

//   } catch (err) {
//     console.error("Erreur getSecureItem:", err);
//     return null;
//   }
// }

// export function removeSecureItem(key) {
//   localStorage.removeItem(key);
// }

// export function clearSecureStorage() {
//   localStorage.clear();
// }











// ----------------------------------------------------------

// secureStorage.js

const SECRET_KEY = "MaCléUltraSecrète!2025"; // clé secrète

// --- Encode en UTF-8 puis en Base64 ---
function utf8ToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

function base64ToUtf8(str) {
    return decodeURIComponent(escape(atob(str)));
}

// --- XOR simple avec clé --- 
function xorEncrypt(str, key) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
}

// --- Génère une clé dynamique basée sur la clé secrète + sel ---
function deriveKey(secret, salt = "") {
    let hash = 0;
    const combined = secret + salt;
    for (let i = 0; i < combined.length; i++) {
        hash = (hash << 5) - hash + combined.charCodeAt(i);
        hash |= 0;
    }
    let key = "";
    for (let i = 0; i < 16; i++) {
        key += String.fromCharCode((hash >> (i * 2)) & 0xff);
    }
    return key;
}

// // --- Chiffrement ---
// function encryptLocal(value) {
//   const str = typeof value === "string" ? value : JSON.stringify(value);
//   const salt = Date.now().toString(); // sel dynamique
//   const key = deriveKey(SECRET_KEY, salt);

//   const xored = xorEncrypt(str, key);
//   return utf8ToBase64(salt + ":" + xored);
// }

// // --- Déchiffrement ---
// function decryptLocal(cipherText) {
//   try {
//     const decoded = base64ToUtf8(cipherText);
//     const [salt, data] = decoded.split(":");
//     const key = deriveKey(SECRET_KEY, salt);

//     const original = xorEncrypt(data, key);

//     try {
//       return JSON.parse(original); // si c'était un objet
//     } catch {
//       return original;
//     }
//   } catch {
//     return null;
//   }
// }

function encryptLocal(value) {
    const str = typeof value === "string" ? value : JSON.stringify(value);
    const key = deriveKey(SECRET_KEY); // ❌ plus de sel dynamique

    const xored = xorEncrypt(str, key);
    return utf8ToBase64(xored); // juste Base64
}

function decryptLocal(cipherText) {
    try {
        const decoded = base64ToUtf8(cipherText);
        const key = deriveKey(SECRET_KEY); // ❌ plus de sel
        const original = xorEncrypt(decoded, key);

        try {
            return JSON.parse(original);
        } catch {
            return original;
        }
    } catch {
        return null;
    }
}


// --- API publique SYNCHRONE ---
export function setSecureItem(key, value) {
    try {
        const encrypted = encryptLocal(value);
        localStorage.setItem(key, encrypted);
    } catch (err) {
        console.error("Erreur setSecureItem:", err);
    }
}

export function getSecureItem(key) {
    try {
        const encrypted = localStorage.getItem(key);
        if (!encrypted) return null;
        return decryptLocal(encrypted);
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

