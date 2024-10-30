import { Component, OnInit } from '@angular/core';
import { FinanceService } from '../services/finance.service';
import { DocumentChange } from '@angular/fire/firestore';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {
  categorias: any[] = [];
  saldos: { total: number, receitas: number, despesas: number } = { total: 0, receitas: 0, despesas: 0 };

  constructor(private financeService: FinanceService) {}

  ngOnInit() {
    this.loadCategorias();
  }

  loadCategorias() {
    this.financeService.getCategorias().subscribe((data: DocumentChange<any>[]) => {
      this.categorias = data.map((e: DocumentChange<any>) => {
        return {
          id: e.doc.id,
          ...e.doc.data(),
          subcolecao: []
        };
      });

      // Carregar as subcoleções para cada categoria
      this.categorias.forEach(categoria => {
        this.financeService.getSubcategorias(categoria.id).subscribe((subData: DocumentChange<any>[]) => {
          categoria.subcolecao = subData.map((sub: DocumentChange<any>) => ({
            id: sub.doc.id,
            ...sub.doc.data()
          }));
        });
      });
    });

    this.calculateSaldos();
  }

  calculateSaldos() {
    let totalReceitas = 0;
    let totalDespesas = 0;

    // Calcular os saldos com base nas categorias
    this.financeService.getCategorias().subscribe((categorias: DocumentChange<any>[]) => {
      categorias.forEach((cat: DocumentChange<any>) => {
        const data = cat.doc.data();
        if (data.tipo === 'receita') {
          totalReceitas += data.quantia || 0;
        } else if (data.tipo === 'despesa') {
          totalDespesas += data.quantia || 0;
        }
      });

      this.saldos = {
        total: totalReceitas - totalDespesas,
        receitas: totalReceitas,
        despesas: totalDespesas
      };
    });
  }

  selecionarSubcategoria(categoriaId: string, subcategoriaId: string) {
    // Lógica para redirecionar para a página de transações da subcategoria
  }
}
