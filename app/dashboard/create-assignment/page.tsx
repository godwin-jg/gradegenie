"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Download,
  Loader2,
  Save,
  Mail,
  Edit,
  Copy,
  Check,
  FileText,
  ListChecks,
  MessageSquare,
  FileQuestion,
  Presentation,
  Users,
  ArrowRight,
  ChevronRight,
  AlertCircle, // Import for error indication
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { PDFPreviewDialog } from "@/components/pdf-preview-dialog"
import { EmailPreviewDialog } from "@/components/email-preview-dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const ASSIGNMENT_TYPES = {
  ESSAY: "essay",
  RESEARCH_PAPER: "research_paper",
  MULTIPLE_CHOICE: "multiple_choice",
  SHORT_ANSWER: "short_answer",
  PRESENTATION: "presentation",
  GROUP_PROJECT: "group_project",
  DISCUSSION: "discussion",
  LAB_REPORT: "lab_report",
  PORTFOLIO: "portfolio",
  CASE_STUDY: "case_study",
}

const ASSIGNMENT_TYPE_INFO = {
  [ASSIGNMENT_TYPES.ESSAY]: {
    title: "Essay",
    description: "A written composition on a particular subject",
    icon: FileText,
    outputs: ["instructions", "rubric"],
  },
  [ASSIGNMENT_TYPES.RESEARCH_PAPER]: {
    title: "Research Paper",
    description: "An in-depth analysis requiring research and citations",
    icon: FileText,
    outputs: ["instructions", "rubric"],
  },
  [ASSIGNMENT_TYPES.MULTIPLE_CHOICE]: {
    title: "Multiple Choice Quiz",
    description: "Questions with several possible answers to choose from",
    icon: FileQuestion,
    outputs: ["questions", "answer_key"],
  },
  [ASSIGNMENT_TYPES.SHORT_ANSWER]: {
    title: "Short Answer Test",
    description: "Questions requiring brief written responses",
    icon: FileQuestion,
    outputs: ["questions", "answer_key", "rubric"],
  },
  [ASSIGNMENT_TYPES.PRESENTATION]: {
    title: "Presentation",
    description: "Oral delivery of information or a project",
    icon: Presentation,
    outputs: ["instructions", "rubric"],
  },
  [ASSIGNMENT_TYPES.GROUP_PROJECT]: {
    title: "Group Project",
    description: "Collaborative work among multiple students",
    icon: Users,
    outputs: ["instructions", "rubric", "peer_evaluation"],
  },
  [ASSIGNMENT_TYPES.DISCUSSION]: {
    title: "Discussion",
    description: "Guided conversation on a specific topic",
    icon: MessageSquare,
    outputs: ["instructions", "participation_criteria"],
  },
  [ASSIGNMENT_TYPES.LAB_REPORT]: {
    title: "Lab Report",
    description: "Documentation of an experiment or investigation",
    icon: ListChecks,
    outputs: ["instructions", "rubric", "checklist"],
  },
  [ASSIGNMENT_TYPES.PORTFOLIO]: {
    title: "Portfolio",
    description: "Collection of work demonstrating skills and growth",
    icon: FileText,
    outputs: ["instructions", "rubric"],
  },
  [ASSIGNMENT_TYPES.CASE_STUDY]: {
    title: "Case Study",
    description: "Analysis of a specific instance or scenario",
    icon: FileText,
    outputs: ["instructions", "rubric"],
  },
}

type GeneratedContentType = {
  instructions?: string
  rubric?: string
  questions?: string
  answer_key?: string
  checklist?: string
  participation_criteria?: string
  peer_evaluation?: string
}

