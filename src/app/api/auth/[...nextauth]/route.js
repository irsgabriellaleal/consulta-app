import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier: email, url }) => {
        const result = await resend.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: "Faça login no Clinix",
          html: `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Login no Clinix</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #3b82f6; color: white; text-align: center; padding: 20px; }
                .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
                .button { display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
                .footer { text-align: center; margin-top: 20px; font-size: 0.8em; color: #777; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Bem-vindo ao Clinix</h1>
                </div>
                <div class="content">
                  <p>Olá,</p>
                  <p>Estamos felizes em tê-lo conosco! Para acessar sua conta no Clinix, por favor, clique no botão abaixo:</p>
                  <p style="text-align: center;">
                    <a href="${url}" class="button" style="color: white;">Fazer Login</a>
                  </p>
                  <p>Se você não solicitou este e-mail, por favor, ignore-o.</p>
                </div>
                <div class="footer">
                  <p>© 2024 Clinix. Todos os direitos reservados.</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });

        if (result.error) {
          throw new Error("Falha ao enviar o email de verificação");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-request",
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user }) {

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email,
            nome: user.name || user.email.split("@")[0],
            dataNascimento: new Date(),
          },
        });
      }

      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };