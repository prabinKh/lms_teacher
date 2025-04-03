// src/components/QuizzesTab.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileQuestion, Edit, Trash, Eye, Plus, CheckCircle2, MinusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  id: number;
  title: string;
  totalQuestions: number;
  passingScore: number;
  questions: Question[];
}

interface QuizzesTabProps {
  quizzes: Quiz[];
  updateQuiz: (updatedQuiz: Quiz) => void;
  addQuiz: (newQuiz: Omit<Quiz, "id">) => void;
  deleteQuiz: (quizId: number) => void;
}

const QuizzesTab: React.FC<QuizzesTabProps> = ({
  quizzes,
  updateQuiz,
  addQuiz,
  deleteQuiz,
}) => {
  const [expandedQuizzes, setExpandedQuizzes] = useState<Record<string, boolean>>({});
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [newQuiz, setNewQuiz] = useState<Omit<Quiz, "id">>({
    title: "",
    totalQuestions: 0,
    passingScore: 0,
    questions: [],
  });

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });

  const toggleQuizView = (quizId: number) => {
    setExpandedQuizzes((prev) => ({
      ...prev,
      [quizId]: !prev[quizId],
    }));
  };

  const openEditQuizDialog = (quiz: Quiz) => {
    try {
      setEditingQuiz(JSON.parse(JSON.stringify(quiz)));
      setShowEditDialog(true);
      setError(null);
    } catch (err) {
      setError("Failed to load quiz for editing");
      console.error("Error opening edit dialog:", err);
    }
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuiz) return;

    try {
      updateQuiz(editingQuiz);
      setShowEditDialog(false);
      setEditingQuiz(null);
      setError(null);
    } catch (err) {
      setError("Failed to save quiz changes");
      console.error("Error saving quiz:", err);
    }
  };

  const openAddQuizDialog = () => {
    setNewQuiz({
      title: "",
      totalQuestions: 0,
      passingScore: 0,
      questions: [],
    });
    setCurrentQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    });
    setShowAddDialog(true);
    setError(null);
  };

  const handleAddQuestion = () => {
    try {
      if (!currentQuestion.question.trim()) {
        setError("Question text cannot be empty");
        return;
      }

      const validOptions = currentQuestion.options.filter((opt) => opt.trim() !== "");
      if (validOptions.length < 2) {
        setError("At least 2 valid options are required");
        return;
      }
      if (currentQuestion.correctAnswer >= validOptions.length) {
        setError("Correct answer index must be valid");
        return;
      }

      const updatedQuestions = [...newQuiz.questions, { ...currentQuestion }];
      setNewQuiz({
        ...newQuiz,
        questions: updatedQuestions,
        totalQuestions: updatedQuestions.length,
      });

      setCurrentQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      });
      setError(null);
    } catch (err) {
      setError("Failed to add question");
      console.error("Error adding question:", err);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: updatedOptions,
    });
  };

  const handleCreateQuiz = () => {
    try {
      if (!newQuiz.title.trim()) {
        setError("Quiz title cannot be empty");
        return;
      }

      if (newQuiz.questions.length === 0) {
        setError("Quiz must have at least one question");
        return;
      }

      const totalQuestions = newQuiz.questions.length;
      const passingScore = newQuiz.passingScore;
      if (passingScore < 0 || passingScore > totalQuestions) {
        setError(`Passing score must be between 0 and ${totalQuestions}`);
        return;
      }

      addQuiz({ ...newQuiz });
      setShowAddDialog(false);
      setNewQuiz({
        title: "",
        totalQuestions: 0,
        passingScore: 0,
        questions: [],
      });
      setError(null);
    } catch (err) {
      setError("Failed to create quiz");
      console.error("Error creating quiz:", err);
    }
  };

  const handleRemoveQuestion = (index: number) => {
    try {
      const updatedQuestions = [...newQuiz.questions];
      updatedQuestions.splice(index, 1);
      setNewQuiz({
        ...newQuiz,
        questions: updatedQuestions,
        totalQuestions: updatedQuestions.length,
      });
      setError(null);
    } catch (err) {
      setError("Failed to remove question");
      console.error("Error removing question:", err);
    }
  };

  const handleEditQuestion = (index: number, updatedQuestion: Question) => {
    if (!editingQuiz) return;

    try {
      const updatedQuestions = [...editingQuiz.questions];
      updatedQuestions[index] = updatedQuestion;

      setEditingQuiz({
        ...editingQuiz,
        questions: updatedQuestions,
        totalQuestions: updatedQuestions.length,
      });
      setError(null);
    } catch (err) {
      setError("Failed to edit question");
      console.error("Error editing question:", err);
    }
  };

  const handleAddQuestionToExistingQuiz = () => {
    if (!editingQuiz) return;

    try {
      const newQuestion = {
        question: "New question",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correctAnswer: 0,
      };

      setEditingQuiz({
        ...editingQuiz,
        questions: [...editingQuiz.questions, newQuestion],
        totalQuestions: editingQuiz.questions.length + 1,
      });
      setError(null);
    } catch (err) {
      setError("Failed to add question to existing quiz");
      console.error("Error adding question to existing quiz:", err);
    }
  };

  const handleRemoveQuestionFromExistingQuiz = (index: number) => {
    if (!editingQuiz) return;

    try {
      const updatedQuestions = [...editingQuiz.questions];
      updatedQuestions.splice(index, 1);

      setEditingQuiz({
        ...editingQuiz,
        questions: updatedQuestions,
        totalQuestions: updatedQuestions.length,
      });
      setError(null);
    } catch (err) {
      setError("Failed to remove question from existing quiz");
      console.error("Error removing question from existing quiz:", err);
    }
  };

  const confirmDelete = (quizId: number) => {
    setConfirmDeleteId(quizId);
    setError(null);
  };

  const handleDelete = () => {
    if (confirmDeleteId !== null) {
      try {
        deleteQuiz(confirmDeleteId);
        setConfirmDeleteId(null);
        setError(null);
      } catch (err) {
        setError("Failed to delete quiz");
        console.error("Error deleting quiz:", err);
      }
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FileQuestion className="h-5 w-5" />
            Course Quizzes
          </h3>
          <Button size="sm" className="gap-1" onClick={openAddQuizDialog}>
            <Plus className="h-4 w-4" />
            Add Quiz
          </Button>
        </div>

        {quizzes.length > 0 ? (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-0">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditQuizDialog(quiz)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => confirmDelete(quiz.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline">{quiz.totalQuestions} questions</Badge>
                    <Badge variant="outline">
                      Passing score: {quiz.passingScore}/{quiz.totalQuestions}
                    </Badge>
                  </div>

                  {!expandedQuizzes[quiz.id] ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-1"
                      onClick={() => toggleQuizView(quiz.id)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Questions
                    </Button>
                  ) : (
                    <div className="mt-4 space-y-4">
                      <Accordion type="single" collapsible className="w-full">
                        {quiz.questions.map((question, idx) => (
                          <AccordionItem key={idx} value={`q-${idx}`}>
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex text-left">
                                <span className="font-medium">Question {idx + 1}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="pb-2 pt-1">
                                <p className="mb-2 font-medium">{question.question}</p>
                                <div className="space-y-2 ml-4">
                                  {question.options.map((option, optionIdx) => (
                                    <div
                                      key={`option-${optionIdx}`}
                                      className={`p-2 rounded-md flex items-start gap-2 ${
                                        optionIdx === question.correctAnswer
                                          ? "bg-green-50 border border-green-200"
                                          : "bg-gray-50 border border-gray-100"
                                      }`}
                                    >
                                      {optionIdx === question.correctAnswer && (
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                      )}
                                      <div
                                        className={
                                          optionIdx === question.correctAnswer ? "font-medium" : ""
                                        }
                                      >
                                        {option}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => toggleQuizView(quiz.id)}
                      >
                        Hide Questions
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center bg-gray-50 rounded-lg p-8 border border-dashed border-gray-300">
            <FileQuestion className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No quizzes available</h3>
            <p className="text-gray-500 mb-4">Create your first quiz for this course</p>
            <Button onClick={openAddQuizDialog} className="gap-1">
              <Plus className="h-4 w-4" />
              Create Quiz
            </Button>
          </div>
        )}

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Quiz</DialogTitle>
            </DialogHeader>
            {editingQuiz && (
              <form onSubmit={handleSaveQuiz}>
                <div className="mt-4 space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="block text-sm font-medium mb-1">Title</Label>
                      <Input
                        type="text"
                        value={editingQuiz.title}
                        onChange={(e) =>
                          setEditingQuiz({
                            ...editingQuiz,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium mb-1">Passing Score</Label>
                      <Input
                        type="number"
                        value={editingQuiz.passingScore}
                        onChange={(e) =>
                          setEditingQuiz({
                            ...editingQuiz,
                            passingScore: parseInt(e.target.value) || 0,
                          })
                        }
                        min={0}
                        max={editingQuiz.totalQuestions}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Questions</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddQuestionToExistingQuiz}
                        className="gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        Add Question
                      </Button>
                    </div>

                    {editingQuiz.questions.map((question, idx) => (
                      <div key={idx} className="mb-6 p-4 border rounded-md relative">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 text-red-500"
                          onClick={() => handleRemoveQuestionFromExistingQuiz(idx)}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>

                        <div className="mb-4">
                          <Label className="block text-sm font-medium mb-1">Question {idx + 1}</Label>
                          <Textarea
                            value={question.question}
                            onChange={(e) => {
                              const updatedQuestion = { ...question, question: e.target.value };
                              handleEditQuestion(idx, updatedQuestion);
                            }}
                            rows={2}
                          />
                        </div>

                        <div className="space-y-3 mb-4">
                          <Label className="block text-sm font-medium mb-1">Options</Label>
                          {question.options.map((option, optionIdx) => (
                            <div key={optionIdx} className="flex items-center space-x-2">
                              <RadioGroup
                                value={question.correctAnswer.toString()}
                                onValueChange={(value) => {
                                  const updatedQuestion = {
                                    ...question,
                                    correctAnswer: parseInt(value),
                                  };
                                  handleEditQuestion(idx, updatedQuestion);
                                }}
                                className="flex-shrink-0"
                              >
                                <RadioGroupItem
                                  value={optionIdx.toString()}
                                  id={`q${idx}-opt${optionIdx}`}
                                />
                              </RadioGroup>
                              <Input
                                type="text"
                                value={option}
                                placeholder={`Option ${optionIdx + 1}`}
                                onChange={(e) => {
                                  const updatedOptions = [...question.options];
                                  updatedOptions[optionIdx] = e.target.value;
                                  const updatedQuestion = {
                                    ...question,
                                    options: updatedOptions,
                                  };
                                  handleEditQuestion(idx, updatedQuestion);
                                }}
                                className="flex-1"
                              />
                            </div>
                          ))}
                          <p className="text-xs text-gray-500">
                            Select the radio button next to the correct answer
                          </p>
                        </div>
                      </div>
                    ))}

                    {editingQuiz.questions.length === 0 && (
                      <div className="text-center bg-gray-50 p-6 rounded-lg">
                        <p className="text-gray-500">No questions added yet</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddQuestionToExistingQuiz}
                          className="mt-2 gap-1"
                        >
                          <Plus className="h-4 w-4" />
                          Add Question
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowEditDialog(false);
                        setEditingQuiz(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Quiz</DialogTitle>
              <DialogDescription>Create a new quiz with multiple-choice questions</DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label className="block text-sm font-medium mb-1">Quiz Title</Label>
                  <Input
                    type="text"
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                    placeholder="Enter quiz title"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium mb-1">Passing Score</Label>
                  <Input
                    type="number"
                    value={newQuiz.passingScore}
                    onChange={(e) =>
                      setNewQuiz({ ...newQuiz, passingScore: parseInt(e.target.value) || 0 })
                    }
                    placeholder="Enter passing score"
                    min="0"
                    max={newQuiz.questions.length}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">
                  Questions Added ({newQuiz.questions.length})
                </h3>

                {newQuiz.questions.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    <Accordion type="single" collapsible className="w-full">
                      {newQuiz.questions.map((question, idx) => (
                        <AccordionItem key={idx} value={`new-q-${idx}`}>
                          <div className="flex justify-between items-center px-4 py-2 border-b">
                            <AccordionTrigger className="hover:no-underline flex-1 text-left">
                              <span className="font-medium">Question {idx + 1}</span>
                            </AccordionTrigger>
                            <div
                              className="p-1 cursor-pointer text-red-500 hover:text-red-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveQuestion(idx);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </div>
                          </div>
                          <AccordionContent>
                            <div className="pb-2 pt-1">
                              <p className="mb-2 font-medium">{question.question}</p>
                              <div className="space-y-2 ml-4">
                                {question.options
                                  .filter((o) => o.trim() !== "")
                                  .map((option, optionIdx) => (
                                    <div
                                      key={`new-option-${optionIdx}`}
                                      className={`p-2 rounded-md flex items-start gap-2 ${
                                        optionIdx === question.correctAnswer
                                          ? "bg-green-50 border border-green-200"
                                          : "bg-gray-50 border border-gray-100"
                                      }`}
                                    >
                                      {optionIdx === question.correctAnswer && (
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                      )}
                                      <div
                                        className={
                                          optionIdx === question.correctAnswer ? "font-medium" : ""
                                        }
                                      >
                                        {option}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ) : (
                  <Alert className="mb-6">
                    <AlertDescription>
                      No questions added yet. Add at least one question below.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="border p-4 rounded-md">
                <h3 className="text-md font-medium mb-4">Add New Question</h3>

                <div className="space-y-4">
                  <div>
                    <Label className="block text-sm font-medium mb-1">Question Text</Label>
                    <Textarea
                      value={currentQuestion.question}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          question: e.target.value,
                        })
                      }
                      placeholder="Enter question text"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label className="block text-sm font-medium mb-2">Options</Label>
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <RadioGroup
                            value={currentQuestion.correctAnswer.toString()}
                            onValueChange={(value) =>
                              setCurrentQuestion({
                                ...currentQuestion,
                                correctAnswer: parseInt(value),
                              })
                            }
                            className="flex-shrink-0"
                          >
                            <RadioGroupItem value={idx.toString()} id={`new-opt-${idx}`} />
                          </RadioGroup>
                          <Input
                            value={option}
                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                            placeholder={`Option ${idx + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Select the radio button next to the correct answer
                    </p>
                  </div>

                  <Button type="button" onClick={handleAddQuestion} className="w-full gap-1">
                    <Plus className="h-4 w-4" />
                    Add This Question
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleCreateQuiz}
                  disabled={newQuiz.questions.length === 0}
                >
                  Create Quiz
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={confirmDeleteId !== null} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to delete this quiz? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleDelete}>
                Delete Quiz
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default QuizzesTab;