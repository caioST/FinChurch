import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-fingerprint-authentication',
  templateUrl: './fingerprint-authentication.page.html',
  styleUrls: ['./fingerprint-authentication.page.scss'],
})
export class FingerprintAuthenticationPage {

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private fingerprintAIO: FingerprintAIO,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore // Adicionando o Firestore
  ) {}

  async registerFingerprint() {
    try {
      // Cadastro da impressão digital
      const result = await this.fingerprintAIO.show({
        disableBackup: true,
        title: 'Autenticação',
        description: 'Use sua impressão digital para autenticar',
      });

      // Após o registro, atualize o Firestore com a informação
      const currentUser = await this.afAuth.currentUser;
      if (currentUser) {
        await this.firestore.collection('users').doc(currentUser.uid).set({
          fingerprintRegistered: true
        }, { merge: true });
      }

      // Redireciona para a página de login
      this.navCtrl.navigateForward('/login');
    } catch (error: any) {
      const message = error.message || 'Erro desconhecido';
      const toast = await this.toastCtrl.create({
        message: 'Erro ao registrar impressão digital: ' + message,
        duration: 2000,
        color: 'danger',
      });
      toast.present();
    }
  }
}