'use server'

import { createClient } from '@/lib/supabase/server'

export interface GiftCard {
  id: string
  code: string
  initial_amount: number
  balance: number
  purchaser_id?: string
  purchaser_email?: string
  recipient_email?: string
  recipient_name?: string
  message?: string
  design_template: string
  redeemed_by?: string
  redeemed_at?: string
  expires_at?: string
  is_active: boolean
  created_at: string
}

export interface GiftCardTransaction {
  id: string
  gift_card_id: string
  amount: number
  type: 'purchase' | 'redeem' | 'refund' | 'expire'
  order_id?: string
  balance_after: number
  created_at: string
}

export async function createGiftCard(
  amount: number,
  purchaserId?: string,
  purchaserEmail?: string,
  recipientEmail?: string,
  recipientName?: string,
  message?: string,
  designTemplate: string = 'default'
): Promise<{ success: boolean; giftCard?: GiftCard; error?: string }> {
  const supabase = await createClient()
  
  // Validate amount
  if (amount < 5 || amount > 500) {
    return { success: false, error: 'Gift card amount must be between $5 and $500' }
  }
  
  // Generate unique code
  const code = generateGiftCardCode()
  
  // Set expiration (1 year from now)
  const expiresAt = new Date()
  expiresAt.setFullYear(expiresAt.getFullYear() + 1)
  
  const { data, error } = await supabase
    .from('gift_cards')
    .insert({
      code,
      initial_amount: amount,
      balance: amount,
      purchaser_id: purchaserId,
      purchaser_email: purchaserEmail,
      recipient_email: recipientEmail,
      recipient_name: recipientName,
      message,
      design_template: designTemplate,
      expires_at: expiresAt.toISOString()
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating gift card:', error)
    return { success: false, error: 'Failed to create gift card' }
  }
  
  // Record purchase transaction
  await supabase.from('gift_card_transactions').insert({
    gift_card_id: data.id,
    amount: amount,
    type: 'purchase',
    balance_after: amount
  })
  
  return { success: true, giftCard: data }
}

export async function getGiftCard(code: string): Promise<GiftCard | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('gift_cards')
    .select('*')
    .eq('code', code.toUpperCase().replace(/\s/g, ''))
    .single()
  
  if (error) {
    return null
  }
  
  return data
}

export async function validateGiftCard(code: string): Promise<{
  valid: boolean
  giftCard?: GiftCard
  error?: string
}> {
  const giftCard = await getGiftCard(code)
  
  if (!giftCard) {
    return { valid: false, error: 'Gift card not found' }
  }
  
  if (!giftCard.is_active) {
    return { valid: false, error: 'Gift card has been deactivated' }
  }
  
  if (giftCard.balance <= 0) {
    return { valid: false, error: 'Gift card has no remaining balance' }
  }
  
  if (giftCard.expires_at && new Date(giftCard.expires_at) < new Date()) {
    return { valid: false, error: 'Gift card has expired' }
  }
  
  return { valid: true, giftCard }
}

export async function redeemGiftCard(
  code: string,
  amount: number,
  userId: string,
  orderId?: string
): Promise<{
  success: boolean
  amountRedeemed?: number
  remainingBalance?: number
  error?: string
}> {
  const supabase = await createClient()
  
  const validation = await validateGiftCard(code)
  if (!validation.valid || !validation.giftCard) {
    return { success: false, error: validation.error }
  }
  
  const giftCard = validation.giftCard
  
  // Calculate amount to redeem (can't exceed balance)
  const amountToRedeem = Math.min(amount, giftCard.balance)
  const newBalance = giftCard.balance - amountToRedeem
  
  // Update gift card
  const { error: updateError } = await supabase
    .from('gift_cards')
    .update({
      balance: newBalance,
      redeemed_by: giftCard.redeemed_by || userId,
      redeemed_at: giftCard.redeemed_at || new Date().toISOString()
    })
    .eq('id', giftCard.id)
  
  if (updateError) {
    console.error('Error redeeming gift card:', updateError)
    return { success: false, error: 'Failed to redeem gift card' }
  }
  
  // Record transaction
  await supabase.from('gift_card_transactions').insert({
    gift_card_id: giftCard.id,
    amount: -amountToRedeem,
    type: 'redeem',
    order_id: orderId,
    balance_after: newBalance
  })
  
  return {
    success: true,
    amountRedeemed: amountToRedeem,
    remainingBalance: newBalance
  }
}

export async function getGiftCardBalance(code: string): Promise<number | null> {
  const giftCard = await getGiftCard(code)
  return giftCard?.balance ?? null
}

export async function getGiftCardTransactions(giftCardId: string): Promise<GiftCardTransaction[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('gift_card_transactions')
    .select('*')
    .eq('gift_card_id', giftCardId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching transactions:', error)
    return []
  }
  
  return data || []
}

export async function getUserGiftCards(userId: string): Promise<GiftCard[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('gift_cards')
    .select('*')
    .or(`purchaser_id.eq.${userId},redeemed_by.eq.${userId}`)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching user gift cards:', error)
    return []
  }
  
  return data || []
}

export async function deactivateGiftCard(giftCardId: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('gift_cards')
    .update({ is_active: false })
    .eq('id', giftCardId)
  
  if (error) {
    console.error('Error deactivating gift card:', error)
    return false
  }
  
  return true
}

export async function refundGiftCard(
  giftCardId: string,
  amount: number
): Promise<boolean> {
  const supabase = await createClient()
  
  // Get current balance
  const { data: giftCard } = await supabase
    .from('gift_cards')
    .select('balance, initial_amount')
    .eq('id', giftCardId)
    .single()
  
  if (!giftCard) return false
  
  // Can't refund more than was redeemed
  const maxRefund = giftCard.initial_amount - giftCard.balance
  const refundAmount = Math.min(amount, maxRefund)
  
  if (refundAmount <= 0) return false
  
  const newBalance = giftCard.balance + refundAmount
  
  const { error } = await supabase
    .from('gift_cards')
    .update({ balance: newBalance })
    .eq('id', giftCardId)
  
  if (error) {
    console.error('Error refunding gift card:', error)
    return false
  }
  
  // Record refund transaction
  await supabase.from('gift_card_transactions').insert({
    gift_card_id: giftCardId,
    amount: refundAmount,
    type: 'refund',
    balance_after: newBalance
  })
  
  return true
}

function generateGiftCardCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) code += '-'
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export const GIFT_CARD_DESIGNS = [
  { id: 'default', name: 'Classic', preview: '/images/gift-cards/classic.png' },
  { id: 'birthday', name: 'Birthday', preview: '/images/gift-cards/birthday.png' },
  { id: 'holiday', name: 'Holiday', preview: '/images/gift-cards/holiday.png' },
  { id: 'thankyou', name: 'Thank You', preview: '/images/gift-cards/thankyou.png' },
  { id: 'gaming', name: 'Gaming', preview: '/images/gift-cards/gaming.png' },
  { id: 'minimal', name: 'Minimal', preview: '/images/gift-cards/minimal.png' }
]

export const GIFT_CARD_AMOUNTS = [10, 25, 50, 75, 100, 150, 200, 250, 500]
