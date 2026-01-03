"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { useAdminQuestions } from "@/hooks/useAdminQuestions";
import { useAdminTopics } from "@/hooks/useAdminTopics";
import { AdminQuestion, CreateQuestionRequest, UpdateQuestionRequest } from "@/types/practice";
import { Plus, Edit, Trash2, ExternalLink, Check, X, BookOpen, FolderPlus } from "lucide-react";

export default function AdminPracticeManager() {
  const [activeTab, setActiveTab] = useState<'topics' | 'questions'>('topics');
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<'topic' | 'question' | null>(null);
  
  const [topicForm, setTopicForm] = useState({
    name: "",
    description: ""
  });
  
  const [questionForm, setQuestionForm] = useState({
    topicId: "",
    name: "",
    url: "",
    platform: "",
    difficulty: ""
  });

  const { questions, loading: questionsLoading, error: questionsError, createQuestion, updateQuestion, deleteQuestion, approveQuestion, rejectQuestion } = useAdminQuestions();
  const { topics, loading: topicsLoading, error: topicsError, createTopic } = useAdminTopics();

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTopic(topicForm);
      setTopicForm({ name: "", description: "" });
      setIsAddingTopic(false);
    } catch (error) {
      console.error('Failed to create topic:', error);
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId && editingType === 'question') {
        await updateQuestion(editingId, questionForm as UpdateQuestionRequest);
      } else {
        await createQuestion(questionForm as CreateQuestionRequest);
      }
      
      // Reset form
      setQuestionForm({
        topicId: "",
        name: "",
        url: "",
        platform: "",
        difficulty: ""
      });
      setIsAddingQuestion(false);
      setEditingId(null);
      setEditingType(null);
    } catch (error) {
      console.error('Failed to save question:', error);
    }
  };

  const handleEditQuestion = (question: AdminQuestion) => {
    setEditingId(question.id);
    setEditingType('question');
    setQuestionForm({
      topicId: question.topicId,
      name: question.name,
      url: question.url,
      platform: question.platform || "",
      difficulty: question.difficulty || ""
    });
  };

  const handleCancel = () => {
    setTopicForm({ name: "", description: "" });
    setQuestionForm({
      topicId: "",
      name: "",
      url: "",
      platform: "",
      difficulty: ""
    });
    setIsAddingTopic(false);
    setIsAddingQuestion(false);
    setEditingId(null);
    setEditingType(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Practice Management</h2>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('topics')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'topics' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          Topics
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'questions' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Questions
        </button>
      </div>

      {/* Topics Tab */}
      {activeTab === 'topics' && (
        <div className="space-y-6">
          {/* Add Topic Button */}
          <div className="flex justify-end">
            <Button onClick={() => setIsAddingTopic(true)}>
              <FolderPlus className="w-4 h-4 mr-2" />
              Add Topic
            </Button>
          </div>

          {/* Add Topic Form */}
          {isAddingTopic && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Topic</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTopic} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Topic Name</label>
                    <Input
                      value={topicForm.name}
                      onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                      placeholder="e.g., Arrays, Dynamic Programming"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
                    <textarea
                      value={topicForm.description}
                      onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                      placeholder="Brief description of the topic"
                      className="w-full p-2 border rounded-md bg-background min-h-[80px] resize-none"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="submit">Add Topic</Button>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Topics List */}
          <Card>
            <CardHeader>
              <CardTitle>All Topics ({topics.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {topicsLoading ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Loading topics...</div>
                </div>
              ) : topicsError ? (
                <div className="text-center py-8">
                  <div className="text-red-500">Error: {topicsError}</div>
                </div>
              ) : topics.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">No topics found</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add your first topic to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg">{topic.name}</h4>
                          {topic.description && (
                            <p className="text-sm text-muted-foreground mt-1">{topic.description}</p>
                          )}
                          <div className="text-xs text-muted-foreground mt-2">
                            Created: {new Date(topic.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
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
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          {/* Add Question Button */}
          <div className="flex justify-end">
            <Button onClick={() => setIsAddingQuestion(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>

          {/* Add/Edit Question Form */}
          {(isAddingQuestion || (editingId && editingType === 'question')) && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingId ? "Edit Question" : "Add New Question"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitQuestion} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Topic</label>
                    <select
                      value={questionForm.topicId}
                      onChange={(e) => setQuestionForm({ ...questionForm, topicId: e.target.value })}
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
                      value={questionForm.name}
                      onChange={(e) => setQuestionForm({ ...questionForm, name: e.target.value })}
                      placeholder="Enter question name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Question URL</label>
                    <Input
                      value={questionForm.url}
                      onChange={(e) => setQuestionForm({ ...questionForm, url: e.target.value })}
                      placeholder="https://leetcode.com/problems/example/"
                      type="url"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Platform (Optional)</label>
                    <Input
                      value={questionForm.platform}
                      onChange={(e) => setQuestionForm({ ...questionForm, platform: e.target.value })}
                      placeholder="LeetCode, Codeforces, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Difficulty (Optional)</label>
                    <select
                      value={questionForm.difficulty}
                      onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
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
              {questionsLoading ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Loading questions...</div>
                </div>
              ) : questionsError ? (
                <div className="text-center py-8">
                  <div className="text-red-500">Error: {questionsError}</div>
                </div>
              ) : questions.length === 0 ? (
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
                            Topic: {question.topic?.name || 'Unknown'}
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
                            <span>{question._count?.attempts || 0} attempts</span>
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
                            onClick={() => handleEditQuestion(question)}
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
      )}
    </div>
  );
}
