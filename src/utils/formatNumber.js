/**
 * Formatte un nombre en supprimant les zéros inutiles après la virgule
 * @param {number|string} value - La valeur à formatter
 * @param {number} maxDecimals - Nombre maximum de décimales à afficher (défaut: 2)
 * @returns {string} Le nombre formaté
 */
export const formatNumber = (value, maxDecimals = 2) => {
  if (value === null || value === undefined || value === '') return '';
  
  // Convertir en nombre
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  // Vérifier si c'est un nombre valide
  if (isNaN(num)) return String(value);
  
  // Formater le nombre avec le maximum de décimales
  let formatted = num.toFixed(maxDecimals);
  
  // Supprimer les zéros inutiles à la fin
  formatted = formatted.replace(/\.?0+$/, '');
  
  // Si le nombre se termine par un point, on le supprime aussi
  if (formatted.endsWith('.')) {
    formatted = formatted.slice(0, -1);
  }
  
  return formatted;
};

/**
 * Formatte un nombre pour l'affichage, en gardant un nombre spécifique de décimales si nécessaire
 * @param {number|string} value - La valeur à formatter
 * @param {number} minDecimals - Nombre minimum de décimales à afficher (défaut: 0)
 * @param {number} maxDecimals - Nombre maximum de décimales à afficher (défaut: 2)
 * @returns {string} Le nombre formaté
 */
export const formatNumberWithOptions = (value, minDecimals = 0, maxDecimals = 2) => {
  if (value === null || value === undefined || value === '') return '';
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return String(value);
  
  // Formater avec le maximum de décimales
  let formatted = num.toFixed(maxDecimals);
  
  // Supprimer les zéros inutiles à la fin
  formatted = formatted.replace(/\.?0+$/, '');
  
  // Vérifier le nombre minimum de décimales
  if (minDecimals > 0) {
    const decimalPart = formatted.includes('.') ? formatted.split('.')[1] : '';
    if (decimalPart.length < minDecimals) {
      formatted = num.toFixed(minDecimals).replace(/\.?0+$/, '');
    }
  }
  
  return formatted;
};