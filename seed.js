const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      email: "iris@gmail.com",
      nome: "Iris",
      senha: "123456",
      dataNascimento: new Date("2005-02-25"),
    },

    {
      email: "japa@gmail.com",
      nome: "Japa",
      senha: "senha_japa_789",
      dataNascimento: new Date("2003-07-15"),
    },

    {
      email: "lucas@gmail.com",
      nome: "Lucas",
      senha: "lucas_senha_456",
      dataNascimento: new Date("2004-11-30"),
    },

    {
      email: "joao@gmail.com",
      nome: "João",
      senha: "joao_123_senha",
      dataNascimento: new Date("2002-09-10"),
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log("Usuários de teste criados com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
