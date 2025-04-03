import type React from "react";
import type { CourseWeek } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CurriculumTabProps {
  curriculum: CourseWeek[];
}

interface FormData {
  week: number;
  topic: string;
  details: string[];
}

const CurriculumTab: React.FC<CurriculumTabProps> = ({ curriculum: initialCurriculum }) => {
  const [curriculum, setCurriculum] = useState<CourseWeek[]>(initialCurriculum);
  const [isAdding, setIsAdding] = useState(false);
  const [editingWeek, setEditingWeek] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    week: 0,
    topic: "",
    details: [""],
  });

  const handleAddWeek = () => {
    setIsAdding(true);
    setFormData({
      week: curriculum.length + 1,
      topic: "",
      details: [""],
    });
  };

  const handleEditWeek = (week: CourseWeek) => {
    setEditingWeek(week.week);
    setFormData({
      week: week.week,
      topic: week.topic,
      details: [...week.details],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newWeek: CourseWeek = {
      week: formData.week,
      topic: formData.topic,
      details: formData.details.filter(detail => detail.trim() !== ""),
    };

    if (editingWeek !== null) {
      setCurriculum(curriculum.map(w => 
        w.week === editingWeek ? newWeek : w
      ));
      setEditingWeek(null);
    } else {
      setCurriculum([...curriculum, newWeek]);
      setIsAdding(false);
    }
    
    setFormData({ week: 0, topic: "", details: [""] });
  };

  const handleDeleteWeek = (weekNumber: number) => {
    setCurriculum(curriculum.filter(w => w.week !== weekNumber));
  };

  const handleDetailChange = (index: number, value: string) => {
    const newDetails = [...formData.details];
    newDetails[index] = value;
    setFormData({ ...formData, details: newDetails });
  };

  const addDetailField = () => {
    setFormData({ ...formData, details: [...formData.details, ""] });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Course Curriculum
          </h3>
          {!isAdding && editingWeek === null && (
            <Button onClick={handleAddWeek}>
              <Plus className="h-4 w-4 mr-2" />
              Add Week
            </Button>
          )}
        </div>

        {(isAdding || editingWeek !== null) && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Week Number</label>
                <Input
                  type="number"
                  value={formData.week}
                  onChange={(e) => setFormData({ ...formData, week: Number(e.target.value) })}
                  className="w-24"
                  disabled={editingWeek !== null}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Topic</label>
                <Input
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="Enter week topic"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Details</label>
                {formData.details.map((detail, index) => (
                  <Textarea
                    key={index}
                    value={detail}
                    onChange={(e) => handleDetailChange(index, e.target.value)}
                    placeholder="Enter detail"
                    className="mt-2"
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDetailField}
                  className="mt-2"
                >
                  Add Detail
                </Button>
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingWeek !== null ? "Update" : "Save"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingWeek(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        )}

        {curriculum.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {curriculum.map((week) => (
              <AccordionItem key={week.week} value={`week-${week.week}`}>
                <div className="flex items-center justify-between border-b py-4">
                  <AccordionTrigger className="hover:no-underline flex-1">
                    <div className="flex items-start text-left">
                      <div className="bg-primary/10 text-primary rounded-md p-2 mr-3 flex items-center justify-center">
                        <span className="font-bold">W{week.week}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{week.topic}</h4>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <div className="flex gap-2 pr-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditWeek(week)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteWeek(week.week)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <AccordionContent>
                  <div className="pl-12 pr-4">
                    <ul className="list-disc space-y-2 text-gray-700">
                      {week.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No curriculum content available
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default CurriculumTab;