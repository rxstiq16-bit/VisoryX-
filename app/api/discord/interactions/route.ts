import { NextRequest, NextResponse } from 'next/server'

// Discord interaction types
const InteractionType = {
  PING: 1,
  APPLICATION_COMMAND: 2,
  MESSAGE_COMPONENT: 3,
}

const InteractionResponseType = {
  PONG: 1,
  CHANNEL_MESSAGE_WITH_SOURCE: 4,
}

// Verify Discord request signature using tweetnacl
async function verifyDiscordRequest(request: NextRequest, body: string): Promise<boolean> {
  const signature = request.headers.get('x-signature-ed25519')
  const timestamp = request.headers.get('x-signature-timestamp')
  const publicKey = process.env.DISCORD_PUBLIC_KEY

  if (!signature || !timestamp || !publicKey) {
    console.log('[v0] Missing signature, timestamp, or public key')
    return false
  }

  try {
    // Use SubtleCrypto for Ed25519 verification
    const encoder = new TextEncoder()
    const message = encoder.encode(timestamp + body)
    
    // Convert hex strings to Uint8Array
    const signatureBytes = hexToBuffer(signature)
    const publicKeyBytes = hexToBuffer(publicKey)

    // Import the public key
    const key = await crypto.subtle.importKey(
      'raw',
      publicKeyBytes,
      {
        name: 'Ed25519',
      },
      false,
      ['verify']
    )

    // Verify the signature
    const isValid = await crypto.subtle.verify(
      'Ed25519',
      key,
      signatureBytes,
      message
    )

    return isValid
  } catch (error) {
    console.log('[v0] Verification error:', error)
    return false
  }
}

function hexToBuffer(hex: string): Uint8Array {
  const matches = hex.match(/.{1,2}/g) || []
  return new Uint8Array(matches.map(byte => parseInt(byte, 16)))
}

// Create embed response
function createEmbed(title: string, description: string, fields: Array<{ name: string; value: string; inline?: boolean }>, color = 0x8B5CF6) {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [{
        title,
        description,
        color,
        fields,
        footer: { text: 'VisoryX Design Studio' },
        timestamp: new Date().toISOString(),
      }],
      components: [{
        type: 1,
        components: [{
          type: 2,
          style: 5,
          label: 'Visit VisoryX',
          url: 'https://visoryx.design',
        }],
      }],
    },
  }
}

// Handle slash commands
function handleCommand(name: string, options: Record<string, string> = {}) {
  switch (name) {
    case 'order':
      return createEmbed(
        `Order #${options.id || 'Unknown'}`,
        'Here are your order details:',
        [
          { name: 'Status', value: 'In Progress', inline: true },
          { name: 'Service', value: 'ERLC Livery Pack', inline: true },
          { name: 'Designer', value: 'VisoryX Team', inline: true },
          { name: 'Progress', value: '60% Complete', inline: true },
          { name: 'Estimated Delivery', value: '2-3 days', inline: true },
        ]
      )

    case 'portfolio':
      return createEmbed(
        'VisoryX Portfolio',
        'Check out our latest work! We have completed over 2,500 projects with a 4.9/5 rating.',
        [
          { name: 'Total Projects', value: '2,500+', inline: true },
          { name: 'Client Rating', value: '4.9/5', inline: true },
          { name: 'Years Active', value: '3+', inline: true },
        ]
      )

    case 'pricing':
      return createEmbed(
        'VisoryX Pricing',
        'Transparent pricing for all services:',
        [
          { name: 'Starter ($15-$30)', value: 'Logos, simple GFX, thumbnails', inline: false },
          { name: 'Professional ($50-$100)', value: 'ERLC liveries, full branding', inline: false },
          { name: 'Enterprise ($150+)', value: 'Complete rebrands, bulk orders', inline: false },
          { name: 'Payment Methods', value: 'PayPal, Stripe, Robux, Crypto', inline: false },
        ]
      )

    case 'services':
      return createEmbed(
        'VisoryX Services',
        'Premium design services for Roblox & Discord:',
        [
          { name: 'ERLC Liveries', value: 'Custom vehicle wraps', inline: true },
          { name: 'Roblox Clothing', value: 'Shirts, pants, uniforms', inline: true },
          { name: 'Game Assets', value: 'Icons, thumbnails, UI', inline: true },
          { name: 'GFX Design', value: 'Banners, ads, art', inline: true },
          { name: 'Discord Branding', value: 'Icons, banners, emotes', inline: true },
          { name: 'Full Rebrands', value: 'Complete identity overhaul', inline: true },
        ]
      )

    case 'support':
      return createEmbed(
        'VisoryX Support',
        'We are here to help!',
        [
          { name: 'Email', value: 'support@visoryx.design', inline: true },
          { name: 'Live Chat', value: 'Available on website', inline: true },
          { name: 'Response Time', value: '< 2 hours', inline: true },
        ]
      )

    case 'quote':
      const serviceNames: Record<string, string> = {
        gfx: 'GFX Design',
        erlc: 'ERLC Livery',
        clothing: 'Roblox Clothing',
        discord: 'Discord Branding',
        logo: 'Logo Design',
        rebrand: 'Full Rebrand',
      }
      return createEmbed(
        'Quote Request Received!',
        'Our team will review and respond within 2-4 hours.',
        [
          { name: 'Service', value: serviceNames[options.service] || options.service, inline: true },
          { name: 'Description', value: options.description || 'No description provided', inline: false },
        ],
        0x10B981
      )

    case 'stats':
      return createEmbed(
        'VisoryX Statistics',
        'Real-time platform stats:',
        [
          { name: 'Orders Completed', value: '2,847', inline: true },
          { name: 'Happy Customers', value: '1,523', inline: true },
          { name: 'Average Rating', value: '4.9/5', inline: true },
          { name: 'Response Time', value: '< 2 hours', inline: true },
          { name: 'Active Designers', value: '5', inline: true },
          { name: 'Orders This Week', value: '47', inline: true },
        ]
      )

    case 'link':
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [{
            title: 'Link Your Discord Account',
            description: 'Connect your Discord to VisoryX to receive order updates via DM and unlock exclusive perks!',
            color: 0x8B5CF6,
            footer: { text: 'Your data is secure and private' },
          }],
          components: [{
            type: 1,
            components: [{
              type: 2,
              style: 5,
              label: 'Link Account',
              url: 'https://visoryx.design/api/auth/discord',
            }],
          }],
        },
      }

    default:
      return createEmbed(
        'Unknown Command',
        'Try /services, /pricing, /portfolio, /support, /stats, or /order',
        []
      )
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  
  // Always verify Discord requests
  const isValid = await verifyDiscordRequest(request, body)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid request signature' }, { status: 401 })
  }

  const interaction = JSON.parse(body)

  // Handle ping (Discord verification)
  if (interaction.type === InteractionType.PING) {
    return NextResponse.json({ type: InteractionResponseType.PONG })
  }

  // Handle slash commands
  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    const { name, options = [] } = interaction.data
    const optionsMap: Record<string, string> = {}
    for (const opt of options) {
      optionsMap[opt.name] = opt.value
    }
    
    const response = handleCommand(name, optionsMap)
    return NextResponse.json(response)
  }

  return NextResponse.json({ error: 'Unknown interaction type' }, { status: 400 })
}
