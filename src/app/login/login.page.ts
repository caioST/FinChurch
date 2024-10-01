import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';

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
    private firestore: AngularFirestore,
    private http: HttpClient 
  ) {}

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
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      const toast = await this.toastCtrl.create({
        message: 'Erro ao fazer login: ' + message,
        duration: 2000,
        color: 'danger'
      });
      toast.present(); 
    }
  }

  async resetPassword() {
    try {
      const email = this.cpf; // Supondo que o CPF é o e-mail
      await this.http.post('https://<YOUR_CLOUD_FUNCTION_URL>/sendResetCode', { email }).toPromise();
      const toast = await this.toastCtrl.create({
        message: 'Código de recuperação enviado para o e-mail.',
        duration: 2000,
        color: 'success'
      });
      toast.present();
      this.navCtrl.navigateForward('/forgot-password'); // Navega para a tela de redefinição de senha
    } catch (error) {
      console.error('Erro ao enviar código:', error);
      const toast = await this.toastCtrl.create({
        message: 'Erro ao enviar código de recuperação.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }

  async revalidateFingerprint() {
    try {
      await this.fingerprintAIO.show({
        title: 'Autenticação',
        disableBackup: true,
        description: 'Por favor, autentique-se usando a impressão digital',
      });
      
      const currentUser = await this.afAuth.currentUser;
      if (currentUser) {
        await this.firestore.collection('users').doc(currentUser.uid).update({
          fingerprintNeedsRevalidation: false 
        });
        console.log('Impressão digital revalidada com sucesso.');
      }
    } catch (error) {
      console.error('Erro ao revalidar impressão digital:', error);
      const toast = await this.toastCtrl.create({
        message: 'Erro ao revalidar impressão digital.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }

  goToRegister() {
    this.navCtrl.navigateForward('/register'); 
  }

  async loginWithFingerprint() {
    try {
      const result = await this.fingerprintAIO.show({
        title: 'Autenticação com Impressão Digital',
        disableBackup: true,
      });
      if (result) {
        this.navCtrl.navigateForward('/access'); 
      }
    } catch (error) {
      console.error('Erro ao autenticar com impressão digital:', error);
      const toast = await this.toastCtrl.create({
        message: 'Erro ao autenticar com impressão digital.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }
}