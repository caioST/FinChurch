import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importando o AngularFireAuth

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  cpf: string = ''; // Adicionando a variável para CPF
  password: string = ''; // Adicionando a variável para Senha

  constructor(private navCtrl: NavController, private afAuth: AngularFireAuth) { }

  async login() {
    try {
      // Lógica para autenticar com Firebase ou outro serviço
      const userCredential = await this.afAuth.signInWithEmailAndPassword(this.cpf, this.password);
      const user = userCredential.user;
      console.log('Usuário logado', user);

      // Redirecionar após o login bem-sucedido
      this.navCtrl.navigateForward('/access'); // Substitua pelo caminho correto da sua página inicial
    } catch (error) {
      console.error('Erro de login:', error);
      // Aqui você pode mostrar um toast ou alert com a mensagem de erro
    }
  }

  resetPassword() {
    this.navCtrl.navigateForward('/forgot-password'); // Redireciona para a página de recuperação de senha
  }

  goToRegister() {
    this.navCtrl.navigateForward('/register'); // Redireciona para a página de registro
  }
}
