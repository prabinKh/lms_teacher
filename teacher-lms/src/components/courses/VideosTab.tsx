import type React from "react";
import type { Video as VideoType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Clock, Pencil, Plus, Trash, Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface VideosTabProps {
  videos: VideoType[];
}

interface FormData {
  id?: string;
  title: string;
  description: string;
  duration: string;
  url: string;
  file?: File | null;
}

const VideosTab: React.FC<VideosTabProps> = ({ videos: initialVideos }) => {
  const [videos, setVideos] = useState<VideoType[]>(initialVideos);
  const [isAdding, setIsAdding] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    duration: "",
    url: "",
    file: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddVideo = () => {
    setIsAdding(true);
    setFormData({
      title: "",
      description: "",
      duration: "",
      url: "",
      file: null,
    });
  };

  const handleEditVideo = (video: VideoType) => {
    setEditingVideoId(video.id);
    setFormData({
      id: video.id,
      title: video.title,
      description: video.description,
      duration: video.duration,
      url: video.url,
      file: null,
    });
  };

  const handleDeleteVideo = (id: string) => {
    setVideos(videos.filter((video) => video.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file });
      setFormData(prev => ({ ...prev, duration: "0:00" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.url && !formData.file) {
      alert("Please provide either a URL or upload a video file");
      return;
    }

    const newVideo: VideoType = {
      id: editingVideoId || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      duration: formData.duration,
      url: formData.file ? URL.createObjectURL(formData.file) : formData.url,
    };

    if (editingVideoId) {
      setVideos(videos.map((video) => 
        video.id === editingVideoId ? newVideo : video
      ));
      setEditingVideoId(null);
    } else {
      setVideos([...videos, newVideo]);
      setIsAdding(false);
    }
    
    setFormData({ title: "", description: "", duration: "", url: "", file: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Video className="h-5 w-5" />
            Course Videos
          </h3>
          {!isAdding && !editingVideoId && (
            <Button onClick={handleAddVideo}>
              <Plus className="h-4 w-4 mr-2" />
              Add Video
            </Button>
          )}
        </div>

        {(isAdding || editingVideoId) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">
                  {editingVideoId ? "Edit Video" : "Add Video"}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingVideoId(null);
                    setFormData({ title: "", description: "", duration: "", url: "", file: null });
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter video title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter video description"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (e.g., 5:30)</label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Enter duration"
                    required={!formData.file}
                    disabled={!!formData.file}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Video URL (optional)</label>
                  <Input
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="Enter video URL"
                    type="url"
                    disabled={!!formData.file}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Or Upload Video (optional)</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="flex-1"
                      disabled={!!formData.url}
                    />
                    {formData.file && (
                      <span className="text-sm text-muted-foreground">
                        {formData.file.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    {editingVideoId ? "Update" : "Save"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAdding(false);
                      setEditingVideoId(null);
                      setFormData({ title: "", description: "", duration: "", url: "", file: null });
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedVideo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-4xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Video Player</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedVideo(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <video
                controls
                src={selectedVideo}
                className="w-full max-h-[70vh]"
                autoPlay
              />
            </div>
          </div>
        )}

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 flex items-center justify-center cursor-pointer"
                     onClick={() => setSelectedVideo(video.url)}>
                  <Video className="h-16 w-16 text-gray-400" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{video.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {video.duration}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditVideo(video)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteVideo(video.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {video.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1"
                    onClick={() => setSelectedVideo(video.url)}
                  >
                    <Video className="h-3.5 w-3.5" />
                    Play Video
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No videos available for this course
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default VideosTab;