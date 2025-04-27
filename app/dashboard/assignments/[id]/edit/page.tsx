"use client"

import { useState, useEffect, useCallback } from "react" // Added useCallback
import { useRouter, useParams } from "next/navigation" // Import useParams
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Save, ArrowLeft, AlertTriangle } from "lucide-react" // Added AlertTriangle
import { useToast } from "@/hooks/use-toast" // Adjust path if needed
import { Badge } from "@/components/ui/badge"
import { format } from 'date-fns' // For formatting date input

// Interface for the assignment data structure
interface AssignmentData {
  _id?: string; // ID from database
  title: string;
  description: string;
  dueDate: string; // Store as YYYY-MM-DD for input type="date"
  totalPoints?: number; // Make optional or provide default
  course: string; // Assuming course name/ID string for simplicity here
  type: string; // e.g., "essay", "project"
  content?: { 
    instructions?: string;
    rubric?: string;
    questions?: string;
    peer_evaluation?: string;
    answer_key?: string;
  };
  lmsIntegration: string[]; // Array of LMS names/IDs
}

// Default state structure matching the interface
const defaultAssignmentState: AssignmentData = {
  title: "",
  description: "",
  dueDate: "",
  totalPoints: 100,
  course: "",
  type: "essay", // Default type
  content: {
    instructions: "",
    rubric: "",
    questions: "",
    peer_evaluation: "",
    answer_key: "",
  },
  lmsIntegration: [],
};

