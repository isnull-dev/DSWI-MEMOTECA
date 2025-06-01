import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Receita } from '../../receita';
import { ReceitaService } from '../../receita.service';
import { ReceitaCardComponent } from '../receita-card/receita-card.component'; // Importe o card

@Component({
  selector: 'app-receita-lista',
  standalone: true,
  imports: [CommonModule, RouterLink, ReceitaCardComponent], // Adicione o Card
  templateUrl: './receita-lista.component.html',
  styleUrls: ['./receita-lista.component.css']
})
export class ReceitaListaComponent implements OnInit {
  receitas: Receita[] = [];
  mensagem: string | null = null;

  private receitaService = inject(ReceitaService);

  ngOnInit(): void {
    this.carregarReceitas();
  }

  carregarReceitas(): void {
    this.receitaService.getReceitas().subscribe({
      next: (data) => {
        this.receitas = data;
        if (data.length === 0) {
          this.mensagem = "Nenhuma receita cadastrada ainda. Que tal adicionar a primeira?";
        } else {
          this.mensagem = null;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar receitas:', err);
        this.mensagem = 'Erro ao carregar as receitas. Verifique a conexão com o backend ou tente novamente mais tarde.';
      }
    });
  }

  excluirReceita(id: number): void {
    this.receitaService.excluirReceita(id).subscribe({
      next: (res) => {
        this.mensagem = res.message || 'Receita excluída com sucesso!';
        this.carregarReceitas(); // Recarrega a lista
        setTimeout(() => this.mensagem = null, 3000);
      },
      error: (err) => {
        console.error('Erro ao excluir receita:', err);
        this.mensagem = err.error?.message || 'Erro ao excluir a receita.';
        setTimeout(() => this.mensagem = null, 3000);
      }
    });
  }
}