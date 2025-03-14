import { NextResponse } from 'next/server';
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const guildId = searchParams.get('guildId') || process.env.DISCORD_GUILD_ID;

    if (!guildId) {
      return NextResponse.json(
        { success: false, error: 'Guild ID gerekli' },
        { status: 400 }
      );
    }

    await client.login(process.env.DISCORD_BOT_TOKEN);

    const guild = await client.guilds.fetch(guildId);
    const members = await guild.members.fetch();

    const users = members.map(member => ({
      id: member.user.id,
      username: member.user.username,
      displayName: member.displayName,
      avatar: member.user.displayAvatarURL({ dynamic: true }),
      roles: member.roles.cache
        .filter(role => role.id !== guildId) 
        .map(role => ({
          id: role.id,
          name: role.name,
          color: role.hexColor,
          position: role.position,
        }))
        .sort((a, b) => b.position - a.position),
      joinedAt: member.joinedAt?.toISOString(),
      status: member.presence?.status || 'offline',
    }));

    return NextResponse.json({
      success: true,
      guildId,
      users,
    });
  } catch (error) {
    console.error('Discord users API error:', error);
    return NextResponse.json(
      { success: false, error: 'Kullanıcılar alınamadı' },
      { status: 500 }
    );
  }
}