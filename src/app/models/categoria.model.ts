export interface Categoria {
  id?: string;  // ID opcional para o Firestore
  nome: string;
  tipo: string;  // Tipo da categoria (ex: 'receita', 'despesa')
  quantia?: number;  // Quantia associada à categoria
  icone?: string;  // Ícone da categoria (opcional)
}
