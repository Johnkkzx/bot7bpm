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

// Configurações fixas direto no script
const CONFIG_BOT = {
  ID_CARGO_ALVO: "1516550378861105162", 
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

          const cargosAtuais = member.roles.cache.filter(role => role.id !== interaction.guild.id);
          const temApenasOCargoAlvo = cargosAtuais.size === 1 && cargosAtuais.has(cargoParaAtribuir.id);

          if (!temApenasOCargoAlvo) {
            
            await member.roles.set([cargoParaAtribuir]);
            modificou = true;
          }

          
          const nomeRealDoUsuario = member.user.globalName || member.user.username;
          const novoNomeCorreto = `${CONFIG_BOT.PREFIXO_NOME}${nomeRealDoUsuario}`;

         
          if (member.nickname !== novoNomeCorreto) {
            await member.setNickname(novoNomeCorreto.substring(0, 32));
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
        .setDescription('O processo de formatação automatizada de quem já estava no servidor foi terminado.')
        .addFields(
          { name: '✅ Membros Atualizados/Limpos', value: `${alteradosContador}`, inline: true },
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

client.on('guildMemberAdd', async member => {
  console.log(`👤 Um novo membro entrou: ${member.user.tag}`);
  
  try {
    const cargoAutomatico = member.guild.roles.cache.get(CONFIG_BOT.ID_CARGO_ALVO);
    
    if (cargoAutomatico) {
      await member.roles.add(cargoAutomatico);
      console.log(`✅ Cargo automático adicionado para: ${member.user.tag}`);
    }

    const nomeBase = member.user.globalName || member.user.username;
    const novoNomeEntrada = `${CONFIG_BOT.PREFIXO_NOME}${nomeBase}`;
    
    await member.setNickname(novoNomeEntrada.substring(0, 32));
    console.log(`✅ Nome formatado automaticamente para: ${novoNomeEntrada}`);

  } catch (error) {
    console.error(`❌ Erro nas ações automáticas de entrada para ${member.user.tag}:`, error);
  }
});

client.login(process.env.TOKEN);
