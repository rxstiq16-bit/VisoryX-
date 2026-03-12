export default function Loading() {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <div className="text-2xl font-bold text-foreground mb-6 tracking-tight">VisoryX</div>
      <div className="w-10 h-10 border-3 border-muted border-t-foreground rounded-full animate-spin" />
    </div>
  )
}
