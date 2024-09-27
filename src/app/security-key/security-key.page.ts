import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-security-key',
  templateUrl: './security-key.page.html',
  styleUrls: ['./security-key.page.scss'],
})
export class SecurityKeyPage {
  // Array para armazenar os 6 dígitos da chave de segurança
  securityKey: string[] = ['', '', '', '', '', ''];

  constructor(private navCtrl: NavController, private toastCtrl: ToastController, private afAuth: AngularFireAuth) { }

  async verifySecurityKey() {
    const fullKey = this.securityKey.join('');

    try {
      // Aqui você deve validar a chave de segurança com seu back-end ou utilizar autenticação do Firebase
      if (fullKey === '273916') {
        this.showToast('Chave de segurança válida');
        this.navCtrl.navigateForward('/new-password', {
          animated: true,
          animationDirection: 'forward'
        });
      } else {
        this.showToast('Chave de segurança inválida');
      }
    } catch (error) {
      this.showToast('Erro na validação da chave de segurança.');
    }
  }

  async resendCode() {
    this.showToast('Código reenviado com sucesso!');
    // Implementar a lógica para reenviar o código
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: 'warning'
    });
    toast.present();
  }

  createAccount() {
    this.navCtrl.navigateForward('/register', {
      animated: true,
      animationDirection: 'forward'
    });
  }
}
