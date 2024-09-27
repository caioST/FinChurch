import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-forgot-password',  
  templateUrl: './forgot-password.page.html',  
  styleUrls: ['./forgot-password.page.scss'],  
})
export class ForgotPasswordPage {
  email: string = '';  // Armazenamento do e-mail do usuário


  constructor(
    private navCtrl: NavController,               
    private toastCtrl: ToastController,           
    private afAuth: AngularFireAuth               
  ) { }

  // Método assíncrono para envio do e-mail de redefinição de senha
  async sendResetEmail() {
    try {
      // Envio do e-mail de recuperação de senha usando o Firebase
      await this.afAuth.sendPasswordResetEmail(this.email);

      // Mensagem de sucesso usando o ToastController
      const toast = await this.toastCtrl.create({
        message: 'E-mail de recuperação enviado com sucesso!',
        duration: 2000,  
        color: 'success'
      });
      toast.present();  
    } catch (error) {
      // Em caso de erro, exibe uma mensagem de erro ao usuário
      const toast = await this.toastCtrl.create({
        message: 'Erro ao enviar e-mail de recuperação.', 
        duration: 2000,  
        color: 'danger'  
      });
      toast.present();
    }
  }

  // Navegar até a página de login
  goToLogin() {

    this.navCtrl.navigateForward('login', {
      animated: true,  
      animationDirection: 'forward'  
    });
  }

  // Navegar até a página de registro (criar conta)
  createAccount() {
    
    this.navCtrl.navigateForward('/register', {
      animated: true,  
      animationDirection: 'forward' 
    });
  }
}
