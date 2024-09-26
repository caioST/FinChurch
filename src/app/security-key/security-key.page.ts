import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-security-key',
  templateUrl: './security-key.page.html',
  styleUrls: ['./security-key.page.scss'],
})
export class SecurityKeyPage {
  
  // Array para armazenar os 6 dígitos da chave de segurança
  securityKey: string[] = ['', '', '', '', '', ''];

  constructor(private navCtrl: NavController, private toastCtrl: ToastController) { }

  // Verifica se a chave de segurança está correta
  verifySecurityKey() {
    const fullKey = this.securityKey.join('');
    
    if (fullKey === '273916') {
      this.showToast('Chave de segurança válida');
      // Implementar navegação ou lógica de sucesso
    } else {
      this.showToast('Chave de segurança inválida');
    }
  }

  // Função para reenviar o código
  resendCode() {
    this.showToast('Código reenviado com sucesso!');
    // Implementar a lógica para reenviar o código
  }

  // Função auxiliar para exibir mensagens Toast
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: 'warning'
    });
    toast.present();
  }

  // Navega para a página de criar conta
  createAccount() {
    this.navCtrl.navigateForward('/register', {
      animated: true,
      animationDirection: 'forward'
    });
  }
}
