import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FinanceService } from '../services/finance.service';

@Component({
  selector: 'app-resumo-subcategoria',
  templateUrl: './resumo-subcategoria.component.html',
  styleUrls: ['./resumo-subcategoria.component.scss'],
})
export class ResumoSubcategoriaComponent implements OnInit {
  colecao: string = '';
  categoriaId: string = '';
  subcategoriaId: string = '';
  historico: any[] = [];
  saldos: { entradas: number; saidas: number } = { entradas: 0, saidas: 0 };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private financeService: FinanceService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.colecao = params['colecao'];
      this.categoriaId = params['categoriaId'];
      this.subcategoriaId = params['subcategoriaId'];
      this.carregarResumo();
    });
  }

  carregarResumo(): void {
    this.financeService.getSubcategoriaTransacoes(this.colecao, this.subcategoriaId).subscribe({
      next: (transacoes) => {
        this.historico = transacoes;
        this.calcularSaldos();
      },
      error: (error) => console.error('Erro ao carregar transações:', error),
    });
  }

  calcularSaldos(): void {
    const entradas = this.historico
      .filter((transacao) => transacao.tipo === 'entrada')
      .reduce((total, transacao) => total + transacao.quantia, 0);

    const saidas = this.historico
      .filter((transacao) => transacao.tipo === 'saida')
      .reduce((total, transacao) => total + transacao.quantia, 0);

    this.saldos = { entradas, saidas };
  }

  adicionarValor(): void {
    this.router.navigate([
      `/subcategoria/${this.colecao}/${this.categoriaId}/${this.subcategoriaId}/adicionar`,
    ]);
  }
}

