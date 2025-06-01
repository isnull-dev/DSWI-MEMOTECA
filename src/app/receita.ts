export interface Receita {
  id?: number; // Opcional, pois será gerado pelo banco ao criar
  titulo: string;
  ingredientes: string;
  modo_preparo: string;
  historia?: string; // Opcional
  autor?: string;    // Opcional
  data_criacao?: string; // Formato YYYY-MM-DD
  imagem_path?: string; // Caminho/nome da imagem
}