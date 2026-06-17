require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('revisar')
    .setDescription('Revisa todos os membros.')
    .toJSON()
];

// Puxa as variáveis do Railway (adicionada a alternativa APPLICATION_ID por segurança)
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID || process.env.APPLICATION_ID;
const guildId = process.env.GUILD_ID;

// Validação simples para conferir os logs no painel
if (!token || !clientId || !guildId) {
  console.error("❌ ERRO: Variáveis de ambiente faltando no painel do Railway!");
  console.log(`TOKEN: ${token ? 'Preenchido' : 'VAZIO'}`);
  console.log(`CLIENT_ID: ${clientId ? 'Preenchido' : 'VAZIO'}`);
  console.log(`GUILD_ID: ${guildId ? 'Preenchido' : 'VAZIO'}`);
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Iniciando o registro dos comandos (/) de barra...');
    
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );
    
    console.log('✅ Comandos registrados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao registrar os comandos:', error);
  }
})();
