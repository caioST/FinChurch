import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubcategoriaService {
  constructor(private firestore: AngularFirestore) {}


  getSubcategoriaDados(
    categoriaId: string,
    subcategoriaId: string
  ): Observable<any> {
    return this.firestore
    .collection('receitas')
    .doc(categoriaId)
    .collection('subcolecao')
    .doc(subcategoriaId)
    .valueChanges();
  }


  adicionarEntrada(
    categoriaId: string,
    subcategoriaId: string
  ): Observable<any> {
    return this.firestore
    .collection('receitas')
    .doc(categoriaId)
    .collection('subcolecao')
    .doc(subcategoriaId)
    .collection('entradas')
    .valueChanges();
  }

}