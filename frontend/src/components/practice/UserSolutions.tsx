"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { ExternalLink, Plus, Edit } from "lucide-react";
import { useUserSolutions } from "@/hooks/usePracticeQuestions";
import { UserSolution } from "@/types/practice";

export default function UserSolutions() {
  const [isAddingSolution, setIsAddingSolution] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    problemName: "",
    problemUrl: "",
    solutionUrl: "",
    platform: ""
  });

  const { solutions, loading, error, addSolution, updateSolution } = useUserSolutions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await updateSolution(editingId, {
          problemUrl: formData.problemUrl,
          platform: formData.platform
        });
      } else {
        await addSolution(formData);
      }
      
      // Reset form
      setFormData({
        problemName: "",
        problemUrl: "",
        solutionUrl: "",
        platform: ""
      });
      setIsAddingSolution(false);
      setEditingId(null);
    } catch (error) {
      console.error('Failed to save solution:', error);
    }
  };

  const handleEdit = (solution: UserSolution) => {
    setEditingId(solution.id);
    setFormData({
      problemName: "", // Not stored in backend
      problemUrl: solution.problemUrl,
      solutionUrl: "", // Not stored in backend
      platform: solution.platform
    });
  };

  const handleCancel = () => {
    setFormData({
      problemName: "",
      problemUrl: "",
      solutionUrl: "",
      platform: ""
    });
    setIsAddingSolution(false);
    setEditingId(null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            My Solutions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading solutions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            My Solutions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive">Error loading solutions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              My Solutions
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingSolution(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Solution
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Add/Edit Form */}
      {(isAddingSolution || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Solution" : "Add New Solution"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Problem Name</label>
                <div className="bg-slate-900/50 text-gray-300">
                  <Input
                    value={formData.problemName}
                    onChange={(e) => setFormData({ ...formData, problemName: e.target.value })}
                    placeholder="Enter problem name"
                    required
                    disabled={!!editingId} // Can't edit name for existing solutions
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Problem URL</label>
                <div className="bg-slate-900/50 text-gray-300">
                  <Input
                    value={formData.problemUrl}
                    onChange={(e) => setFormData({ ...formData, problemUrl: e.target.value })}
                    placeholder="https://leetcode.com/problems/example/"
                    type="url"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Solution URL</label>
                <div className="bg-slate-900/50 text-gray-300">
                  <Input
                    value={formData.solutionUrl}
                    onChange={(e) => setFormData({ ...formData, solutionUrl: e.target.value })}
                    placeholder="https://github.com/username/solution"
                    type="url"
                    required
                    disabled={!!editingId} // Can't edit solution URL for existing solutions
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Platform (Optional)</label>
                <div className="bg-slate-900/50 text-gray-300">
                  <Input
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    placeholder="LeetCode, Codeforces, etc."
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? "Update" : "Add"} Solution
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Solutions List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Solutions ({solutions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {solutions.length === 0 ? (
            <div className="text-center py-8">
              <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No solutions added yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add your first solution to start tracking your progress
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {solutions.map((solution: UserSolution) => (
                <div
                  key={solution.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium truncate">
                          {solution.problemName}
                        </h4>
                        <Badge text={solution.platform} variant="gray" />
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <a
                          href={solution.problemUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Problem
                        </a>
                      </div>
                      
                      <div className="text-xs text-muted-foreground mt-2">
                        Solved on: {new Date(solution.solvedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(solution)}
                      className="ml-4"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
