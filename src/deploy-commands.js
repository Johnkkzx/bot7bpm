require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

// Definição do comando /revisar
const commands = [
  new SlashCommandBuilder()
    .setName('revisar')
    .setDescription('Altera o apelido e atribui o cargo a todos os membros do servidor.')
    .toJSON()
];

// IDs configurados diretamente no script
const clientId = "1518007145885335682"; 
const guildId = "1472932103539785863";   
const token = process.env.TOKEN;

// Validação apenas para o Token que ficou na variável
if (!token) {
  console.error("❌ ERRO: O TOKEN está faltando no painel de variáveis do Railway!");
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
