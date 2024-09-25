import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {
  email: string = '';

  constructor(private navCtrl: NavController) { }

  goToLogin() {
    this.navCtrl.navigateForward('login', {
      animated: true,
      animationDirection: 'forward'
    });
  }

  createAccount() {
    this.navCtrl.navigateForward('/register', {
      animated: true,
      animationDirection: 'forward'
    })
  }

  sendResetEmail() {
    if (this.email) {
      // Adicione lógica para enviar o e-mail de redefinição de senha
      console.log('E-mail de redefinição enviado para:', this.email);
    } else {
      console.log('Por favor, insira um e-mail válido.');
    }
  }
}
