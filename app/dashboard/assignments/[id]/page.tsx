"use client"

import { useState, useEffect, use } from "react"; // Import hooks
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Share2, Edit, AlertTriangle, Loader2, Clock, CalendarDays, Trash2 } from "lucide-react"; // Import icons
import { FileUpload } from "@/components/file-upload"; // Assuming this component handles file selection/upload trigger
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns'; 

interface Submission {
  _id: string;
  studentName?: string | null; 
  studentId?: string; 
  submissionDate: string;
  status: 'pending' | 'graded';
  score?: number | null;
  aiScore?: number; 
  plagiarismScore?: number; 
  fileUrl?: string; 
}

interface AssignmentDetails {
  _id: string;
  title: string;
  course: string; 
  description: string;
  dueDate?: string;
  createdAt: string; 
  totalPoints?: number; 
  submissions: Submission[]; 
}

export default function AssignmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { toast } = useToast();
  const { id: assignmentId } = use(params); // Unwrap `params` using `use`

  const [assignment, setAssignment] = useState<AssignmentDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);


  const [assignNameOpen, setAssignNameOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [selectedStudent, setSelectedStudent] = useState(""); // For dropdown selection
  const [manualStudentName, setManualStudentName] = useState(""); // For manual entry
  const [activeTab, setActiveTab] = useState("select"); // For dialog tabs

  // State for student roster (example)
  const [studentRoster, setStudentRoster] = useState<{ id: string; name: string }[]>([
    // TODO: Fetch this from an API based on the assignment's course
    { id: "S12345", name: "John Doe" },
    { id: "S12346", name: "Jane Smith" },
    { id: "S12347", name: "Bob Johnson" },
  ]);


  const fetchAssignmentDetails = async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('token'); // Use your consistent token key

    if (!token) {
      setError("Authentication token not found. Please log in.");
      setIsLoading(false);
      toast({ title: "Unauthorized", description: "Please log in.", variant: "destructive" });
      router.push('/login');
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
      console.log(`Workspaceing assignment details from: ${apiUrl}/assignment/${assignmentId}`);

      const response = await fetch(`${apiUrl}/assignment/${assignmentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: AssignmentDetails = await response.json();
        setAssignment(data);
        console.log("Assignment details fetched:", data);
      } else if (response.status === 401) {
        setError("Your session may have expired. Please log in again.");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast({ title: "Session Expired", description: "Please log in again.", variant: "destructive" });
        router.push('/login');
      } else if (response.status === 404) {
        setError(`Assignment with ID ${assignmentId} not found.`);
        console.error("Assignment not found:", response.status);
      }
       else {
        const errorData = await response.json();
        setError(errorData.message || `Failed to fetch assignment details (Status: ${response.status})`);
        console.error("Error fetching assignment details:", response.status, errorData);
      }
    } catch (err) {
      console.error("Network error fetching assignment details:", err);
      setError("Could not connect to the server to fetch assignment details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId) {
      fetchAssignmentDetails();
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignmentId]); 




const handleUploadComplete = async (files: File[], images: string[]) => {
    if (!files || files.length === 0) {
        toast({
            title: "No File Selected",
            description: "Please select a file to upload.",
            variant: "warning", // Use warning variant
        });
        return;
    }

    const fileToUpload = files[0];
    console.log("File to upload:", fileToUpload.name, fileToUpload.size);
    // TODO: Handle images if needed - requires backend changes (e.g., different field name, conversion)
    if (images && images.length > 0) {
       console.log("Images captured (currently ignored by upload):", images.length);
       // If you need to upload images (e.g., as base64 strings or converted to blobs),
       // you'd append them to FormData here and adjust the backend.
    }

    setIsUploading(true); 
    const token = localStorage.getItem('token'); // Use your consistent token key

    if (!token) {
        toast({ title: "Error", description: "Authentication required to submit.", variant: "destructive" });
        setIsUploading(false);
        return;
    }

    const formData = new FormData();
    formData.append('submissionFile', fileToUpload, fileToUpload.name); 
    formData.append('assignmentId', assignmentId); 

    // Optional: Add manual student name if teacher is submitting (needs UI element)
    // if (manualStudentNameForUpload) {
    //   formData.append('studentNameManual', manualStudentNameForUpload);
    // }

    try {
        console.log("Preparing to upload submission...", fileToUpload.name);
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
        console.log(`Uploading submission to: ${apiUrl}/submissions`);

        const response = await fetch(`${apiUrl}/submissions`, { 
            method: 'POST',
            headers: {
                // DO NOT set 'Content-Type': 'application/json' when sending FormData
                'Authorization': `Bearer ${token}`,
            },
            body: formData, 
        });

        const responseData = await response.json(); // Attempt to parse JSON response

        if (response.ok) {
            console.log("Submission successful:", responseData);
            toast({
                title: "Submission Successful",
                description: `"${responseData.fileName || fileToUpload.name}" uploaded successfully.`,
            });

            fetchAssignmentDetails();

        } else {
            console.error("Submission upload failed:", response.status, responseData);
            toast({
                title: "Upload Failed",
                description: responseData.message || `Server responded with ${response.status}. Please try again.`,
                variant: "destructive",
            });
        }

    } catch (err) {
        console.error("Network error during submission upload:", err);
        toast({
            title: "Network Error",
            description: `Could not connect to the server. ${err instanceof Error ? err.message : ''}`,
            variant: "destructive",
        });
    } finally {
        setIsUploading(false); 
    }
};

  const handleEditAssignment = () => {
    // You might pass state or refetch details on the edit page
    router.push(`/dashboard/assignments/${assignmentId}/edit`);
  };

  const handleDeleteSubmission = async (submission: Submission) => {
    const token = localStorage.getItem('token'); // Use your consistent token key
    if (!token) {
        toast({ title: "Error", description: "Authentication required.", variant: "destructive" });
        return;
    }
    if (!submission) return;
    console.log(`Deleting submission ${submission}...`);
    const confirmation = confirm(`Are you sure you want to delete the submission from ${submission.studentName || 'this student'}?`);
    if (confirmation) {
      try {
          const token = localStorage.getItem('token');
          if (!token) {
            toast({ title: "Error", description: "Authentication required.", variant: "destructive" });
            return;
          }
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
          const response = await fetch(`${apiUrl}/submissions/${submission._id}`, {
            method: 'DELETE',
            headers: {
            'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            toast({ title: "Success", description: "Submission deleted successfully." });
            fetchAssignmentDetails(); // Refresh the list
          } else {
            const errorData = await response.json();
            toast({
            title: "Error",
            description: errorData.message || "Failed to delete submission.",
            variant: "destructive",
            });
          }
          } catch (err) {
          toast({
            title: "Network Error",
            description: "Could not delete submission.",
            variant: "destructive",
          });
          console.error("Error deleting submission:", err);
          }
        }
      }



  const handleAssignName = async () => {
    if (!selectedSubmission) return;

    const studentNameToAssign = activeTab === "select" ? selectedStudent : manualStudentName;

    if (!studentNameToAssign) {
      toast({ title: "Error", description: "Please select or enter a student name.", variant: "destructive" });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        toast({ title: "Error", description: "Authentication required.", variant: "destructive" });
        return;
    }

    console.log(`Assigning name "${studentNameToAssign}" to submission ${selectedSubmission._id}`);
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/submissions/${selectedSubmission._id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentName: studentNameToAssign }) // Send the name to update
        });

        if (response.ok) {
            toast({ title: "Success", description: `Submission assigned to ${studentNameToAssign}` });
            // Refresh data to show the change
            fetchAssignmentDetails();
            setAssignNameOpen(false); // Close dialog
            // Reset dialog state
            setSelectedSubmission(null);
            setSelectedStudent("");
            setManualStudentName("");
            setActiveTab("select");
        } else {
            const errorData = await response.json();
            toast({ title: "Error Assigning Name", description: errorData.message || "Failed to update submission.", variant: "destructive" });
        }
    } catch (err) {
         toast({ title: "Network Error", description: "Could not assign name.", variant: "destructive" });
         console.error("Error assigning name:", err);
    }
  };

  const openAssignNameDialog = (submission: Submission) => {
    setSelectedSubmission(submission);
    setAssignNameOpen(true);
  };

   // Helper to format dates
   const formatDate = (dateString?: string, formatStr: string = 'PP') => { // PP format: Dec 15, 2023
     if (!dateString) return 'N/A';
     try {
         return format(new Date(dateString), formatStr);
     } catch (e) {
         console.error("Error formatting date:", e);
         return 'Invalid Date';
     }
   };

   // Helper to get initials
   const getInitials = (name?: string | null) => {
     if (!name) return "?";
     return name.split(" ").map((n) => n[0]).join("").toUpperCase();
   }


  // --- Render Logic ---

  if (isLoading) {
    return (
        <div className="container mx-auto py-6 flex justify-center items-center min-h-[300px]">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  if (error) {
     return (
        <div className="container mx-auto py-6 space-y-6">
             <Card className="border-destructive bg-destructive/10">
                 <CardHeader className="flex flex-row items-center space-x-3 space-y-0">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                     <CardTitle className="text-destructive">Error Loading Assignment</CardTitle>
                 </CardHeader>
                 <CardContent>
                     <p className="text-destructive">{error}</p>
                 </CardContent>
                 <CardFooter>
                      <Button variant="secondary" onClick={fetchAssignmentDetails}>Retry</Button>
                      <Button variant="outline" className="ml-2" onClick={() => router.back()}>Go Back</Button>
                 </CardFooter>
             </Card>
        </div>
     )
  }

  if (!assignment) {
      return (
         <div className="container mx-auto py-6 text-center">
             <p className="text-muted-foreground">Assignment data could not be loaded.</p>
         </div>
      );
  }

  // --- Main Render Output ---
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{assignment.title}</h1>
          <p className="text-muted-foreground">
            Course: {assignment.course} | Due: {formatDate(assignment.dueDate)}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
           {/* TODO: Only show submit if user is a student? Need role check */}
           <FileUpload
            //  trigger={<Button className="w-full sm:w-auto">Submit Assignment</Button>} 
             trigger={  <Button className="w-full sm:w-auto" disabled={isUploading}>
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isUploading ? 'Submitting...' : 'Submit Assignment'}
              </Button>}
             title="Submit Assignment"
             description="Upload your completed assignment. You can upload files or take photos."
             onUploadComplete={handleUploadComplete}
             // Pass assignmentId or other necessary info to the component if needed
           />
           {/* TODO: Only show edit if user is the teacher/creator? Need role check */}
           <Button variant="outline" onClick={handleEditAssignment} className="w-full sm:w-auto">
             <Edit className="mr-2 h-4 w-4" />
             Edit Assignment
           </Button>
        </div>
      </div>

      {/* Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{assignment.description}</p> {/* Preserve formatting */}
          {assignment.totalPoints !== undefined && (
            <p className="mt-3 text-sm">
              <strong>Total Points:</strong> {assignment.totalPoints}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Submissions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>{assignment.submissions.length} submission(s) received</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignment.submissions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No submissions received yet.</p>
            ) : (
              assignment.submissions.map((submission) => (
              <div key={submission._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                {/* Student Info */}
                <div className="flex items-center gap-3">
                  <Avatar>
                     {/* Placeholder image - replace if you have actual student avatars */}
                     <AvatarImage src={`/placeholder-user.jpg`} alt={submission.studentName || 'Student'} />
                    <AvatarFallback>{getInitials(submission.studentName)}</AvatarFallback>
                  </Avatar>
                    <div>
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium text-primary hover:underline" // Use primary color
                      onClick={() => openAssignNameDialog(submission)}
                    >
                      {submission.studentName || "Assign Student Name"}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Submitted: {formatDate(submission.submissionDate)}
                    </p>
                    </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                   {/* Status/Score Badge */}
                   {submission.status === "graded" ? (
                     <Badge className="bg-green-100 text-green-800 border border-green-200 px-2.5 py-0.5">
                        {submission.score ?? 'N/A'}{assignment.totalPoints ? `/${assignment.totalPoints}` : ''}
                    </Badge>
                   ) : (
                     <Badge variant="outline" className="px-2.5 py-0.5">Pending</Badge>
                   )}
                   {/* Action Buttons */}
                   <div className="flex gap-1.5"> {/* Reduced gap */}
                      {/* TODO: Implement Share functionality */}
                     {/* <Button variant="outline" size="icon" asChild title="Share">
                       <Link href={`/dashboard/assignments/${assignmentId}/submissions/${submission._id}/share`}>
                         <Share2 className="h-4 w-4" />
                       </Link>
                     </Button> */}
                     {/* TODO: Implement Download functionality (needs fileUrl) */}
                     <Button variant="outline" size="icon" asChild title="Download" disabled={!submission.fileUrl}>
                       <Link href={submission.fileUrl || '#'} target="_blank" rel="noopener noreferrer">
                       <Download className="h-4 w-4" />
                       </Link>
                     </Button>
                     {/* Link to Review Page */}
                     <Button variant="outline" asChild title="Review">
                       <Link href={`/dashboard/assignments/${assignmentId}/submissions/${submission._id}`}>
                       <Eye className="mr-2 h-4 w-4" />
                       Review
                       </Link>
                     </Button>
                     <Button
                       variant="outline"
                       size="icon"
                       title="Delete"
                       onClick={() => handleDeleteSubmission(submission)}
                       className="text-red-500 hover:bg-red-100 focus:bg-red-100 focus:ring-red-500" 
                     >
                       <Trash2 className="h-4 w-4 text-red-500" />
                     </Button>
                   </div>
                </div>
              </div>
            ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Assign Name Dialog */}
      <Dialog open={assignNameOpen} onOpenChange={setAssignNameOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Student Name</DialogTitle>
            <DialogDescription>
              Assign this submission to a student from the roster or enter their name manually.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="select">Select Student</TabsTrigger>
              <TabsTrigger value="manual">Enter Manually</TabsTrigger>
            </TabsList>

            {/* Select Student Tab */}
            <TabsContent value="select" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="student-select">Select from class roster</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger id="student-select">
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                     {studentRoster.length > 0 ? (
                         studentRoster.map(student => (
                             <SelectItem key={student.id} value={student.name}> {/* Use name as value for simplicity here */}
                                 {student.name}
                             </SelectItem>
                         ))
                     ) : (
                         <div className="p-4 text-center text-sm text-muted-foreground">No students in roster.</div>
                     )}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Manual Entry Tab */}
            <TabsContent value="manual" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="student-name">Enter student name</Label>
                <Input
                  id="student-name"
                  value={manualStudentName}
                  onChange={(e) => setManualStudentName(e.target.value)}
                  placeholder="e.g., John Doe"
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignNameOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignName}>Assign Name</Button> {/* API call triggered here */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}