import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngIf, pipe date, etc.
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Receita } from '../../receita';
import { ReceitaService } from '../../receita.service';

@Component({
  selector: 'app-receita-detalhe',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './receita-detalhe.component.html',
  styleUrls: ['./receita-detalhe.component.css']
})
export class ReceitaDetalheComponent implements OnInit {
  receita: Receita | undefined;
  mensagemErro: string | null = null;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private receitaService = inject(ReceitaService);

  readonly imageBaseUrl = 'http://localhost/memoteca_api/uploads/';


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarReceita(+id);
    } else {
      this.mensagemErro = 'ID da receita não fornecido.';
    }
  }

  carregarReceita(id: number): void {
    this.receitaService.getReceita(id).subscribe({
      next: (data) => {
        this.receita = data;
      },
      error: (err) => {
        console.error('Erro ao buscar detalhes da receita:', err);
        this.mensagemErro = err.error?.message || 'Receita não encontrada ou erro ao carregar.';
        if(err.status === 404) {
            this.mensagemErro = 'Receita não encontrada.';
        }
      }
    });
  }

  excluirReceita(id?: number): void {
    if (id && confirm(`Tem certeza que deseja excluir a receita "${this.receita?.titulo}"?`)) {
      this.receitaService.excluirReceita(id).subscribe({
        next: () => {
          alert('Receita excluída com sucesso!');
          this.router.navigate(['/receitas']);
        },
        error: (err) => {
          console.error('Erro ao excluir receita:', err);
          alert(err.error?.message || 'Erro ao excluir a receita.');
        }
      });
    }
  }
}