"use client"
import { useState, useEffect } from "react"; // Import hooks
import Link from "next/link";
import { useRouter } from 'next/navigation'; // To redirect on auth error
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CalendarDays, Clock, FileText, Plus, Search, AlertTriangle, Loader2 } from "lucide-react"; // Import new icons
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns'; // For formatting dates

// Define an interface for the assignment structure coming from the backend
interface Assignment {
  _id: string;
  title: string;
  course: string;
  type: string; // Added type for potential display/filtering
  dueDate?: string; // Optional dueDate (comes as ISO string)
  createdAt: string; // Comes as ISO string
  // Add other relevant fields if they exist in your model, e.g., status
  // submissionsCount?: number; // Example if you add this later
}

export default function AssignmentsPage() {
  const { toast } = useToast();
  const router = useRouter();

  // State for assignments, loading, and errors
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search input

  // Function to fetch assignments
  const fetchAssignments = async () => {
    setIsLoading(true);
    setError(null);

    // Retrieve token from localStorage (use the key you decided on, e.g., 'token' or 'authToken')
    const token = localStorage.getItem('token');

    if (!token) {
      setError("Authentication token not found. Please log in.");
      setIsLoading(false);
      toast({
          title: "Unauthorized",
          description: "You need to be logged in to view assignments.",
          variant: "destructive",
      });
      router.push('/login'); // Redirect to login if no token
      return;
    }

    try {
      console.log(`genium brother`);
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
      console.log(`Workspaceing assignments from: ${apiUrl}/assignment`);

      const response = await fetch(`${apiUrl}/assignment`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Send the token
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: Assignment[] = await response.json();
        setAssignments(data);
        console.log("Assignments fetched:", data);
      } else if (response.status === 401) {
        // Handle unauthorized access (e.g., expired token)
        setError("Your session may have expired. Please log in again.");
        localStorage.removeItem('token'); // Clear invalid token
        localStorage.removeItem('user');
        toast({
            title: "Session Expired",
            description: "Please log in again.",
            variant: "destructive",
        });
        router.push('/login'); // Redirect to login
      } else {
        // Handle other server errors
        const errorData = await response.json();
        setError(errorData.message || `Failed to fetch assignments (Status: ${response.status})`);
        console.error("Error fetching assignments:", response.status, errorData);
      }
    } catch (err) {
      // Handle network errors
      console.error("Network error fetching assignments:", err);
      setError("Could not connect to the server to fetch assignments.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch assignments when the component mounts
  useEffect(() => {
    fetchAssignments();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this runs once on mount

  // Filter assignments based on search term (client-side filtering)
  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to determine assignment status and badge variant
  const getAssignmentStatus = (dueDate?: string): { text: string; variant: "default" | "secondary" | "outline" | "destructive" } => {
    if (!dueDate) {
        return { text: "Draft", variant: "outline" };
    }
    const now = new Date();
    const due = new Date(dueDate);

    // Set time to end of day for comparison to include the due date itself
    due.setHours(23, 59, 59, 999);

    if (due < now) {
        return { text: "Ended", variant: "secondary" };
    } else {
        return { text: "Active", variant: "default" }; // 'default' is the primary colored badge
    }
  };

   // Helper to format dates or return placeholder
   const formatDate = (dateString?: string, formatStr: string = 'MMM dd, yyyy') => {
     if (!dateString) return 'N/A';
     try {
         return format(new Date(dateString), formatStr);
     } catch (e) {
         console.error("Error formatting date:", e);
         return 'Invalid Date';
     }
   };


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header and Create Button */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Assignments</h2>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/create-assignment">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Assignment
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex justify-end mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title, course, type..."
            className="w-[200px] pl-8 md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
         <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading assignments...</span>
         </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <Card className="border-destructive bg-destructive/10">
            <CardHeader className="flex flex-row items-center space-x-3 space-y-0">
                 <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">Error Loading Assignments</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-destructive">{error}</p>
            </CardContent>
             <CardFooter>
                 <Button variant="secondary" onClick={fetchAssignments}>Retry</Button>
             </CardFooter>
        </Card>
      )}

      {/* No Assignments State */}
      {!isLoading && !error && filteredAssignments.length === 0 && (
         <div className="text-center py-10 border border-dashed rounded-lg">
             <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
             <p className="text-muted-foreground">
                 {assignments.length === 0 ? "You haven't created any assignments yet." : "No assignments match your search."}
             </p>
             {assignments.length === 0 && (
                 <Link href="/dashboard/create-assignment" className="mt-4 inline-block">
                     <Button variant="outline">Create your first assignment</Button>
                 </Link>
             )}
         </div>
      )}

      {/* Assignment Grid */}
      {!isLoading && !error && filteredAssignments.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAssignments.map((assignment) => {
             const status = getAssignmentStatus(assignment.dueDate);
            return (
              <Card key={assignment._id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{assignment.title}</CardTitle> {/* Slightly larger title */}
                    <CardDescription>{assignment.course}</CardDescription>
                  </div>
                   {/* Dynamic Badge */}
                   <Badge variant={status.variant}>{status.text}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-1.5"> {/* Added space */}
                     {/* Display Due Date or Created Date */}
                     {assignment.dueDate ? (
                        <div className="flex items-center">
                           <CalendarDays className="mr-1.5 h-4 w-4 flex-shrink-0" /> {/* Adjusted margin */}
                           <span>Due: {formatDate(assignment.dueDate)}</span>
                         </div>
                     ) : (
                         <div className="flex items-center">
                           <Clock className="mr-1.5 h-4 w-4 flex-shrink-0" /> {/* Adjusted margin */}
                           <span>Created: {formatDate(assignment.createdAt)}</span>
                         </div>
                     )}
                    {/* Placeholder for submissions - replace when available */}
                    <div className="flex items-center">
                      <FileText className="mr-1.5 h-4 w-4 flex-shrink-0" /> {/* Adjusted margin */}
                      {/* Add submission count here when available */}
                      <span>Type: {assignment.type.replace("_", " ")}</span> {/* Display type */}
                      {/* <span>{assignment.submissionsCount ?? 'N/A'} submissions</span> */}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {/* Link uses dynamic assignment ID */}
                  <Link href={`/dashboard/assignments/${assignment._id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                       {status.text === "Draft" ? "Edit Draft" : "View Details"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
           })}
        </div>
      )}
    </div>
  );
}