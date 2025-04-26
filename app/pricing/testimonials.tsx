import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export function Testimonials() {
  return (
    <div className="mt-16">
      <h2 className="text-center text-2xl font-bold mb-8">What Educators Are Saying</h2>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-muted">
                  <Image
                    src="/placeholder.svg?height=48&width=48"
                    alt="Hannah"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Hannah</p>
                  <p className="text-xs text-muted-foreground">School Teacher</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                "GradeGenie saved me weeks of work. My students appreciate the fast turnaround, and I love how quick,
                easy, and accurate it is."
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-muted">
                  <Image
                    src="/placeholder.svg?height=48&width=48"
                    alt="Dane"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Dane</p>
                  <p className="text-xs text-muted-foreground">University Professor</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                "Finding and managing TAs used to be a nightmare. With GradeGenie, I have a reliable, consistent grading
                assistant, freeing up my time for research."
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-muted">
                  <Image
                    src="/placeholder.svg?height=48&width=48"
                    alt="Doras"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Doras</p>
                  <p className="text-xs text-muted-foreground">Tutor</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                "The feedback it provides is much more detailed than I have time to give, and I can still add my
                comments and adjust grades. I can't imagine going back to the old way!"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
