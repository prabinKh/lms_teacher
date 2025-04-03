import type React from "react";
import type { Document } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  DownloadCloud,
  File,
  FileImage,
  FileSpreadsheet,
  FileCode,
  Plus,
  Trash,
  Upload,
  X,
  FileAudio,
  FileVideo,
  FileArchive,
  Pencil,
  Eye,
  Save,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface DocumentsTabProps {
  documents: Document[];
}

interface FormData {
  id?: string;
  title: string;
  file?: File | null;
  url?: string;
  type: string;
  size: string;
  content?: string;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ documents: initialDocuments }) => {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editedContent, setEditedContent] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    title: "",
    file: null,
    type: "",
    size: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getDocumentIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (["pdf", "doc", "docx", "txt", "rtf", "odt"].includes(lowerType)) {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    if (["xlsx", "xls", "csv", "ods"].includes(lowerType)) {
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    }
    if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "tiff"].includes(lowerType)) {
      return <FileImage className="h-5 w-5 text-purple-500" />;
    }
    if (["js", "ts", "py", "java", "c", "cpp", "cs", "rb", "php", "html", "css", "json", "xml", "yaml", "sh", "go", "rs", "sql"].includes(lowerType)) {
      return <FileCode className="h-5 w-5 text-amber-500" />;
    }
    if (["mp3", "wav", "ogg", "flac", "aac", "m4a"].includes(lowerType)) {
      return <FileAudio className="h-5 w-5 text-blue-500" />;
    }
    if (["mp4", "mkv", "avi", "mov", "wmv", "flv", "webm"].includes(lowerType)) {
      return <FileVideo className="h-5 w-5 text-indigo-500" />;
    }
    if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(lowerType)) {
      return <FileArchive className="h-5 w-5 text-orange-500" />;
    }
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  };

  const handleAddDocument = () => {
    setIsAdding(true);
    setFormData({
      title: "",
      file: null,
      type: "",
      size: "",
    });
  };

  const handleEditDocument = (doc: Document) => {
    setIsEditing(doc.id);
    setFormData({
      id: doc.id,
      title: doc.title,
      file: null,
      url: doc.url,
      type: doc.type,
      size: doc.size,
    });
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
    if (viewingDocument && viewingDocument.id === id) {
      setViewingDocument(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileType = file.name.split(".").pop() || "";
      const fileSize = formatFileSize(file.size);
      setFormData({
        ...formData,
        file,
        type: fileType,
        size: fileSize,
        title: formData.title || file.name.replace(`.${fileType}`, ""),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isAdding && !formData.file) {
      alert("Please upload a file");
      return;
    }

    const newDocument: Document = {
      id: formData.id || Date.now().toString(),
      title: formData.title,
      url: formData.file ? URL.createObjectURL(formData.file) : formData.url!,
      type: formData.type,
      size: formData.size,
      content: formData.content,
    };

    if (isEditing) {
      setDocuments(documents.map((doc) => 
        doc.id === isEditing ? newDocument : doc
      ));
      setIsEditing(null);
    } else {
      setDocuments([...documents, newDocument]);
      setIsAdding(false);
    }

    setFormData({ title: "", file: null, type: "", size: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fetchDocumentContent = async (doc: Document) => {
    try {
      // For text-based files, fetch the content
      if (["txt", "csv", "json", "xml", "html", "css", "js", "ts", "py", "java", "c", "cpp", "cs", "rb", "php", "sh", "go", "rs", "sql"].includes(doc.type.toLowerCase())) {
        const response = await fetch(doc.url);
        const text = await response.text();
        
        // Update the document with content
        const updatedDoc = { ...doc, content: text };
        setViewingDocument(updatedDoc);
        setEditedContent(text);
        
        // Update the document in the state
        setDocuments(documents.map(d => d.id === doc.id ? updatedDoc : d));
      } else {
        setViewingDocument(doc);
        setEditedContent("");
      }
    } catch (error) {
      console.error("Error fetching document content:", error);
      setViewingDocument(doc);
      setEditedContent("");
    }
  };

  const handleViewDocument = (doc: Document) => {
    fetchDocumentContent(doc);
    setIsEditingContent(false);
  };

  const handleSaveContent = () => {
    if (!viewingDocument) return;

    // Create a blob from the edited content
    const blob = new Blob([editedContent], { type: "text/plain" });
    const newUrl = URL.createObjectURL(blob);

    // Update the document in state
    const updatedDoc = { ...viewingDocument, url: newUrl, content: editedContent };
    
    setDocuments(documents.map(doc => 
      doc.id === viewingDocument.id ? updatedDoc : doc
    ));
    
    setViewingDocument(updatedDoc);
    setIsEditingContent(false);
  };

  const isEditable = (type: string) => {
    const editableTypes = ["txt", "csv", "json", "xml", "html", "css", "js", "ts", "py", "java", "c", "cpp", "cs", "rb", "php", "sh", "go", "rs", "sql"];
    return editableTypes.includes(type.toLowerCase());
  };

  const renderDocumentPreview = () => {
    if (!viewingDocument) return null;

    const type = viewingDocument.type.toLowerCase();
    
    if (isEditingContent && isEditable(type)) {
      return (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-2">
            <h5 className="text-sm font-medium">Editing: {viewingDocument.title}.{type}</h5>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveContent}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setIsEditingContent(false);
                  setEditedContent(viewingDocument.content || "");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
          <Textarea 
            value={editedContent} 
            onChange={(e) => setEditedContent(e.target.value)}
            className="flex-1 font-mono text-sm min-h-[60vh]"
          />
        </div>
      );
    }

    // PDF Files
    if (type === "pdf") {
      return (
        <iframe
          src={viewingDocument.url}
          className="w-full h-[70vh]"
          title="PDF Preview"
        />
      );
    }
    
    // Image Files
    if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "tiff"].includes(type)) {
      return (
        <div className="flex items-center justify-center h-[70vh]">
          <img
            src={viewingDocument.url}
            alt={viewingDocument.title}
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>
      );
    }
    
    // Audio Files
    if (["mp3", "wav", "ogg", "flac", "aac", "m4a"].includes(type)) {
      return (
        <div className="flex items-center justify-center h-[20vh]">
          <audio controls className="w-full max-w-md">
            <source src={viewingDocument.url} type={`audio/${type}`} />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }
    
    // Video Files
    if (["mp4", "mkv", "avi", "mov", "wmv", "flv", "webm"].includes(type)) {
      return (
        <div className="flex items-center justify-center h-[70vh]">
          <video controls className="max-w-full max-h-[70vh]">
            <source src={viewingDocument.url} type={`video/${type === 'mkv' ? 'mp4' : type}`} />
            Your browser does not support the video element.
          </video>
        </div>
      );
    }
    
    // Text/Code Files
    if (isEditable(type)) {
      return (
        <div className="border rounded overflow-auto h-[70vh] p-4 bg-gray-50">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {viewingDocument.content || "Content not available for preview"}
          </pre>
        </div>
      );
    }
    
    // Default for other file types
    return (
      <div className="flex flex-col items-center justify-center h-[20vh] border rounded p-6 bg-gray-50">
        <div className="mb-4">
          {getDocumentIcon(type)}
        </div>
        <p className="text-lg font-semibold">{viewingDocument.title}.{type}</p>
        <p className="text-sm text-gray-500 mb-4">This file type cannot be previewed</p>
        <Button asChild>
          <a href={viewingDocument.url} download={`${viewingDocument.title}.${viewingDocument.type}`}>
            <DownloadCloud className="h-4 w-4 mr-2" />
            Download
          </a>
        </Button>
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Course Documents
          </h3>
          {!isAdding && !isEditing && (
            <Button onClick={handleAddDocument}>
              <Plus className="h-4 w-4 mr-2" />
              Add Document
            </Button>
          )}
        </div>

        {(isAdding || isEditing) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">{isEditing ? "Edit Document" : "Add Document"}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false);
                    setIsEditing(null);
                    setFormData({ title: "", file: null, type: "", size: "" });
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
                    placeholder="Enter document title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {isEditing ? "Replace File (optional)" : "Upload File"}
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="flex-1"
                      required={isAdding}
                    />
                    {formData.file ? (
                      <span className="text-sm text-muted-foreground">
                        {formData.file.name} ({formData.size})
                      </span>
                    ) : isEditing && (
                      <span className="text-sm text-muted-foreground">
                        Current: {formData.type.toUpperCase()} ({formData.size})
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    {isEditing ? "Update" : "Save"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAdding(false);
                      setIsEditing(null);
                      setFormData({ title: "", file: null, type: "", size: "" });
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

        {viewingDocument && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  {getDocumentIcon(viewingDocument.type)}
                  <h4 className="text-lg font-semibold">{viewingDocument.title}.{viewingDocument.type}</h4>
                </div>
                <div className="flex items-center gap-2">
                  {isEditable(viewingDocument.type) && !isEditingContent && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditingContent(true)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                  >
                    <a href={viewingDocument.url} download={`${viewingDocument.title}.${viewingDocument.type}`}>
                      <DownloadCloud className="h-4 w-4 mr-1" />
                      Download
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewingDocument(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-2">
                {renderDocumentPreview()}
              </div>
            </div>
          </div>
        )}

        {documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  {getDocumentIcon(doc.type)}
                  <div>
                    <h4 className="font-medium">{doc.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {doc.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{doc.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDocument(doc)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditDocument(doc)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1"
                    asChild
                  >
                    <a href={doc.url} download={doc.title + "." + doc.type}>
                      <DownloadCloud className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDocument(doc.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No documents available for this course
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsTab;