import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


interface Transacao {
  data: string;
  quantia: number;
  titulo: string;
  mensagem: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private categoriasPath = 'categorias';

  constructor(private firestore: AngularFirestore) { }

  getCategorias (): Observable<any> {
    return this.firestore.collection(this.categoriasPath).snapshotChanges();
  }

  getCategoria(categoria:
    string,
    subcategoria: string,
    transacao: Transacao): Promise<void> {
      const id = this.firestore.createId();
      return this.firestore.doc(`${this.categoriasPath}/${categoria}/${subcategoria}/${id}`).set(transacao);
    }
}
