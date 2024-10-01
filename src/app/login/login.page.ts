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
    private http: HttpClient // Adicione o HttpClient
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

  // Defina a função de revalidação da impressão digital
  async revalidateFingerprint() {
    try {
      await this.fingerprintAIO.show({
        title: 'Autenticação',
        disableBackup: true,
        description: 'Por favor, autentique-se usando a impressão digital',
      });
      
      const currentUser = await this.afAuth.currentUser;
      if (currentUser) {
        // Atualiza a necessidade de revalidação no Firestore
        await this.firestore.collection('users').doc(currentUser.uid).update({
          fingerprintNeedsRevalidation: false // Atualiza a necessidade de revalidação
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

  // Outros métodos...
}