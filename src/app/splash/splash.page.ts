import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
    setTimeout(() => {
      // Redirecionar para a página de Access após 4 segundos
      this.navCtrl.navigateRoot('/access', {
        animated: true,
        animationDirection: 'forward'
      });
    }, 4000); // Tempo de espera em milissegundos (4 segundos)
  }
}