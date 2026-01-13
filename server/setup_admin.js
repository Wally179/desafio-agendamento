// server/setup_admin.js
const { Sequelize } = require("sequelize");
const dbConfig = require("./src/config/database");
const bcrypt = require("bcryptjs");

// Conecta ao banco
const connection = new Sequelize(dbConfig);

async function run() {
  try {
    console.log("🛠️  Iniciando manutenção...");

    // // 1. CORREÇÃO DO ERRO DE MIGRATION
    // // Apaga a tabela appointments se ela existir, para limpar o erro de "Duplicate key"
    // // ATENÇÃO: Isso apaga agendamentos existentes (como é setup, não tem problema)
    // console.log("🗑️  Limpando tabelas antigas para corrigir erro...");
    // await connection.query("DROP TABLE IF EXISTS appointments;");
    // console.log(
    //   "✅ Tabela 'appointments' limpa. Agora a migration vai funcionar."
    // );

    // 2. CRIAÇÃO DO ADMIN (Opcional agora, mas já deixa pronto)
    // Se quiser criar o admin agora, descomente as linhas abaixo DEPOIS de rodar as migrations

    const passwordHash = await bcrypt.hash("123456", 8);

    // Tenta criar ou encontrar o admin
    const [user, created] = await connection.query(
      `
      SELECT * FROM users WHERE email = 'admin@agendamento.com' LIMIT 1
    `,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (user) {
      // Se existe, vira admin
      await connection.query(
        `UPDATE users SET role = 'admin' WHERE email = 'admin@agendamento.com'`
      );
      console.log("👑 Usuário admin@agendamento.com promovido a ADMIN!");
    } else {
      // Se não existe, cria do zero
      await connection.query(`
        INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
        VALUES ('Admin', 'admin@agendamento.com', '${passwordHash}', 'admin', NOW(), NOW())
      `);
      console.log("👑 Usuário Admin criado do zero (Senha: 123456)");
    }
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await connection.close();
  }
}

run();
