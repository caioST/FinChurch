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

// Cria a função com opções de memória e timeout
export const sendResetCode = functions
  .https.onRequest(async (req: Request, res: Response) => {
    const email = req.body.email;
    const resetCode = Math.floor(100000 + Math.random() * 900000);
    const expirationTime = Date.now() + 3600000; // Código expira em 1 hora

    const mailOptions = {
      from: functions.config().email.user,
      to: email,
      subject: "Código de recuperação de senha",
      text: `Seu código de recuperação é: ${resetCode}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      // Salvar o código e tempo de expiração no Firestore
      await admin.firestore()
        .collection("resetCodes")
        .doc(email)
        .set({
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
  });
