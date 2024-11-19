// src/app/services/finance.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, of } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  constructor(private firestore: AngularFirestore) { }

  getAllSubcategorias(): Observable<any[]> {
    const colecoes = ['receitas', 'despesas', 'campanhas', 'departamentos'];

    return from(colecoes).pipe(
      mergeMap((colecao) =>
        this.firestore.collection(colecao).get().pipe(
          mergeMap((snapshot) =>
            from(snapshot.docs).pipe(
              mergeMap((doc) => {
                const categoriaId = doc.id;
                const subcategoriasRef = doc.ref.collection('subcolecao');

                return from(subcategoriasRef.get()).pipe(
                  map((subSnapshot) =>
                    subSnapshot.docs.map((subDoc) => ({
                      id: subDoc.id,
                      ...subDoc.data() as Record<string, any>, // Garantimos que o retorno é um objeto
                      categoriaId,
                      colecao,
                    }))
                  )
                );
              }),
              toArray(),
              map((subcategoriasPorCategoria) => subcategoriasPorCategoria.flat())
            )
          )
        )
      ),
      toArray(),
      map((subcategoriasPorColecao) => subcategoriasPorColecao.flat())
    );
  }
}
