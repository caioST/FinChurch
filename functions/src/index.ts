import * as functions from "firebase-functions";
import * as nodemailer from "nodemailer";
import * as admin from "firebase-admin";
import {Request, Response} from "express";

admin.initializeApp();

// Configuração do Nodemailer usando variáveis de ambiente
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass,
  },
});

// Função para enviar o código de redefinição de senha
export const sendResetCode = functions.https.onRequest(
  async (req: Request, res: Response): Promise<void> => {
    const email: string = req.body.email;

    // Verifica se o email está presente
    if (!email) {
      res.status(400).send({error: "Email é obrigatório."});
      return;
    }

    const resetCode: string = Math.floor(100000 + Math.random() * 900000)
      .toString();
    const expirationTime: number = Date.now() + 3600000; // Código expira em 1 hora

    const mailOptions = {
      from: functions.config().email.user,
      to: email,
      subject: "Código de recuperação de senha",
      text: `Seu código de recuperação é: ${resetCode}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      await admin.firestore().collection("resetCodes").doc(email).set({
        resetCode,
        expirationTime,
      });
      res.status(200).send({
        message: "Código de recuperação enviado para o e-mail.",
      });
    } catch (error) {
      console.error("Erro ao enviar o código:", error);
      res.status(500).send({error: "Erro ao enviar o código."});
    }
  }
);

// Função para verificar o código de redefinição de senha
export const verifyResetCode = functions.https.onRequest(
  async (req: Request, res: Response): Promise<void> => {
    const {email, resetCode}: {email: string; resetCode: string} = req.body;

    // Verifica se o email e o código estão presentes
    if (!email || !resetCode) {
      res.status(400).send({error: "Email e código são obrigatórios."});
      return;
    }

    try {
      const doc = await admin.firestore().collection("resetCodes").doc(email)
        .get();
      if (!doc.exists) {
        res.status(400).send({error: "Código inválido ou expirado."});
        return;
      }

      const data = doc.data();
      if (data && data.resetCode === resetCode && data.expirationTime > Date.now()) {
        res.status(200).send({message: "Código válido."});
      } else {
        res.status(400).send({error: "Código inválido ou expirado."});
      }
    } catch (error) {
      console.error("Erro ao verificar o código:", error);
      res.status(500).send({error: "Erro ao verificar o código."});
    }
  }
);

// Função para redefinir a senha
export const resetPassword = functions.https.onRequest(
  async (req: Request, res: Response): Promise<void> => {
    const {email, newPassword}: {email: string; newPassword: string} = req.body;

    // Verifica se o email e a nova senha estão presentes
    if (!email || !newPassword) {
      res.status(400).send({error: "Email e nova senha são obrigatórios."});
      return;
    }

    try {
      await admin.auth().updateUser(email, {password: newPassword});
      await admin.firestore().collection("resetCodes").doc(email).delete();
      res.status(200).send({message: "Senha redefinida com sucesso."});
    } catch (error) {
      console.error("Erro ao redefinir a senha:", error);
      res.status(500).send({error: "Erro ao redefinir a senha."});
    }
  }
);
