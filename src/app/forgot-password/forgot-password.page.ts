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
  email: string = '';  // Armazenamento do e-mail do usuário


  constructor(
    private navCtrl: NavController,               
    private toastCtrl: ToastController,           
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore               
  ) { }

  // Método assíncrono para envio do e-mail de redefinição de senha
    async sendResetEmail() {
      try {
        await this.afAuth.sendPasswordResetEmail(this.email);
    
        // Marcar no Firestore que a impressão digital precisa ser revalidada
        const currentUser = await this.afAuth.currentUser;
        if (currentUser) {
          await this.firestore.collection('users').doc(currentUser.uid).update({
            fingerprintNeedsRevalidation: true
          });
        }
    
        const toast = await this.toastCtrl.create({
          message: 'E-mail de recuperação enviado com sucesso!',
          duration: 2000,
          color: 'success'
        });
        toast.present();
      } catch (error) {
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
