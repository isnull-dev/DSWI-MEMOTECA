import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReceitaService } from '../../receita.service';
import { Receita } from '../../receita'; // A interface Receita

@Component({
  selector: 'app-receita-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './receita-form.component.html',
  styleUrls: ['./receita-form.component.css']
})
export class ReceitaFormComponent implements OnInit {
  receitaForm: FormGroup;
  receitaId: number | null = null;
  isEditMode = false;
  mensagemSucesso: string | null = null;
  mensagemErro: string | null = null;
  selectedFile: File | null = null; // Para armazenar o arquivo selecionado
  currentImagePath: string | null = null; // Para mostrar a imagem atual na edição

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private receitaService = inject(ReceitaService);

  // URL base para exibir a imagem atual na edição
  readonly imageBaseUrl = 'http://localhost/memoteca_api/uploads/';

  constructor() {
    this.receitaForm = this.fb.group({
      titulo: ['', Validators.required],
      ingredientes: ['', Validators.required],
      modo_preparo: ['', Validators.required],
      historia: [''],
      autor: [''],
      data_criacao: [this.getTodayDate()],
      
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.receitaId = +id;
        this.carregarReceitaParaEdicao(this.receitaId);
      }
    });
  }

  private getTodayDate(): string {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${today.getFullYear()}-${month}-${day}`;
  }

  carregarReceitaParaEdicao(id: number): void {
    this.receitaService.getReceita(id).subscribe({
      next: (receita) => {
        if (receita.data_criacao) {
          const isoDate = new Date(receita.data_criacao).toISOString().split('T')[0];
          receita.data_criacao = !isNaN(new Date(receita.data_criacao).getTime()) ? isoDate : this.getTodayDate();
        } else {
          receita.data_criacao = this.getTodayDate();
        }
        
        this.receitaForm.patchValue({
            titulo: receita.titulo,
            ingredientes: receita.ingredientes,
            modo_preparo: receita.modo_preparo,
            historia: receita.historia,
            autor: receita.autor,
            data_criacao: receita.data_criacao
        });
        if (receita.imagem_path) {
          this.currentImagePath = receita.imagem_path;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar receita:', err);
        this.mensagemErro = 'Erro ao carregar a receita para edição.';
      }
    });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
      this.currentImagePath = null; // Remove a imagem atual se uma nova for selecionada
      this.mensagemSucesso = null; // Limpa mensagens anteriores
      this.mensagemErro = null;
    } else {
      this.selectedFile = null;
    }
  }

  onSubmit(): void {
    this.mensagemSucesso = null;
    this.mensagemErro = null;

    if (this.receitaForm.invalid) {
      this.mensagemErro = 'Por favor, preencha todos os campos obrigatórios.';
      Object.values(this.receitaForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    const formData = new FormData();
    // Adiciona os campos do formulário ao FormData
    Object.keys(this.receitaForm.value).forEach(key => {
      formData.append(key, this.receitaForm.value[key]);
    });

    // Adiciona o arquivo de imagem, se selecionado
    if (this.selectedFile) {
      formData.append('imagem', this.selectedFile, this.selectedFile.name);
    } else if (this.isEditMode && this.currentImagePath) {
      
    }


    if (this.isEditMode && this.receitaId) {
      formData.append('id', this.receitaId.toString()); // Adiciona ID para atualização
      this.receitaService.atualizarReceita(formData).subscribe({
        next: (res) => {
          this.mensagemSucesso = res.message || 'Receita atualizada com sucesso!';

          setTimeout(() => this.router.navigate(['/receitas', this.receitaId]), 2000);
        },
        error: (err) => {
          console.error('Erro ao atualizar receita:', err);
          this.mensagemErro = err.error?.message || 'Erro ao atualizar receita.';
        }
      });
    } else { // Modo de Criação
      this.receitaService.criarReceita(formData).subscribe({
        next: (res) => {
          this.mensagemSucesso = res.message || 'Receita criada com sucesso!';
          this.selectedFile = null;
          this.receitaForm.reset({ data_criacao: this.getTodayDate() });
           // Limpa o input de arquivo visualmente
          const inputFile = document.getElementById('imagemFile') as HTMLInputElement;
          if (inputFile) {
            inputFile.value = "";
          }
          setTimeout(() => {
            if (res.id) {
                this.router.navigate(['/receitas', res.id]);
            } else {
                this.router.navigate(['/receitas']);
            }
          }, 2000);
        },
        error: (err) => {
          console.error('Erro ao criar receita:', err);
          this.mensagemErro = err.error?.message || 'Erro ao criar receita.';
        }
      });
    }
  }
}