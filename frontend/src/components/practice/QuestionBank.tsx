"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/Badge";
import { BookOpen, ExternalLink, Plus } from "lucide-react";
import { usePracticeTopics, useTopicQuestions } from "@/hooks/usePracticeQuestions";
import { PracticeQuestion } from "@/types/practice";
import { practiceQuestionsApi } from "@/lib/api/practiceQuestions";

const STATUS_COLORS = {
  SOLVED: "bg-green-100 text-green-800 border-green-200",
  WA: "bg-red-100 text-red-800 border-red-200",
  TLE: "bg-yellow-100 text-yellow-800 border-yellow-200",
  RTE: "bg-orange-100 text-orange-800 border-orange-200",
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'SOLVED': return 'SOLVED';
    case 'WA': return 'WA';
    case 'TLE': return 'TLE';
    case 'RTE': return 'RTE';
    default: return 'NOT ATTEMPTED';
  }
};

export default function QuestionBank() {
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [suggestingQuestion, setSuggestingQuestion] = useState(false);
  
  const { topics, loading: topicsLoading, error: topicsError } = usePracticeTopics();
  const { topic, loading: questionsLoading, error: questionsError, refetch } = useTopicQuestions(selectedTopicId);

  const selectedTopic = topics.find(t => t.id === selectedTopicId);

  const handleStatusChange = async (questionId: string, newStatus: 'SOLVED' | 'WA' | 'TLE' | 'RTE') => {
    try {
      await practiceQuestionsApi.updateAttempt({ questionId, status: newStatus });
      refetch(); // Refresh the questions
    } catch (error) {
      console.error('Failed to update attempt:', error);
    }
  };

  const handleSuggestQuestion = () => {
    setSuggestingQuestion(true);
    // TODO: Open suggestion modal/dialog
  };

  if (topicsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Question Bank
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading topics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (topicsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Question Bank
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive">Error loading topics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Topics Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Question Bank
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSuggestQuestion}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Suggest Question
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Topic</label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="">Choose a topic...</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name} ({topic._count.questions} questions)
                  </option>
                ))}
              </select>
            </div>

            {selectedTopic && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-1">{selectedTopic.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedTopic.description || 'No description available'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {selectedTopic._count.questions} questions available
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      {selectedTopic && (
        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardContent>
            {questionsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-muted-foreground">Loading questions...</p>
              </div>
            ) : questionsError ? (
              <div className="text-center py-8">
                <p className="text-destructive">Error loading questions</p>
              </div>
            ) : !topic?.questions.length ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No questions available in this topic</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Be the first to suggest a question!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {topic.questions.map((question: PracticeQuestion) => {
                  const attempt = question.attempts?.[0];
                  const currentStatus = attempt?.status;

                  return (
                    <div
                      key={question.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium truncate">{question.name}</h4>
                            {question.difficulty && (
                              <Badge variant="outline" className="text-xs">
                                {question.difficulty}
                              </Badge>
                            )}
                            {question.platform && (
                              <Badge variant="secondary" className="text-xs">
                                {question.platform}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <a
                              href={question.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:text-foreground transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Open Problem
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <select
                            value={currentStatus || ""}
                            onChange={(e) => {
                              if (e.target.value && e.target.value !== currentStatus) {
                                handleStatusChange(question.id, e.target.value as "SOLVED" | "WA" | "TLE" | "RTE");
                              }
                            }}
                            className="px-3 py-1 border rounded text-sm bg-background"
                          >
                            <option value="">Not Attempted</option>
                            <option value="SOLVED">SOLVED</option>
                            <option value="WA">WA</option>
                            <option value="TLE">TLE</option>
                            <option value="RTE">RTE</option>
                          </select>

                          {currentStatus && (
                            <Badge className={STATUS_COLORS[currentStatus as keyof typeof STATUS_COLORS]}>
                              {getStatusText(currentStatus)}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {attempt && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Last updated: {new Date(attempt.updatedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
