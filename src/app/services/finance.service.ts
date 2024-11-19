// src/app/services/finance.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  constructor(private firestore: AngularFirestore) {}

  /**
   * Obtém todas as subcategorias de várias coleções
   */
  getAllSubcategorias(): Observable<any[]> {
    const colecoes = ['receitas', 'despesas', 'campanhas', 'departamentos'];

    // Para cada coleção, carrega subcategorias de todos os documentos
    const observables = colecoes.map((colecao) =>
      this.firestore
        .collection(colecao)
        .get()
        .pipe(
          switchMap((snapshot) =>
            forkJoin(
              snapshot.docs.map((doc) =>
                this.firestore
                  .collection(colecao)
                  .doc(doc.id)
                  .collection('subcolecao')
                  .get()
                  .pipe(
                    map((subSnapshot) =>
                      subSnapshot.docs.map((subDoc) => ({
                        id: subDoc.id,
                        ...subDoc.data(),
                        categoriaId: doc.id,
                        colecao,
                      }))
                    ),
                    catchError((error) => {
                      console.error(`Erro ao carregar subcoleção de ${colecao}/${doc.id}:`, error);
                      return of([]);
                    })
                  )
              )
            )
          ),
          map((subcategoriasPorCategoria) => subcategoriasPorCategoria.flat()),
          catchError((error) => {
            console.error(`Erro ao carregar dados da coleção ${colecao}:`, error);
            return of([]);
          })
        )
    );

    return forkJoin(observables).pipe(
      map((subcategoriasPorColecao) => subcategoriasPorColecao.flat())
    );
  }
}
