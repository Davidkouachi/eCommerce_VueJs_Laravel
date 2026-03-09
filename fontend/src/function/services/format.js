export function formaDateHeure(value) {
  if (!value) return '';

  // Convertit en objet Date même si " " à la place de "T"
  const date = new Date(value.replace(' ', 'T'));

  if (isNaN(date.getTime())) return value; // si conversion échoue

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} à ${hours}:${minutes}:${seconds}`;
}

export function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
