import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController, NavController, ModalController } from '@ionic/angular';
import { TermsModalComponent } from '../terms-modal/terms-modal.component'; // Importando o modal

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  fullName: string = '';
  cpf: string = '';
  email: string = '';
  phone: string = '';
  birthDate: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private modalCtrl: ModalController // Adicionando o ModalController
  ) {}

  async register() {
    // Verificação de senha
    if (this.password !== this.confirmPassword) {
      const toast = await this.toastCtrl.create({
        message: 'As senhas não coincidem.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    try {
      await this.afAuth.createUserWithEmailAndPassword(this.email, this.password);
      const toast = await this.toastCtrl.create({
        message: 'Conta criada com sucesso!',
        duration: 2000,
        color: 'success'
      });
      toast.present();
      this.goToLogin();
    } catch (error: any) {
      const toast = await this.toastCtrl.create({
        message: error.message,
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

  async openTermsModal() {
    const modal = await this.modalCtrl.create({
      component: TermsModalComponent,
    });
    await modal.present();
  }
}
