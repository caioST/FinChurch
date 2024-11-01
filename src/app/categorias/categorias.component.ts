import { Component, OnInit } from '@angular/core';
import { FinanceService } from '../services/finance.service';
import { Router } from '@angular/router'; // Importando Router para navegação
import { Observable } from 'rxjs';

interface Categoria {
  id: string;
  nome: string; // Campos que você espera ter na categoria
  tipo: string; // 'receita' ou 'despesa'
  quantia: number; // Valor da categoria
  subcolecao?: any[]; // Para armazenar subcategorias
  icone?: string; // Novo campo opcional para o ícone
}

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  saldos: { total: number, receitas: number, despesas: number } = { total: 0, receitas: 0, despesas: 0 };

  constructor(private financeService: FinanceService, private router: Router) {} // Injeta o Router

  ngOnInit() {
    this.loadCategorias(); // Carrega as categorias ao inicializar o componente.
  }

  loadCategorias() {
    this.financeService.getCategorias().subscribe((data: Categoria[]) => {
      this.categorias = data; // Assume que `data` já está no formato correto.


      console.log('Categorias carregadas:', this.categorias);

      // Para cada categoria, carrega suas subcategorias.
      this.categorias.forEach(categoria => {
        if (categoria && categoria.id) {
          this.financeService.getSubcolecao(categoria.id).subscribe((subData: any[]) => {
            categoria.subcolecao = subData; // Armazena as subcategorias diretamente.
            this.calculateSaldos(); // Calcula saldos após carregar as subcategorias.
          });
        }
      });
    });
  }

  calculateSaldos() {
    let totalReceitas = 0;
    let totalDespesas = 0;

    this.categorias.forEach(categoria => {
      if (categoria.tipo === 'receita') {
        totalReceitas += categoria.quantia || 0;
      } else if (categoria.tipo === 'despesa') {
        totalDespesas += categoria.quantia || 0;
      }
    });

    this.saldos = {
      total: totalReceitas - totalDespesas,
      receitas: totalReceitas,
      despesas: totalDespesas
    };
  }

  // Método para selecionar uma categoria e navegar para as subcategorias
  selecionarCategoria(categoriaId: string) {
    console.log("Categoria selecionada:", categoriaId);
    this.router.navigate(['/subcategorias', categoriaId]); // Altere a rota conforme sua configuração
  }

  selecionarSubcategoria(categoriaId: string, subcategoriaId: string) {
    // Lógica para navegação (não implementada).
  }
}
