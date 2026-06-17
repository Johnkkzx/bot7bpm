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
  ID_CARGO_ALVO: "1292571689841852426", // ID do cargo que os membros vão receber
  PREFIXO_NOME: "Cidadão. ",           // Formato atualizado: Cidadão. Nick
};

client.once('ready', () => {
  console.log(`✅ Robô online com sucesso como: ${client.user.tag}!`);
});

// 1️⃣ LOGICA: COMANDO /REVISAR (Para quem já está no servidor)
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'revisar') {
    try {
      // Evita o erro de timeout de 3 segundos do Discord
      await interaction.deferReply({ ephemeral: true });

      // Procura o cargo configurado dentro do servidor
      const cargoParaAtribuir = interaction.guild.roles.cache.get(CONFIG_BOT.ID_CARGO_ALVO);
      
      if (!cargoParaAtribuir) {
        return await interaction.editReply({ 
          content: `❌ Erro: O ID do cargo (${CONFIG_BOT.ID_CARGO_ALVO}) não foi encontrado neste servidor.` 
        });
      }

      // Descarrega todos os membros do servidor para a memória
      const members = await interaction.guild.members.fetch();
      let alteradosContador = 0;
      let errosContador = 0;

      // Executa a verificação individual em cada membro existente
      for (const [id, member] of members) {
        // Ignora bots e o dono do servidor por restrições de hierarquia
        if (member.user.bot || member.id === interaction.guild.ownerId) continue;

        try {
          let modificou = false;

          // Atribui o cargo caso o membro não o possua
          if (!member.roles.cache.has(cargoParaAtribuir.id)) {
            await member.roles.add(cargoParaAtribuir);
            modificou = true;
          }

          // Modifica o apelido caso não comece com o prefixo "Cidadão. "
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

      // Apresentação do relatório final no chat
      const embedResultado = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('🛠️ Revisão de Membros Concluída')
        .setDescription('O processo de formatação automatizada de quem já estava no servidor foi terminado.')
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

// 2️⃣ LOGICA: ENTRADA AUTOMÁTICA (Para novos membros que entrarem a partir de agora)
client.on('guildMemberAdd', async member => {
  console.log(`👤 Um novo membro entrou: ${member.user.tag}`);
  
  try {
    // 1. Busca o cargo configurado
    const cargoAutomatico = member.guild.roles.cache.get(CONFIG_BOT.ID_CARGO_ALVO);
    
    if (cargoAutomatico) {
      // Entrega o cargo na hora
      await member.roles.add(cargoAutomatico);
      console.log(`✅ Cargo automático adicionado para: ${member.user.tag}`);
    } else {
      console.error(`⚠️ Não foi possível dar o cargo automático: ID ${CONFIG_BOT.ID_CARGO_ALVO} não encontrado.`);
    }

    // 2. Altera o nome na hora para o formato "Cidadão. NomeDoUsuario"
    const nomeBase = member.user.globalName || member.user.username;
    const novoNomeEntrada = `${CONFIG_BOT.PREFIXO_NOME}${nomeBase}`;
    
    await member.setNickname(novoNomeEntrada.substring(0, 32));
    console.log(`✅ Nome formatado automaticamente para: ${novoNomeEntrada}`);

  } catch (error) {
    console.error(`❌ Erro nas ações automáticas de entrada para ${member.user.tag}:`, error);
  }
});

client.login(process.env.TOKEN);
