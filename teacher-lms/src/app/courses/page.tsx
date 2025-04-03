"use client";

import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, Users, Filter, ChevronRight } from "lucide-react";
import Link from "next/link";
import { coursesData } from "@/data/courses";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Course {
  id: number;
  title: string;
  instructor: string;
  description: string;
  department: string;
  level: string;
  duration: string;
  enrolled: number;
  rating: number;
  image: string; // This will now store a data URL or file path
}

export default function CoursesPage() {
  const [open, setOpen] = useState(false);
  const [newCourse, setNewCourse] = useState<Course>({
    id: 0,
    title: "",
    instructor: "",
    description: "",
    department: "",
    level: "",
    duration: "",
    enrolled: 0,
    rating: 0,
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [createdCourses, setCreatedCourses] = useState<Course[]>([]); // Store newly created courses

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({
      ...prev,
      [name]: name === "enrolled" || name === "rating" ? Number(value) : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a temporary URL for preview
      setNewCourse((prev) => ({ ...prev, image: imageUrl }));
      setImagePreview(imageUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const courseToSubmit = { ...newCourse, id: Date.now() }; // Assign a unique ID
    setCreatedCourses((prev) => [...prev, courseToSubmit]); // Add to local state
    console.log("New Course Submitted:", courseToSubmit);
    setOpen(false);
    // Reset the form
    setNewCourse({
      id: 0,
      title: "",
      instructor: "",
      description: "",
      department: "",
      level: "",
      duration: "",
      enrolled: 0,
      rating: 0,
      image: "",
    });
    setImagePreview(null); // Clear image preview
  };

  // Combine original coursesData with newly created courses
  const allCourses = [...coursesData, ...createdCourses];

  return (
    <PageLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Courses</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                Create Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newCourse.title}
                    onChange={handleInputChange}
                    placeholder="Enter course title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    name="instructor"
                    value={newCourse.instructor}
                    onChange={handleInputChange}
                    placeholder="Enter instructor name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newCourse.description}
                    onChange={handleInputChange}
                    placeholder="Enter course description"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    value={newCourse.department}
                    onChange={handleInputChange}
                    placeholder="Enter department"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="level">Level</Label>
                  <Input
                    id="level"
                    name="level"
                    value={newCourse.level}
                    onChange={handleInputChange}
                    placeholder="Enter level (e.g., Beginner)"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={newCourse.duration}
                    onChange={handleInputChange}
                    placeholder="Enter duration (e.g., 12 weeks)"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="enrolled">Enrolled Students</Label>
                  <Input
                    id="enrolled"
                    name="enrolled"
                    type="number"
                    value={newCourse.enrolled}
                    onChange={handleInputChange}
                    placeholder="Enter number of enrolled students"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={newCourse.rating}
                    onChange={handleInputChange}
                    placeholder="Enter rating (0-5)"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image">Course Image</Label>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    required
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="submit">Create Course</Button>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-8"
            />
          </div>
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Course List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCourses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2 relative">
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg absolute top-0 left-0">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="pt-48" />
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Users className="h-4 w-4" />
                    <span>{course.enrolled} students</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{course.level}</Badge>
                    <Badge variant="outline">{course.duration}</Badge>
                    <Badge variant="outline">{course.department}</Badge>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center">
                      <span className="text-amber-500">★</span>
                      <span className="ml-1 text-sm font-medium">{course.rating.toFixed(1)}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1">
                      View <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}