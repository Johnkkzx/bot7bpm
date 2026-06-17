require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');

// Cria o cliente do Bot com as permissões corretas (Intents)
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,    // Ativado no Developer Portal
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent   // Ativado no Developer Portal
  ]
});

// Mensagem executada quando o bot liga com sucesso
client.once('ready', () => {
  console.log(`✅ Bot online com sucesso como: ${client.user.tag}!`);
});

// Gerenciador de comandos de barra (Slash Commands)
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'revisar') {
    try {
      // Resposta temporária para o usuário não receber erro de timeout
      await interaction.reply({ content: '🔄 Iniciando a revisão dos membros...', ephemeral: true });
      
      // Aqui você pode adicionar a lógica do que o seu comando deve fazer
      // Exemplo: buscar membros, verificar cargos, etc.
      
      await interaction.followUp({ content: '✅ Revisão concluída com sucesso!', ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: '❌ Houve um erro ao tentar executar esse comando.', ephemeral: true });
    }
  }
});

// Evento disparado quando um novo membro entra no servidor
client.on('guildMemberAdd', member => {
  console.log(`👤 Um novo membro entrou: ${member.user.tag}`);
  // Adicione aqui suas boas-vindas ou ações automáticas
});

// Faz o login utilizando o Token configurado no Railway
client.login(process.env.TOKEN).catch(err => {
  console.error("❌ Erro ao fazer login. Verifique se o TOKEN está correto no Railway.");
  console.error(err);
});
