import type { Metadata } from "next"
import ClassroomPage from "./classroom-page"

export const metadata: Metadata = {
  title: "Classroom Management | GradeGenie",
  description: "Manage your classroom, students, and co-teachers",
}

export default function Page() {
  return <ClassroomPage />
}
