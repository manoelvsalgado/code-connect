export function generateSlug(title: string): string {
  return title
    .toLowerCase() // converte para minúsculas
    .normalize('NFD') // normaliza caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // remove caracteres especiais
    .trim() // remove espaços nas pontas
    .replace(/\s+/g, '-') // substitui espaços por hífens
    .replace(/-+/g, '-') // substitui múltiplos hífens por um só
    .replace(/^-|-$/g, ''); // remove hífens no início e fim
}
