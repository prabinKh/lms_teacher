import React, { useState, useEffect } from "react";
import { Assignment, AssignmentSubmission } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, Plus, Edit, Trash, Calendar, Eye, Award, Save, Send, Upload, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import * as Collapsible from '@radix-ui/react-collapsible';

interface QuestionWithVisibility {
  id: number;
  content: string;
  visibilityDate: string;
  isEditing?: boolean;
  seeEnabled?: boolean;
}

interface ExtendedAssignment extends Assignment {
  questions: QuestionWithVisibility[];
  isDraft: boolean;
}

interface AssignmentsTabProps {
  assignments: ExtendedAssignment[];
  courseId: number;
  getSubmissions: (assignmentId: number) => Promise<AssignmentSubmission[]>;
  addAssignment: (assignment: Assignment) => void;
  updateAssignment: (assignment: Assignment) => void;
  deleteAssignment: (assignmentId: number) => void;
  addSubmission: (submission: AssignmentSubmission) => void;
  updateSubmission: (submission: AssignmentSubmission) => void;
  userRole: "teacher" | "student";
  studentId?: number;
}

const SubmissionsTable: React.FC<{
  submissions: AssignmentSubmission[];
  assignment: ExtendedAssignment;
  onViewSubmission: (submission: AssignmentSubmission) => void;
  onViewQuestions: (questions: QuestionWithVisibility[]) => void;
  isSubmissionLate: (submission: AssignmentSubmission, assignment: ExtendedAssignment) => boolean;
  onGradeSubmission?: (submissionId: number, grade: number, feedback: string) => void;
  userRole: "teacher" | "student";
  studentId?: number;
}> = ({ submissions, assignment, onViewSubmission, onViewQuestions, isSubmissionLate, onGradeSubmission, userRole, studentId }) => {
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="border rounded-md">
      <div className="p-3 bg-gray-50 border-b text-xs font-medium">Submissions and Questions</div>
      <div className="divide-y">
        {submissions
          .filter((submission) => (userRole === "student" ? submission.studentId === studentId : true))
          .map((submission) => (
            <div key={submission.id} className="p-3 text-sm">
              <div className="flex justify-between items-center">
                <div>
                  {userRole === "teacher" && `Student ${submission.studentId} - ${formatDate(submission.submissionDate)}`}
                  {userRole === "student" && `Submitted on ${formatDate(submission.submissionDate)}`}
                  {isSubmissionLate(submission, assignment) && <Badge variant="outline" className="ml-2 text-red-500 border-red-200 bg-red-50 text-[10px] h-5">Late</Badge>}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => onViewSubmission(submission)}>
                    <Eye className="h-3.5 w-3.5" /> View
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => onViewQuestions(assignment.questions)}>
                    <Eye className="h-3.5 w-3.5" /> See Questions
                  </Button>
                  {userRole === "teacher" && submission.grade === undefined && onGradeSubmission && (
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => onViewSubmission(submission)}>
                      <Award className="h-3.5 w-3.5" /> Grade
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const AssignmentsTab: React.FC<AssignmentsTabProps> = ({
  assignments: initialAssignments,
  courseId,
  getSubmissions,
  addAssignment,
  updateAssignment,
  deleteAssignment,
  addSubmission,
  updateSubmission,
  userRole,
  studentId = 101,
}) => {
  const [assignments, setAssignments] = useState<ExtendedAssignment[]>(initialAssignments);
  const [selectedAssignment, setSelectedAssignment] = useState<ExtendedAssignment | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [submissionsMap, setSubmissionsMap] = useState<Record<number, AssignmentSubmission[]>>({});
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showQuestionsDialog, setShowQuestionsDialog] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<QuestionWithVisibility[]>([]);
  const [newAssignment, setNewAssignment] = useState<ExtendedAssignment>({ id: 0, title: "", description: "", dueDate: "", points: 100, questions: [], isDraft: true });
  const [editingAssignment, setEditingAssignment] = useState<ExtendedAssignment | null>(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [studentSubmission, setStudentSubmission] = useState<string>("");
  const [grade, setGrade] = useState<number | "">("");
  const [feedback, setFeedback] = useState<string>("");
  const [openQuestions, setOpenQuestions] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchSubmissions = async () => {
      const newMap: Record<number, AssignmentSubmission[]> = {};
      for (const assignment of assignments) newMap[assignment.id] = await getSubmissions(assignment.id);
      setSubmissionsMap(newMap);
    };
    fetchSubmissions();
  }, [assignments, getSubmissions]);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const isSubmissionLate = (submission: AssignmentSubmission, assignment: ExtendedAssignment) => new Date(submission.submissionDate) > new Date(assignment.dueDate);

  const toggleQuestion = (questionId: number) => {
    setOpenQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleViewSubmission = (submission: AssignmentSubmission) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade || "");
    setFeedback(submission.feedback || "");
    setShowSubmissionDialog(true);
  };

  const handleViewQuestions = (questions: QuestionWithVisibility[]) => {
    setSelectedQuestions(questions);
    setShowQuestionsDialog(true);
  };

  const handleAddQuestion = (isEdit: boolean) => {
    const target = isEdit ? editingAssignment : newAssignment;
    const setTarget = isEdit ? setEditingAssignment : setNewAssignment;
    if (target) {
      const newQuestion = { id: target.questions.length + 1, content: "", visibilityDate: new Date().toISOString().split("T")[0], isEditing: true, seeEnabled: true };
      setTarget({ ...target, questions: [...target.questions, newQuestion] });
      if (isEdit) setEditingQuestionIndex(target.questions.length);
    }
  };

  const handleQuestionChange = (index: number, field: string, value: string, isEdit: boolean) => {
    const target = isEdit ? editingAssignment : newAssignment;
    const setTarget = isEdit ? setEditingAssignment : setNewAssignment;
    if (target) setTarget({ ...target, questions: target.questions.map((q, i) => (i === index ? { ...q, [field]: value } : q)) });
  };

  const handleDeleteQuestion = (index: number, isEdit: boolean) => {
    const target = isEdit ? editingAssignment : newAssignment;
    const setTarget = isEdit ? setEditingAssignment : setNewAssignment;
    if (target) {
      setTarget({ ...target, questions: target.questions.filter((_, i) => i !== index) });
      if (isEdit && editingQuestionIndex === index) setEditingQuestionIndex(null);
    }
  };

  const handleSaveDraft = () => {
    const assignmentWithId = { ...newAssignment, id: Date.now() };
    addAssignment(assignmentWithId);
    setAssignments((prev) => [...prev, assignmentWithId]);
    setShowCreateDialog(false);
    setNewAssignment({ id: 0, title: "", description: "", dueDate: "", points: 100, questions: [], isDraft: true });
  };

  const handlePublish = () => {
    const assignmentWithId = { ...newAssignment, id: Date.now(), isDraft: false };
    addAssignment(assignmentWithId);
    setAssignments((prev) => [...prev, assignmentWithId]);
    setShowCreateDialog(false);
    setNewAssignment({ id: 0, title: "", description: "", dueDate: "", points: 100, questions: [], isDraft: true });
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment({ ...(assignment as ExtendedAssignment), questions: assignment.questions || [] });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (editingAssignment) {
      updateAssignment(editingAssignment);
      setAssignments((prev) => prev.map((a) => (a.id === editingAssignment.id ? editingAssignment : a)));
      setShowEditDialog(false);
      setEditingQuestionIndex(null);
    }
  };

  const handleDeleteAssignment = (assignmentId: number) => {
    if (!confirm("Are you sure?")) return;
    deleteAssignment(assignmentId);
    setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
    setSubmissionsMap((prev) => { const newMap = { ...prev }; delete newMap[assignmentId]; return newMap; });
  };

  const handleSubmitAssignment = (assignmentId: number) => {
    const newSubmission: AssignmentSubmission = { id: Date.now(), assignmentId, studentId, courseId, submissionDate: new Date().toISOString(), content: studentSubmission };
    addSubmission(newSubmission);
    setSubmissionsMap((prev) => ({ ...prev, [assignmentId]: [...(prev[assignmentId] || []), newSubmission] }));
    setStudentSubmission("");
    setShowSubmissionDialog(false);
  };

  const handleGradeSubmission = (submissionId: number, grade: number, feedback: string) => {
    if (!selectedSubmission || !selectedAssignment) return;
    const updatedSubmission = { ...selectedSubmission, grade, feedback };
    updateSubmission(updatedSubmission);
    setSubmissionsMap((prev) => ({ ...prev, [selectedAssignment.id]: prev[selectedAssignment.id].map((s) => (s.id === submissionId ? updatedSubmission : s)) }));
    setShowSubmissionDialog(false);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <CheckSquare className="h-5 w-5" /> {userRole === "teacher" ? "Course Assignments" : "My Assignments"}
          </h3>
          {userRole === "teacher" && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1"><Plus className="h-4 w-4" /> Add Assignment</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Create New Assignment</DialogTitle></DialogHeader>
                <div className="space-y-4 mt-4">
                  <div><Label>Title</Label><Input value={newAssignment.title} onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} /></div>
                  <div><Label>Description</Label><Textarea value={newAssignment.description} onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })} /></div>
                  <div><Label>Due Date</Label><Input type="date" value={newAssignment.dueDate} onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} /></div>
                  <Separator />
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Questions</Label>
                      <Button size="sm" onClick={() => handleAddQuestion(false)}><Plus className="h-4 w-4 mr-1" /> Add Question</Button>
                    </div>
                    <div className="max-h-[40vh] overflow-y-auto space-y-4">
                      {newAssignment.questions.map((question, index) => (
                        <div key={question.id} className="mb-4 p-4 border rounded">
                          <Label className="text-sm font-medium mb-2 block">Question {index + 1}</Label>
                          <Textarea 
                            value={question.content} 
                            onChange={(e) => handleQuestionChange(index, "content", e.target.value, false)} 
                            className="mb-2" 
                          />
                          <div className="flex gap-2">
                            <Input 
                              type="date" 
                              value={question.visibilityDate} 
                              onChange={(e) => handleQuestionChange(index, "visibilityDate", e.target.value, false)} 
                            />
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleDeleteQuestion(index, false)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleSaveDraft}><Save className="h-4 w-4 mr-1" /> Save Draft</Button>
                    <Button onClick={handlePublish}><Send className="h-4 w-4 mr-1" /> Publish</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {assignments.length > 0 ? (
          <div className="space-y-6">
            {assignments
              .filter((assignment) => (userRole === "student" ? !assignment.isDraft : true))
              .map((assignment) => {
                const submissions = submissionsMap[assignment.id] || [];
                const studentSubmission = submissions.find((s) => s.studentId === studentId);
                const currentDate = new Date();
                const visibleQuestions = assignment.questions?.filter((q) => new Date(q.visibilityDate) <= currentDate && q.seeEnabled) || [];

                return (
                  <Card key={assignment.id} className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden">
                    <CardHeader className="p-4 pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        {userRole === "teacher" && (
                          <div className="flex space-x-2">
                            {new Date(assignment.dueDate) > currentDate && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditAssignment(assignment)}><Edit className="h-4 w-4" /></Button>}
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteAssignment(assignment.id)}><Trash className="h-4 w-4" /></Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground mb-3">{assignment.description}</p>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <div className="flex items-center gap-1.5 text-sm"><Calendar className="h-4 w-4 text-muted-foreground" /> Due: <span className="font-medium">{formatDate(assignment.dueDate)}</span></div>
                        <div className="flex items-center gap-1.5 text-sm"><Award className="h-4 w-4 text-muted-foreground" /> Points: <span className="font-medium">{assignment.points}</span></div>
                        {assignment.isDraft && <Badge>Draft</Badge>}
                      </div>

                      {/* Display questions as collapsible dropdowns */}
                      {visibleQuestions.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Assignment Questions</h4>
                          <div className="space-y-2">
                            {visibleQuestions.map((question, index) => (
                              <Collapsible.Root 
                                key={question.id} 
                                open={openQuestions[question.id]} 
                                onOpenChange={() => toggleQuestion(question.id)}
                              >
                                <Collapsible.Trigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    className="w-full justify-between p-3 bg-gray-50 hover:bg-gray-100"
                                  >
                                    <span className="text-sm font-medium">Q{index + 1}: {question.content.substring(0, 50)}{question.content.length > 50 ? "..." : ""}</span>
                                    {openQuestions[question.id] ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </Button>
                                </Collapsible.Trigger>
                                <Collapsible.Content className="p-3 bg-gray-50 rounded-b-md">
                                  <p className="text-sm">{question.content}</p>
                                  <p className="text-xs text-muted-foreground mt-1">Visible since: {formatDate(question.visibilityDate)}</p>
                                </Collapsible.Content>
                              </Collapsible.Root>
                            ))}
                          </div>
                        </div>
                      )}

                      {userRole === "student" && !studentSubmission && new Date(assignment.dueDate) > currentDate && (
                        <Button className="mt-4" onClick={() => { setSelectedAssignment(assignment); setShowSubmissionDialog(true); }}>
                          <Upload className="h-4 w-4 mr-2" /> Submit Assignment
                        </Button>
                      )}

                      {(userRole === "teacher" || studentSubmission) && (
                        <SubmissionsTable
                          submissions={submissions}
                          assignment={assignment}
                          onViewSubmission={handleViewSubmission}
                          onViewQuestions={handleViewQuestions}
                          isSubmissionLate={isSubmissionLate}
                          onGradeSubmission={userRole === "teacher" ? handleGradeSubmission : undefined}
                          userRole={userRole}
                          studentId={studentId}
                        />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">{userRole === "teacher" ? "No assignments available" : "No assignments assigned"}</p>
        )}
      </CardContent>

      <Dialog open={showSubmissionDialog} onOpenChange={setShowSubmissionDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>{userRole === "teacher" ? "Assignment Submission" : "Submit Assignment"}</DialogTitle></DialogHeader>
          <div className="mt-4">
            {selectedSubmission ? (
              <>
                <div className="border rounded-md p-4 max-h-[60vh] overflow-y-auto mb-4 bg-gray-50" dangerouslySetInnerHTML={{ __html: selectedSubmission.content.replace(/\n/g, "<br>") }} />
                {selectedSubmission.feedback && <div className="mt-4"><h4 className="text-sm font-medium mb-2">Feedback:</h4><div className="p-3 bg-primary/5 rounded-md text-sm">{selectedSubmission.feedback}</div></div>}
                {userRole === "teacher" && (
                  <div className="mt-4 space-y-4">
                    <div><Label>Grade (out of {selectedAssignment?.points || 100})</Label><Input type="number" min={0} max={selectedAssignment?.points || 100} value={grade} onChange={(e) => setGrade(e.target.value === "" ? "" : Number(e.target.value))} disabled={selectedSubmission.grade !== undefined} /></div>
                    <div><Label>Feedback</Label><Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} disabled={selectedSubmission.grade !== undefined} /></div>
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-4">
                  {userRole === "teacher" && selectedSubmission.grade === undefined && (
                    <Button className="gap-1" onClick={() => handleGradeSubmission(selectedSubmission.id, Number(grade), feedback)} disabled={grade === "" || grade < 0 || grade > (selectedAssignment?.points || 100)}>
                      <Award className="h-4 w-4" /> Submit Grade
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setShowSubmissionDialog(false)}>Close</Button>
                </div>
              </>
            ) : userRole === "student" && selectedAssignment ? (
              <>
                {/* Display questions as collapsible dropdowns in submission dialog */}
                {selectedAssignment.questions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Questions</h4>
                    <div className="space-y-2">
                      {selectedAssignment.questions
                        .filter(q => q.seeEnabled && new Date(q.visibilityDate) <= new Date())
                        .map((question, index) => (
                          <Collapsible.Root 
                            key={question.id} 
                            open={openQuestions[question.id]} 
                            onOpenChange={() => toggleQuestion(question.id)}
                          >
                            <Collapsible.Trigger asChild>
                              <Button 
                                variant="ghost" 
                                className="w-full justify-between p-3 bg-gray-50 hover:bg-gray-100"
                              >
                                <span className="text-sm font-medium">Q{index + 1}: {question.content.substring(0, 50)}{question.content.length > 50 ? "..." : ""}</span>
                                {openQuestions[question.id] ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </Collapsible.Trigger>
                            <Collapsible.Content className="p-3 bg-gray-50 rounded-b-md">
                              <p className="text-sm">{question.content}</p>
                            </Collapsible.Content>
                          </Collapsible.Root>
                        ))}
                    </div>
                  </div>
                )}
                <Textarea value={studentSubmission} onChange={(e) => setStudentSubmission(e.target.value)} className="min-h-[200px]" />
                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={() => handleSubmitAssignment(selectedAssignment.id)} disabled={!studentSubmission.trim()}><Upload className="h-4 w-4 mr-2" /> Submit</Button>
                  <Button variant="outline" onClick={() => setShowSubmissionDialog(false)}>Cancel</Button>
                </div>
              </>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showQuestionsDialog} onOpenChange={setShowQuestionsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Assignment Questions</DialogTitle></DialogHeader>
          <div className="mt-4 space-y-4">
            {selectedQuestions.filter(q => q.seeEnabled).map((question, index) => (
              <Collapsible.Root 
                key={question.id} 
                open={openQuestions[question.id]} 
                onOpenChange={() => toggleQuestion(question.id)}
              >
                <Collapsible.Trigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between p-3 bg-gray-50 hover:bg-gray-100"
                  >
                    <span className="text-sm font-medium">Q{index + 1}: {question.content.substring(0, 50)}{question.content.length > 50 ? "..." : ""}</span>
                    {openQuestions[question.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </Collapsible.Trigger>
                <Collapsible.Content className="p-3 bg-gray-50 rounded-b-md">
                  <p className="text-sm">{question.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">Visible since: {formatDate(question.visibilityDate)}</p>
                </Collapsible.Content>
              </Collapsible.Root>
            ))}
          </div>
          <div className="flex justify-end mt-4"><Button variant="outline" onClick={() => setShowQuestionsDialog(false)}>Close</Button></div>
        </DialogContent>
      </Dialog>

      {userRole === "teacher" && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Edit Assignment</DialogTitle></DialogHeader>
            {editingAssignment && (
              <div className="space-y-4 mt-4">
                <div><Label>Title</Label><Input value={editingAssignment.title} onChange={(e) => setEditingAssignment({ ...editingAssignment, title: e.target.value })} /></div>
                <div><Label>Description</Label><Textarea value={editingAssignment.description} onChange={(e) => setEditingAssignment({ ...editingAssignment, description: e.target.value })} /></div>
                <div><Label>Due Date</Label><Input type="date" value={editingAssignment.dueDate} onChange={(e) => setEditingAssignment({ ...editingAssignment, dueDate: e.target.value })} /></div>
                <Separator />
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Questions</Label>
                    <Button size="sm" onClick={() => handleAddQuestion(true)}><Plus className="h-4 w-4 mr-1" /> Add Question</Button>
                  </div>
                  <div className="max-h-[40vh] overflow-y-auto space-y-4">
                    {editingAssignment.questions.map((question, index) => (
                      <div key={question.id} className="mb-4 p-4 border rounded">
                        {editingQuestionIndex === index ? (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium block">Question {index + 1}</Label>
                            <Textarea 
                              value={question.content} 
                              onChange={(e) => handleQuestionChange(index, "content", e.target.value, true)} 
                              className="mb-2" 
                            />
                            <div className="flex gap-2 items-center">
                              <div className="flex-1">
                                <Label className="text-xs">Visibility Date</Label>
                                <Input 
                                  type="date" 
                                  value={question.visibilityDate} 
                                  onChange={(e) => handleQuestionChange(index, "visibilityDate", e.target.value, true)} 
                                />
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setEditingQuestionIndex(null)}
                              >
                                <Save className="h-4 w-4 mr-1" /> Save
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => handleDeleteQuestion(index, true)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-medium">Question {index + 1}: {question.content}</p>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => setEditingQuestionIndex(index)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteQuestion(index, true)}
                                >
                                  <Trash className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">Visible from: {formatDate(question.visibilityDate)}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    onClick={handleSaveEdit} 
                    disabled={!editingAssignment.title || !editingAssignment.dueDate}
                  >
                    <Save className="h-4 w-4 mr-1" /> Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => { setEditingQuestionIndex(null); setShowEditDialog(false); }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default AssignmentsTab;