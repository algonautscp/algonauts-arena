"use client";

import { useState, useEffect } from "react";
import { practiceQuestionsApi } from "@/lib/api/practiceQuestions";
import { PracticeTopic, TopicWithQuestions, UserSolution } from "@/types/practice";

export function usePracticeTopics() {
  const [topics, setTopics] = useState<PracticeTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await practiceQuestionsApi.getTopics();
      setTopics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch topics');
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return {
    topics,
    loading,
    error,
    refetch: fetchTopics
  };
}

export function useTopicQuestions(topicId: string) {
  const [topic, setTopic] = useState<TopicWithQuestions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopicQuestions = async () => {
    if (!topicId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await practiceQuestionsApi.getTopicQuestions(topicId);
      setTopic(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch topic questions');
      setTopic(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopicQuestions();
  }, [topicId]);

  return {
    topic,
    loading,
    error,
    refetch: fetchTopicQuestions
  };
}

export function useUserSolutions() {
  const [solutions, setSolutions] = useState<UserSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSolutions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await practiceQuestionsApi.getMySolutions();
      setSolutions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch solutions');
      setSolutions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  const addSolution = async (data: { problemName: string; problemUrl: string; solutionUrl: string; platform?: string }) => {
    try {
      const result = await practiceQuestionsApi.addSolution(data);
      await fetchSolutions(); // Refresh the list
      return result;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add solution');
    }
  };

  const updateSolution = async (id: string, data: { problemUrl?: string; platform?: string }) => {
    try {
      const result = await practiceQuestionsApi.updateSolution(id, data);
      await fetchSolutions(); // Refresh the list
      return result;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update solution');
    }
  };

  return {
    solutions,
    loading,
    error,
    addSolution,
    updateSolution,
    refetch: fetchSolutions
  };
}
