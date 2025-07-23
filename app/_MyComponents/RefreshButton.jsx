'use client'
import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { useToast } from '@/hooks/use-toast'

export default function RefreshButton() {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [refreshedAt, setRefreshedAt] = useState(null)

  const handleRefresh = () => {
    toast({
      title: 'Refreshing...',
      description: 'Fetching the latest data.',
    })

    startTransition(() => {
      router.refresh()
      const now = new Date()
      setRefreshedAt(now)

      toast({
        title: 'Refresh complete',
        description: `Updated at ${now.toLocaleTimeString()}`,
      })
    })
  }

  return (
    <div className="relative w-fit">
      <Button
        size="icon"
        variant="outline"
        onClick={handleRefresh}
        className={`h-7 w-7 transition-opacity duration-200 ${
          isPending ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isPending}
      >
        <RefreshCcw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
      </Button>

      {refreshedAt && (
        <span className="absolute left-1/2 -translate-x-1/2 top-8 text-[10px] text-muted-foreground whitespace-nowrap">
          Last: {refreshedAt.toLocaleTimeString()}
        </span>
      )}
    </div>
  )
}
