require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,    
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent   
  ]
});


const CONFIG_BOT = {
  ID_CARGO_ALVO: "1292571689841852426", 
  PREFIXO_NOME: "Cidadão. ",           
};

client.once('ready', () => {
  console.log(`✅ Robô online com sucesso como: ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'revisar') {
    try {
      
      await interaction.deferReply({ ephemeral: true });

     
      const cargoParaAtribuir = interaction.guild.roles.cache.get(CONFIG_BOT.ID_CARGO_ALVO);
      
      if (!cargoParaAtribuir) {
        return await interaction.editReply({ 
          content: `❌ Erro: O ID do cargo (${CONFIG_BOT.ID_CARGO_ALVO}) não foi encontrado neste servidor.` 
        });
      }

      
      const members = await interaction.guild.members.fetch();
      let alteradosContador = 0;
      let errosContador = 0;

     
      for (const [id, member] of members) {
        
        if (member.user.bot || member.id === interaction.guild.ownerId) continue;

        try {
          let modificou = false;

          
          if (!member.roles.cache.has(cargoParaAtribuir.id)) {
            await member.roles.add(cargoParaAtribuir);
            modificou = true;
          }

          
          const nomeAtual = member.displayName;
          if (!nomeAtual.startsWith(CONFIG_BOT.PREFIXO_NOME)) {
            const novoNome = `${CONFIG_BOT.PREFIXO_NOME}${nomeAtual}`;
            
            await member.setNickname(novoNome.substring(0, 32));
            modificou = true;
          }

          if (modificou) {
            alteradosContador++;
          }
        } catch (err) {
          
          errosContador++;
        }
      }

      
      const embedResultado = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('🛠️ Revisão de Membros Concluída')
        .setDescription('O processo de formatação automatizada foi terminado.')
        .addFields(
          { name: '✅ Membros Atualizados', value: `${alteradosContador}`, inline: true },
          { name: '⚠️ Perfis Ignorados (Hierarquia Alta)', value: `${errosContador}`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: `Solicitado por: ${interaction.user.tag}` });

      await interaction.editReply({ embeds: [embedResultado] });

    } catch (error) {
      console.error('Erro durante a execução da revisão:', error);
      await interaction.editReply({ content: '❌ Ocorreu um erro crítico ao processar os membros.' });
    }
  }
});

client.login(process.env.TOKEN);
