'use server'

import { createClient } from '@/lib/supabase/server'

export interface Contract {
  id: string
  user_id: string
  order_id?: string
  type: 'terms' | 'nda' | 'custom' | 'freelancer'
  title: string
  content: string
  status: 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled'
  signed_at?: string
  signature_data?: string
  ip_address?: string
  expires_at?: string
  metadata?: Record<string, any>
  created_at: string
}

// Get user's contracts
export async function getUserContracts(): Promise<Contract[]> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

// Get contract by ID
export async function getContract(id: string): Promise<Contract | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) return null
  return data
}

// Create contract
export async function createContract(
  type: Contract['type'],
  title: string,
  content: string,
  orderId?: string,
  expiresAt?: string
): Promise<Contract> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('contracts')
    .insert({
      user_id: user.id,
      order_id: orderId,
      type,
      title,
      content,
      status: 'draft',
      expires_at: expiresAt
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Sign contract
export async function signContract(
  contractId: string,
  signatureData: string,
  ipAddress?: string
): Promise<Contract> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('contracts')
    .update({
      status: 'signed',
      signed_at: new Date().toISOString(),
      signature_data: signatureData,
      ip_address: ipAddress
    })
    .eq('id', contractId)
    .eq('user_id', user.id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Get pending contracts that need signing
export async function getPendingContracts(): Promise<Contract[]> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return []
  
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'sent')
    .order('created_at', { ascending: false })
  
  if (error) return []
  return data || []
}

// Generate terms of service contract
export function generateTermsContract(customerName: string, serviceName: string): string {
  return `
TERMS OF SERVICE AGREEMENT

This Terms of Service Agreement ("Agreement") is entered into between VisoryX ("Company") and ${customerName} ("Client").

1. SERVICES
The Company agrees to provide ${serviceName} services as specified in the order details.

2. PAYMENT
Payment is due upon order placement. All sales are final unless otherwise specified.

3. DELIVERABLES
- All deliverables remain property of the Client upon full payment
- Source files are included where applicable
- Revisions are provided as per the service tier purchased

4. TIMELINE
The Company will deliver the work within the specified deadline. Rush orders may be available for an additional fee.

5. USAGE RIGHTS
Upon payment, the Client receives full commercial rights to use the delivered work.

6. CONFIDENTIALITY
Both parties agree to keep all project details confidential.

7. LIMITATION OF LIABILITY
The Company's liability is limited to the amount paid for the services.

8. ACCEPTANCE
By signing this Agreement, the Client accepts these terms and conditions.

Date: ${new Date().toLocaleDateString()}
  `.trim()
}
