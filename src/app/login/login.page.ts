import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  cpf: string = ''; // Variável para CPF
  password: string = ''; // Variável para Senha

  constructor(
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private fingerprintAIO: FingerprintAIO,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore
  ) { }

  async login() {
    try {
      // Lógica para autenticar com Firebase usando CPF
      const userCredential = await this.afAuth.signInWithEmailAndPassword(this.cpf, this.password);
      const user = userCredential.user;
      console.log('Usuário logado', user);

      // Redirecionar após o login bem-sucedido
      this.navCtrl.navigateForward('/access'); // Substitua pelo caminho correto da sua página inicial
    } catch (error) {
      console.error('Erro de login:', error);
      let message = 'Erro desconhecido';
      if (error instanceof Error) {
        message = error.message; // Acesse a mensagem do erro se for um objeto Error
      }
      const toast = await this.toastCtrl.create({
        message: 'Erro ao fazer login: ' + message,
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }

  async loginWithFingerprint() {
    try {
      const result = await this.fingerprintAIO.show({
        title: 'Autenticação',
        description: 'Use sua impressão digital para fazer login',
        disableBackup: true
      });
  
      if (result) {
        // Verificar se a impressão digital foi registrada
        const currentUser = await this.afAuth.currentUser;
        if (currentUser) {
          const userDoc = await this.firestore.collection('users').doc(currentUser.uid).get().toPromise();
          
          if (userDoc && userDoc.exists) {
            const userData = userDoc.data() as { fingerprintRegistered?: boolean }; // Definindo o tipo esperado
  
            if (userData?.fingerprintRegistered) {
              console.log('Login com impressão digital bem-sucedido');
              this.navCtrl.navigateForward('/access'); // Redirecionar após o login
            } else {
              throw new Error('Impressão digital não registrada.');
            }
          } else {
            throw new Error('Usuário não encontrado.');
          }
        } else {
          throw new Error('Usuário não autenticado.');
        }
      }
    } catch (error) {
      console.error('Erro ao autenticar com impressão digital:', error);
      let message = 'Erro desconhecido';
      if (error instanceof Error) {
        message = error.message; // Acesse a mensagem do erro se for um objeto Error
      }
      const toast = await this.toastCtrl.create({
        message: 'Erro ao autenticar: ' + message,
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }

  resetPassword() {
    this.navCtrl.navigateForward('/forgot-password'); // Redireciona para a página de recuperação de senha
  }

  goToRegister() {
    this.navCtrl.navigateForward('/register'); // Redireciona para a página de registro
  }
}