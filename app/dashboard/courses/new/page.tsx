"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast" // Adjust path if needed

export default function NewCoursePage() {
  const { toast } = useToast();
  const router = useRouter(); // Initialize router
  const [isCreating, setIsCreating] = useState(false);

  const [courseTitle, setCourseTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("spring-2025"); // Default value
  const [description, setDescription] = useState("");
  // Optional: Add state for schedule if you want to save it
  // const [scheduleDays, setScheduleDays] = useState("");
  // const [scheduleTime, setScheduleTime] = useState("");

  const handleCreateCourse = async () => {
    if (!courseTitle.trim() || !courseCode.trim()) {
        toast({
            title: "Missing Information",
            description: "Please enter both Course Title and Course Code.",
            variant: "destructive",
        });
        return;
    }

    setIsCreating(true);
    const token = localStorage.getItem('token'); // Get auth token

    if (!token) {
        toast({ title: "Error", description: "Authentication required. Please log in.", variant: "destructive" });
        setIsCreating(false);
        router.push('/login'); // Redirect to login if no token
        return;
    }

    // --- Prepare Payload ---
    const courseData = {
        title: courseTitle,
        courseCode: courseCode,
        department: department || undefined, // Send undefined if empty, adjust backend if needed
        semester: semester || undefined,
        description: description || undefined,
        // Add schedule details if state exists
        // schedule: { days: scheduleDays, time: scheduleTime }
    };

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
        console.log(`Creating course at: ${apiUrl}/courses`);

        const response = await fetch(`${apiUrl}/courses`, { // Assuming POST /api/courses endpoint
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(courseData),
        });

        const responseData = await response.json(); // Attempt to parse JSON

        if (response.ok) {
            toast({
                title: "Course Created",
                description: `"${responseData.title || courseTitle}" created successfully.`, // Use title from response if available
            });
            // Navigate to the courses list page or the new course page
            // router.push(`/dashboard/courses/${responseData._id}`); // Option: Go to new course detail page
            router.push("/dashboard/courses"); // Option: Go back to courses list

        } else {
            // Handle API errors
            console.error("Failed to create course:", response.status, responseData);
            toast({
                title: "Creation Failed",
                description: responseData.message || `Server responded with ${response.status}. Please try again.`,
                variant: "destructive",
            });
        }
    } catch (error) {
        // Handle network errors
        console.error("Error creating course:", error);
        toast({
            title: "Network Error",
            description: `Could not connect to the server. ${error instanceof Error ? error.message : ''}`,
            variant: "destructive",
        });
    } finally {
        setIsCreating(false); // Ensure loading state is turned off
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-3xl mx-auto"> {/* Centered content */}
      <div className="flex items-center space-x-2 mb-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/courses" aria-label="Back to courses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Create New Course</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
          <CardDescription>Enter the details for your new course. Title and Code are required.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Use grid for better alignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"> {/* Reduced space */}
              <Label htmlFor="course-title">Course Title *</Label>
              <Input
                id="course-title"
                placeholder="e.g., Introduction to Psychology"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="course-code">Course Code *</Label>
              <Input
                id="course-code"
                placeholder="e.g., PSY 101"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                required
               />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="department">Department</Label>
            {/* Controlled Select Component */}
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Psychology">Psychology</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Environmental Studies">Environmental Studies</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="History">History</SelectItem>
                <SelectItem value="Biology">Biology</SelectItem>
                {/* Add more departments */}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="semester">Semester</Label>
             {/* Controlled Select Component */}
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger id="semester">
                <SelectValue placeholder="Select semester (optional)" />
              </SelectTrigger>
              <SelectContent>
                {/* Add more relevant semesters */}
                <SelectItem value="Spring 2025">Spring 2025</SelectItem>
                <SelectItem value="Summer 2025">Summer 2025</SelectItem>
                <SelectItem value="Fall 2025">Fall 2025</SelectItem>
                <SelectItem value="Winter 2026">Winter 2026</SelectItem>
                <SelectItem value="Spring 2026">Spring 2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Course Description</Label>
            <Textarea
                id="description"
                placeholder="Enter a brief description of the course (optional)"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Optional: Course Schedule Section */}
          {/*
          <div className="space-y-2 pt-2">
            <Label>Course Schedule (Optional)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="days" className="text-sm text-muted-foreground"> Days </Label>
                <Select value={scheduleDays} onValueChange={setScheduleDays}>
                  <SelectTrigger id="days"> <SelectValue placeholder="Select days" /> </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MW">Monday/Wednesday</SelectItem>
                    <SelectItem value="TR">Tuesday/Thursday</SelectItem>
                    <SelectItem value="MWF">Monday/Wednesday/Friday</SelectItem>
                    <SelectItem value="F">Friday only</SelectItem>
                    <SelectItem value="W">Wednesday only</SelectItem>
                    <SelectItem value="TBA">To Be Announced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="time" className="text-sm text-muted-foreground"> Time </Label>
                <Select value={scheduleTime} onValueChange={setScheduleTime}>
                  <SelectTrigger id="time"> <SelectValue placeholder="Select time" /> </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9:00-10:15">9:00 AM - 10:15 AM</SelectItem>
                    <SelectItem value="10:30-11:45">10:30 AM - 11:45 AM</SelectItem>
                    <SelectItem value="13:00-14:15">1:00 PM - 2:15 PM</SelectItem>
                    <SelectItem value="14:30-15:45">2:30 PM - 3:45 PM</SelectItem>
                    <SelectItem value="16:00-17:15">4:00 PM - 5:15 PM</SelectItem>
                     <SelectItem value="TBA">To Be Announced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          */}

        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/dashboard/courses">Cancel</Link>
          </Button>
          <Button onClick={handleCreateCourse} disabled={isCreating}>
            {isCreating ? (
              <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating... </>
            ) : (
              <> <Plus className="mr-2 h-4 w-4" /> Create Course </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
