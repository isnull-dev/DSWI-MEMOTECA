import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para diretivas como *ngIf
import { RouterLink } from '@angular/router';
import { Receita } from '../../receita'; // Importe a interface

@Component({
  selector: 'app-receita-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './receita-card.component.html',
  styleUrls: ['./receita-card.component.css']
})
export class ReceitaCardComponent {
  @Input() receita!: Receita; // Recebe a receita como entrada
  @Output() excluir = new EventEmitter<number>(); // Emite o ID para exclusão

  readonly imageBaseUrl = 'http://localhost/memoteca_api/uploads/'; // ESSENCIAL!

  confirmarExclusao(id?: number): void {
    if (id && confirm(`Tem certeza que deseja excluir a receita "${this.receita.titulo}"?`)) {
      this.excluir.emit(id);
    }
  }
}