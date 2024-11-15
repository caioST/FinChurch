import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { switchMap, combineLatest } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  constructor(private firestore: AngularFirestore) { }

  // Método para obter Receitas
  getReceitas(): Observable<any[]> {
    return this.firestore.collection('receitas').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  // Método para obter Despesas
  getDespesas(): Observable<any[]> {
    return this.firestore.collection('despesas').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  // Método para obter Departamentos
  getDepartamentos(): Observable<any[]> {
    return this.firestore.collection('departamentos').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id; // Corrigido aqui
        return { id, ...data };
      }))
    );
  }

  // Método para obter Campanhas
  getCampanhas(): Observable<any[]> {
    return this.firestore.collection('campanhas').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id; // Corrigido aqui
        return { id, ...data };
      }))
    );
  }

  getAllSubcategorias(): Observable<any[]> {
    const categorias = ['despesas', 'receitas', 'departamentos', 'campanhas'];

    // Cria uma lista de observáveis para cada coleção principal
    const observables = categorias.map(categoria =>
      this.firestore.collection(categoria).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const docId = a.payload.doc.id; // ID do documento principal
          return this.firestore.collection('${categoria}/${docId}/subcolecao').snapshotChanges().pipe(
            map(subActions => subActions.map(sub => {
              const data = sub.payload.doc.data() as any;
              const subId = sub.payload.doc.id;
              return { id: subId, ...data, categoria };
            }))
          );
        })),
        // Concatena todos os observáveis de subcoleções
        switchMap(subObsArray => combineLatest(subObsArray))
      )
    );

    // Concatena os resultados de todas as categorias
    return combineLatest(observables).pipe(
      map((results: any[][]) => results.reduce((acc, val) => acc.concat(val), [])) 
    );
  }


}