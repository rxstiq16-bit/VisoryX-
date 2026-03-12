import { NextResponse } from 'next/server'

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID

const commands = [
  {
    name: 'order',
    description: 'Check the status of your order',
    options: [{
      name: 'id',
      description: 'Your order ID',
      type: 3, // STRING
      required: true,
    }],
  },
  {
    name: 'portfolio',
    description: 'View our latest work',
  },
  {
    name: 'pricing',
    description: 'View our pricing packages',
  },
  {
    name: 'services',
    description: 'View all our services',
  },
  {
    name: 'support',
    description: 'Get help or contact support',
  },
  {
    name: 'quote',
    description: 'Request a custom quote',
    options: [
      {
        name: 'service',
        description: 'Service type',
        type: 3, // STRING
        required: true,
        choices: [
          { name: 'GFX Design', value: 'gfx' },
          { name: 'ERLC Livery', value: 'erlc' },
          { name: 'Roblox Clothing', value: 'clothing' },
          { name: 'Discord Branding', value: 'discord' },
          { name: 'Logo Design', value: 'logo' },
          { name: 'Full Rebrand', value: 'rebrand' },
        ],
      },
      {
        name: 'description',
        description: 'Brief description of what you need',
        type: 3, // STRING
        required: true,
      },
    ],
  },
  {
    name: 'link',
    description: 'Link your Discord account to VisoryX',
  },
  {
    name: 'stats',
    description: 'View VisoryX statistics',
  },
]

export async function POST() {
  if (!DISCORD_BOT_TOKEN || !DISCORD_CLIENT_ID) {
    return NextResponse.json({ error: 'Missing Discord credentials' }, { status: 500 })
  }

  try {
    const response = await fetch(
      `https://discord.com/api/v10/applications/${DISCORD_CLIENT_ID}/commands`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commands),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json({ error, status: response.status }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({ 
      success: true, 
      message: 'Commands registered successfully!',
      commands: data.map((cmd: { name: string }) => cmd.name),
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Send a POST request to register Discord bot commands',
    commands: commands.map(cmd => cmd.name),
  })
}
