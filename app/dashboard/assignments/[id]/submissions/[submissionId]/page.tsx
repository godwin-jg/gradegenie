"use client"

import { useState, useEffect, useRef, useCallback, JSX, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast"; 

import {
  ArrowLeft, Download, Share2, Save, CheckCircle, AlertTriangle,
  ArrowRight, MessageSquare, Sparkles, Loader2, Eye, Wand2 
} from "lucide-react";

import { format } from 'date-fns'; 

interface InlineComment {
  id: string; 
  startIndex: number;
  endIndex: number;
  text: string;
  color: string; 
  timestamp: string;
  author: string;
  isAIGenerated?: boolean;
  _id?: string; 
}

interface SubScore {
  _id?: string; 
  name: string;
  score: number;
  maxScore: number;
  rationale: string;
}

interface OverallFeedback {
  strengths: string;
  improvements: string;
  actionItems: string;
}

interface AICheckerDetail {
    section: string;
    aiProbability: number;
    humanProbability: number;
}

interface AICheckerResult {
    score: number;
    confidence: string;
    details: AICheckerDetail[];
}

interface PlagiarismMatch {
    _id?: string; // Optional
    text: string;
    source: string;
    similarity: number;
}

interface PlagiarismResult {
    score: number;
    matches: PlagiarismMatch[];
}

interface SubmissionDetails {
  _id: string;
  assignmentId: string | { _id: string, title: string, course: string, totalPoints?: number, createdBy: string }; // Allow ID or populated obj
  assignmentTitle: string; 
  studentName: string; 
  studentId?: string;
  submittedBy: string | { _id: string, name: string, email: string }; 
  submissionDate: string;
  status: 'pending' | 'graded';
  content: string;
  score?: number | null;
  subScores?: SubScore[] | null;
  overallFeedback?: OverallFeedback | null;
  inlineComments?: InlineComment[] | null; 
  aiCheckerResults?: AICheckerResult | null;
  plagiarismResults?: PlagiarismResult | null;
  fileUrl?: string;
  fileName?: string; 
}

export default function SubmissionReviewPage({
  params,
}: {
  params: Promise<{ id: string; submissionId: string }> 
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { id: assignmentId, submissionId } = use(params);

  const [submissionDetails, setSubmissionDetails] = useState<SubmissionDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [inlineComments, setInlineComments] = useState<InlineComment[]>([]);
  const [overallFeedback, setOverallFeedback] = useState<OverallFeedback>({ strengths: "", improvements: "", actionItems: "" });
  const [subScores, setSubScores] = useState<SubScore[]>([]);
  const [finalScore, setFinalScore] = useState<number>(0);

  const [newCommentText, setNewCommentText] = useState<string>("");
  const [selectedText, setSelectedText] = useState<string>("");
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [isCommentMode, setIsCommentMode] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const commentSidebarRef = useRef<HTMLDivElement>(null);

  const defaultRubric: Omit<SubScore, 'score' | 'rationale' | '_id'>[] = [
      { name: "Content/Understanding", maxScore: 30 },
      { name: "Organization/Structure", maxScore: 25 },
      { name: "Evidence/Support", maxScore: 25 },
      { name: "Clarity/Mechanics", maxScore: 20 }
  ];

  const fetchSubmissionDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSubmissionDetails(null);
    setInlineComments([]);
    setOverallFeedback({ strengths: "", improvements: "", actionItems: "" });
    setSubScores([]);
    setFinalScore(0);

    const token = localStorage.getItem('token');
    if (!token) { /* ... handle auth error ... */
        setError("Authentication required."); setIsLoading(false); router.push('/login'); return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/submissions/${submissionId}`, {
        method: 'GET', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      if (!response.ok) { // Throw error for bad responses
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}`);
      }

      const data: SubmissionDetails = await response.json();
      setSubmissionDetails(data);
      console.log("Submission details fetched:", data);

      setInlineComments(() => (data.inlineComments || []).map(c => ({ ...c, id: c._id || c.id })) ); // Ensure 'id' field has the DB _id
      setOverallFeedback(prev =>
        data.overallFeedback && (data.overallFeedback.strengths || data.overallFeedback.improvements || data.overallFeedback.actionItems)
        ? data.overallFeedback
        : prev // Keep existing if fetched is empty but state isn't (e.g. after AI analyze)
      );
      setFinalScore(() => data.score ?? 0);

      if (data.subScores && data.subScores.length > 0) {
        setSubScores(() => data.subScores!.map(s => ({ ...s, _id: s._id || undefined })));
      } else {
        const initialSubScores = defaultRubric.map(item => ({ ...item, score: 0, rationale: "" }));
        setSubScores(() => initialSubScores);
        setFinalScore(() => 0); // Ensure final score is 0 if using default rubric
      }

    } catch (err: any) {
      console.error("Error fetching submission details:", err);
      setError(err.message || "Could not connect to the server.");
      if (err.message?.includes('401') || err.message?.includes('403')) { // Crude check for auth errors in message
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [submissionId, router]); // Removed toast from deps

  useEffect(() => {
    if (submissionId) {
      fetchSubmissionDetails();
    }
  }, [submissionId, fetchSubmissionDetails]);


  const handleTextSelection = () => {
     if (!isCommentMode) return;
     const selection = window.getSelection();
     // Ensure selection is within the contentRef
     if (!selection || selection.rangeCount === 0 || !contentRef.current?.contains(selection.anchorNode)) {
         setSelectedText(""); setSelectionRange(null); setNewCommentText(""); return;
     }
     const range = selection.getRangeAt(0);
     const text = selection.toString().trim();
     if (!text) { setSelectedText(""); setSelectionRange(null); setNewCommentText(""); return; }

     const preSelectionRange = document.createRange();
     preSelectionRange.selectNodeContents(contentRef.current);
     preSelectionRange.setEnd(range.startContainer, range.startOffset);
     const start = preSelectionRange.toString().length;
     const end = start + text.length;

     setSelectedText(text);
     setSelectionRange({ start, end });
     setNewCommentText("");
     setActiveCommentId(null);
     setTimeout(() => { // Scroll new comment box into view
         commentSidebarRef.current?.querySelector('#new-comment-box')?.scrollIntoView({ behavior: "smooth", block: "center" });
     }, 100);
  };

  const addInlineComment = (commentToAdd: Omit<InlineComment, 'id' | 'color' | '_id'>) => {
    const tempId = `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const newComment: InlineComment = {
        ...commentToAdd,
        id: tempId,
        _id: undefined, // Ensure no _id for new comment
        color: getRandomHighlightColor(),
    };
    setInlineComments(prev => [...prev, newComment]);
    if (!commentToAdd.isAIGenerated) {
        setNewCommentText(""); setSelectedText(""); setSelectionRange(null);
        toast({ title: "Comment added locally", description: "Save changes to persist." });
    }
    setActiveCommentId(newComment.id);
    setTimeout(() => scrollToComment(newComment.id), 100);
  };

  const handleAddCommentClick = () => {
    if (!newCommentText.trim() || !selectionRange) return;
    const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
    addInlineComment({
      startIndex: selectionRange.start, 
      endIndex: selectionRange.end,
      text: newCommentText, 
      timestamp: new Date().toISOString(),
      author: loggedInUser.name || "Anonymous", // Use logged-in user's name or fallback
      isAIGenerated: false,
    });
  }

  const removeInlineComment = (idToRemove: string) => {
    setInlineComments(prev => prev.filter(c => c.id !== idToRemove));
    if (activeCommentId === idToRemove) setActiveCommentId(null);
    toast({ title: "Comment removed locally", description: "Save changes to persist.", variant: "destructive"});
  };

  const updateCommentText = (idToUpdate: string, newText: string) => {
    setInlineComments(prev => prev.map(c => c.id === idToUpdate ? { ...c, text: newText } : c));
    toast({ title: "Comment updated locally", description: "Save changes to persist." });
  };

  const getRandomHighlightColor = () => {
    const colors = ["bg-yellow-200/70", "bg-green-200/70", "bg-blue-200/70", "bg-purple-200/70", "bg-pink-200/70"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // --- AI Features ---
  const generateAIComment = async () => {
    if (!selectedText) return;
    setIsGeneratingAI(true); setNewCommentText("");
    const token = localStorage.getItem('token');
    if (!token) { /* handle auth error */ setIsGeneratingAI(false); return; }

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/assignment/suggest-comment`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: selectedText })
        });
        if (!response.ok) { const errData = await response.json(); throw new Error(errData.message || `Error ${response.status}`); }
        const data = await response.json();
        if (data.suggestion) {
            setNewCommentText(data.suggestion);
            toast({ title: "AI Suggestion Ready"});
        } else { throw new Error("Suggestion not found in response."); }
    } catch (error: any) {
        console.error("Error generating AI comment:", error);
        toast({ title: "AI Suggestion Error", description: error.message, variant: "destructive" });
        setNewCommentText("Error generating suggestion.");
    } finally { setIsGeneratingAI(false); }
  };

  const handleAnalyzeWithAI = async () => {
    if (!submissionDetails?.content) { /* handle no content error */ return; }
    setIsAnalyzing(true); setError(null);
    const token = localStorage.getItem('token');
    if (!token) { /* handle auth error */ setIsAnalyzing(false); return; }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/ai/analyze-submission`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionContent: submissionDetails.content, submissionId: submissionDetails._id })
      });
      if (!response.ok) { const errData = await response.json(); throw new Error(errData.message || `Error ${response.status}`); }
      const analysisResult = await response.json();

      // Update Overall Feedback state (merge strategy: only if fields were previously empty)
      if (analysisResult.suggestedOverallFeedback) {
           setOverallFeedback(prev => ({
                strengths: prev.strengths || analysisResult.suggestedOverallFeedback.strengths || "",
                improvements: prev.improvements || analysisResult.suggestedOverallFeedback.improvements || "",
                actionItems: prev.actionItems || analysisResult.suggestedOverallFeedback.actionItems || "",
            }));
      }

      if (analysisResult.suggestedInlineComments?.length > 0) {
           const newAIComments: InlineComment[] = analysisResult.suggestedInlineComments.map((suggestion: any) => ({
               id: `temp-ai-${Date.now()}-${Math.random().toString(16).slice(2)}`,
               _id: undefined,
               startIndex: suggestion.startIndex, endIndex: suggestion.endIndex,
               text: suggestion.text, color: getRandomHighlightColor(),
               timestamp: new Date().toISOString(), author: "AI Assistant",
               isAIGenerated: true,
           }));
           setInlineComments(prev => [...prev, ...newAIComments]);
      }

        if (analysisResult.aiCheckResults && !submissionDetails.aiCheckerResults) {
           setSubmissionDetails(prev => prev ? { ...prev, aiCheckerResults: analysisResult.aiCheckResults } : null);
        }
      toast({ title: "AI Analysis Complete", description: "Suggestions added." });

    } catch (error: any) {
      console.error("Error during AI analysis:", error);
      toast({ title: "AI Analysis Error", description: error.message, variant: "destructive" });
      setError(error.message);
    } finally { setIsAnalyzing(false); }
  };

  const updateSubScore = (index: number, newScore: number | string) => {
    const scoreValue = newScore === '' ? 0 : Number(newScore); // Treat empty string as 0
    const updatedScores = [...subScores];
    const maxScore = updatedScores[index].maxScore;
    const clampedScore = Math.max(0, Math.min(isNaN(scoreValue) ? 0 : scoreValue, maxScore));
    updatedScores[index].score = clampedScore;
    setSubScores(updatedScores);
    recalculateFinalScore(updatedScores);
  };

  const updateSubScoreRationale = (index: number, rationale: string) => {
    setSubScores(prev => prev.map((s, i) => i === index ? { ...s, rationale } : s));
  };

  const updateOverallFeedback = (field: keyof OverallFeedback, value: string) => {
    setOverallFeedback(prev => ({ ...prev, [field]: value }));
  };

  const recalculateFinalScore = useCallback((currentSubScores: SubScore[]) => {
    const total = currentSubScores.reduce((sum, item) => sum + (item.score || 0), 0);
    const max = currentSubScores.reduce((sum, item) => sum + (item.maxScore || 0), 0);
    const newFinalScore = max > 0 ? Math.round((total / max) * 100) : 0;
    setFinalScore(newFinalScore);
  }, []); // No dependencies needed if only operating on arguments

  const saveChanges = async () => {
    setIsSaving(true);
    const token = localStorage.getItem('token');
    if (!token || !submissionDetails) { /* handle error */ setIsSaving(false); return; }

    const payload = {
      score: finalScore,
      subScores: subScores.map(({ _id, ...rest }) => rest), // Remove _id from subscores if backend handles it
      overallFeedback: overallFeedback,
      inlineComments: inlineComments.map(({ id, color, ...rest }) => ({ // Send necessary fields
          ...rest,
          _id: rest._id // Ensure original _id is sent if present
      })),
      status: 'graded'
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/submissions/${submissionId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) { const errData = await response.json(); throw new Error(errData.message || `Error ${response.status}`); }

      const updatedData = await response.json();
      toast({ title: "Changes Saved", description: "Grading saved successfully." });

      // Update state with response to get potentially new _ids for comments/subscores
      if (updatedData.submission) {
        setSubmissionDetails(prev => prev ? { ...prev, ...updatedData.submission } : null);
        // Re-initialize grading states from the *saved* data
        setInlineComments(() => (updatedData.submission.inlineComments || []).map((c: any) => ({ ...c, id: c._id || c.id })));
        setOverallFeedback(() => updatedData.submission.overallFeedback || { strengths: "", improvements: "", actionItems: "" });
        setFinalScore(() => updatedData.submission.score ?? 0);
        setSubScores(() => (updatedData.submission.subScores || []).map((s: any) => ({...s, _id: s._id || undefined})));
      } else {
         // Fallback refetch if response structure is different
         fetchSubmissionDetails();
      }

    } catch (error: any) {
       console.error("Error saving changes:", error);
       toast({ title: "Save Error", description: error.message, variant: "destructive" });
    } finally { setIsSaving(false); }
  };

  const scrollToComment = (commentId: string) => {
    setActiveCommentId(commentId);
    commentSidebarRef.current?.querySelector(`[data-comment-id="${commentId}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const toggleCommentMode = () => {
    setIsCommentMode(prev => !prev);
    if (isCommentMode) { // Means we are turning it OFF
        setSelectedText(""); setSelectionRange(null); setNewCommentText("");
    } else { // Means we are turning it ON
        toast({ title: "Comment mode enabled", description: "Select text to add comments." });
    }
  };

  const renderHighlightedContent = useCallback(() => {
      if (!submissionDetails?.content) return <p className="text-muted-foreground italic">No submission content available.</p>;
      const content = submissionDetails.content;
      const segments: any[] = []; let lastIndex = 0;
      [...inlineComments].sort((a, b) => a.startIndex - b.startIndex).forEach(comment => {
          if (comment.startIndex > lastIndex) segments.push({ type: 'text', content: content.substring(lastIndex, comment.startIndex) });
          segments.push({ type: 'highlight', content: content.substring(comment.startIndex, comment.endIndex), comment });
          lastIndex = comment.endIndex;
      });
      if (lastIndex < content.length) segments.push({ type: 'text', content: content.substring(lastIndex) });

      const renderedParagraphs: JSX.Element[] = []; let currentParagraph: JSX.Element[] = [];
      segments.forEach((segment, index) => {
          if (segment.type === 'text') {
              segment.content.split(/(\n)/).forEach((line: string, lineIndex: number) => {
                  if (line === '\n') {
                      if (currentParagraph.length > 0) renderedParagraphs.push(<p key={`p-${renderedParagraphs.length}`} className="mb-4 min-h-[1.5em]">{currentParagraph}</p>);
                      currentParagraph = [];
                  } else if (line) { currentParagraph.push(<span key={`s-${index}-${lineIndex}`}>{line}</span>); }
              });
          } else {
              const { comment } = segment; const isActive = comment.id === activeCommentId;
              currentParagraph.push(
                  <span key={`h-${comment.id}`}
                      className={`relative inline cursor-pointer group ${comment.color} px-0.5 rounded transition-all duration-200 ${isActive ? "ring-2 ring-primary shadow-md" : ""}`}
                      onClick={(e) => { e.stopPropagation(); scrollToComment(comment.id); }}>
                      {segment.content}
                      <span className={`absolute -top-2.5 -right-1.5 w-5 h-5 ${isActive ? 'bg-primary' : 'bg-gray-600'} text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow`} title={comment.isAIGenerated ? "AI Suggestion" : "Comment"}>
                          {comment.isAIGenerated ? <Sparkles className="w-2.5 h-2.5" /> : <MessageSquare className="w-2.5 h-2.5" />}
                      </span>
                  </span>);
          }
      });
      if (currentParagraph.length > 0) renderedParagraphs.push(<p key={`p-${renderedParagraphs.length}`} className="mb-4 min-h-[1.5em]">{currentParagraph}</p>);
      return renderedParagraphs.length > 0 ? renderedParagraphs : <p className="text-muted-foreground italic">Submission content seems empty.</p>;
  }, [submissionDetails?.content, inlineComments, activeCommentId]);


  const formatDateForDisplay = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try { return format(new Date(dateString), "PPpp"); } catch { return "Invalid Date"; }
  }
  const getInitials = (name?: string | null) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).filter(Boolean).join("").toUpperCase();
  }
  
  const handleDownloadReport = async () => {
    setIsDownloading(true); // Start loading state
    setError(null); // Clear previous errors
    const token = localStorage.getItem('token');

    if (!token) {
        toast({ title: "Authentication Error", description: "Please log in to download report.", variant: "destructive" });
        router.push('/login');
        setIsDownloading(false);
        return;
    }

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
        const reportUrl = `${apiUrl}/submissions/${submissionId}/report`;
        console.log(`Fetching report from: ${reportUrl}`);

        // 1. Fetch the report using Authorization header
        const response = await fetch(reportUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                // No 'Content-Type' needed for GET request itself
            },
        });

        if (!response.ok) {
            // Try to parse error message from backend if possible
            let errorMsg = `Failed to download report (Status: ${response.status})`;
            try {
                const errorData = await response.json();
                errorMsg = errorData.message || errorMsg;
            } catch (e) { /* Ignore parsing error if response wasn't JSON */ }
            throw new Error(errorMsg);
        }

        // 2. Get the response body as a Blob
        const blob = await response.blob();

        // 3. Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // 4. Create a temporary link element
        const link = document.createElement('a');
        link.href = url;

        // 5. Set the download filename (use info from submissionDetails if available)
        const studentName = submissionDetails?.studentName?.replace(/\s+/g, '_') || 'Student';
        // Ensure assignmentTitle is derived correctly (it might be nested)
        const assignmentTitleString = typeof submissionDetails?.assignmentId === 'object'
            ? submissionDetails.assignmentId?.title?.replace(/\s+/g, '_')
            : 'Assignment';
        const filename = `Report_${studentName}_${assignmentTitleString || 'Report'}.pdf`;
        link.setAttribute('download', filename);

        // 6. Append link to body, click it, remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 7. Revoke the object URL to free up memory
        window.URL.revokeObjectURL(url);

        toast({ title: "Download Started", description: "Your report PDF is downloading." });

    } catch (error: any) {
        console.error("Error downloading report:", error);
        setError(error.message || "Could not download the report.");
        toast({ title: "Download Error", description: error.message || "Could not download the report.", variant: "destructive" });
    } finally {
        setIsDownloading(false); // End loading state
    }
  };

  if (isLoading) {
    return ( <div className="container mx-auto py-6 flex justify-center items-center min-h-[50vh]"> <Loader2 className="h-10 w-10 animate-spin text-primary" /> </div> );
  }
  if (error) {
     return ( <div className="container mx-auto py-6 space-y-6"> <Card className="border-destructive bg-destructive/10"> <CardHeader className="flex flex-row items-center space-x-3 space-y-0"> <AlertTriangle className="h-5 w-5 text-destructive" /> <CardTitle className="text-destructive">Error Loading Submission</CardTitle> </CardHeader> <CardContent> <p className="text-destructive">{error}</p> </CardContent> <CardFooter> <Button variant="secondary" onClick={fetchSubmissionDetails}>Retry</Button> <Button variant="outline" className="ml-2" onClick={() => router.back()}>Go Back</Button> </CardFooter> </Card> </div> )
  }
  if (!submissionDetails) {
      return ( <div className="container mx-auto py-6 text-center"> <p className="text-muted-foreground">Submission not found.</p> <Button variant="outline" className="mt-4" onClick={() => router.back()}>Go Back</Button> </div> );
  }


  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl"> {/* Added max-width */}
        {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-shrink min-w-0"> {/* Prevent title shrinking */}
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/assignments/${assignmentId}`} aria-label="Back to assignment details">
            <span>
              <ArrowLeft className="h-4 w-4" />
            </span>
          </Link>
        </Button>
          <div className="overflow-hidden">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight truncate" title={submissionDetails.assignmentTitle}>Submission Review</h1>
            <p className="text-sm text-muted-foreground truncate" title={submissionDetails.assignmentTitle}> For: {submissionDetails.assignmentTitle} </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto justify-end shrink-0"> {/* Prevent shrinking */}
             {/* <Button variant="default" onClick={handleAnalyzeWithAI} disabled={isAnalyzing || isLoading} className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-lg">
             {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />} {isAnalyzing ? "Analyzing..." : "AI Review"}
             </Button> */}
           <div className="bg-muted px-4 py-1.5 rounded-lg text-center order-first sm:order-none">
             <span className="text-xs font-medium text-muted-foreground block">Final Score</span>
             <div className="flex items-baseline justify-center"> <span className="text-xl font-bold">{finalScore}</span> <span className="text-xs ml-0.5">/100</span> {/* TODO: Use assignment total points */} </div>
           </div>
           <Button onClick={saveChanges} disabled={isSaving || isAnalyzing} className="w-full sm:w-auto">
             {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} {isSaving ? "Saving..." : "Save Changes"}
           </Button>
        </div>
      </div>

        {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
            {/* Submission Content */}
          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
  <div>
    <CardTitle>Submission Content</CardTitle>
    <CardDescription>
      Submitted on {formatDateForDisplay(submissionDetails.submissionDate)} by {submissionDetails.studentName}
    </CardDescription>
  </div>
  <div className="flex gap-2">
    <Button
      variant="default"
      size="sm"
      onClick={handleAnalyzeWithAI}
      disabled={isAnalyzing || isLoading || !submissionDetails?.content} // Disable if no content
      className="flex items-center gap-2 bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 text-white hover:from-green-600 hover:via-teal-600 hover:to-blue-600 shadow-lg"
      title="Analyze content with AI for feedback suggestions"
        >
      {isAnalyzing ? (
      <>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Analyzing...</span>
      </>
      ) : (
      <>
        <Wand2 className="h-4 w-4" />
        <span>AI Review</span>
      </>
      )}
    </Button>
    <Button
      variant={isCommentMode ? "default" : "outline"}
      size="sm"
      onClick={toggleCommentMode}
      className="flex items-center gap-1"
    >
      <MessageSquare className="h-4 w-4" /> {isCommentMode ? "Exit Comments" : "Add Comments"}
    </Button>

   
            </div>
            </CardHeader>
            <CardContent className="relative">
              {isCommentMode && <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-2 mb-2 border-b text-xs text-center text-primary font-medium rounded-t-md"> COMMENT MODE: Select text below to add a comment. Click highlights to view. </div>}
              <div ref={contentRef} className={`prose prose-sm sm:prose-base max-w-none mt-2 leading-relaxed ${isCommentMode ? "cursor-text selection:bg-primary/20" : ""}`} onMouseUp={isCommentMode ? handleTextSelection : undefined} >
                 {renderHighlightedContent()}
              </div>
            </CardContent>
          </Card>
            {/* Overall Feedback */}
          <Card>
             <CardHeader> <CardTitle>Overall Feedback</CardTitle> {!overallFeedback.strengths && !overallFeedback.improvements && !overallFeedback.actionItems && <CardDescription>Provide feedback or click 'AI Review' for suggestions.</CardDescription>} </CardHeader>
             <CardContent className="space-y-6">
                <div className="space-y-2"> <div className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-600" /><Label htmlFor="strengths" className="font-medium text-base">Strengths</Label></div> <Textarea id="strengths" placeholder={isAnalyzing ? "AI generating..." : "What did the student do well? (or use AI Review)"} value={overallFeedback.strengths} onChange={(e) => updateOverallFeedback("strengths", e.target.value)} className="min-h-[100px]" disabled={isAnalyzing}/> </div>
                <div className="space-y-2"> <div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-yellow-600" /><Label htmlFor="improvements" className="font-medium text-base">Areas for Improvement</Label></div> <Textarea id="improvements" placeholder={isAnalyzing ? "AI generating..." : "What could the student improve? (or use AI Review)"} value={overallFeedback.improvements} onChange={(e) => updateOverallFeedback("improvements", e.target.value)} className="min-h-[100px]" disabled={isAnalyzing}/> </div>
                <div className="space-y-2"> <div className="flex items-center gap-2"><ArrowRight className="h-5 w-5 text-blue-600" /><Label htmlFor="actionItems" className="font-medium text-base">Action Items</Label></div> <Textarea id="actionItems" placeholder={isAnalyzing ? "AI generating..." : "Specific actions? (e.g., 1. Review X...) (or use AI Review)"} value={overallFeedback.actionItems} onChange={(e) => updateOverallFeedback("actionItems", e.target.value)} className="min-h-[100px]" disabled={isAnalyzing}/> </div>
             </CardContent>
          </Card>
        </div>
          {/* Right Column (Sidebar) */}
        <div className="lg:sticky lg:top-4 space-y-6">
            {/* Inline Comments */}
          {/* <div className="flex justify-between items-center"> */}
            <div className="flex justify-between items-center"> 
            <Button
              variant="ghost"
              size="sm"
              title="Download Reviewed Report (PDF)"
              onClick={handleDownloadReport} // Call the new handler
              disabled={isDownloading || isLoading || isSaving || isAnalyzing}// Disable during operations
              className="text-purple-500 hover:text-blue-600"
            >
              {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {/* <Download className="h-4 w-4 mr-1" /> */}
              Review Report
            </Button>
            {submissionDetails.fileUrl && (
              <Button
              variant="ghost"
              size="sm"
              title={`Download Original File ${submissionDetails.fileName || 'file'}`}
              asChild
              className="text-blue-500 hover:text-purple-600"
              >
              <Link href={submissionDetails.fileUrl} target="_blank" rel="noopener noreferrer">
                <span className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                Original Report
                </span>
              </Link>
              </Button>
            )}
            </div>
          <Card>
             <CardHeader className="pb-2"> <CardTitle>Inline Comments</CardTitle> <CardDescription>{inlineComments.length} comment(s). {isCommentMode ? "Select text..." : ""}</CardDescription> </CardHeader>
             <CardContent className="p-0">
                 <div ref={commentSidebarRef} className="max-h-[40vh] lg:max-h-[calc(100vh-30rem)] overflow-hidden"> {/* Dynamic max height */}
                    <ScrollArea className="h-[40vh] overflow-y-auto pr-1"> {/* Set explicit height and enable scrolling */}
                       <div className="px-4 py-2 space-y-3">
                          {selectedText && isCommentMode && (
                              <div id="new-comment-box" className="mb-4 p-3 border rounded-md bg-muted/30 space-y-3 shadow-sm">
                                  <div> <p className="font-medium text-sm">Selected Text:</p> <p className="text-xs italic mt-1 text-muted-foreground line-clamp-2">"{selectedText}"</p> </div>
                                  <Textarea placeholder="Add your comment..." value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} className="text-sm min-h-[70px]" />
                                  <div className="flex gap-2">
                                    {/* <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={generateAIComment} disabled={isGeneratingAI}> 
                                      <Sparkles className="h-3 w-3 mr-1" /> {isGeneratingAI ? "Generating..." : "AI Suggest"} 
                                    </Button> */}
                                    <Button size="sm" className="flex-1 text-xs" onClick={handleAddCommentClick} disabled={!newCommentText.trim()}> Add Comment </Button>
                                  </div>
                              </div> )}
                          {inlineComments.length === 0 && !(selectedText && isCommentMode) ? ( <div className="text-center py-6 text-sm text-muted-foreground"> {isCommentMode ? "Select text to add comments" : "No comments yet."} </div>
                          ) : ( inlineComments.sort((a, b) => a.startIndex - b.startIndex).map((comment) => (
                               <div key={comment.id} data-comment-id={comment.id} className={`p-2.5 border rounded-md transition-all cursor-pointer ${comment.id === activeCommentId ? "ring-2 ring-primary bg-primary/5 shadow" : "hover:bg-muted/20"}`} onClick={() => setActiveCommentId(comment.id === activeCommentId ? null : comment.id)} >
                                  <div className="flex justify-between items-start mb-1.5 gap-2"> 
                                    <div className="flex items-center gap-1.5 flex-shrink min-w-0"> 
                                      {!comment.isAIGenerated && <span className={`w-2.5 h-2.5 rounded-full ${comment.color} flex-shrink-0`}></span>} 
                                      {comment.isAIGenerated && <Sparkles className="h-3 w-3 text-purple-500 flex-shrink-0" title="AI Generated"/>} 
                                      <span className="text-xs font-medium truncate" title={comment.author}>{comment.author}</span> 
                                      </div> 
                                          <span className="text-[11px] text-muted-foreground flex-shrink-0">{formatDateForDisplay(comment.timestamp)}</span>
                                       </div>
                                  <div className="text-[11px] text-muted-foreground mb-1.5 italic line-clamp-1" 
                                       title={submissionDetails.content.substring(comment.startIndex, comment.endIndex)}> 
                                       "{submissionDetails.content.substring(comment.startIndex, comment.endIndex)}" 
                                  </div>
                                  <div className="text-sm mb-1.5 whitespace-pre-wrap">{comment.text}</div> {/* Allow comment text wrapping */}
                                  {comment.id === activeCommentId && ( <div className="flex justify-end gap-1 mt-1"> <Button variant="ghost" size="xs" className="h-6 px-1.5 text-xs" onClick={(e) => { e.stopPropagation(); const nt = prompt("Edit:", comment.text); if(nt !== null) updateCommentText(comment.id, nt); }}> Edit </Button> <Button variant="ghost" size="xs" className="h-6 px-1.5 text-xs text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); if(confirm("Delete?")) removeInlineComment(comment.id); }}> Delete </Button> </div> )}
                               </div> )) )}
                       </div>
                    </ScrollArea>
                 </div>
            </CardContent>
          </Card>
            {/* Student Info */}
          <Card>
             <CardHeader className="pb-3"> <CardTitle className="text-base">Student Information</CardTitle> </CardHeader>
             <CardContent> <div className="flex items-center gap-3"> <Avatar className="h-10 w-10"> <AvatarImage src={`/placeholder-user.jpg`} alt={submissionDetails.studentName}/> <AvatarFallback>{getInitials(submissionDetails.studentName)}</AvatarFallback> </Avatar> <div> <p className="font-medium text-sm">{submissionDetails.studentName}</p> {submissionDetails.studentId && <p className="text-xs text-muted-foreground">ID: {submissionDetails.studentId}</p>} </div> </div> </CardContent>
          </Card>
            {/* Grading Rubric */}
          <Card>
             <CardHeader className="pb-3"> <CardTitle className="text-base">Grading Rubric</CardTitle> </CardHeader>
             <CardContent className="space-y-5">
                {subScores.map((score, index) => (
                   <div key={score._id || `subscore-${index}`} className="space-y-1.5 border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-center"> <Label htmlFor={`score-${index}`} className="text-sm font-medium">{score.name}</Label> <Input id={`score-${index}`} type="number" min="0" max={score.maxScore} value={score.score} onChange={(e) => updateSubScore(index, e.target.value)} className="w-20 h-8 text-sm text-right px-2" aria-label={`${score.name} score out of ${score.maxScore}`} /> </div>
                      <span className="text-xs text-muted-foreground block text-right -mt-1 mr-1">/ {score.maxScore} pts</span>
                      <Textarea placeholder={`Rationale for ${score.name}...`} value={score.rationale} onChange={(e) => updateSubScoreRationale(index, e.target.value)} className="text-xs min-h-[60px]" aria-label={`Rationale for ${score.name} score`} />
                   </div> ))}
                <Separator />
                <div className="flex justify-between items-center font-semibold pt-2"> <span>Final Calculated Score:</span> <span>{finalScore} / 100</span> </div>
             </CardContent>
          </Card>
            {/* AI & Plagiarism Tabs */}
          <Tabs defaultValue="ai" className="w-full">
            <TabsList className="grid w-full grid-cols-2"> <TabsTrigger value="ai" disabled={!submissionDetails.aiCheckerResults}>AI Check</TabsTrigger> <TabsTrigger value="plagiarism" disabled={!submissionDetails.plagiarismResults}>Plagiarism</TabsTrigger> </TabsList>
            <TabsContent value="ai"> <Card> <CardHeader className="pb-3"> <CardTitle className="text-sm">AI Content Detection</CardTitle> {submissionDetails.aiCheckerResults ? (<CardDescription>Confidence: {submissionDetails.aiCheckerResults.confidence}</CardDescription> ): <CardDescription>No AI check results.</CardDescription>} </CardHeader> {submissionDetails.aiCheckerResults && ( <CardContent className="space-y-4"> <div className="flex items-center justify-between text-xs"> <span>Overall Human Score</span> <Badge variant={submissionDetails.aiCheckerResults.score > 80 ? "default" : "secondary"}> {submissionDetails.aiCheckerResults.score}% </Badge> </div> <Progress value={submissionDetails.aiCheckerResults.score} className="h-2" /> <Separator /> <h3 className="font-medium text-xs pt-2">Detailed Analysis</h3> <div className="space-y-3"> {submissionDetails.aiCheckerResults.details.map((detail, index) => ( <div key={index} className="space-y-1"> <div className="flex justify-between text-xs"> <span>{detail.section}</span> <span>{Math.round(detail.humanProbability * 100)}% Human</span> </div> <Progress value={detail.humanProbability * 100} className="h-1.5" /> </div> ))} </div> </CardContent> )} </Card> </TabsContent>
            <TabsContent value="plagiarism"> <Card> <CardHeader className="pb-3"> <CardTitle className="text-sm">Plagiarism Check</CardTitle> {submissionDetails.plagiarismResults ? (<CardDescription>Originality: {submissionDetails.plagiarismResults.score}%</CardDescription> ): <CardDescription>No plagiarism results.</CardDescription>} </CardHeader> {submissionDetails.plagiarismResults && ( <CardContent className="space-y-4"> <Progress value={submissionDetails.plagiarismResults.score} className="h-2" /> <Separator /> <h3 className="font-medium text-xs pt-2">Matched Content</h3> {submissionDetails.plagiarismResults.matches.length === 0 ? ( <p className="text-xs text-muted-foreground">No matches found.</p> ) : ( <ScrollArea className="h-[150px] pr-3"> <div className="space-y-3"> {submissionDetails.plagiarismResults.matches.map((match, index) => ( <div key={match._id || index} className="p-2 border rounded-md space-y-1 bg-muted/30"> <p className="italic text-[11px] line-clamp-2">"{match.text}"</p> <div className="flex justify-between text-[11px]"> <span className="text-muted-foreground truncate" title={match.source}>Source: {match.source}</span> <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">{Math.round(match.similarity * 100)}% Match</Badge> </div> </div> ))} </div> </ScrollArea> )} </CardContent> )} </Card> </TabsContent>
           </Tabs>
        </div> {/* End Right Column */}
      </div> {/* End Main Grid */}
    </div> /* End Container */
  );
}