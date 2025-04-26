"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"; // Import if needed for redirects on auth error
import { Loader2, Sparkles, RefreshCw, Download, Check, Edit2, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input" // Keep Input for editing
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { SyllabusPreview } from "./syllabus-preview" // Assuming this component exists
import { useToast } from "@/components/ui/use-toast" // Adjust path if needed

interface SyllabusCreatorProps {
  courseDetails: {
    name: string
    description: string
    subject: string // e.g., "Psychology"
    gradeLevel: string // e.g., "University" or "High School"
    // Add other relevant details like course code, term if available
  }
  onComplete: (generatedSyllabusData: any) => void // Pass generated data back
  isCreating: boolean // Loading state from parent
  // Optional: Pass existing syllabus data if editing
  initialSyllabusData?: any | null;
  courseId?: string; // Pass courseId if syllabus needs to be saved to it
}

// Define a more specific type for syllabus data if possible
// This is based on the mock data structure
interface SyllabusData {
    courseTitle: string;
    instructor: string;
    term: string;
    courseDescription: string;
    learningObjectives: string[];
    requiredMaterials: {
        title: string;
        author: string;
        publisher: string;
        year: string;
        required: boolean;
        _id?: string; // Optional ID from DB
    }[];
    gradingPolicy: {
        [key: string]: { // Allow dynamic keys like 'assignments', 'midterm'
            percentage: number;
            description: string;
        }
    };
    weeklySchedule: {
        week: number;
        topic: string;
        readings: string;
        assignments: string;
        _id?: string; // Optional ID from DB
    }[];
    policies: {
        [key: string]: string; // Dynamic keys like 'attendance', 'lateWork'
    };
    // Add _id if fetched/saved
    _id?: string;
}


export function SyllabusCreator({
    courseDetails,
    onComplete,
    isCreating, // Loading state for the final "Create Course" button
    initialSyllabusData = null, // Allow passing existing data
    courseId // Needed if saving syllabus to course
}: SyllabusCreatorProps) {
  const { toast } = useToast();
  const router = useRouter(); // For potential redirects

  const [isGenerating, setIsGenerating] = useState(false); // Loading state for AI generation
  // Determine initial tab based on whether initial data is provided
  const [activeTab, setActiveTab] = useState(initialSyllabusData ? "edit" : "generate");
  const [syllabusData, setSyllabusData] = useState<SyllabusData | null>(initialSyllabusData);
  const [prompt, setPrompt] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  // Generate default prompt or use initial data
  useEffect(() => {
    if (!initialSyllabusData) { // Only set default prompt if not editing
        const defaultPrompt = `Create a comprehensive university-level syllabus for a course titled "${courseDetails.name}" in the subject of ${courseDetails.subject}.
Course Description: ${courseDetails.description}
Grade Level: ${courseDetails.gradeLevel}

Include the following sections:
- Basic Information (Instructor Name placeholder: "TBD", Term placeholder: "e.g., Fall 2025")
- Course Description (use provided)
- Learning Objectives (generate 4-6 relevant objectives)
- Required Materials (suggest 1-2 fictional but realistic textbooks/resources, mark one as required)
- Grading Policy (create a breakdown totaling 100%, e.g., Assignments, Midterm, Final Exam, Participation)
- Weekly Schedule (generate a plausible 14-15 week schedule with Topic, Readings, Assignments for each week)
- Course Policies (include standard policies for Attendance, Late Work, Academic Integrity, Accommodations)

Format the output as a JSON object suitable for direct use in an application. Ensure keys match this structure: { courseTitle, instructor, term, courseDescription, learningObjectives: [], requiredMaterials: [{title, author, publisher, year, required}], gradingPolicy: { key: {percentage, description} }, weeklySchedule: [{week, topic, readings, assignments}], policies: { key: "policy text" } }`;
        setPrompt(defaultPrompt);
    } else {
        // If editing, set the syllabus data
        setSyllabusData(initialSyllabusData);
        setActiveTab("edit"); // Start on edit tab if data exists
    }
  }, [courseDetails, initialSyllabusData]); // Rerun if course details change or initial data appears


  // --- Function to call backend AI for syllabus generation ---
  const generateSyllabus = async () => {
    setIsGenerating(true);
    setError(null); // Clear previous errors
    const token = localStorage.getItem('token');

    if (!token) {
      toast({ title: "Authentication Error", description: "Please log in.", variant: "destructive" });
      setIsGenerating(false);
      router.push('/login');
      return;
    }

    // Combine prompt and additional info
    const finalPrompt = `${prompt}\n\nAdditional Instructions/Details:\n${additionalInfo || "None"}`;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
      console.log(`Requesting syllabus generation from: ${apiUrl}/assignment/generate`);

      const response = await fetch(`${apiUrl}/assignment/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: finalPrompt, // Send the combined prompt
            // Optionally send structured course details if backend prefers that
            // courseDetails: courseDetails
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `AI generation failed (Status: ${response.status})`);
      }

      const generatedData = await response.json();
      console.log("AI Generated Syllabus Data:", generatedData);

      // --- TODO: Validate the structure of generatedData ---
      // Add checks here to ensure generatedData has the expected fields/types
      // before setting the state. If validation fails, show an error toast.
      if (!generatedData || typeof generatedData !== 'object' || !generatedData.courseTitle) {
          throw new Error("Received invalid syllabus structure from AI.");
      }

      // Ensure all expected arrays/objects exist, even if empty, for the editor
      const validatedData: SyllabusData = {
          courseTitle: generatedData.courseTitle || courseDetails.name,
          instructor: generatedData.instructor || "TBD",
          term: generatedData.term || "TBD",
          courseDescription: generatedData.courseDescription || courseDetails.description,
          learningObjectives: Array.isArray(generatedData.learningObjectives) ? generatedData.learningObjectives : [],
          requiredMaterials: Array.isArray(generatedData.requiredMaterials) ? generatedData.requiredMaterials : [],
          gradingPolicy: typeof generatedData.gradingPolicy === 'object' && generatedData.gradingPolicy !== null ? generatedData.gradingPolicy : {},
          weeklySchedule: Array.isArray(generatedData.weeklySchedule) ? generatedData.weeklySchedule : [],
          policies: typeof generatedData.policies === 'object' && generatedData.policies !== null ? generatedData.policies : {},
      };


      setSyllabusData(validatedData); // Update state with validated data
      setActiveTab("edit"); // Move to edit tab
      toast({ title: "Syllabus Generated", description: "Review and edit the generated syllabus." });

    } catch (error: any) {
      console.error("Error generating syllabus:", error);
      setError(error.message || "An unexpected error occurred during generation."); // Set error state
      toast({ title: "Generation Error", description: error.message || "Could not generate syllabus.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Handlers for Editing Syllabus Data ---
  // Example: Update basic info field
  const handleSyllabusChange = (field: keyof SyllabusData, value: any) => {
      setSyllabusData(prev => prev ? { ...prev, [field]: value } : null);
  };

  // Example: Update a specific learning objective
  const handleObjectiveChange = (index: number, value: string) => {
      setSyllabusData(prev => {
          if (!prev) return null;
          const newObjectives = [...prev.learningObjectives];
          newObjectives[index] = value;
          return { ...prev, learningObjectives: newObjectives };
      });
  };
   // Add similar handlers for materials, grading, schedule, policies...
   // (These are implemented directly in the JSX onChange handlers below for brevity)


   // --- Final Step: Pass data back to parent ---
   const handleComplete = () => {
       if (syllabusData) {
           onComplete(syllabusData); // Pass the final edited data
       } else {
           toast({ title: "Error", description: "No syllabus data to save.", variant: "destructive" });
       }
   };


  // --- Local Error State Display ---
  const [error, setError] = useState<string | null>(null); // Added error state


  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">1. Generate</TabsTrigger>
          <TabsTrigger value="edit" disabled={!syllabusData}>2. Edit</TabsTrigger>
          <TabsTrigger value="preview" disabled={!syllabusData}>3. Preview & Finish</TabsTrigger>
        </TabsList>

        {/* Generate Tab */}
        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"> <Sparkles className="mr-2 h-5 w-5 text-primary" /> AI Syllabus Generation </CardTitle>
              <CardDescription> Let AI create a draft syllabus based on your course details and prompt. </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="prompt">Generation Prompt</Label>
                <Textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} className="min-h-[150px] mt-1" placeholder="Enter prompt to guide AI..." />
                <p className="text-xs text-muted-foreground mt-1"> Review or modify the auto-generated prompt. </p>
              </div>
              <div>
                <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                <Textarea id="additionalInfo" value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} className="min-h-[100px] mt-1" placeholder="Specific textbooks, policies, topics, etc." />
              </div>
              {/* Display Course Details for Context */}
              <div className="bg-muted/50 p-3 rounded-md border">
                 <h4 className="font-medium mb-2 text-sm">Using Course Details:</h4>
                 <ul className="space-y-1 text-xs text-muted-foreground">
                   <li><span className="font-medium">Name:</span> {courseDetails.name}</li>
                   <li><span className="font-medium">Subject:</span> {courseDetails.subject}</li>
                   <li><span className="font-medium">Level:</span> {courseDetails.gradeLevel}</li>
                   <li className="line-clamp-2"><span className="font-medium">Desc:</span> {courseDetails.description}</li>
                 </ul>
               </div>
               {/* Display Error if Generation Failed */}
                {error && activeTab === 'generate' && (
                    <p className="text-sm text-destructive text-center p-2 bg-destructive/10 rounded border border-destructive/30">
                        <AlertTriangle className="inline h-4 w-4 mr-1" /> {error}
                    </p>
                )}
            </CardContent>
            <CardFooter className="flex justify-end">
               {/* Removed Back Button, handled by Tabs */}
              <Button onClick={generateSyllabus} disabled={isGenerating || !prompt.trim()}>
                {isGenerating ? ( <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> ) : ( <><Sparkles className="mr-2 h-4 w-4" /> Generate Syllabus</> )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Edit Tab */}
        <TabsContent value="edit" className="space-y-6">
          {syllabusData && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Syllabus</CardTitle>
                <CardDescription>Review and customize the AI-generated syllabus.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Accordion for Editing Sections */}
                <Accordion type="multiple" defaultValue={["basic-info", "objectives"]} className="w-full">
                  {/* Basic Info Section */}
                  <AccordionItem value="basic-info">
                    <AccordionTrigger>Basic Information</AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-3">
                       <div> <Label htmlFor="edit-courseTitle">Course Title</Label> <Input id="edit-courseTitle" value={syllabusData.courseTitle} onChange={(e) => handleSyllabusChange('courseTitle', e.target.value)} /> </div>
                       <div> <Label htmlFor="edit-instructor">Instructor Name</Label> <Input id="edit-instructor" value={syllabusData.instructor} onChange={(e) => handleSyllabusChange('instructor', e.target.value)} /> </div>
                       <div> <Label htmlFor="edit-term">Term</Label> <Input id="edit-term" value={syllabusData.term} onChange={(e) => handleSyllabusChange('term', e.target.value)} /> </div>
                       <div> <Label htmlFor="edit-courseDescription">Course Description</Label> <Textarea id="edit-courseDescription" value={syllabusData.courseDescription} onChange={(e) => handleSyllabusChange('courseDescription', e.target.value)} className="min-h-[100px]" /> </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Learning Objectives Section */}
                  <AccordionItem value="objectives">
                     <AccordionTrigger>Learning Objectives</AccordionTrigger>
                     <AccordionContent className="space-y-3 pt-3">
                         {syllabusData.learningObjectives.map((objective: string, index: number) => (
                           <div key={`obj-${index}`} className="flex items-center gap-2">
                             <Input value={objective} onChange={(e) => handleObjectiveChange(index, e.target.value)} aria-label={`Learning objective ${index + 1}`} />
                             <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => { setSyllabusData(prev => prev ? { ...prev, learningObjectives: prev.learningObjectives.filter((_, i) => i !== index) } : null); }} aria-label={`Remove objective ${index + 1}`}> <X className="h-4 w-4" /> </Button>
                           </div>
                         ))}
                         <Button variant="outline" size="sm" onClick={() => { setSyllabusData(prev => prev ? { ...prev, learningObjectives: [...prev.learningObjectives, ""] } : null); }}> Add Objective </Button>
                     </AccordionContent>
                  </AccordionItem>

                  {/* Required Materials Section */}
                   <AccordionItem value="materials">
                     <AccordionTrigger>Required Materials</AccordionTrigger>
                     <AccordionContent className="space-y-4 pt-3">
                         {syllabusData.requiredMaterials.map((material, index) => (
                           <Card key={`mat-${index}`} className="p-3 bg-muted/30">
                               <div className="flex justify-between items-center mb-2">
                                   <h4 className="font-medium text-sm">Material {index + 1}</h4>
                                   <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => setSyllabusData(prev => prev ? { ...prev, requiredMaterials: prev.requiredMaterials.filter((_, i) => i !== index) } : null)} aria-label={`Remove material ${index + 1}`}> <X className="h-4 w-4" /> </Button>
                               </div>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                   {/* Title, Author, Publisher, Year Inputs */}
                                   <div> <Label htmlFor={`mat-title-${index}`} className="text-xs">Title</Label> <Input id={`mat-title-${index}`} value={material.title} onChange={(e) => setSyllabusData(prev => prev ? { ...prev, requiredMaterials: prev.requiredMaterials.map((m, i) => i === index ? { ...m, title: e.target.value } : m) } : null)} /> </div>
                                   <div> <Label htmlFor={`mat-author-${index}`} className="text-xs">Author</Label> <Input id={`mat-author-${index}`} value={material.author} onChange={(e) => setSyllabusData(prev => prev ? { ...prev, requiredMaterials: prev.requiredMaterials.map((m, i) => i === index ? { ...m, author: e.target.value } : m) } : null)} /> </div>
                                   <div> <Label htmlFor={`mat-pub-${index}`} className="text-xs">Publisher</Label> <Input id={`mat-pub-${index}`} value={material.publisher} onChange={(e) => setSyllabusData(prev => prev ? { ...prev, requiredMaterials: prev.requiredMaterials.map((m, i) => i === index ? { ...m, publisher: e.target.value } : m) } : null)} /> </div>
                                   <div> <Label htmlFor={`mat-year-${index}`} className="text-xs">Year</Label> <Input id={`mat-year-${index}`} value={material.year} onChange={(e) => setSyllabusData(prev => prev ? { ...prev, requiredMaterials: prev.requiredMaterials.map((m, i) => i === index ? { ...m, year: e.target.value } : m) } : null)} /> </div>
                               </div>
                               <div className="flex items-center space-x-2 mt-3">
                                   <Switch id={`mat-req-${index}`} checked={material.required} onCheckedChange={(checked) => setSyllabusData(prev => prev ? { ...prev, requiredMaterials: prev.requiredMaterials.map((m, i) => i === index ? { ...m, required: checked } : m) } : null)} />
                                   <Label htmlFor={`mat-req-${index}`} className="text-sm">Required</Label>
                               </div>
                           </Card>
                         ))}
                         <Button variant="outline" size="sm" onClick={() => setSyllabusData(prev => prev ? { ...prev, requiredMaterials: [...prev.requiredMaterials, { title: "", author: "", publisher: "", year: "", required: true }] } : null)}> Add Material </Button>
                     </AccordionContent>
                   </AccordionItem>

                   {/* Grading Policy Section */}
                   <AccordionItem value="grading">
                       <AccordionTrigger>Grading Policy</AccordionTrigger>
                       <AccordionContent className="space-y-4 pt-3">
                           {Object.entries(syllabusData.gradingPolicy).map(([key, value]) => (
                               <Card key={key} className="p-3 bg-muted/30">
                                   <div className="flex justify-between items-center mb-2">
                                        {/* Allow editing the component name */}
                                        <Input value={key} onChange={(e) => {
                                            const newKey = e.target.value || `component${Date.now()}`; // Prevent empty key
                                            if (newKey === key || syllabusData.gradingPolicy[newKey]) return; // Skip if same or key exists
                                            const { [key]: removed, ...rest } = syllabusData.gradingPolicy;
                                            setSyllabusData(prev => prev ? { ...prev, gradingPolicy: { ...rest, [newKey]: value } } : null);
                                        }} className="font-medium text-sm h-8 mr-2"/>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => { const { [key]: removed, ...rest } = syllabusData.gradingPolicy; setSyllabusData(prev => prev ? { ...prev, gradingPolicy: rest } : null); }} aria-label={`Remove ${key}`}> <X className="h-4 w-4" /> </Button>
                                   </div>
                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                       <div>
                                           <Label htmlFor={`grade-desc-${key}`} className="text-xs">Description</Label>
                                           <Input id={`grade-desc-${key}`} value={value.description} onChange={(e) => setSyllabusData(prev => prev ? { ...prev, gradingPolicy: { ...prev.gradingPolicy, [key]: { ...value, description: e.target.value } } } : null)} />
                                       </div>
                                       <div>
                                           <Label htmlFor={`grade-perc-${key}`} className="text-xs">Percentage</Label>
                                           <div className="flex items-center">
                                               <Input id={`grade-perc-${key}`} type="number" min="0" max="100" value={value.percentage} onChange={(e) => setSyllabusData(prev => prev ? { ...prev, gradingPolicy: { ...prev.gradingPolicy, [key]: { ...value, percentage: parseInt(e.target.value) || 0 } } } : null)} className="w-20" />
                                               <span className="ml-1 text-sm">%</span>
                                           </div>
                                       </div>
                                   </div>
                               </Card>
                           ))}
                           <Button variant="outline" size="sm" onClick={() => { const newKey = `newComponent${Object.keys(syllabusData.gradingPolicy).length}`; setSyllabusData(prev => prev ? { ...prev, gradingPolicy: { ...prev.gradingPolicy, [newKey]: { description: "New Grading Component", percentage: 0 } } } : null); }}> Add Grading Component </Button>
                            {/* Optional: Show total percentage */}
                            <div className="text-right text-sm font-medium mt-2"> Total: {Object.values(syllabusData.gradingPolicy).reduce((sum, item) => sum + (item.percentage || 0), 0)}% </div>
                       </AccordionContent>
                   </AccordionItem>

                   {/* Weekly Schedule Section */}
                   <AccordionItem value="schedule">
                       <AccordionTrigger>Weekly Schedule</AccordionTrigger>
                       <AccordionContent className="space-y-4 pt-3">
                           {syllabusData.weeklySchedule.sort((a,b) => a.week - b.week).map((week, index) => ( // Sort by week number
                               <Card key={`week-${index}`} className="p-3 bg-muted/30">
                                   <div className="flex justify-between items-center mb-2">
                                       <Label htmlFor={`week-num-${index}`} className="font-medium text-sm">Week</Label>
                                        <div className="flex items-center gap-2">
                                            <Input id={`week-num-${index}`} type="number" value={week.week} onChange={(e) => setSyllabusData(prev => prev ? { ...prev, weeklySchedule: prev.weeklySchedule.map((w, i) => i === index ? { ...w, week: parseInt(e.target.value) || 1 } : w) } : null)} className="w-16 h-8"/>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => setSyllabusData(prev => prev ? { ...prev, weeklySchedule: prev.weeklySchedule.filter((_, i) => i !== index) } : null)} aria-label={`Remove week ${week.week}`}> <X className="h-4 w-4" /> </Button>
                                        </div>
                                   </div>
                                   <div className="space-y-2">
                                       <div> <Label htmlFor={`week-topic-${index}`} className="text-xs">Topic</Label> <Input id={`week-topic-${index}`} value={week.topic} onChange={(e) => setSyllabusData(prev => prev ? { ...prev, weeklySchedule: prev.weeklySchedule.map((w, i) => i === index ? { ...w, topic: e.target.value } : w) } : null)} /> </div>
                                       <div> <Label htmlFor={`week-read-${index}`} className="text-xs">Readings</Label> <Input id={`week-read-${index}`} value={week.readings} onChange={(e) => setSyllabusData(prev => prev ? { ...prev, weeklySchedule: prev.weeklySchedule.map((w, i) => i === index ? { ...w, readings: e.target.value } : w) } : null)} /> </div>
                                       <div> <Label htmlFor={`week-assign-${index}`} className="text-xs">Assignments</Label> <Input id={`week-assign-${index}`} value={week.assignments} onChange={(e) => setSyllabusData(prev => prev ? { ...prev, weeklySchedule: prev.weeklySchedule.map((w, i) => i === index ? { ...w, assignments: e.target.value } : w) } : null)} /> </div>
                                   </div>
                               </Card>
                           ))}
                           <Button variant="outline" size="sm" onClick={() => { const lastWeekNum = syllabusData.weeklySchedule.length > 0 ? Math.max(...syllabusData.weeklySchedule.map(w => w.week)) : 0; setSyllabusData(prev => prev ? { ...prev, weeklySchedule: [...prev.weeklySchedule, { week: lastWeekNum + 1, topic: "", readings: "", assignments: "" }] } : null); }}> Add Week </Button>
                       </AccordionContent>
                   </AccordionItem>

                   {/* Course Policies Section */}
                    <AccordionItem value="policies">
                       <AccordionTrigger>Course Policies</AccordionTrigger>
                       <AccordionContent className="space-y-4 pt-3">
                           {Object.entries(syllabusData.policies).map(([key, value]) => (
                               <div key={key} className="space-y-1.5">
                                   <div className="flex justify-between items-center">
                                        {/* Allow editing policy title */}
                                        <Input value={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")} onChange={(e) => {
                                            const newKey = e.target.value.replace(/\s+/g, '_').toLowerCase() || `policy${Date.now()}`; // Create key
                                            if (newKey === key || syllabusData.policies[newKey]) return;
                                            const { [key]: removed, ...rest } = syllabusData.policies;
                                            setSyllabusData(prev => prev ? { ...prev, policies: { ...rest, [newKey]: value } } : null);
                                        }} className="font-medium text-sm h-8 mr-2"/>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => { const { [key]: removed, ...rest } = syllabusData.policies; setSyllabusData(prev => prev ? { ...prev, policies: rest } : null); }} aria-label={`Remove ${key} policy`}> <X className="h-4 w-4" /> </Button>
                                   </div>
                                   <Textarea id={`policy-${key}`} value={value} onChange={(e) => setSyllabusData(prev => prev ? { ...prev, policies: { ...prev.policies, [key]: e.target.value } } : null)} className="min-h-[80px]" />
                               </div>
                           ))}
                           <Button variant="outline" size="sm" onClick={() => { const newKey = `newPolicy${Object.keys(syllabusData.policies).length}`; setSyllabusData(prev => prev ? { ...prev, policies: { ...prev.policies, [newKey]: "" } } : null); }}> Add Policy </Button>
                       </AccordionContent>
                   </AccordionItem>

                </Accordion>
              </CardContent>
              <CardFooter className="flex justify-between">
                 {/* Button to Regenerate */}
                <Button variant="outline" onClick={generateSyllabus} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />} Regenerate AI Draft
                </Button>
                {/* Button to Proceed to Preview */}
                <Button onClick={() => setActiveTab("preview")}>
                    <Check className="mr-2 h-4 w-4" /> Continue to Preview
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          {syllabusData && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-2xl font-bold">Syllabus Preview</h2>
                <div className="flex flex-wrap gap-2">
                   {/* TODO: Implement PDF Download */}
                  <Button variant="outline" disabled> <Download className="mr-2 h-4 w-4" /> Download PDF </Button>
                  <Button variant="outline" onClick={() => setActiveTab("edit")}> <Edit2 className="mr-2 h-4 w-4" /> Edit </Button>
                  {/* Final button calls parent's onComplete */}
                  <Button onClick={handleComplete} disabled={isCreating}>
                    {isCreating ? ( <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finishing...</> ) : ( "Finish & Create Course" )}
                  </Button>
                </div>
              </div>
              <Card className="border shadow-sm">
                <CardContent className="p-4 sm:p-6">
                   {/* Assuming SyllabusPreview component takes the data and renders it */}
                  <SyllabusPreview syllabusData={syllabusData} />
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

