"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { useAdminQuestions } from "@/hooks/useAdminQuestions";
import { usePracticeTopics } from "@/hooks/usePracticeQuestions";
import { AdminQuestion, CreateQuestionRequest, UpdateQuestionRequest } from "@/types/practice";
import { Plus, Edit, Trash2, ExternalLink, Check, X } from "lucide-react";

export default function AdminQuestionManager() {
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    topicId: "",
    name: "",
    url: "",
    platform: "",
    difficulty: ""
  });

  const { questions, loading, error, createQuestion, updateQuestion, deleteQuestion, approveQuestion, rejectQuestion } = useAdminQuestions();
  const { topics } = usePracticeTopics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await updateQuestion(editingId, formData as UpdateQuestionRequest);
      } else {
        await createQuestion(formData as CreateQuestionRequest);
      }
      
      // Reset form
      setFormData({
        topicId: "",
        name: "",
        url: "",
        platform: "",
        difficulty: ""
      });
      setIsAddingQuestion(false);
      setEditingId(null);
    } catch (error) {
      console.error('Failed to save question:', error);
    }
  };

  const handleEdit = (question: AdminQuestion) => {
    setEditingId(question.id);
    setFormData({
      topicId: question.topicId,
      name: question.name,
      url: question.url,
      platform: question.platform || "",
      difficulty: question.difficulty || ""
    });
  };

  const handleCancel = () => {
    setFormData({
      topicId: "",
      name: "",
      url: "",
      platform: "",
      difficulty: ""
    });
    setIsAddingQuestion(false);
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Question Bank Management</h2>
        <Button onClick={() => setIsAddingQuestion(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </Button>
      </div>

      {/* Add/Edit Question Form */}
      {(isAddingQuestion || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Question" : "Add New Question"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Topic</label>
                <select
                  value={formData.topicId}
                  onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                  className="w-full p-2 border rounded-md bg-background"
                  required
                >
                  <option value="">Select a topic</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Question Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter question name"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Question URL</label>
                <Input
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://leetcode.com/problems/example/"
                  type="url"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Platform (Optional)</label>
                <Input
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  placeholder="LeetCode, Codeforces, etc."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty (Optional)</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="">Select difficulty</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? "Update" : "Add"} Question
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Questions List */}
      <Card>
        <CardHeader>
          <CardTitle>All Questions ({questions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">No questions found</div>
              <p className="text-sm text-muted-foreground mt-2">
                Add your first question to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium truncate">{question.name}</h4>
                        <Badge text={question.status} variant={
                          question.status === 'APPROVED' ? 'green' : 
                          question.status === 'REJECTED' ? 'yellow' : 'gray'
                        } />
                        {question.platform && (
                          <Badge text={question.platform} variant="gray" />
                        )}
                        {question.difficulty && (
                          <Badge text={question.difficulty} variant="gray" />
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        Topic: {question.topic.name}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <a
                          href={question.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Problem
                        </a>
                        <span>•</span>
                        <span>{question._count.attempts} attempts</span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Added: {new Date(question.createdAt).toLocaleDateString()}
                        {question.suggested && (
                          <span> • Suggested by: {question.suggested.name}</span>
                        )}
                        {question.approved && (
                          <span> • Approved by: {question.approved.name}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {question.status === 'PENDING' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => approveQuestion(question.id)}
                            className="text-emerald-600 hover:text-emerald-700"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => rejectQuestion(question.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(question)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteQuestion(question.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
