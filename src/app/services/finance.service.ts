import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  constructor(private firestore: AngularFirestore) {}

  getCategorias(): Observable<any> {
    return this.firestore.collection('categorias').snapshotChanges();
  }

  getSubcategorias(categoriaId: string): Observable<any> {
    return this.firestore.collection(`categorias/${categoriaId}/subcolecao`).snapshotChanges();
  }

  getTransacoes(categoriaId: string, subcategoriaId: string): Observable<any> {
    return this.firestore.collection(`categorias/${categoriaId}/subcolecao/${subcategoriaId}/transacoes`).snapshotChanges();
  }

  addTransacao(categoriaId: string, subcategoriaId: string, transacao: any): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore
      .doc(`categorias/${categoriaId}/subcolecao/${subcategoriaId}/transacoes/${id}`)
      .set(transacao);
  }
}
