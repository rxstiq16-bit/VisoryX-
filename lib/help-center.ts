'use server'

import { createClient } from '@/lib/supabase/server'

export interface HelpCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  sort_order: number
  is_active: boolean
  article_count?: number
}

export interface HelpArticle {
  id: string
  category_id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  tags: string[]
  views: number
  helpful_yes: number
  helpful_no: number
  is_featured: boolean
  is_active: boolean
  author_id?: string
  created_at: string
  updated_at: string
  category?: HelpCategory
}

export const DEFAULT_CATEGORIES: Omit<HelpCategory, 'id'>[] = [
  {
    name: 'Getting Started',
    slug: 'getting-started',
    description: 'Learn the basics of using VisoryX',
    icon: 'rocket',
    sort_order: 1,
    is_active: true
  },
  {
    name: 'Placing Orders',
    slug: 'placing-orders',
    description: 'How to order design services',
    icon: 'shopping-cart',
    sort_order: 2,
    is_active: true
  },
  {
    name: 'Payments & Billing',
    slug: 'payments-billing',
    description: 'Payment methods, invoices, and refunds',
    icon: 'credit-card',
    sort_order: 3,
    is_active: true
  },
  {
    name: 'Revisions & Feedback',
    slug: 'revisions-feedback',
    description: 'How to request changes to your designs',
    icon: 'refresh-cw',
    sort_order: 4,
    is_active: true
  },
  {
    name: 'Account & Profile',
    slug: 'account-profile',
    description: 'Managing your VisoryX account',
    icon: 'user',
    sort_order: 5,
    is_active: true
  },
  {
    name: 'Loyalty & Rewards',
    slug: 'loyalty-rewards',
    description: 'Earn points and unlock benefits',
    icon: 'gift',
    sort_order: 6,
    is_active: true
  },
  {
    name: 'Integrations',
    slug: 'integrations',
    description: 'Connect Discord, Roblox, and more',
    icon: 'link',
    sort_order: 7,
    is_active: true
  },
  {
    name: 'Troubleshooting',
    slug: 'troubleshooting',
    description: 'Common issues and solutions',
    icon: 'help-circle',
    sort_order: 8,
    is_active: true
  }
]

export async function getHelpCategories(): Promise<HelpCategory[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('help_categories')
    .select(`
      *,
      articles:help_articles(count)
    `)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  
  if (error || !data) {
    // Return default categories with mock counts
    return DEFAULT_CATEGORIES.map((cat, i) => ({
      ...cat,
      id: `default-${i}`,
      article_count: Math.floor(Math.random() * 10) + 3
    }))
  }
  
  return data.map(cat => ({
    ...cat,
    article_count: cat.articles?.[0]?.count || 0
  }))
}

export async function getHelpCategory(slug: string): Promise<HelpCategory | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('help_categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  
  if (error) {
    // Check default categories
    const defaultCat = DEFAULT_CATEGORIES.find(c => c.slug === slug)
    if (defaultCat) {
      return { ...defaultCat, id: `default-${slug}` }
    }
    return null
  }
  
  return data
}

export async function getHelpArticles(
  categorySlug?: string,
  limit: number = 50
): Promise<HelpArticle[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('help_articles')
    .select(`
      *,
      category:help_categories(*)
    `)
    .eq('is_active', true)
    .order('views', { ascending: false })
    .limit(limit)
  
  if (categorySlug) {
    query = query.eq('category.slug', categorySlug)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching help articles:', error)
    return []
  }
  
  return data || []
}

export async function getHelpArticle(slug: string): Promise<HelpArticle | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('help_articles')
    .select(`
      *,
      category:help_categories(*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  
  if (error) {
    return null
  }
  
  // Increment view count
  await supabase
    .from('help_articles')
    .update({ views: (data.views || 0) + 1 })
    .eq('id', data.id)
  
  return data
}

export async function getFeaturedArticles(limit: number = 6): Promise<HelpArticle[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('help_articles')
    .select(`
      *,
      category:help_categories(*)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('views', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching featured articles:', error)
    return []
  }
  
  return data || []
}

export async function searchHelpArticles(query: string): Promise<HelpArticle[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('help_articles')
    .select(`
      *,
      category:help_categories(*)
    `)
    .eq('is_active', true)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .order('views', { ascending: false })
    .limit(20)
  
  if (error) {
    console.error('Error searching help articles:', error)
    return []
  }
  
  return data || []
}

export async function rateArticle(
  articleId: string,
  helpful: boolean
): Promise<boolean> {
  const supabase = await createClient()
  
  const field = helpful ? 'helpful_yes' : 'helpful_no'
  
  const { error } = await supabase.rpc('increment_help_rating', {
    article_id: articleId,
    is_helpful: helpful
  })
  
  if (error) {
    // Fallback: get current value and increment
    const { data: article } = await supabase
      .from('help_articles')
      .select(field)
      .eq('id', articleId)
      .single()
    
    if (article) {
      await supabase
        .from('help_articles')
        .update({ [field]: (article[field] || 0) + 1 })
        .eq('id', articleId)
    }
  }
  
  return true
}

export async function getRelatedArticles(
  articleId: string,
  categoryId: string,
  tags: string[],
  limit: number = 3
): Promise<HelpArticle[]> {
  const supabase = await createClient()
  
  // First try to find articles with matching tags
  let { data, error } = await supabase
    .from('help_articles')
    .select('*')
    .eq('is_active', true)
    .neq('id', articleId)
    .overlaps('tags', tags)
    .limit(limit)
  
  if (!data || data.length < limit) {
    // Fall back to same category
    const { data: categoryArticles } = await supabase
      .from('help_articles')
      .select('*')
      .eq('is_active', true)
      .eq('category_id', categoryId)
      .neq('id', articleId)
      .order('views', { ascending: false })
      .limit(limit - (data?.length || 0))
    
    data = [...(data || []), ...(categoryArticles || [])]
  }
  
  return data || []
}

export async function getPopularArticles(limit: number = 5): Promise<HelpArticle[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('help_articles')
    .select(`
      *,
      category:help_categories(*)
    `)
    .eq('is_active', true)
    .order('views', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching popular articles:', error)
    return []
  }
  
  return data || []
}