export default function CreateAssignmentPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState<"type" | "details" | "generate">("type")

  const [selectedType, setSelectedType] = useState<string>("")

  const [assignmentTitle, setAssignmentTitle] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [description, setDescription] = useState("")
  const [learningObjectives, setLearningObjectives] = useState("")
  const [quizSettings, setQuizSettings] = useState({
    numQuestions: 10,
    timeLimit: 60,
    randomize: false,
    showAnswers: false,
  })
  const [groupSettings, setGroupSettings] = useState({
    groupSize: 2,
    randomizeGroups: false,
    groupFormation: "instructor", // Options: "instructor", "student", "random"
    peerEvaluation: false, // Whether to include peer evaluation
  })


  const [selectedGroupSize, setSelectedGroupSize] = useState("")

  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [publishToLMS, setPublishToLMS] = useState<string[]>([])
  const [connectedLMS, setConnectedLMS] = useState<string[]>(["Canvas"]) // Example

  const [generatedContent, setGeneratedContent] = useState<GeneratedContentType>({})

  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false)
  const [emailPreviewOpen, setEmailPreviewOpen] = useState(false)

  const [copied, setCopied] = useState<string | null>(null)

  // Handle query params for quick creation (Keep as is)
  useEffect(() => {
    const type = searchParams.get("type")
    const topic = searchParams.get("topic")

    if (type && Object.values(ASSIGNMENT_TYPES).includes(type)) {
      setSelectedType(type)
      setCurrentStep("details")
    }

    if (topic) {
      // Pre-fill description if topic is provided
      setDescription(`Create an assignment about: ${topic}`)
    }
  }, [searchParams])

  const handleTypeSelection = () => {
    if (!selectedType) {
      toast({
        title: "Please select an assignment type",
        description: "You must select an assignment type to continue",
        variant: "destructive",
      })
      return
    }
    setCurrentStep("details")
  }

  const handleDetailsSubmission = () => {
    // Basic validation
    if (!assignmentTitle || !selectedCourse || !description) {
         toast({
           title: "Missing Information",
           description: "Please fill in Title, Course, and Description.",
           variant: "destructive",
         })
         return
    }

    setCurrentStep("generate")
    handleGenerateContent() // Auto-generate content after details submission
  }

  const handleGenerateContent = async () => {
    if (!selectedType || !assignmentTitle || !selectedCourse || !description) {
        toast({ title: "Cannot Generate", description: "Missing assignment details.", variant: "destructive" })
        setCurrentStep("details") // Go back if details missing
        return;
    }

    setIsGenerating(true)
    setGeneratedContent({}) // Clear previous content

    const typeInfo = ASSIGNMENT_TYPE_INFO[selectedType]
    const outputs = typeInfo?.outputs || []
    const typeTitle = typeInfo?.title || "Assignment"

    const newContent: GeneratedContentType = {}
    let generationSuccessful = true;

    const createBasePromptContext = () => {
        let context = `Assignment Type: ${typeTitle}\n`;
        context += `Title: ${assignmentTitle}\n`;
        context += `Course: ${selectedCourse}\n`;
        context += `Description: ${description}\n`;
        if (learningObjectives) {
            context += `Learning Objectives:\n${learningObjectives}\n`;
        }
        if (dueDate) {
            context += `Due Date: ${dueDate}\n`;
        }
        // Add type-specific details if needed (e.g., number of questions for multiple choice)
        // You might need to add state variables for these details in renderDetailsForm if you want the AI to use them
        if (selectedType === ASSIGNMENT_TYPES.MULTIPLE_CHOICE) {
            const numQuestions = quizSettings.numQuestions || 10; // Default to 10 if not set
            context += `Number of Questions desired: ${numQuestions}\n`;
        }
        return context;
    }

    const baseContext = createBasePromptContext();

    console.log("Starting generation for outputs:", outputs);
    console.log("Base Context for Prompts:", baseContext);

    for (const output of outputs) {
      let prompt = ""
      let specificInstruction = ""

      // --- Create specific prompts for each output type ---
      switch (output) {
        case "instructions":
          specificInstruction = `Generate detailed assignment instructions based on the provided context. Include sections like Overview, Requirements, Components (if applicable, tailor to the assignment type), and Submission Guidelines. Ensure the tone is appropriate for ${selectedCourse}. Focus *only* on generating the instructions document.`
          break
        case "rubric":
          specificInstruction = `Generate a grading rubric based on the provided context. The rubric should evaluate key aspects relevant to a ${typeTitle}, such as Content/Understanding, Organization/Structure, Evidence/Support (if applicable), and Clarity/Mechanics. Use clear criteria for different performance levels (e.g., Excellent, Good, Satisfactory, Needs Improvement). Format it clearly, perhaps using Markdown tables. Focus *only* on generating the rubric.`
          break
        case "questions":
          specificInstruction = `Generate relevant ${selectedType === ASSIGNMENT_TYPES.MULTIPLE_CHOICE ? 'multiple choice' : 'short answer'} questions based on the provided context (description, learning objectives). Ensure questions align with the topic and course level. For multiple choice, provide 4 options (a, b, c, d) with one correct answer. For short answer, create clear, concise questions. Focus *only* on generating the questions.`
          specificInstruction += ` Include ${quizSettings.numQuestions} questions.`
          break
        case "answer_key":
          specificInstruction = `Generate an answer key for the ${selectedType === ASSIGNMENT_TYPES.MULTIPLE_CHOICE ? 'multiple choice' : 'short answer'} questions you would typically create for the provided context. For multiple choice, list the correct option (e.g., '1. b'). For short answer, provide ideal/model answers or key points expected. Include brief explanations where helpful. Focus *only* on generating the answer key.`
          break
        case "checklist":
            specificInstruction = `Generate a checklist for students completing a ${typeTitle} based on the provided context. Include items related to Format/Structure, Content Quality, Technical Requirements, and any specific steps needed for this assignment type (e.g., lab safety for Lab Report). Focus *only* on generating the checklist.`
            break
        case "participation_criteria":
            specificInstruction = `Generate participation criteria/rubric for a ${typeTitle} activity based on the provided context. Include criteria like Quantity of Participation, Quality of Contributions, Engagement with Peers, and Discussion Etiquette. Define different performance levels. Focus *only* on generating the participation criteria.`
            break
        case "peer_evaluation":
            specificInstruction = `Generate a peer evaluation form for a group project based on the provided context. Include criteria like Contribution to Project, Reliability, Quality of Work, Collaboration, and Communication. Use a rating scale (e.g., 1-5) and provide space for comments and overall contribution percentage. Focus *only* on generating the peer evaluation form.`
            break
        default:
            console.warn(`Unsupported output type for generation: ${output}`);
            continue; // Skip unsupported types
      }

      prompt = `Context:\n${baseContext}\nInstruction:\n${specificInstruction}`;
      console.log(`--- Generating [${output}] --- \nPrompt: ${prompt.substring(0, 300)}...`); // Log truncated prompt

      try {
          const apiResponse = await generateContentFromAPI(prompt);
          if (apiResponse && !apiResponse.startsWith("Content generation failed.")) {
                newContent[output as keyof GeneratedContentType] = apiResponse;
                console.log(`--- Successfully generated [${output}] ---`);
          } else {
               throw new Error(`API returned failure message for ${output}.`);
          }
      } catch (error) {
            console.error(`Error generating content for [${output}]:`, error);
            newContent[output as keyof GeneratedContentType] = `--- Error generating ${output.replace("_", " ")} ---`; // Indicate failure in UI
            generationSuccessful = false; // Mark that at least one part failed
            toast({
                title: `Error Generating ${output.replace("_", " ")}`,
                description: `Failed to generate ${output.replace("_", " ")}. Please review details or try again later.`,
                variant: "destructive",
            });
      }
    } // End of loop

    setGeneratedContent(newContent)
    setIsGenerating(false)

    if (generationSuccessful) {
        toast({
            title: "Content Generation Complete",
            description: "Your assignment content has been generated.",
        });
    } else {
         toast({
            title: "Content Generation Partially Failed",
            description: "Some parts of the assignment could not be generated. Please review.",
            variant: "warning", // Use a warning variant
         });
    }
  }

  // --- Helper function to call your backend API (Keep as is, ensure URL is correct) ---
  const generateContentFromAPI = async (input: string): Promise<string> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      console.log(`Calling API: ${apiUrl}/assignment/generate`);
      const response = await fetch(`${apiUrl}/assignment/generate`, { // Use environment variable for base URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input, // Ensure your API expects the key 'prompt'
        }),
      });

      const data = await response.json();

      if (response.ok && data.content) { // Ensure API returns { content: "..." } on success
        console.log("API Success:", data.content.substring(0,100) + "..."); // Log snippet of response
        return data.content;
      } else {
        // Log the actual error from the API if available
        const errorMsg = data.error || `API request failed with status ${response.status}`;
        console.error("API Error Response:", data);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("Error calling generation API:", error);
      // Return a specific error message string instead of throwing
      return `Content generation failed. ${error instanceof Error ? error.message : String(error)}`;
    }
  };


  // --- *** DELETED local generation functions *** ---
  // const generateInstructions = () => { ... } // REMOVED
  // const generateRubric = () => { ... }       // REMOVED
  // const generateQuestions = () => { ... }    // REMOVED
  // const generateAnswerKey = () => { ... }    // REMOVED
  // const generateChecklist = () => { ... }    // REMOVED
  // const generateParticipationCriteria = () => { ... } // REMOVED
  // const generatePeerEvaluation = () => { ... } // REMOVED

  const handleSaveAssignment = async () => {
    setIsSaving(true);

    // 1. Prepare the data payload to send to the backend
    const assignmentData = {
      type: selectedType,
      title: assignmentTitle,
      course: selectedCourse,
      dueDate: dueDate || null, // Send null if empty, or handle on backend
      description: description,
      learningObjectives: learningObjectives || null, // Send null if empty
      content: generatedContent, // Send the whole object with generated parts
      lmsIntegration: publishToLMS, // Save which LMS platforms were selected
      // Add any other relevant fields (e.g., specific quiz/group settings if saved in state)
      quizSettings: selectedType === ASSIGNMENT_TYPES.MULTIPLE_CHOICE ? quizSettings : undefined, // Include quiz settings only for quizzes
      groupSettings: selectedType === ASSIGNMENT_TYPES.GROUP_PROJECT ? groupSettings : undefined, // Include group settings only for group projects
      userId: localStorage.getItem('userId') || 'USER_ID_FROM_AUTH', // Retrieve userId from localStorage or use a placeholder
    };

    // Basic validation before sending (optional, but good practice)
    if (!assignmentData.type || !assignmentData.title || !assignmentData.course) {
        toast({
            title: "Cannot Save",
            description: "Missing essential information (Type, Title, Course).",
            variant: "destructive",
        });
        setIsSaving(false);
        return;
    }

    console.log("Attempting to save assignment:", assignmentData);

    try {
      // *** IMPORTANT: Replace with your actual auth token retrieval logic ***
      // Example: const authToken = localStorage.getItem('authToken');
      const authToken = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'; 
      const response = await fetch(`${apiUrl}/assignment`, { // Ensure URL and port are correct
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include Authorization header if your API requires it
           ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        },
        body: JSON.stringify(assignmentData),
      });

      if (response.ok) {
        const savedAssignment = await response.json(); // Optional: get the saved data back
        console.log("Assignment saved successfully:", savedAssignment);
        toast({
          title: "Assignment Saved",
          description: `"${assignmentTitle}" has been saved successfully.`,
        });
        // Redirect to the assignments list page after successful save
        router.push("/dashboard/assignments"); // Adjust this route if needed
      } else {
        // Handle API errors (e.g., validation errors, server errors)
        const errorData = await response.json();
        console.error("Failed to save assignment:", response.status, errorData);
        toast({
          title: "Save Failed",
          description: errorData.message || `Server responded with ${response.status}. Please try again.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      // Handle network errors or other unexpected issues
      console.error("Error saving assignment:", error);
      toast({
        title: "Network Error",
        description: `Could not connect to the server. ${error instanceof Error ? error.message : ''}`,
        variant: "destructive",
      });
    } finally {
      // Ensure loading state is turned off regardless of success or failure
      setIsSaving(false);
    }
  };

  // Handle copying content to clipboard (Keep as is)
  const handleCopyToClipboard = (text: string | undefined, type: string) => {
    if (!text) {
        toast({ title: "Nothing to Copy", description: `${type} content is empty.`, variant: "destructive"});
        return;
    }
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
    toast({
      title: "Copied to clipboard",
      description: `${type} has been copied to your clipboard.`,
    })
  }

  // Render the assignment type selection step (Keep as is)
  const renderTypeSelection = () => {
    // ... (JSX remains the same)
     return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create New Assessment</h1>
          <p className="text-muted-foreground">Select the type of assessment you want to create</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(ASSIGNMENT_TYPE_INFO).map(([type, info]) => {
            const Icon = info.icon
            return (
              <Card
                key={type}
                className={`cursor-pointer transition-all hover:border-primary hover:shadow-md ${selectedType === type ? "border-primary bg-primary/5" : ""}`}
                onClick={() => setSelectedType(type)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{info.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {info.outputs.map((output) => (
                      <Badge key={output} variant="outline" className="text-xs capitalize"> {/* Added capitalize */}
                        {output.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleTypeSelection} disabled={!selectedType}>
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  // Render the assignment details step (Keep as is, maybe add more fields if needed for prompts)
  const renderDetailsForm = () => {
    // ... (JSX remains the same, ensure IDs match if needed for prompt context)
    const typeInfo = ASSIGNMENT_TYPE_INFO[selectedType]

    return (
      <div className="space-y-6">
        {/* Back Button and Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm">
           <Button variant="ghost" onClick={() => setCurrentStep("type")} className="p-0 h-auto text-muted-foreground hover:text-primary">
             <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
             Select Type
           </Button>
           <ChevronRight className="h-4 w-4 text-muted-foreground" />
           <span className="font-medium text-primary">{typeInfo?.title || "Assignment"} Details</span>
         </div>

        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold">Enter Details</h1>
          <p className="text-muted-foreground">
            Provide the specifics for your {typeInfo?.title.toLowerCase() || "assignment"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
             <CardDescription>
                These details will guide the AI content generation.
             </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="assignment-title">Title *</Label>
              <Input
                id="assignment-title"
                placeholder={`E.g., Midterm ${typeInfo?.title || "Assignment"}, Unit 5 Project`}
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                required
              />
            </div>

             {/* Course */}
            <div className="space-y-2">
              <Label htmlFor="course">Course *</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse} required>
                <SelectTrigger id="course">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {/* Add more realistic course examples or fetch from API */}
                  <SelectItem value="Introduction to Biology (BIO 101)">Introduction to Biology (BIO 101)</SelectItem>
                  <SelectItem value="American History (HIST 210)">American History (HIST 210)</SelectItem>
                  <SelectItem value="Calculus I (MATH 150)">Calculus I (MATH 150)</SelectItem>
                  <SelectItem value="Principles of Marketing (MKTG 300)">Principles of Marketing (MKTG 300)</SelectItem>
                   <SelectItem value="Introduction to Psychology (PSY 101)">Introduction to Psychology (PSY 101)</SelectItem>
                   <SelectItem value="Environmental Science (ENV 201)">Environmental Science (ENV 201)</SelectItem>
                   <SelectItem value="Creative Writing (ENG 215)">Creative Writing (ENG 215)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>

             {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description / Topic *</Label>
              <Textarea
                id="description"
                placeholder={`Briefly describe the assignment topic, task, or prompt for the students. This heavily influences the AI generation.\nE.g., "Analyze the causes of the American Civil War.", "Write a report on the Krebs cycle.", "Develop a marketing plan for a new sustainable product."`}
                rows={4} // Increased rows
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

             {/* Learning Objectives */}
            <div className="space-y-2">
              <Label htmlFor="learning-objectives">Learning Objectives</Label>
              <Textarea
                id="learning-objectives"
                placeholder="Optional: List key skills or knowledge students should demonstrate (one per line).\n- Understand the process of cellular respiration.\n- Analyze primary source documents.\n- Apply statistical methods to real-world data."
                rows={3}
                value={learningObjectives}
                onChange={(e) => setLearningObjectives(e.target.value)}
              />
               <p className="text-xs text-muted-foreground">Providing objectives helps the AI generate more relevant content.</p>
            </div>

            {/* Type-specific fields (Keep as is, or enhance) */}
            {/* ... (quiz settings, group settings JSX) ... */}
            {selectedType === ASSIGNMENT_TYPES.MULTIPLE_CHOICE && (
              <div className="space-y-2">
                <Label>Quiz Settings</Label>
                <div className="rounded-md border p-4 space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="num-questions">Number of Questions</Label>
                    <Input
                      id="num-questions"
                      type="number"
                      value={quizSettings.numQuestions}
                      onChange={(e) =>
                      setQuizSettings((prev) => ({
                        ...prev,
                        numQuestions: parseInt(e.target.value, 10) || 0,
                      }))
                      }
                    />
                    </div>
                  <div className="space-y-2">
                    <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                    <Input 
                      id="time-limit" 
                      type="number"
                      value={quizSettings.timeLimit}
                      onChange={(e) =>
                      setQuizSettings((prev) => ({
                        ...prev,
                        timeLimit: parseInt(e.target.value, 10) || 0,
                      }))
                      }
                      placeholder="0 for no limit"
                      />
                  </div>
                    <div className="flex items-center space-x-2">
                    <Checkbox
                      id="randomize"
                      checked={quizSettings.randomize}
                      onCheckedChange={(checked) =>
                      setQuizSettings((prev) => ({
                        ...prev,
                        randomize: Boolean(checked),
                      }))
                      }
                    />
                    <Label htmlFor="randomize" className="text-sm font-normal">
                      Randomize question order
                    </Label>
                    </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                    id="show-answers"
                    checked={quizSettings.showAnswers}
                    onCheckedChange={(checked) =>
                      setQuizSettings((prev) => ({
                        ...prev,
                        showAnswers: Boolean(checked),
                      }))
                    }
                    />
                    <Label htmlFor="show-answers" className="text-sm font-normal">
                      Show correct answers after submission
                    </Label>
                  </div>
                </div>
              </div>
            )}

                {selectedType === ASSIGNMENT_TYPES.GROUP_PROJECT && (
                <div className="space-y-2">
                <Label>Group Settings</Label>
                <div className="rounded-md border p-4 space-y-4">
                  <div className="space-y-2">
                  <Label htmlFor="group-size">Group Size</Label>
                  <Input
                    id="group-size"
                    type="number"
                    value={groupSettings.groupSize}
                    onChange={(e) =>
                    setGroupSettings((prev) => ({
                      ...prev,
                      groupSize: parseInt(e.target.value, 10) || 0,
                    }))
                    }
                  />
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="group-formation">Group Formation</Label>
                  <RadioGroup
                    value={groupSettings.groupFormation}
                    onValueChange={(value) =>
                    setGroupSettings((prev) => ({
                      ...prev,
                      groupFormation: value,
                    }))
                    }
                  >
                    <div className="flex items-center space-x-2">
                    <RadioGroupItem value="instructor" id="instructor" />
                    <Label htmlFor="instructor" className="text-sm font-normal">
                      Instructor-assigned groups
                    </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student" className="text-sm font-normal">
                      Student-selected groups
                    </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                    <RadioGroupItem value="random" id="random" />
                    <Label htmlFor="random" className="text-sm font-normal">
                      Randomly assigned groups
                    </Label>
                    </div>
                  </RadioGroup>
                  </div>
                  <div className="flex items-center space-x-2">
                  <Checkbox
                    id="peer-eval"
                    checked={groupSettings.peerEvaluation}
                    onCheckedChange={(checked) =>
                    setGroupSettings((prev) => ({
                      ...prev,
                      peerEvaluation: Boolean(checked),
                    }))
                    }
                  />
                  <Label htmlFor="peer-eval" className="text-sm font-normal">
                    Include peer evaluation component
                  </Label>
                  </div>
                </div>
                </div>
            )}
            

            {/* LMS Integration (Keep as is) */}
             {/* ... (LMS JSX) ... */}
              <div className="space-y-2">
                <Label>LMS Integration (Optional)</Label>
                <div className="space-y-3 rounded-md border p-4 bg-muted/30">
                  {/* Canvas Example */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="canvas"
                        checked={publishToLMS.includes("Canvas")}
                        disabled={!connectedLMS.includes("Canvas")} // Disable if not connected
                        onCheckedChange={(checked) => {
                          if (!connectedLMS.includes("Canvas")) return; // Prevent checking if not connected
                          setPublishToLMS(prev =>
                            checked
                              ? [...prev, "Canvas"]
                              : prev.filter((lms) => lms !== "Canvas")
                          );
                        }}
                      />
                      <Label htmlFor="canvas" className={`text-sm font-normal ${!connectedLMS.includes("Canvas") ? 'text-muted-foreground' : ''}`}>
                        Publish to Canvas
                      </Label>
                    </div>
                     {connectedLMS.includes("Canvas") ? (
                       <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300"> Connected </Badge>
                     ) : (
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => router.push("/dashboard/integrations")}> Connect </Button>
                     )}
                  </div>

                  {/* Google Classroom Example */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="google-classroom"
                        checked={publishToLMS.includes("Google Classroom")}
                         disabled={!connectedLMS.includes("Google Classroom")}
                        onCheckedChange={(checked) => {
                          if (!connectedLMS.includes("Google Classroom")) return;
                          setPublishToLMS(prev =>
                            checked
                              ? [...prev, "Google Classroom"]
                              : prev.filter((lms) => lms !== "Google Classroom")
                          );
                        }}
                      />
                       <Label htmlFor="google-classroom" className={`text-sm font-normal ${!connectedLMS.includes("Google Classroom") ? 'text-muted-foreground' : ''}`}>
                         Publish to Google Classroom
                       </Label>
                    </div>
                     {!connectedLMS.includes("Google Classroom") && ( // Show connect only if not connected
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => router.push("/dashboard/integrations")}> Connect </Button>
                     )}
                  </div>
                   <p className="text-xs text-muted-foreground pt-2">Connect LMS platforms in Integrations settings.</p>
                </div>
              </div>

          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleDetailsSubmission} type="button"> {/* Changed type to button */}
              Generate Content <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    )

  }

  // Render the content generation and review step (Keep as is, Textarea uses generatedContent state now)
  const renderGenerationStep = () => {
    // ... (JSX remains largely the same, uses generatedContent which is now populated by API)
     const typeInfo = ASSIGNMENT_TYPE_INFO[selectedType]
     const outputs = typeInfo?.outputs || []
     const defaultTab = outputs.length > 0 ? outputs[0] : undefined; // Handle no outputs case

     return (
       <div className="space-y-6">
        {/* Back Button and Breadcrumb */}
         <div className="flex items-center space-x-2 text-sm">
           <Button variant="ghost" onClick={() => setCurrentStep("type")} className="p-0 h-auto text-muted-foreground hover:text-primary">
             Select Type
           </Button>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
           <Button variant="ghost" onClick={() => setCurrentStep("details")} className="p-0 h-auto text-muted-foreground hover:text-primary">
             Details
           </Button>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
           <span className="font-medium text-primary">Generate & Review</span>
         </div>

         <div className="text-center space-y-1">
           <h1 className="text-3xl font-bold">{assignmentTitle || "Generated Content"}</h1>
           <p className="text-muted-foreground">{selectedCourse || "Course Not Selected"}</p>
         </div>

         {isGenerating ? (
           <Card className="flex items-center justify-center py-16 border-dashed">
             <CardContent className="text-center">
               <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
               <h3 className="text-xl font-medium">Generating Content...</h3>
               <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                 Our AI assistant is crafting your {typeInfo?.title.toLowerCase() || "assignment"} components. This may take a moment.
               </p>
             </CardContent>
           </Card>
         ) : !defaultTab ? ( // Handle case where generation wasn't triggered or failed completely
              <Card className="flex items-center justify-center py-16 border-dashed border-destructive/50 bg-destructive/5">
                 <CardContent className="text-center">
                   <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                   <h3 className="text-xl font-medium text-destructive">No Content Generated</h3>
                   <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                     Could not generate content. Please go back and ensure all required details are filled correctly, or try again.
                   </p>
                    <Button onClick={() => setCurrentStep("details")} variant="destructive" className="mt-4">
                        Go Back to Details
                    </Button>
                 </CardContent>
               </Card>
            ) : (
           // --- Display Generated Content Tabs ---
           <div className="space-y-6">
             <Tabs defaultValue={defaultTab} className="space-y-4">
                <TabsList className="flex flex-wrap h-auto justify-start"> {/* Allow wrapping */}
                 {/* Dynamically render tabs based on available outputs */}
                 {outputs.map((output) => {
                     // Check if content exists or if it's an error message
                     const hasContent = generatedContent[output as keyof GeneratedContentType];
                     const isError = hasContent?.startsWith("--- Error generating");
                     const tabTitle = output.replace("_", " ");

                     return (
                       <TabsTrigger key={output} value={output} className="capitalize data-[state=active]:shadow-sm">
                         {isError && <AlertCircle className="mr-2 h-4 w-4 text-destructive" />}
                         {tabTitle}
                       </TabsTrigger>
                     );
                 })}
               </TabsList>

                {/* Dynamically render tab content */}
                {outputs.map((output) => (
                    <TabsContent key={output} value={output} className="space-y-4 mt-0"> {/* Removed mt-4 */}
                       <Card className="border shadow-sm">
                           <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                               <CardTitle className="text-lg font-semibold capitalize">{output.replace("_", " ")}</CardTitle>
                               <div className="flex space-x-2">
                                   <Button
                                     variant="outline"
                                     size="sm"
                                     onClick={() => handleCopyToClipboard(generatedContent[output as keyof GeneratedContentType], output.replace("_", " "))}
                                     className="h-8"
                                      disabled={!generatedContent[output as keyof GeneratedContentType] || generatedContent[output as keyof GeneratedContentType]?.startsWith("--- Error generating")}
                                   >
                                     {copied === output.replace("_", " ") ? (
                                       <Check className="mr-1.5 h-4 w-4" />
                                     ) : (
                                       <Copy className="mr-1.5 h-4 w-4" />
                                     )}
                                     Copy
                                   </Button>
                                   {/* Basic Edit button - functionality not implemented here */}
                                   {/* <Button variant="outline" size="sm" className="h-8" disabled>
                                     <Edit className="mr-1.5 h-4 w-4" />
                                     Edit
                                   </Button> */}
                               </div>
                           </CardHeader>
                           <CardContent>
                               {generatedContent[output as keyof GeneratedContentType]?.startsWith("--- Error generating") ? (
                                   <div className="text-destructive p-4 bg-destructive/10 rounded-md min-h-[200px] flex items-center justify-center flex-col">
                                        <AlertCircle className="h-8 w-8 mb-2"/>
                                        <p>{generatedContent[output as keyof GeneratedContentType]}</p>
                                        <Button size="sm" variant="secondary" className="mt-3" onClick={handleGenerateContent} disabled={isGenerating}>
                                             {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null }
                                             Retry Generation
                                        </Button>
                                    </div>
                               ) : (
                                   <Textarea
                                     value={generatedContent[output as keyof GeneratedContentType] || `No ${output.replace("_"," ")} content generated.`}
                                     onChange={(e) => setGeneratedContent(prev => ({ ...prev, [output]: e.target.value }))}
                                     className="min-h-[400px] font-mono text-sm bg-background" // Use mono for code-like content
                                     readOnly={!generatedContent[output as keyof GeneratedContentType]} // Make read-only if empty
                                   />
                               )}
                           </CardContent>
                       </Card>
                    </TabsContent>
                ))}
             </Tabs>

             {/* Action Buttons */}
             <div className="flex flex-col sm:flex-row justify-between gap-3">
               <div className="flex flex-wrap gap-2">
                 <Button variant="outline" onClick={() => setPdfPreviewOpen(true)}>
                   <Download className="mr-2 h-4 w-4" />
                   Preview/Download PDF
                 </Button>
                 {/* <Button variant="outline" onClick={() => setEmailPreviewOpen(true)}>
                   <Mail className="mr-2 h-4 w-4" />
                   Email Preview
                 </Button> */}
               </div>
               <Button onClick={handleSaveAssignment} disabled={isSaving || isGenerating}>
                 {isSaving ? (
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                 ) : (
                   <Save className="mr-2 h-4 w-4" />
                 )}
                 Save {typeInfo?.title || "Assignment"}
               </Button>
             </div>
           </div>
         )}
       </div>
     )
  }

  // --- Main Return block ---
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-5xl mx-auto"> {/* Added max-width and centering */}
      {currentStep === "type" && renderTypeSelection()}
      {currentStep === "details" && renderDetailsForm()}
      {currentStep === "generate" && renderGenerationStep()}

      {/* PDF Preview Dialog (Ensure it handles potentially missing content) */}
      <PDFPreviewDialog
        open={pdfPreviewOpen}
        onOpenChange={setPdfPreviewOpen}
        // Pass individual pieces, default to empty string if null/undefined
        instructions={generatedContent.instructions || ""}
        rubric={generatedContent.rubric || ""}
        questions={generatedContent.questions || ""}
        answerKey={generatedContent.answer_key || ""}
        checklist={generatedContent.checklist || ""}
        participationCriteria={generatedContent.participation_criteria || ""}
        peerEvaluation={generatedContent.peer_evaluation || ""}
        title={assignmentTitle || "Assignment Preview"}
        course={selectedCourse || ""}
        // Pass the list of actually generated outputs so the dialog knows what to include
        generatedOutputs={Object.keys(generatedContent).filter(key => generatedContent[key as keyof GeneratedContentType] && !generatedContent[key as keyof GeneratedContentType]?.startsWith("--- Error")) as (keyof GeneratedContentType)[]}
      />

      <PDFPreviewDialog
          open={pdfPreviewOpen}
          onOpenChange={setPdfPreviewOpen}
          assignment={generatedContent.instructions || ""}
          rubric={generatedContent.rubric || ""}
          title={assignmentTitle}
          course={selectedCourse}
        />
    
        {/* Email Preview Dialog */}
        <EmailPreviewDialog
          open={emailPreviewOpen}
          onOpenChange={setEmailPreviewOpen}
          assignment={generatedContent.instructions || ""}
          rubric={generatedContent.rubric || ""}
          title={assignmentTitle}
          course={selectedCourse}
          />
    </div>
  )
}

// return (
//   <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//     {currentStep === "type" && renderTypeSelection()}
//     {currentStep === "details" && renderDetailsForm()}
//     {currentStep === "generate" && renderGenerationStep()}

//     {/* PDF Preview Dialog */}
//   </div>
// )