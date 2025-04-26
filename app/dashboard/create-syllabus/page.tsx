"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Loader2, Save, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CreateSyllabusPage() {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [syllabus, setSyllabus] = useState("")

  const handleGenerateSyllabus = () => {
    setIsGenerating(true)

    // Simulate AI generating syllabus
    setTimeout(() => {
      setSyllabus(`# Introduction to Psychology (PSY 101)
## Spring 2025

**Instructor:** Dr. Jane Smith
**Email:** j.smith@university.edu
**Office Hours:** Monday & Wednesday, 2:00-4:00 PM
**Location:** Science Building, Room 301

## Course Description
This course provides a comprehensive introduction to the scientific study of behavior and mental processes. Students will explore the major theories, concepts, and research methods in psychology, including biological bases of behavior, sensation and perception, learning, memory, cognition, development, personality, social psychology, and psychological disorders.

## Learning Objectives
By the end of this course, students will be able to:
1. Describe key concepts, principles, and overarching themes in psychology
2. Develop a working knowledge of psychology's content domains
3. Apply critical thinking skills to evaluate psychological research
4. Apply psychological concepts to real-world situations
5. Demonstrate effective written and oral communication skills

## Required Materials
- Myers, D. G., & DeWall, C. N. (2024). Psychology (14th ed.). Worth Publishers.
- Additional readings will be provided on the course website

## Course Schedule

### Week 1-2: Introduction to Psychology & Research Methods
- History of psychology
- Major theoretical perspectives
- Research methods and ethics

### Week 3-4: Biological Bases of Behavior
- Neural structure and function
- Neuroanatomy and the nervous system
- Genetics and evolutionary psychology

### Week 5-6: Sensation, Perception, and Consciousness
- Sensory processes
- Perceptual organization
- States of consciousness

### Week 7-8: Learning and Memory
- Classical and operant conditioning
- Observational learning
- Memory processes and biases

### Week 9-10: Cognition, Language, and Intelligence
- Problem-solving and decision-making
- Language acquisition and structure
- Theories of intelligence

### Week 11-12: Development and Personality
- Physical, cognitive, and social development
- Major personality theories
- Assessment of personality

### Week 13-14: Social Psychology and Psychological Disorders
- Social influence and group behavior
- Classification and diagnosis of disorders
- Major categories of psychological disorders

### Week 15: Treatment of Psychological Disorders & Conclusion
- Therapeutic approaches
- Course review and synthesis

## Assignments and Grading
- Midterm Exam: 25%
- Final Exam: 30%
- Research Paper: 20%
- Weekly Quizzes: 15%
- Class Participation: 10%

## Course Policies
- **Attendance:** Regular attendance is expected. More than three unexcused absences will result in a grade reduction.
- **Late Assignments:** Assignments submitted late will be penalized 10% per day.
- **Academic Integrity:** Plagiarism and cheating will not be tolerated and may result in course failure.
- **Accommodations:** Students requiring accommodations should contact the instructor within the first week of class.

## University Resources
- **Counseling Center:** Science Building, Room 200
- **Writing Center:** Library, Room 100
- **Disability Services:** Administration Building, Room 150`)

      setIsGenerating(false)

      toast({
        title: "Syllabus Generated",
        description: "AI-generated syllabus is ready for review",
      })
    }, 3000)
  }

  const handleDownloadPDF = () => {
    setIsDownloading(true)

    // Simulate PDF download
    setTimeout(() => {
      setIsDownloading(false)

      toast({
        title: "PDF Downloaded",
        description: "Your syllabus has been downloaded as a PDF",
      })

      // In a real app, this would trigger a PDF download
    }, 2000)
  }

  const handleSaveSyllabus = () => {
    setIsSaving(true)

    // Simulate saving syllabus
    setTimeout(() => {
      setIsSaving(false)

      toast({
        title: "Syllabus Saved",
        description: "Your syllabus has been saved successfully",
      })

      // In a real app, this would save to a database and redirect
    }, 2000)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 font-sans">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary-dark">Create Syllabus</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-primary/10">
          <CardHeader className="bg-secondary/50 rounded-t-lg">
            <CardTitle className="text-primary-dark">Course Information</CardTitle>
            <CardDescription>Enter details about your course to generate a syllabus</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="course-title" className="text-sm font-medium">
                Course Title
              </Label>
              <Input
                id="course-title"
                placeholder="Introduction to Psychology"
                className="border-primary/20 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-code" className="text-sm font-medium">
                Course Code
              </Label>
              <Input id="course-code" placeholder="PSY 101" className="border-primary/20 focus-visible:ring-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester" className="text-sm font-medium">
                Semester
              </Label>
              <Select defaultValue="spring">
                <SelectTrigger className="border-primary/20 focus-visible:ring-primary">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spring">Spring 2025</SelectItem>
                  <SelectItem value="summer">Summer 2025</SelectItem>
                  <SelectItem value="fall">Fall 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Course Description
              </Label>
              <Textarea
                id="description"
                placeholder="Brief description of the course content and objectives"
                rows={4}
                className="border-primary/20 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topics" className="text-sm font-medium">
                Key Topics
              </Label>
              <Textarea
                id="topics"
                placeholder="List major topics to be covered in the course"
                rows={4}
                className="border-primary/20 focus-visible:ring-primary"
              />
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/30 rounded-b-lg">
            <Button
              className="w-full bg-primary hover:bg-primary-dark text-white"
              onClick={handleGenerateSyllabus}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Syllabus...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Syllabus
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        {syllabus ? (
          <Card className="border-primary/10">
            <CardHeader className="bg-secondary/50 rounded-t-lg">
              <CardTitle className="text-primary-dark">Generated Syllabus</CardTitle>
              <CardDescription>Review and edit the AI-generated syllabus</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Textarea
                value={syllabus}
                onChange={(e) => setSyllabus(e.target.value)}
                className="min-h-[500px] font-mono border-primary/20 focus-visible:ring-primary"
              />
            </CardContent>
            <CardFooter className="flex justify-between bg-secondary/30 rounded-b-lg">
              <Button
                variant="outline"
                className="border-primary/20 text-primary hover:bg-primary/10 hover:text-primary-dark"
                onClick={handleDownloadPDF}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
              <Button
                className="bg-primary hover:bg-primary-dark text-white"
                onClick={handleSaveSyllabus}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Syllabus
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="flex items-center justify-center border-primary/10 bg-secondary/20">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-medium text-primary-dark">AI Syllabus Generator</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Fill in the course information and click "Generate Syllabus" to create a comprehensive course syllabus
                using AI.
              </p>
              <p className="text-sm text-muted-foreground mt-4">The generated syllabus will include:</p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 text-left list-disc pl-5">
                <li>Course description and objectives</li>
                <li>Weekly schedule with topics</li>
                <li>Assignment details and grading criteria</li>
                <li>Course policies and resources</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
