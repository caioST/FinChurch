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
  cpf: string = '';
  password: string = '';

  constructor(
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private fingerprintAIO: FingerprintAIO,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore
  ) {}

  // Verifica a necessidade de revalidação da impressão digital ao entrar na página
  async ionViewDidEnter() {
    const currentUser = await this.afAuth.currentUser;
    if (currentUser) {
      const userDoc = await this.firestore.collection('users').doc(currentUser.uid).get().toPromise();
      if (userDoc && userDoc.exists) {
        const userData = userDoc.data() as { fingerprintNeedsRevalidation?: boolean };
        
        if (userData?.fingerprintNeedsRevalidation) {
          await this.revalidateFingerprint();
        }
      }
    }
  }

  async login() {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(this.cpf, this.password);
      const user = userCredential.user;
  
      if (user) {
        await this.firestore.collection('users').doc(user.uid).update({
          fingerprintNeedsRevalidation: true
        });
        console.log('Usuário logado, impressão digital marcada para revalidação');
        this.navCtrl.navigateForward('/access'); 
      }
    } catch (error) {
      console.error('Erro de login:', error);
      let message = 'Erro desconhecido';
      if (error instanceof Error) {
        message = error.message;
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
        const currentUser = await this.afAuth.currentUser;
        if (currentUser) {
          const userDoc = await this.firestore.collection('users').doc(currentUser.uid).get().toPromise();

          if (userDoc && userDoc.exists) {
            const userData = userDoc.data() as { fingerprintRegistered?: boolean, fingerprintNeedsRevalidation?: boolean };

            if (userData?.fingerprintRegistered && !userData?.fingerprintNeedsRevalidation) {
              console.log('Login com impressão digital bem-sucedido');
              this.navCtrl.navigateForward('/access');
            } else if (userData?.fingerprintRegistered && userData?.fingerprintNeedsRevalidation) {
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

  async revalidateFingerprint() {
    const currentUser = await this.afAuth.currentUser;
    if (currentUser) {
      await this.firestore.collection('users').doc(currentUser.uid).update({
        fingerprintNeedsRevalidation: false
      });
      console.log('Impressão digital revalidada com sucesso.');
    }
  }

  resetPassword() {
    this.navCtrl.navigateForward('/forgot-password');
  }

  goToRegister() {
    this.navCtrl.navigateForward('/register');
  }
}