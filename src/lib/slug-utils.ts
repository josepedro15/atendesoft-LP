// Utilitários para geração de slugs a partir de títulos

/**
 * Gera um slug amigável para URL a partir de um título
 * @param title - Título da proposta
 * @returns Slug amigável para URL
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Remove acentos
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Substitui espaços e caracteres especiais por hífens
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    // Remove hífens duplicados
    .replace(/-+/g, '-')
    // Remove hífens no início e fim
    .replace(/^-+|-+$/g, '');
}

/**
 * Gera uma URL pública para a proposta baseada no slug
 * @param slug - Slug da proposta
 * @returns URL pública completa
 */
export function generatePublicUrl(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'https://atendesoft.com';
  
  return `${baseUrl}/propostas-${slug}`;
}

/**
 * Valida se um slug é válido
 * @param slug - Slug para validar
 * @returns true se o slug é válido
 */
export function isValidSlug(slug: string): boolean {
  // Slug deve ter entre 1 e 50 caracteres
  if (slug.length < 1 || slug.length > 50) {
    return false;
  }
  
  // Slug deve conter apenas letras minúsculas, números e hífens
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug);
}

/**
 * Gera um slug único adicionando um sufixo numérico se necessário
 * @param baseSlug - Slug base
 * @param existingSlugs - Array de slugs já existentes
 * @returns Slug único
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}
