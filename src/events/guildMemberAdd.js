module.exports = (client) => {
  client.on('guildMemberAdd', async member => {
    const cargoId = '1516550378861105162';

    await member.roles.add(cargoId).catch(() => {});
    await member.setNickname(`Cidadão. ${member.user.username}`).catch(() => {});
  });
};
