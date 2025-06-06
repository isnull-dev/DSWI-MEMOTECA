export interface Receita {
  
  titulo: string;
  ingredientes: string;
  modo_preparo: string;
  historia?: string; 
  autor?: string;   
  data_criacao?: string; // Formato YYYY-MM-DD
  imagem_path?: string; // Caminho/nome da imagem
}