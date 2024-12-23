/**
 * Validates a Shopify store domain
 * @param domain The store domain to validate
 * @returns boolean indicating if the domain is valid
 */
export const validateShopDomain = (domain: string): boolean => {
  // Remove protocol and www if present
  const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
  
  // Check if it's already a .myshopify.com domain
  if (cleanDomain.endsWith('.myshopify.com')) {
    return /^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/.test(cleanDomain);
  }
  
  // Check if it's a valid store name that we can append .myshopify.com to
  return /^[a-zA-Z0-9][a-zA-Z0-9\-]*$/.test(cleanDomain);
};