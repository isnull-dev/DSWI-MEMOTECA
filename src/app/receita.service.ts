import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Receita } from './receita';

@Injectable({
  providedIn: 'root'
})
export class ReceitaService {
  private apiUrl = 'http://localhost/memoteca_api';

  constructor(private http: HttpClient) { }

  getReceitas(): Observable<Receita[]> {
    return this.http.get<Receita[]>(`${this.apiUrl}/listar_receitas.php`);
  }

  getReceita(id: number): Observable<Receita> {
    return this.http.get<Receita>(`${this.apiUrl}/obter_receita.php?id=${id}`);
  }


  criarReceita(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/criar_receita.php`, formData);
  }

  
  atualizarReceita(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/atualizar_receita.php`, formData);
  }

  excluirReceita(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/excluir_receita.php?id=${id}`);
  }
}