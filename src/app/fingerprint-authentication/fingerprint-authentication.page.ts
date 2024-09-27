import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';

@Component({
  selector: 'app-fingerprint-authentication',
  templateUrl: './fingerprint-authentication.page.html',
  styleUrls: ['./fingerprint-authentication.page.scss'],
})
export class FingerprintAuthenticationPage {

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private fingerprintAIO: FingerprintAIO
  ) {}

  async registerFingerprint() {
    try {
      // Cadastro da impressão digital
      const result = await this.fingerprintAIO.show({
        disableBackup: true,
        title: 'Autenticação',
        description: 'Use sua impressão digital para autenticar',
      });

      // Após o registro, redireciona para a página de login
      this.navCtrl.navigateForward('/login');
    } catch (error: any) { // Aqui especificamos 'any' como o tipo de erro
      const message = (error && error.message) ? error.message : 'Erro desconhecido';
      const toast = await this.toastCtrl.create({
        message: 'Erro ao registrar impressão digital: ' + message,
        duration: 2000,
        color: 'danger',
      });
      toast.present();
    }
  }
}