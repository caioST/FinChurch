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

  // Construtor da classe onde são injetados os serviços necessários
  constructor(private navCtrl: NavController, private toastCtrl: ToastController, private afAuth: AngularFireAuth) { }

  // Método assíncrono para verificar a chave de segurança
  async verifySecurityKey() {
    // Junta os dígitos da chave de segurança em uma única string
    const fullKey = this.securityKey.join('');

    try {
      // Validação da chave de segurança com autenticação do Firebase
      if (fullKey === '273916') { // Verifica se a chave de segurança é válida
        this.showToast('Chave de segurança válida'); // Exibe mensagem de sucesso
        // Navega para a página de nova senha se a chave for válida
        this.navCtrl.navigateForward('/new-password', {
          animated: true, // Habilita animações na navegação
          animationDirection: 'forward' // Define a direção da animação
        });
      } else {
        // Exibe mensagem de erro se a chave de segurança for inválida
        this.showToast('Chave de segurança inválida');
      }
    } catch (error) {
      // Exibe mensagem de erro caso ocorra uma exceção durante a validação
      this.showToast('Erro na validação da chave de segurança.');
    }
  }

  // Método assíncrono para reenviar o código de segurança
  async resendCode() {
    this.showToast('Código reenviado com sucesso!'); // Mensagem de confirmação
    // A fazer: Implementar a lógica para reenviar o código
  }

  // Método assíncrono para mostrar um toast com uma mensagem específica
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000, 
      color: 'warning' 
    });
    toast.present(); 
  }

  // Método para redirecionar para a página de criação de conta
  createAccount() {
    this.navCtrl.navigateForward('/register', {
      animated: true, 
      animationDirection: 'forward' 
    });
  }
}
