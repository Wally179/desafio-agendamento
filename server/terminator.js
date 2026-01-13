// server/terminator.js
require("dotenv").config(); // Garante que lê o .env
const { Sequelize } = require("sequelize");

// Configuração manual para garantir que não dependa de arquivos externos
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false, // Sem spam no terminal
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

async function exterminate() {
  try {
    console.log("🤖 TERMINATOR INICIADO...");

    // 1. Desativa a segurança de chaves estrangeiras
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0", { raw: true });
    console.log("🔓 Travas desligadas.");

    // 2. Pega o nome de TODAS as tabelas do banco
    const [results] = await sequelize.query("SHOW TABLES");
    const tables = results.map((row) => Object.values(row)[0]);

    if (tables.length === 0) {
      console.log("✅ O banco já está vazio!");
    } else {
      console.log(
        `🗑️  Encontradas ${tables.length} tabelas para destruir: ${tables.join(
          ", "
        )}`
      );

      // 3. Destrói uma por uma
      for (const table of tables) {
        await sequelize.query(`DROP TABLE IF EXISTS \`${table}\``);
        console.log(`🔥 Tabela '${table}' destruída.`);
      }
    }

    // 4. Apaga a tabela de controle de migrations se ela sobrou
    await sequelize.query("DROP TABLE IF EXISTS `SequelizeMeta`");

    // 5. Religa a segurança (opcional, pois a conexão vai fechar)
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", { raw: true });

    console.log("💀 TERMINATOR FINALIZADO. O banco está vazio.");
  } catch (error) {
    console.error("❌ Erro fatal:", error);
  } finally {
    await sequelize.close();
  }
}

exterminate();
