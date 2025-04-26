import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SyllabusPreviewProps {
  syllabusData: any
}

export function SyllabusPreview({ syllabusData }: SyllabusPreviewProps) {
  // Calculate total percentage for grading policy
  const totalPercentage = Object.values(syllabusData.gradingPolicy).reduce(
    (sum: number, item: any) => sum + item.percentage,
    0,
  )

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{syllabusData.courseTitle}</h1>
        <p className="text-xl">{syllabusData.term}</p>
        <p>Instructor: {syllabusData.instructor}</p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Course Description</h2>
        <p className="whitespace-pre-line">{syllabusData.courseDescription}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Learning Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          {syllabusData.learningObjectives.map((objective: string, index: number) => (
            <li key={index}>{objective}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Required Materials</h2>
        <ul className="space-y-3">
          {syllabusData.requiredMaterials.map((material: any, index: number) => (
            <li key={index} className="flex items-start">
              <span className="font-medium mr-2">{index + 1}.</span>
              <div>
                <span className="font-medium">{material.title}</span> by {material.author}.{material.publisher},{" "}
                {material.year}.
                <span className="ml-2 text-sm font-medium">({material.required ? "Required" : "Optional"})</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Grading Policy</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(syllabusData.gradingPolicy).map(([key, value]: [string, any]) => (
              <TableRow key={key}>
                <TableCell className="font-medium">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                </TableCell>
                <TableCell>{value.description}</TableCell>
                <TableCell className="text-right">{value.percentage}%</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} className="font-bold text-right">
                Total
              </TableCell>
              <TableCell className="font-bold text-right">
                {totalPercentage}%
                {totalPercentage !== 100 && (
                  <span className="text-red-500 ml-2">
                    {totalPercentage < 100
                      ? "(Missing " + (100 - totalPercentage) + "%)"
                      : "(Exceeds by " + (totalPercentage - 100) + "%)"}
                  </span>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <section>
        <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Course Schedule</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Week</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Readings</TableHead>
              <TableHead>Assignments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {syllabusData.weeklySchedule.map((week: any) => (
              <TableRow key={week.week}>
                <TableCell>{week.week}</TableCell>
                <TableCell>{week.topic}</TableCell>
                <TableCell>{week.readings}</TableCell>
                <TableCell>{week.assignments}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section>
        <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Course Policies</h2>
        {Object.entries(syllabusData.policies).map(([key, value]: [string, string]) => (
          <div key={key} className="mb-4">
            <h3 className="text-lg font-medium mb-2">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
            </h3>
            <p className="whitespace-pre-line">{value}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
