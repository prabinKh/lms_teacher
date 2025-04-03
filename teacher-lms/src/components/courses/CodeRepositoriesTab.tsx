import React, { useState, useEffect } from "react";
import type { CodeRepository } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Code,
  ExternalLink,
  Copy,
  Plus,
  Trash,
  X,
  Pencil,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CodeRepositoriesTabProps {
  codeRepositories?: CodeRepository[];
}

interface FormData {
  id?: string;
  title: string;
  description: string;
  language: string;
  url: string;
  code: string;
}

const CodeRepositoriesTab: React.FC<CodeRepositoriesTabProps> = ({
  codeRepositories: initialRepositories = []
}) => {
  const [repositories, setRepositories] = useState<CodeRepository[]>(initialRepositories);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    language: "",
    url: "",
    code: "",
  });
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [visibleCode, setVisibleCode] = useState<string[]>([]);

  // Fix: Use a proper dependency array to prevent infinite updates
  useEffect(() => {
    // Only update if the prop value is different from the current state
    if (initialRepositories !== repositories) {
      setRepositories(initialRepositories);
    }
  }, [initialRepositories]); // Don't include repositories in the dependency array

  const copyToClipboard = (text: string, repoId: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(repoId);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const toggleCodeVisibility = (repoId: string) => {
    setVisibleCode(prev => 
      prev.includes(repoId) 
        ? prev.filter(id => id !== repoId) 
        : [...prev, repoId]
    );
  };

  const handleAddRepository = () => {
    setIsAdding(true);
    setFormData({
      title: "",
      description: "",
      language: "",
      url: "",
      code: "",
    });
  };

  const handleEditRepository = (repo: CodeRepository) => {
    setIsEditing(repo.id);
    setFormData({
      id: repo.id,
      title: repo.title,
      description: repo.description,
      language: repo.language,
      url: repo.url || "",
      code: repo.code,
    });
  };

  const handleDeleteRepository = (id: string) => {
    setRepositories(prevRepositories => prevRepositories.filter((repo) => repo.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRepository: CodeRepository = {
      id: formData.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      language: formData.language,
      url: formData.url || "", // Default to empty string if URL is not provided
      code: formData.code,
    };

    if (isEditing) {
      setRepositories(prevRepositories => prevRepositories.map((repo) => 
        repo.id === isEditing ? newRepository : repo
      ));
      setIsEditing(null);
    } else {
      setRepositories(prevRepositories => [...prevRepositories, newRepository]);
      setIsAdding(false);
    }

    setFormData({
      title: "",
      description: "",
      language: "",
      url: "",
      code: "",
    });
  };

  const closeForm = () => {
    setIsAdding(false);
    setIsEditing(null);
    setFormData({
      title: "",
      description: "",
      language: "",
      url: "",
      code: "",
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Code className="h-5 w-5" />
            Code Repositories
          </h3>
          {!isAdding && !isEditing && (
            <Button onClick={handleAddRepository}>
              <Plus className="h-4 w-4 mr-2" />
              Add Repository
            </Button>
          )}
        </div>

        {repositories && repositories.length > 0 ? (
          <div className="space-y-6">
            {repositories.map((repo) => (
              <Card key={repo.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{repo.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {repo.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{repo.language}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRepository(repo)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRepository(repo.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Code Sample</span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 gap-1"
                          onClick={() => toggleCodeVisibility(repo.id)}
                        >
                          {visibleCode.includes(repo.id) ? (
                            <>
                              <EyeOff className="h-3.5 w-3.5" />
                              <span className="text-xs">Hide</span>
                            </>
                          ) : (
                            <>
                              <Eye className="h-3.5 w-3.5" />
                              <span className="text-xs">Show</span>
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 gap-1"
                          onClick={() => copyToClipboard(repo.code, repo.id)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span className="text-xs">
                            {copySuccess === repo.id ? "Copied!" : "Copy"}
                          </span>
                        </Button>
                      </div>
                    </div>
                    {visibleCode.includes(repo.id) && (
                      <div className="relative">
                        <pre className="text-xs bg-gray-100 p-3 rounded-md overflow-x-auto font-mono">
                          {repo.code}
                        </pre>
                      </div>
                    )}
                  </div>

                  {repo.url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-1"
                      asChild
                    >
                      <a href={repo.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" />
                        View Repository
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No code repositories available for this course
          </p>
        )}

        {/* Add/Edit Repository Modal */}
        {(isAdding || isEditing) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">
                  {isEditing ? "Edit Repository" : "Add Repository"}
                </h4>
                <Button variant="ghost" size="sm" onClick={closeForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Repository title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Language</label>
                    <Input
                      value={formData.language}
                      onChange={(e) =>
                        setFormData({ ...formData, language: e.target.value })
                      }
                      placeholder="e.g. JavaScript, Python, Java"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Input
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Short description of the repository"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL (Optional)</label>
                  <Input
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    placeholder="https://github.com/username/repository"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Code Sample</label>
                  <Textarea
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="Paste a representative code sample here"
                    className="font-mono h-40"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CodeRepositoriesTab;