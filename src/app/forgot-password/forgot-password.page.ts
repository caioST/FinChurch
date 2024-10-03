import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-forgot-password',  
  templateUrl: './forgot-password.page.html',  
  styleUrls: ['./forgot-password.page.scss'],  
})
export class ForgotPasswordPage {
  email: string = '';  // Armazenamento do e-mail do usuário aaaaa


  constructor(
    private navCtrl: NavController,               
    private toastCtrl: ToastController,           
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) { }

  // Método assíncrono para envio do e-mail de redefinição de senha
  async sendResetEmail() {
    try {
      // Envio do e-mail de recuperação de senha usando o Firebase
      await this.afAuth.sendPasswordResetEmail(this.email);
  
      // Atualizar a impressão digital no Firestore após a redefinição de senha
      const currentUser = await this.afAuth.currentUser;
      if (currentUser) {
        await this.firestore.collection('users').doc(currentUser.uid).update({
          fingerprintRegistered: true
        });
      }
  
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
