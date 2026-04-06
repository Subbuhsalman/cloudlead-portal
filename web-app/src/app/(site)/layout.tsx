

import { Header } from "@/modules/landing/header";





export default function SitesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <><Header />{children}</>
  )
}