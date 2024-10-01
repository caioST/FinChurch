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
  cpf: string = '';  // Variável para armazenar o CPF do usuário
  password: string = '';  // Variável para armazenar a senha do usuário


  constructor(
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private fingerprintAIO: FingerprintAIO,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore
  ) { }

  // Método assíncrono para autenticar o usuário usando CPF e senha
  async login() {
    try {
      // Lógica para autenticar com Firebase usando CPF e senha
      const userCredential = await this.afAuth.signInWithEmailAndPassword(this.cpf, this.password);
      const user = userCredential.user;  // Obtem o usuário autenticado
      console.log('Usuário logado', user);  // Log para verificar o usuário logado

      // Redirecionar após o login bem-sucedido
      this.navCtrl.navigateForward('/access'); // Navega para a página inicial do aplicativo
    } catch (error) {
      console.error('Erro de login:', error);  // Log de erro no console
      let message = 'Erro desconhecido';  // Mensagem padrão de erro
      if (error instanceof Error) {
        message = error.message;  // Acessa a mensagem do erro se for um objeto Error
      }
      // Criação de um toast para exibir a mensagem de erro ao usuário
      const toast = await this.toastCtrl.create({
        message: 'Erro ao fazer login: ' + message,  // Mensagem de erro personalizada
        duration: 2000,  // Duração do toast (2 segundos)
        color: 'danger'  // Cor do toast para indicar erro (vermelho)
      });
      toast.present();  // Apresenta o toast ao usuário
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
            const userData = userDoc.data() as { fingerprintRegistered?: boolean, fingerprintNeedsRevalidation?: boolean };

            // Verifica se a impressão digital foi registrada e não requer revalidação
            if (userData?.fingerprintRegistered && !userData?.fingerprintNeedsRevalidation) {
              console.log('Login com impressão digital bem-sucedido');
              this.navCtrl.navigateForward('/access');
            } else if (userData?.fingerprintRegistered && userData?.fingerprintNeedsRevalidation) {
              // Revalide a impressão digital
              await this.revalidateFingerprint();
              console.log('Impressão digital revalidada com sucesso.');
              this.navCtrl.navigateForward('/access');
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
        message = error.message;
      }
      const toast = await this.toastCtrl.create({
        message: 'Erro ao autenticar: ' + message,
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }

  // Método para revalidar a impressão digital após login com CPF e senha
  async revalidateFingerprint() {
    const currentUser = await this.afAuth.currentUser;
    if (currentUser) {
      await this.firestore.collection('users').doc(currentUser.uid).update({
        fingerprintNeedsRevalidation: false
      });
      console.log('Impressão digital revalidada com sucesso.');
    }
  }

  // Método para redirecionar para a página de recuperação de senha
  resetPassword() {
    this.navCtrl.navigateForward('/forgot-password');
  }

  // Método para redirecionar para a página de registro
  goToRegister() {
    this.navCtrl.navigateForward('/register');
  }
}
