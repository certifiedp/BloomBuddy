import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <section className="container flex min-h-screen flex-col items-center px-4 text-center">
      <div className="max-w-3xl">
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tighter md:text-6xl">
          Bloom Buddy
        </h1>
        <p className="mb-8 text-xl text-muted-foreground">
          Meet your new best friend!
        </p>
        <p className="mb-12 text-lg text-muted-foreground">
          Give your green friends the power of communication through the magic
          of AI
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    </section>
  )
}
