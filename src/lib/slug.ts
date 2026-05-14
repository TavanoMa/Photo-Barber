export function generateSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")                 // remove acentos
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9\s-]/g, "")    // remove símbolos
    .trim()
    .replace(/\s+/g, "-")            // espaço → hífen
}