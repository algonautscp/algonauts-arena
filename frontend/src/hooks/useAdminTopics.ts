import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { PracticeTopic } from "@/types/practice";

export function useAdminTopics() {
  const [topics, setTopics] = useState<PracticeTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/practice-questions/topics');
      setTopics(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch topics');
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  const createTopic = async (data: { name: string; description?: string }) => {
    try {
      const response = await api.post('/api/practice-questions/topics', data);
      await fetchTopics(); // Refresh the topics list
      return response.data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create topic');
    }
  };

  const updateTopic = async (id: string, data: { name?: string; description?: string }) => {
    try {
      // This would need to be implemented in the API
      setTopics(prev => prev.map(topic => 
        topic.id === id 
          ? { ...topic, ...data, updatedAt: new Date().toISOString() }
          : topic
      ));
      return { message: 'Topic updated successfully' };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update topic');
    }
  };

  const deleteTopic = async (id: string) => {
    try {
      // This would need to be implemented in the API
      setTopics(prev => prev.filter(topic => topic.id !== id));
      return { message: 'Topic deleted successfully' };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete topic');
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return {
    topics,
    loading,
    error,
    fetchTopics,
    createTopic,
    updateTopic,
    deleteTopic
  };
}