export default function EditAssignmentPage() {
  // Use useParams hook to get route parameters
  const params = useParams();
  const assignmentId = params.id as string; // Get ID from URL

  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State for fetch/save errors
  const [assignment, setAssignment] = useState<AssignmentData>(defaultAssignmentState);

  // --- Fetch Assignment Data ---
  const fetchAssignmentData = useCallback(async () => {
    console.log("Fetching assignment data...____+>");
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    if (!token) {
        toast({ title: "Authentication Error", description: "Please log in.", variant: "destructive" });
        setIsLoading(false);
        router.push('/login');
        return;
    }
    if (!assignmentId) {
        setError("Assignment ID not found.");
        setIsLoading(false);
        return;
    }

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
        console.log(`Saving assignment changes to: ${apiUrl}/assignment/${assignmentId}/edit`);

        const response = await fetch(`${apiUrl}/assignment/${assignmentId}/edit`, { // Corrected endpoint
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to fetch assignment (Status: ${response.status})`);
        }

        const data = await response.json();
        console.log("Fetched Assignment Data:", data);

        // Format data for the state (especially date)
        const formattedData: AssignmentData = {
            ...defaultAssignmentState, // Start with defaults
            ...data, // Overwrite with fetched data
            dueDate: data.dueDate ? format(new Date(data.dueDate), 'yyyy-MM-dd') : "", // Format for input[type=date]
            // Ensure content object exists even if backend sends null/undefined
            content: {
                 instructions: data.content?.instructions || "",
                 rubric: data.content?.rubric || "",
                 questions: data.content?.questions || "",
                 peer_evaluation: data.content?.peer_evaluation || "",
                 answer_key: data.content?.answer_key || "",

            },
            llmsIntegration: data.publishToLMS || [], // Assuming this is an array
        };

        setAssignment(formattedData);

    } catch (err: any) {
        console.error("Error fetching assignment data:", err);
        setError(err.message || "Failed to load assignment details.");
        toast({ title: "Loading Error", description: err.message || "Could not load assignment.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  }, [assignmentId, router, toast]); // Add dependencies

  // Fetch data on component mount
  useEffect(() => {
    fetchAssignmentData();
  }, [fetchAssignmentData]); // Depend on the memoized fetch function


  // --- Handle Input Changes ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target;
      setAssignment(prev => ({ ...prev, [id]: value }));
  };

  const handleNestedChange = (parentKey: 'content', childKey: 'instructions' | 'rubric', value: string) => {
      setAssignment(prev => ({
          ...prev,
          [parentKey]: {
              ...prev[parentKey],
              [childKey]: value
          }
      }));
  };

 const handleSelectChange = (field: keyof AssignmentData, value: string) => {
    setAssignment(prev => ({ ...prev, [field]: value }));
  };

 const handleCheckboxChange = (field: keyof AssignmentData, checked: boolean | 'indeterminate') => {
    // Assuming these are boolean settings
    if (typeof checked === 'boolean') {
        setAssignment(prev => ({ ...prev, [field]: checked }));
    }
 };

 const handleLMSChange = (lmsName: string, checked: boolean | 'indeterminate') => {
     if (typeof checked !== 'boolean') return; // Should not happen with Checkbox

     setAssignment(prev => {
         const currentLMS = prev.publishToLMS || [];
         if (checked) {
             // Add if not already present
             return { ...prev, publishToLMS: [...new Set([...currentLMS, lmsName])] };
         } else {
             // Remove if present
             return { ...prev, publishToLMS: currentLMS.filter(lms => lms !== lmsName) };
         }
     });
 };


  // --- Save Changes ---
  const handleSaveAssignment = async () => {
    setIsSaving(true);
    setError(null); // Clear previous save errors
    const token = localStorage.getItem('token');

    if (!token) { /* ... handle auth error ... */ setIsSaving(false); return; }
    if (!assignmentId) { /* ... handle missing ID error ... */ setIsSaving(false); return; }

    // Prepare payload - potentially clean up or format data before sending
    const payload: Partial<AssignmentData> = {
        title: assignment.title,
        description: assignment.description,
        // dueDate: assignment.dueDate || null, // Send null if empty
        totalPoints: assignment.totalPoints,
        type: assignment.type,
        content: { // Send nested content
            instructions: assignment.content?.instructions,
            rubric: assignment.content?.rubric,
            questions: assignment.content?.questions,
            peer_evaluation: assignment.content?.peer_evaluation,
            answer_key: assignment.content?.answer_key,
        },
        lmsIntegration: assignment.lmsIntegration, // Assuming this is the correct field
    };


    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
        console.log(`Saving assignment changes to: ${apiUrl}/assignment/${assignmentId}/edit`);

        const response = await fetch(`${apiUrl}/assignment/${assignmentId}/edit`, { // Corrected endpoint
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to save assignment (Status: ${response.status})`);
        }

        const updatedData = await response.json();
        console.log("Assignment Updated:", updatedData);

        toast({
            title: "Assignment Updated",
            description: "Your changes have been saved successfully.",
        });

        // Navigate back to the assignment details page
        router.push(`/dashboard/assignments`); 

    } catch (err: any) {
        console.error("Error saving assignment:", err);
        setError(err.message || "Failed to save changes.");
        toast({ title: "Save Error", description: err.message || "Could not save changes.", variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  };

  // --- Cancel Action ---
  const handleCancel = () => {
    // Navigate back without saving - consider adding a confirmation dialog if changes were made
    router.back(); // Go back to previous page
    // Or: router.push(`/dashboard/assignments`);
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 pt-6">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading assignment details...</p>
        </div>
      </div>
    );
  }

  // --- Error State ---
   if (error) {
      return (
         <div className="flex-1 p-4 md:p-8 pt-6">
              <div className="flex items-center mb-4">
                  <Button variant="outline" size="icon" onClick={handleCancel} className="mr-2 h-8 w-8">
                      <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-xl font-bold tracking-tight text-destructive">Error Loading Assignment</h2>
              </div>
              <Card className="border-destructive bg-destructive/10">
                  <CardContent className="p-6 text-center">
                      <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-3" />
                      <p className="text-destructive mb-4">{error}</p>
                      <Button variant="secondary" onClick={fetchAssignmentData}>Retry</Button>
                  </CardContent>
              </Card>
         </div>
      )
   }

  // --- Main Render ---
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-4xl mx-auto"> {/* Constrain width */}
      <div className="flex items-center justify-between space-y-2 mb-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleCancel} className="mr-2 h-9 px-3"> {/* Adjusted button */}
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Edit Assignment</h2>
        </div>
        {assignment.course && <Badge variant="outline">{assignment.course}</Badge>}
      </div>

        {/* Display Save Error if present */}
       {error && !isLoading && (
           <p className="text-sm text-destructive text-center p-2 bg-destructive/10 rounded border border-destructive/30">
               <AlertTriangle className="inline h-4 w-4 mr-1" /> Save Error: {error}
           </p>
       )}

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          {/* Conditionally render tabs if content exists? Or allow adding? */}
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
          <TabsTrigger value="rubric">Rubric</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Edit the core details of your assignment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Assignment Title *</Label>
                <Input id="title" value={assignment.title} onChange={handleInputChange} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={assignment.description} onChange={handleInputChange} rows={4} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" value={assignment.dueDate} onChange={handleInputChange} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="totalPoints">Total Points</Label>
                  <Input id="totalPoints" type="number" min="0" value={assignment.totalPoints || ''} onChange={(e) => setAssignment(prev => ({ ...prev, totalPoints: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 }))} />
                </div>
              </div>
              {/* Course and Type might not be editable after creation, depending on your logic */}
              {/* If they are, add similar controlled components here */}
              <div className="space-y-1.5">
                  <Label htmlFor="course">Course (Read-only)</Label>
                  <Input id="course" value={assignment.course} readOnly disabled className="bg-muted/50"/>
              </div>
               <div className="space-y-1.5">
                  <Label htmlFor="type">Assignment Type (Read-only)</Label>
                  <Input id="type" value={assignment.type} readOnly disabled className="bg-muted/50 capitalize"/>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Instructions Tab */}
        <TabsContent value="instructions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Instructions</CardTitle>
              <CardDescription>Edit the detailed instructions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="instructions" // Use ID matching the key
                value={assignment.content?.instructions || ""}
                onChange={(e) => handleNestedChange('content', 'instructions', e.target.value)}
                className="min-h-[400px] font-mono text-sm" // Added text-sm
                placeholder="Enter assignment instructions here..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rubric Tab */}
        <TabsContent value="rubric" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grading Rubric</CardTitle>
              <CardDescription>Edit the grading rubric (Markdown supported).</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="rubric" // Use ID matching the key
                value={assignment.content?.rubric || ""}
                onChange={(e) => handleNestedChange('content', 'rubric', e.target.value)}
                className="min-h-[400px] font-mono text-sm" // Added text-sm
                placeholder="Enter grading rubric here (Markdown format recommended)..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Settings</CardTitle>
              <CardDescription>Configure integrations and advanced options.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6"> {/* Increased spacing */}
              {/* LMS Integration */}
              <div className="space-y-2">
                <Label className="font-medium">LMS Integration</Label>
                <div className="space-y-3 rounded-md border p-4 bg-muted/30">
                  {/* Canvas Example */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="publish-canvas"
                        checked={assignment.publishToLMS?.includes("Canvas")}
                        onCheckedChange={(checked) => handleLMSChange("Canvas", checked)}
                        // disabled={!isCanvasConnected} // Example: Disable if not connected
                      />
                      <Label htmlFor="publish-canvas" className="text-sm font-normal"> Publish to Canvas </Label>
                    </div>
                    {/* TODO: Show connection status dynamically */}
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200"> Connected </Badge>
                    {/* <Button variant="outline" size="sm" className="h-7 text-xs">Connect</Button> */}
                  </div>
                  {/* Google Classroom Example */}
                   <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="publish-google"
                        checked={assignment.publishToLMS?.includes("Google Classroom")}
                        onCheckedChange={(checked) => handleLMSChange("Google Classroom", checked)}
                        disabled // Example: Disabled if not connected
                      />
                      <Label htmlFor="publish-google" className="text-sm font-normal text-muted-foreground"> Publish to Google Classroom </Label>
                    </div>
                     <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => router.push("/dashboard/integrations")}> Connect </Button>
                  </div>
                </div>
              </div>
              {/* Advanced Settings */}
              <div className="space-y-2">
                <Label className="font-medium">Advanced Options</Label>
                <div className="space-y-3 rounded-md border p-4 bg-muted/30">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="plagiarismCheckEnabled" checked={assignment.plagiarismCheckEnabled} onCheckedChange={(checked) => handleCheckboxChange('plagiarismCheckEnabled', checked)} />
                    <Label htmlFor="plagiarismCheckEnabled" className="text-sm font-normal"> Enable plagiarism detection </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="aiGradingEnabled" checked={assignment.aiGradingEnabled} onCheckedChange={(checked) => handleCheckboxChange('aiGradingEnabled', checked)} />
                    <Label htmlFor="aiGradingEnabled" className="text-sm font-normal"> Enable AI-assisted grading features </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="allowLateSubmissions" checked={assignment.allowLateSubmissions} onCheckedChange={(checked) => handleCheckboxChange('allowLateSubmissions', checked)} />
                    <Label htmlFor="allowLateSubmissions" className="text-sm font-normal"> Allow late submissions </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={handleCancel} disabled={isSaving}> Cancel </Button>
        <Button onClick={handleSaveAssignment} disabled={isSaving || isLoading}>
          {isSaving ? ( <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> ) : ( <><Save className="mr-2 h-4 w-4" /> Save Changes</> )}
        </Button>
      </div>
    </div>
  )
}
