import { useState, useEffect } from "react";
import { practiceQuestionsApi } from "@/lib/api/practiceQuestions";
import { AdminQuestion, CreateQuestionRequest, UpdateQuestionRequest } from "@/types/practice";

export function useAdminQuestions() {
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await practiceQuestionsApi.getAllQuestions();
      setQuestions(response.questions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch questions');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const createQuestion = async (data: CreateQuestionRequest) => {
    try {
      const response = await practiceQuestionsApi.createQuestion(data);
      setQuestions(prev => [response.question, ...prev]);
      return response;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create question');
    }
  };

  const updateQuestion = async (id: string, data: UpdateQuestionRequest) => {
    try {
      const response = await practiceQuestionsApi.updateQuestion(id, data);
      setQuestions(prev => prev.map(q => q.id === id ? response.question : q));
      return response;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update question');
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      await practiceQuestionsApi.deleteQuestion(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete question');
    }
  };

  const approveQuestion = async (id: string) => {
    try {
      const response = await practiceQuestionsApi.approveQuestion(id);
      setQuestions(prev => prev.map(q => q.id === id ? response.question : q));
      return response;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to approve question');
    }
  };

  const rejectQuestion = async (id: string) => {
    try {
      const response = await practiceQuestionsApi.rejectQuestion(id);
      setQuestions(prev => prev.map(q => q.id === id ? response.question : q));
      return response;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to reject question');
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return {
    questions,
    loading,
    error,
    fetchQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    approveQuestion,
    rejectQuestion
  };
}
