import { Component, OnInit } from '@angular/core';
import { FinanceService } from '../services/finance.service';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';

interface Categoria {
  id: string;
  nome: string;
  tipo: string; // 'receita' ou 'despesa'
  quantia: number; // Valor da categoria
  icone?: string; // O campo ícone pode ser opcional
}

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {
  receitas: Categoria[] = [];
  despesas: Categoria[] = [];
  departamentos: Categoria[] = [];
  campanhas: Categoria[] = [];
  saldos: { total: number; receitas: number; despesas: number; departamentos: number; campanhas: number } = { total: 0, receitas: 0, despesas: 0, departamentos: 0, campanhas: 0 };

  constructor(private financeService: FinanceService, private router: Router) {}

  ngOnInit() {
    this.loadCategorias();
  }

  loadCategorias() {
    combineLatest([
      this.financeService.getReceitas(),
      this.financeService.getDespesas(),
      this.financeService.getDepartamentos(),
      this.financeService.getCampanhas(),
    ]).subscribe(([receitas, despesas, departamentos, campanhas]) => {
      this.receitas = receitas;
      this.despesas = despesas;
      this.departamentos = departamentos;
      this.campanhas = campanhas;
      this.calculateSaldos(); // Calcula saldos após carregar todas as categorias
    });
  }

  calculateSaldos() {
    const totalReceitas = this.receitas.reduce((total, categoria) => total + (categoria.quantia || 0), 0);
    const totalDespesas = this.despesas.reduce((total, categoria) => total + (categoria.quantia || 0), 0);
    const totalDepartamentos = this.departamentos.reduce((total, categoria) => total + (categoria.quantia || 0), 0);
    const totalCampanhas = this.campanhas.reduce((total, categoria) => total + (categoria.quantia || 0), 0);

    this.saldos = {
      total: totalReceitas - totalDespesas,
      receitas: totalReceitas,
      despesas: totalDespesas,
      departamentos: totalDepartamentos,
      campanhas: totalCampanhas,
    };
  }

  selecionarCategoria(categoriaId: string) {
    console.log("Categoria selecionada:", categoriaId);
    this.router.navigate(['/subcategorias', categoriaId]); // Se você tiver essa rota
  }

  voltar() {
    this.router.navigate(['']); // Redireciona para a página anterior
  }

  abrirNotificacoes() {
    this.router.navigate(['/notificacoes']); // Redireciona para a página de notificações
  }
}
