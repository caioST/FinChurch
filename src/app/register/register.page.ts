import { Component } from '@angular/core';  
import { AngularFireAuth } from '@angular/fire/compat/auth';  
import { ToastController, NavController, ModalController } from '@ionic/angular';  
import { TermsModalComponent } from '../terms-modal/terms-modal.component'; 


@Component({
  selector: 'app-register',  
  templateUrl: './register.page.html', 
  styleUrls: ['./register.page.scss'], 
})
export class RegisterPage {
  // Variáveis para armazenar os dados do formulário de registro
  fullName: string = '';  // Nome completo do usuário
  cpf: string = '';  // CPF do usuário
  email: string = '';  // E-mail do usuário
  phone: string = '';  // Telefone do usuário
  birthDate: string = '';  // Data de nascimento do usuário
  password: string = '';  // Senha do usuário
  confirmPassword: string = '';  // Confirmação da senha
  termsAccepted: boolean = false; // Variável para verificar se os termos foram aceitos

  
  constructor(
    private afAuth: AngularFireAuth,             
    private toastCtrl: ToastController,          
    private navCtrl: NavController,              
    private modalCtrl: ModalController           
  ) {}

  // Método assíncrono para registrar um novo usuário
  async register() {
    // Verificação se os termos foram aceitos
    if (!this.termsAccepted) {
      // Se os termos não foram aceitos, exibe uma mensagem de erro
      const toast = await this.toastCtrl.create({
        message: 'Você precisa aceitar os Termos de Uso antes de continuar.', 
        duration: 2000,  
        color: 'danger'  
      });
      toast.present();  
      return;  
    }

    // Verificação de senha
    if (this.password !== this.confirmPassword) {
      // Se as senhas não coincidem, exibe uma mensagem de erro
      const toast = await this.toastCtrl.create({
        message: 'As senhas não coincidem.', 
        duration: 2000,  
        color: 'danger'  
      });
      toast.present();  
      return;  // Encerra o método se as senhas não coincidirem
    }

    try {
      // Tenta criar um novo usuário com e-mail e senha
      await this.afAuth.createUserWithEmailAndPassword(this.email, this.password);
      // Exibe mensagem de sucesso após a criação da conta
      const toast = await this.toastCtrl.create({
        message: 'Conta criada com sucesso!', 
        duration: 2000,  
        color: 'success' 
      });
      toast.present(); 
      
      // Redirecionar para a página de cadastro de impressão digital
      this.navCtrl.navigateForward('/fingerprint-authentication'); // Navega para a próxima página
    } catch (error: any) {
      // Se ocorrer um erro durante a criação do usuário
      const toast = await this.toastCtrl.create({
        message: error.message, 
        duration: 2000,  
        color: 'danger'  
      });
      toast.present();  
    }
  }

  // Método para redirecionar para a página de login
  goToLogin() {
    this.navCtrl.navigateForward('/login', { 
      animated: true, 
      animationDirection: 'forward' 
    });
  }

  // Método assíncrono para abrir o modal de termos de uso
  async openTermsModal() {
    const modal = await this.modalCtrl.create({ // Cria uma instância do modal
      component: TermsModalComponent, // Define o componente do modal
    });

    // Após o modal ser fechado, verifica se os termos foram aceitos
    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.accepted) {
        this.termsAccepted = true; // Define como aceito se os termos foram aceitos
      }
    });

    await modal.present(); // Apresenta o modal ao usuário
  }
}
