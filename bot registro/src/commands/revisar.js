const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const cargoId = '1516550378861105162';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('revisar')
    .setDescription('Corrige cargos e nicknames.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    await interaction.guild.members.fetch();

    let alterados = 0;

    for (const member of interaction.guild.members.cache.values()) {
      if (member.user.bot) continue;

      if (!member.roles.cache.has(cargoId)) {
        await member.roles.add(cargoId).catch(() => {});
      }

      const nick = `Cidadão. ${member.user.username}`;
      if (member.nickname !== nick) {
        await member.setNickname(nick).catch(() => {});
        alterados++;
      }
    }

    await interaction.editReply(`Revisão concluída. ${alterados} nicknames ajustados.`);
  }
};