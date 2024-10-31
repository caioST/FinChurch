import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, combineLatest, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface Categoria {
  id: string;
  nome: string; // Campos que você espera ter na categoria
  tipo: string; // 'receita' ou 'despesa'
  quantia: number; // Valor da categoria
  subcategorias?: Subcategoria[];
}

interface Subcategoria {
  id: string;
  nome: string; // Campos que você espera ter na subcategoria
}

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  constructor(private firestore: AngularFirestore) {}

  getCategorias(): Observable<Categoria[]> {
    return this.firestore.collection('categorias').snapshotChanges().pipe(
      map(categoriasSnapshot => {
        return categoriasSnapshot.map(e => {
          const data = e.payload.doc.data() as Omit<Categoria, 'id'>; // Exclui 'id' dos dados
          return {
            id: e.payload.doc.id, // Atribui o ID uma única vez
            ...data // Espalha os dados restantes
          };
        });
      }),
      catchError(err => {
        console.error("Erro ao obter categorias:", err);
        return of([]); // Retorna um array vazio em caso de erro
      })
    );
  }

  getSubcolecao(categoriaId: string): Observable<Subcategoria[]> {
    return this.firestore.collection(`categorias/${categoriaId}/subcolecao`).snapshotChanges().pipe(
      map(subSnapshot => {
        return subSnapshot.map(sub => {
          const data = sub.payload.doc.data() as Omit<Subcategoria, 'id'>; // Exclui 'id' dos dados
          return {
            id: sub.payload.doc.id, // Atribui o ID uma única vez
            ...data // Espalha os dados restantes
          };
        });
      }),
      catchError(err => {
        console.error(`Erro ao obter subcoleção para a categoria ${categoriaId}:`, err);
        return of([]); // Retorna um array vazio em caso de erro
      })
    );
  }
}
