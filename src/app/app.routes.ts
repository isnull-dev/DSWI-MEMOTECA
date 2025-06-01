import { Routes } from '@angular/router';
import { ReceitaListaComponent } from './receitas/receita-lista/receita-lista.component';
import { ReceitaFormComponent } from './receitas/receita-form/receita-form.component';
import { ReceitaDetalheComponent } from './receitas/receita-detalhe/receita-detalhe.component';

export const routes: Routes = [
  { path: '', redirectTo: '/receitas', pathMatch: 'full' }, // Rota padrão
  {
    path: 'receitas',
    component: ReceitaListaComponent,
    title: 'Memoteca - Lista de Receitas' // Título da página
  },
  {
    path: 'receitas/nova',
    component: ReceitaFormComponent,
    title: 'Memoteca - Nova Receita'
  },
  {
    path: 'receitas/editar/:id', // Rota para editar com ID
    component: ReceitaFormComponent,
    title: 'Memoteca - Editar Receita'
  },
  {
    path: 'receitas/:id', // Rota para detalhes com ID
    component: ReceitaDetalheComponent,
    title: 'Memoteca - Detalhes da Receita'
  },

];