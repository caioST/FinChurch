import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController, NavController, ModalController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { TermsModalComponent } from '../terms-modal/terms-modal.component';
import { ErrorHandler } from '../services/error-handler.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage {
  // Variáveis para armazenar os dados do formulário de registro
  fullName: string = ''; // Nome completo do usuário
  cpf: string = ''; // CPF do usuário
  email: string = ''; // E-mail do usuário
  phone: string = ''; // Telefone do usuário
  birthDate: string = ''; // Data de nascimento do usuário
  password: string = ''; // Senha do usuário
  confirmPassword: string = ''; // Confirmação da senha
  termsAccepted: boolean = false; // Variável para verificar se os termos foram aceitos

  // Formulário de registro
  registerForm = this.formBuilder.group({
    fullName: ['', Validators.required],
    cpf: ['', [Validators.required, this.cpfValidator]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, this.phoneValidator]],
    birthDate: ['', Validators.required],
    password: ['', [Validators.required, this.passwordValidator]],
    confirmPassword: ['', [Validators.required, this.confirmPasswordValidator]]
  });

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
  ) { }

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

    // Verificação do formulário de registro
    if (!this.registerForm.valid) {
      // Se o formulário não for válido, exibe uma mensagem de erro
      const toast = await this.toastCtrl.create({
        message: 'Por favor, preencha todos os campos corretamente.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    try {
      // Cria um novo usuário com e-mail e senha (senha em texto simples, Firebase irá criptografar)
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
    
    } catch (error) {
      // Lida com erros durante a criação do usuário
      this.errorHandler.handleError(error);
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

  // Validador de CPF
  cpfValidator(control: any) {
    const cpf = control.value;
    if (!cpf) {
      return null;
    }
    const cpfRegex = /^\d{3}\.\d{ 3}\.\d{3}\-\d{2}$/;
    if (!cpfRegex.test(cpf)) {
      return { cpfInvalid: true };
    }
    return null;
  }

  // Validador de telefone
  phoneValidator(control: any) {
    const phone = control.value;
    if (!phone) {
      return null;
    }
    const phoneRegex = /^\d{2} \d{4}\-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      return { phoneInvalid: true };
    }
    return null;
  }

  // Validador de senha
  passwordValidator(control: any) {
    const password = control.value;
    if (!password) {
      return null;
    }
    const passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      return { passwordInvalid: true };
    }
    return null;
  }

  // Validador de confirmação de senha
  confirmPasswordValidator(control: any) {
    const confirmPassword = control.value;
    if (!confirmPassword) {
      return null;
    }
    if (confirmPassword !== this.password) {
      return { confirmPasswordInvalid: true };
    }
    return null;
  }
}