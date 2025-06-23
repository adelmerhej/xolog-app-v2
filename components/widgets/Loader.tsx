import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

export default function LoadingAnimation() {
  return (
    <div className="spinner">
      <span className="ball-1"></span>
      <span className="ball-2"></span>
      <span className="ball-3"></span>
      <span className="ball-4"></span>
      <span className="ball-5"></span>
      <span className="ball-6"></span>
      <span className="ball-7"></span>
      <span className="ball-8"></span>
    </div>
  )
}

export function Loadingbutton({ btnText, btnClass, btnVariant }: { btnText: string; btnClass?: string; btnVariant?: string }) {

  return (
    <Button className={cn("cursor-none", btnClass)} 
      variant={btnVariant as "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined}>
      {btnText} &nbsp;
      <LoadingAnimation />
    </Button>
  )
}
