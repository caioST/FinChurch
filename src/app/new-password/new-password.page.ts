import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage {
  resetCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private afAuth: AngularFireAuth
  ) {}

  async resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      const toast = await this.toastCtrl.create({
        message: 'As senhas não coincidem.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    try {
      await this.afAuth.confirmPasswordReset(this.resetCode, this.newPassword);
      const toast = await this.toastCtrl.create({
        message: 'Senha redefinida com sucesso.',
        duration: 2000,
        color: 'success'
      });
      toast.present();
      this.navCtrl.navigateBack('/login');
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Erro ao redefinir a senha.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }

  goToLogin() {
    this.navCtrl.navigateForward('/login');
  }
}