import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {
  email: string = '';
  resetCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  codeSent: boolean = false; // Variável para controlar o estado de envio do código

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private afAuth: AngularFireAuth,
    private http: HttpClient // Adicione o HttpClient
  ) {}

  async requestResetCode() {
    try {
      await this.http.post('http://localhost:8100/sendResetCode', { email: this.email }).toPromise();
      const toast = await this.toastCtrl.create({
        message: 'Código de redefinição enviado para o seu e-mail.',
        duration: 2000,
        color: 'success'
      });
      toast.present();
      this.codeSent = true; // Define que o código foi enviado
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Erro ao enviar o código.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }

  async verifyResetCode() {
    try {
      // Aqui você deve verificar se o código está correto
      const response = await this.http.post('http://localhost:8100/verifyResetCode', { 
        email: this.email, 
        resetCode: this.resetCode 
      }).toPromise();

      if (response) {
        const toast = await this.toastCtrl.create({
          message: 'Código verificado com sucesso.',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.navCtrl.navigateForward('/new-password'); // Navega para a tela de nova senha
      }
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Código inválido ou expirado.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }

  async resetPassword() {
    // Verifique se as senhas correspondem
    if (this.newPassword !== this.confirmPassword) {
      const toast = await this.toastCtrl.create({
        message: 'As senhas não coincidem.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    // Aqui você deve redefinir a senha no Firebase
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
    this.navCtrl.navigateForward('/login', { 
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