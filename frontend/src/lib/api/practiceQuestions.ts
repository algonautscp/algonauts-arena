import { api } from '@/lib/api';
import {
  PracticeTopic,
  TopicWithQuestions,
  SuggestQuestionRequest,
  UpdateAttemptRequest,
  UserSolution,
  AddSolutionRequest,
  UpdateSolutionRequest,
  AdminQuestion,
  CreateQuestionRequest,
  UpdateQuestionRequest
} from '@/types/practice';

export const practiceQuestionsApi = {
  // SECTION 1 - TOPIC-WISE QUESTION BANK

  // Get all topics
  getTopics: (): Promise<PracticeTopic[]> => {
    return api.get('/api/practice-questions/topics').then((res: any) => res.data);
  },

  // Get topic with questions
  getTopicQuestions: (topicId: string): Promise<TopicWithQuestions> => {
    return api.get(`/api/practice-questions/topics/${topicId}/questions`).then((res: any) => res.data);
  },

  // Suggest a question
  suggestQuestion: (data: SuggestQuestionRequest): Promise<{ message: string; question: any }> => {
    return api.post('/api/practice-questions/questions/suggest', data).then((res: any) => res.data);
  },

  // Update attempt status
  updateAttempt: (data: UpdateAttemptRequest): Promise<{ message: string; attempt: any }> => {
    return api.post('/api/practice-questions/attempt', data).then((res: any) => res.data);
  },

  // SECTION 2 - USER-SUBMITTED SOLVED QUESTIONS

  // Get user's solutions
  getMySolutions: (): Promise<UserSolution[]> => {
    return api.get('/api/practice-questions/my-solutions').then((res: any) => res.data);
  },

  // Add a solution
  addSolution: (data: AddSolutionRequest): Promise<{ message: string; solution: any }> => {
    return api.post('/api/practice-questions/my-solutions', data).then((res: any) => res.data);
  },

  // Update a solution
  updateSolution: (id: string, data: UpdateSolutionRequest): Promise<{ message: string; solution: any }> => {
    return api.patch(`/api/practice-questions/my-solutions/${id}`, data).then((res: any) => res.data);
  },

  // SECTION 3 - ADMIN QUESTION MANAGEMENT (Admin/Mentor only)

  // Get all questions (admin view)
  getAllQuestions: (): Promise<{ message: string; questions: AdminQuestion[] }> => {
    return api.get('/api/practice-questions/admin/questions').then((res: any) => res.data);
  },

  // Create question (admin)
  createQuestion: (data: CreateQuestionRequest): Promise<{ message: string; question: AdminQuestion }> => {
    return api.post('/api/practice-questions/admin/questions', data).then((res: any) => res.data);
  },

  // Update question (admin)
  updateQuestion: (id: string, data: UpdateQuestionRequest): Promise<{ message: string; question: AdminQuestion }> => {
    return api.put(`/api/practice-questions/admin/questions/${id}`, data).then((res: any) => res.data);
  },

  // Delete question (admin)
  deleteQuestion: (id: string): Promise<{ message: string }> => {
    return api.delete(`/api/practice-questions/admin/questions/${id}`).then((res: any) => res.data);
  },

  // Approve question (admin)
  approveQuestion: (id: string): Promise<{ message: string; question: AdminQuestion }> => {
    return api.put(`/api/practice-questions/admin/questions/${id}/approve`).then((res: any) => res.data);
  },

  // Reject question (admin)
  rejectQuestion: (id: string): Promise<{ message: string; question: AdminQuestion }> => {
    return api.put(`/api/practice-questions/admin/questions/${id}/reject`).then((res: any) => res.data);
  }
};
