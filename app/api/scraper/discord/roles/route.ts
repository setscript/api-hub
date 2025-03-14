import { NextResponse } from 'next/server';
import { Client, GatewayIntentBits } from 'discord.js';

export async function GET() {
  try {
    const token = process.env.DISCORD_BOT_TOKEN;
    const guildId = process.env.DISCORD_GUILD_ID;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Discord bot token bulunamadı. Lütfen .env dosyasını kontrol edin.' },
        { status: 500 }
      );
    }

    if (!guildId) {
      return NextResponse.json(
        { success: false, error: 'Discord sunucu ID bulunamadı. Lütfen .env dosyasını kontrol edin.' },
        { status: 500 }
      );
    }

    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
      ]
    });

    await client.login(token);

    const guild = await client.guilds.fetch(guildId);
    
    if (!guild) {
      await client.destroy();
      return NextResponse.json(
        { success: false, error: 'Belirtilen ID ile sunucu bulunamadı.' },
        { status: 404 }
      );
    }

    await guild.members.fetch();
    const roles = await guild.roles.fetch();
    
    const formattedRoles = roles.map(role => {
      if (role.name === '@everyone') return null;
      
      return {
        id: role.id,
        name: role.name,
        color: role.color.toString(),
        position: role.position,
        members: role.members.size
      };
    }).filter(Boolean);

    await client.destroy();

    return NextResponse.json({
      success: true,
      roles: formattedRoles
    });
  } catch (error: any) {
    console.error('Discord rolleri alınırken hata oluştu:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Discord API hatası: ${error.message || 'Bilinmeyen hata'}` 
      },
      { status: 500 }
    );
  }
} 