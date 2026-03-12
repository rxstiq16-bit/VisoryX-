"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Globe,
  FileText,
  Archive,
  Search,
  ExternalLink,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image: string | null
  author_name: string
  status: "draft" | "published" | "archived"
  tags: string[]
  published_at: string | null
  created_at: string
  updated_at: string
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export default function AdminBlogPage() {
  const supabase = createClient()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  // Editor state
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [saving, setSaving] = useState(false)

  // Form fields
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [authorName, setAuthorName] = useState("VisoryX Team")
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [tagsInput, setTagsInput] = useState("")

  const loadPosts = useCallback(async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })
    if (data) setPosts(data as BlogPost[])
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadPosts() }, [loadPosts])

  const resetForm = () => {
    setTitle("")
    setSlug("")
    setExcerpt("")
    setContent("")
    setCoverImage("")
    setAuthorName("VisoryX Team")
    setStatus("draft")
    setTagsInput("")
    setEditingPost(null)
  }

  const openNew = () => {
    resetForm()
    setEditorOpen(true)
  }

  const openEdit = (post: BlogPost) => {
    setEditingPost(post)
    setTitle(post.title)
    setSlug(post.slug)
    setExcerpt(post.excerpt || "")
    setContent(post.content)
    setCoverImage(post.cover_image || "")
    setAuthorName(post.author_name)
    setStatus(post.status === "archived" ? "draft" : post.status)
    setTagsInput((post.tags || []).join(", "))
    setEditorOpen(true)
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required")
      return
    }
    setSaving(true)
    const finalSlug = slug.trim() || slugify(title)
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    const postData = {
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt.trim() || null,
      content: content.trim(),
      cover_image: coverImage.trim() || null,
      author_name: authorName.trim(),
      status,
      tags,
      published_at: status === "published" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }

    if (editingPost) {
      const { error } = await supabase
        .from("blog_posts")
        .update(postData)
        .eq("id", editingPost.id)
      if (error) {
        toast.error("Failed to update post: " + error.message)
      } else {
        toast.success("Post updated")
      }
    } else {
      const { error } = await supabase.from("blog_posts").insert(postData)
      if (error) {
        toast.error("Failed to create post: " + error.message)
      } else {
        toast.success("Post created")
      }
    }

    setSaving(false)
    setEditorOpen(false)
    resetForm()
    loadPosts()
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id)
    if (!error) {
      toast.success("Post deleted")
      loadPosts()
    }
  }

  const handleToggleStatus = async (post: BlogPost) => {
    const newStatus = post.status === "published" ? "draft" : "published"
    await supabase
      .from("blog_posts")
      .update({
        status: newStatus,
        published_at: newStatus === "published" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", post.id)
    toast.success(newStatus === "published" ? "Post published" : "Post unpublished")
    loadPosts()
  }

  const filtered = posts.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false
    if (search) {
      const s = search.toLowerCase()
      return (
        p.title.toLowerCase().includes(s) ||
        p.slug.toLowerCase().includes(s) ||
        p.tags?.some((t) => t.toLowerCase().includes(s))
      )
    }
    return true
  })

  const statusIcon = (s: string) => {
    if (s === "published") return <Globe className="h-3 w-3" />
    if (s === "archived") return <Archive className="h-3 w-3" />
    return <FileText className="h-3 w-3" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage blog posts for SEO and content marketing.
          </p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[140px] h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Posts</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posts list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No posts found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create your first blog post to boost SEO.
            </p>
            <Button onClick={openNew} size="sm" className="mt-4 gap-2">
              <Plus className="h-3.5 w-3.5" />
              Create Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((post) => (
            <Card key={post.id} className="transition-colors hover:border-primary/20">
              <CardContent className="flex items-center gap-4 p-4">
                {post.cover_image && (
                  <img
                    src={post.cover_image}
                    alt=""
                    className="h-16 w-24 rounded-lg object-cover shrink-0 border border-border/50"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold truncate">{post.title}</h3>
                    <Badge
                      variant={post.status === "published" ? "default" : "secondary"}
                      className="text-[10px] gap-1 shrink-0"
                    >
                      {statusIcon(post.status)}
                      {post.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    /{post.slug} &middot; by {post.author_name} &middot;{" "}
                    {format(new Date(post.created_at), "MMM d, yyyy")}
                  </p>
                  {post.tags?.length > 0 && (
                    <div className="mt-1.5 flex gap-1">
                      {post.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {post.status === "published" && (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleToggleStatus(post)}
                  >
                    {post.status === "published" ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <Globe className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => openEdit(post)}
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Editor Dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Post" : "New Blog Post"}</DialogTitle>
            <DialogDescription>
              {editingPost
                ? "Update your blog post content and settings."
                : "Write a new blog post to share with your audience."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    if (!editingPost) setSlug(slugify(e.target.value))
                  }}
                  placeholder="Your post title"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated-from-title"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief description shown in listings..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Content *</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog post content here. HTML is supported."
                rows={12}
                className="font-mono text-sm"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Cover Image URL</Label>
                <Input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Author Name</Label>
                <Input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Design, Branding, Tips"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as "draft" | "published")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingPost ? "Update" : "Create"} Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
