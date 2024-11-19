import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FinanceService } from '../services/finance.service';

@Component({
  selector: 'app-subcategorias',
  templateUrl: './subcategorias.component.html',
  styleUrls: ['./subcategorias.component.scss'],
})
export class SubcategoriasComponent implements OnInit {
  subcategorias: any[] = [];
  saldos: { total: number; receitas: number; despesas: number } = { total: 0, receitas: 0, despesas: 0 };

  constructor(private financeService: FinanceService, private router: Router) {}

  ngOnInit() {
    this.loadAllSubcategorias();
  }

  loadAllSubcategorias() {
    this.financeService.getAllSubcategorias().subscribe({
      next: (subcategorias) => {
        this.subcategorias = subcategorias;
        this.calculateSaldos();
      },
      error: (error) => {
        console.error('Erro ao carregar subcategorias:', error);
      },
    });
  }

  calculateSaldos() {
    const totalReceitas = this.subcategorias.reduce((total, sub) => total + (sub.quantia || 0), 0);
    const totalDespesas = this.subcategorias.reduce((total, sub) => total + (sub.quantia || 0), 0);

    this.saldos = { total: totalReceitas - totalDespesas, receitas: totalReceitas, despesas: totalDespesas };
  }

  selecionarSubcategoria(subcategoriaId: string) {
    this.router.navigate(['/transacoes', subcategoriaId]);
  }

  voltar() {
    this.router.navigate(['/categorias']); // Redireciona de volta para a página de categorias
  }
  
}


  
  


