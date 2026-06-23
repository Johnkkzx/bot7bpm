module.exports = (client) => {
  client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const cargoId = '1516550378861105162';

    const tinha = oldMember.roles.cache.has(cargoId);
    const tem = newMember.roles.cache.has(cargoId);

    if (!tinha && tem) {
      await newMember
        .setNickname(`Cidadão. ${newMember.user.username}`)
        .catch(() => {});
    }
  });
};
