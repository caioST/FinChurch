import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {
  email: string = '';

  constructor(private navCtrl: NavController, private toastCtrl: ToastController, private afAuth: AngularFireAuth) { }

  async sendResetEmail() {
    try {
      await this.afAuth.sendPasswordResetEmail(this.email);
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
}
