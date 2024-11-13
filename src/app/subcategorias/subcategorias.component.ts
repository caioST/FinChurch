import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FinanceService } from '../services/finance.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subcategorias',
  templateUrl: './subcategorias.component.html',
  styleUrls: ['./subcategorias.component.scss']
})
export class SubcategoriasComponent implements OnInit {
  subcategorias: any[] = [];
  categoriaId: string = '';
  saldos: { total: number; receitas: number; despesas: number } = { total: 0, receitas: 0, despesas: 0 };

  constructor(
    private route: ActivatedRoute,
    private financeService: FinanceService,
    private router: Router
  ) { }

  ngOnInit() {
    // Obtém o ID da categoria da rota
    this.categoriaId = this.route.snapshot.paramMap.get('categoriaId') || '';
    this.loadSubcategorias();
  }

  loadSubcategorias() {
    this.financeService.getSubcategorias(this.categoriaId).subscribe((subcategorias) => {
      this.subcategorias = subcategorias;
      this.calculateSaldos(); // Calcula os saldos após carregar as subcategorias
    });
  }

  calculateSaldos() {
    const totalReceitas = this.subcategorias.reduce((total, subcategoria) => total + (subcategoria.receitas || 0), 0);
    const totalDespesas = this.subcategorias.reduce((total, subcategoria) => total + (subcategoria.despesas || 0), 0);

    this.saldos = {
      total: totalReceitas - totalDespesas,
      receitas: totalReceitas,
      despesas: totalDespesas,
    };
  }

  selecionarSubcategoria(subcategoriaId: string) {
    console.log("Subcategoria selecionada:", subcategoriaId);
    this.router.navigate(['/transacoes', subcategoriaId]); // Navega para a página de transações (ajuste conforme a sua rota)
  }

  voltar() {
    this.router.navigate(['/categorias']); // Redireciona de volta para a página de categorias
  }
}
