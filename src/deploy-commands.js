require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

// Definição do comando /revisar
const commands = [
  new SlashCommandBuilder()
    .setName('revisar')
    .setDescription('Altera o apelido e atribui o cargo a todos os membros do servidor.')
    .toJSON()
];

// Suporte para as variáveis de ambiente do Railway
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID || process.env.APPLICATION_ID;
const guildId = process.env.GUILD_ID;

// Validação de segurança exibida nos logs do Railway
if (!token || !clientId || !guildId) {
  console.error("❌ ERRO: Variáveis de ambiente em falta no painel do Railway!");
  console.log(`TOKEN: ${token ? 'OK' : 'EM FALTA'}`);
  console.log(`CLIENT_ID/APPLICATION_ID: ${clientId ? 'OK' : 'EM FALTA'}`);
  console.log(`GUILD_ID: ${guildId ? 'OK' : 'EM FALTA'}`);
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('A iniciar o registo do comando (/) de barra...');
    
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );
    
    console.log('✅ Comando registado com sucesso no Discord!');
  } catch (error) {
    console.error('❌ Erro ao registar o comando:', error);
  }
})();
