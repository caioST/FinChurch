import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {
  email: string = '';

  constructor(private navCtrl: NavController, private toastCtrl: ToastController) { }

  async sendResetEmail() {
    if (!this.validateEmail(this.email)) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor, insira um e-mail válido.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    // Lógica para enviar o e-mail de recuperação
    const toast = await this.toastCtrl.create({
      message: 'E-mail de recuperação enviado com sucesso!',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

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
    });
  }

  validateEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
}
