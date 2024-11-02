import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  constructor(private firestore: AngularFirestore) {}

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
}
