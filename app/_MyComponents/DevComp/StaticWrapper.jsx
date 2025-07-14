import { Children, Suspense } from "react"
import { Content } from "vaul"

function StaticWrapper({children}) {
   return (
     <Suspense fallback="Loading...">
                {children}
      </Suspense>
   )
}

export default StaticWrapper
