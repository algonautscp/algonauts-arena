const prisma = require('../utils/prisma');

class PracticeQuestionsController {
  // POST /api/practice-questions/topics (Admin/Mentor only)
  async createTopic(req, res) {
    try {
      const userId = req.user.id;
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({
          message: 'Topic name is required'
        });
      }

      // Check if user is admin or mentor
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user || !['ADMIN', 'MENTOR'].includes(user.role)) {
        return res.status(403).json({
          message: 'Only admins and mentors can create topics'
        });
      }

      const topic = await prisma.practiceTopic.create({
        data: {
          name,
          description: description || null,
          createdById: userId
        }
      });

      res.status(201).json({
        message: 'Topic created successfully',
        topic
      });
    } catch (error) {
      console.error('Create topic error:', error);
      if (error.code === 'P2002') {
        return res.status(409).json({
          message: 'Topic with this name already exists'
        });
      }
      res.status(500).json({
        message: 'Failed to create topic',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/practice-questions/topics
  async getTopics(req, res) {
    try {
      const topics = await prisma.practiceTopic.findMany({
        include: {
          _count: {
            select: {
              questions: {
                where: {
                  status: 'APPROVED'
                }
              }
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      res.json(topics);
    } catch (error) {
      console.error('Get topics error:', error);
      res.status(500).json({
        message: 'Failed to fetch topics',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/practice/topics/:topicId/questions
  async getTopicQuestions(req, res) {
    try {
      const { topicId } = req.params;
      const userId = req.user.id;

      const topic = await prisma.practiceTopic.findUnique({
        where: { id: topicId },
        include: {
          questions: {
            where: {
              status: 'APPROVED'
            },
            include: {
              attempts: {
                where: {
                  userId: userId
                },
                select: {
                  status: true,
                  updatedAt: true
                }
              }
            },
            orderBy: {
              name: 'asc'
            }
          }
        }
      });

      if (!topic) {
        return res.status(404).json({
          message: 'Topic not found'
        });
      }

      res.json(topic);
    } catch (error) {
      console.error('Get topic questions error:', error);
      res.status(500).json({
        message: 'Failed to fetch topic questions',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // POST /api/practice/questions/suggest
  async suggestQuestion(req, res) {
    try {
      const userId = req.user.id;
      const { topicId, name, url, platform, difficulty } = req.body;

      if (!topicId || !name || !url) {
        return res.status(400).json({
          message: 'Topic ID, name, and URL are required'
        });
      }

      // Check if question with this URL already exists
      const existingQuestion = await prisma.practiceQuestion.findUnique({
        where: { url }
      });

      if (existingQuestion) {
        return res.status(409).json({
          message: 'Question with this URL already exists'
        });
      }

      // Verify topic exists
      const topic = await prisma.practiceTopic.findUnique({
        where: { id: topicId }
      });

      if (!topic) {
        return res.status(404).json({
          message: 'Topic not found'
        });
      }

      const question = await prisma.practiceQuestion.create({
        data: {
          topicId,
          name,
          url,
          platform: platform || null,
          difficulty: difficulty || null,
          suggestedBy: userId,
          status: 'PENDING'
        }
      });

      res.status(201).json({
        message: 'Question suggested successfully',
        question
      });
    } catch (error) {
      console.error('Suggest question error:', error);
      res.status(500).json({
        message: 'Failed to suggest question',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // POST /api/practice/attempt
  async updateAttempt(req, res) {
    try {
      const userId = req.user.id;
      const { questionId, status } = req.body;

      if (!questionId || !status) {
        return res.status(400).json({
          message: 'Question ID and status are required'
        });
      }

      if (!['SOLVED', 'WA', 'TLE', 'RTE'].includes(status)) {
        return res.status(400).json({
          message: 'Invalid status. Must be one of: SOLVED, WA, TLE, RTE'
        });
      }

      // Verify question exists and is approved
      const question = await prisma.practiceQuestion.findUnique({
        where: { id: questionId }
      });

      if (!question) {
        return res.status(404).json({
          message: 'Question not found'
        });
      }

      if (question.status !== 'APPROVED') {
        return res.status(400).json({
          message: 'Question is not approved'
        });
      }

      // Upsert attempt (create or update)
      const attempt = await prisma.practiceAttempt.upsert({
        where: {
          userId_questionId: {
            userId,
            questionId
          }
        },
        update: {
          status,
          updatedAt: new Date()
        },
        create: {
          userId,
          questionId,
          status
        }
      });

      res.json({
        message: 'Attempt updated successfully',
        attempt
      });
    } catch (error) {
      console.error('Update attempt error:', error);
      res.status(500).json({
        message: 'Failed to update attempt',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/practice/my-solutions
  async getMySolutions(req, res) {
    try {
      const userId = req.user.id;

      const solutions = await prisma.problemSolve.findMany({
        where: {
          userId: userId,
          source: 'USER_ADDED'
        },
        orderBy: {
          solvedAt: 'desc'
        }
      });

      res.json(solutions);
    } catch (error) {
      console.error('Get my solutions error:', error);
      res.status(500).json({
        message: 'Failed to fetch solutions',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // POST /api/practice/my-solutions
  async addMySolution(req, res) {
    try {
      const userId = req.user.id;
      const { problemName, problemUrl, solutionUrl, platform } = req.body;

      if (!problemName || !problemUrl || !solutionUrl) {
        return res.status(400).json({
          message: 'Problem name, problem URL, and solution URL are required'
        });
      }

      // Normalize platform to match enum values
      let normalizedPlatform = 'OTHER';
      if (platform) {
        const platformUpper = platform.toUpperCase();
        if (['CODEFORCES', 'CODECHEF', 'LEETCODE', 'ATCODER', 'OTHER'].includes(platformUpper)) {
          normalizedPlatform = platformUpper;
        }
      }

      const solution = await prisma.problemSolve.create({
        data: {
          userId,
          platform: normalizedPlatform,
          problemName,
          problemUrl,
          difficulty: null, // Not required for user solutions
          source: 'USER_ADDED'
        }
      });

      res.status(201).json({
        message: 'Solution added successfully',
        solution
      });
    } catch (error) {
      console.error('Add solution error:', error);
      res.status(500).json({
        message: 'Failed to add solution',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // PATCH /api/practice/my-solutions/:id
  async updateMySolution(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { problemName, problemUrl, solutionUrl, topic, platform } = req.body;

      // Verify solution belongs to user
      const existingSolution = await prisma.problemSolve.findFirst({
        where: {
          id: id,
          userId: userId,
          source: 'USER_ADDED'
        }
      });

      if (!existingSolution) {
        return res.status(404).json({
          message: 'Solution not found'
        });
      }

      const solution = await prisma.problemSolve.update({
        where: { id },
        data: {
          ...(problemUrl && { problemUrl }),
          ...(platform && { platform: platform })
        }
      });

      res.json({
        message: 'Solution updated successfully',
        solution
      });
    } catch (error) {
      console.error('Update solution error:', error);
      res.status(500).json({
        message: 'Failed to update solution',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Helper method to check if user is admin or mentor
  async checkAdminOrMentor(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    return user && ['ADMIN', 'MENTOR'].includes(user.role);
  }

  // GET /api/practice-questions/admin/questions (Admin/Mentor only)
  async getAllQuestionsAdmin(req, res) {
    try {
      const userId = req.user.id;
      
      // Simple check without async helper
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!user || !['ADMIN', 'MENTOR'].includes(user.role)) {
        return res.status(403).json({
          message: 'Only admins and mentors can view all questions'
        });
      }

      const questions = await prisma.practiceQuestion.findMany({
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        message: 'Questions retrieved successfully',
        questions
      });
    } catch (error) {
      console.error('Get all questions error:', error);
      res.status(500).json({
        message: 'Failed to retrieve questions',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // POST /api/practice-questions/admin/questions (Admin/Mentor only)
  async createQuestionAdmin(req, res) {
    try {
      const userId = req.user.id;
      const { topicId, name, url, platform, difficulty } = req.body;

      // Simple check without async helper
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!user || !['ADMIN', 'MENTOR'].includes(user.role)) {
        return res.status(403).json({
          message: 'Only admins and mentors can create questions'
        });
      }

      if (!topicId || !name || !url) {
        return res.status(400).json({
          message: 'Topic ID, name, and URL are required'
        });
      }

      // Check if question with this URL already exists
      const existingQuestion = await prisma.practiceQuestion.findUnique({
        where: { url }
      });

      if (existingQuestion) {
        return res.status(409).json({
          message: 'Question with this URL already exists'
        });
      }

      // Verify topic exists
      const topic = await prisma.practiceTopic.findUnique({
        where: { id: topicId }
      });

      if (!topic) {
        return res.status(404).json({
          message: 'Topic not found'
        });
      }

      const question = await prisma.practiceQuestion.create({
        data: {
          topicId,
          name,
          url,
          platform: platform || null,
          difficulty: difficulty || null,
          status: 'APPROVED',
          approvedBy: userId
        },
        include: {
          topic: true,
          approved: {
            select: { name: true, email: true }
          }
        }
      });

      res.status(201).json({
        message: 'Question created successfully',
        question
      });
    } catch (error) {
      console.error('Create question error:', error);
      res.status(500).json({
        message: 'Failed to create question',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // PUT /api/practice-questions/admin/questions/:id (Admin/Mentor only)
  async updateQuestion(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { name, url, platform, difficulty, status } = req.body;

      if (!(await this.checkAdminOrMentor(userId))) {
        return res.status(403).json({
          message: 'Only admins and mentors can update questions'
        });
      }

      const question = await prisma.practiceQuestion.findUnique({
        where: { id }
      });

      if (!question) {
        return res.status(404).json({
          message: 'Question not found'
        });
      }

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (url !== undefined) updateData.url = url;
      if (platform !== undefined) updateData.platform = platform;
      if (difficulty !== undefined) updateData.difficulty = difficulty;
      if (status !== undefined) {
        if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
          return res.status(400).json({
            message: 'Invalid status. Must be one of: PENDING, APPROVED, REJECTED'
          });
        }
        updateData.status = status;
        if (status === 'APPROVED') {
          updateData.approvedBy = userId;
        }
      }

      const updatedQuestion = await prisma.practiceQuestion.update({
        where: { id },
        data: updateData,
        include: {
          topic: true,
          suggested: {
            select: { name: true, email: true }
          },
          approved: {
            select: { name: true, email: true }
          }
        }
      });

      res.json({
        message: 'Question updated successfully',
        question: updatedQuestion
      });
    } catch (error) {
      console.error('Update question error:', error);
      if (error.code === 'P2002') {
        return res.status(409).json({
          message: 'Question with this URL already exists'
        });
      }
      res.status(500).json({
        message: 'Failed to update question',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // DELETE /api/practice-questions/admin/questions/:id (Admin/Mentor only)
  async deleteQuestion(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      if (!(await this.checkAdminOrMentor(userId))) {
        return res.status(403).json({
          message: 'Only admins and mentors can delete questions'
        });
      }

      const question = await prisma.practiceQuestion.findUnique({
        where: { id },
        include: {
          _count: {
            select: { attempts: true }
          }
        }
      });

      if (!question) {
        return res.status(404).json({
          message: 'Question not found'
        });
      }

      // Check if question has attempts (optional: prevent deletion if attempts exist)
      if (question._count.attempts > 0) {
        return res.status(400).json({
          message: 'Cannot delete question that has user attempts'
        });
      }

      await prisma.practiceQuestion.delete({
        where: { id }
      });

      res.json({
        message: 'Question deleted successfully'
      });
    } catch (error) {
      console.error('Delete question error:', error);
      res.status(500).json({
        message: 'Failed to delete question',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // PUT /api/practice-questions/admin/questions/:id/approve (Admin/Mentor only)
  async approveQuestion(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      if (!(await this.checkAdminOrMentor(userId))) {
        return res.status(403).json({
          message: 'Only admins and mentors can approve questions'
        });
      }

      const question = await prisma.practiceQuestion.findUnique({
        where: { id }
      });

      if (!question) {
        return res.status(404).json({
          message: 'Question not found'
        });
      }

      const updatedQuestion = await prisma.practiceQuestion.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedBy: userId
        },
        include: {
          topic: true,
          suggested: {
            select: { name: true, email: true }
          },
          approved: {
            select: { name: true, email: true }
          }
        }
      });

      res.json({
        message: 'Question approved successfully',
        question: updatedQuestion
      });
    } catch (error) {
      console.error('Approve question error:', error);
      res.status(500).json({
        message: 'Failed to approve question',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // PUT /api/practice-questions/admin/questions/:id/reject (Admin/Mentor only)
  async rejectQuestion(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      if (!(await this.checkAdminOrMentor(userId))) {
        return res.status(403).json({
          message: 'Only admins and mentors can reject questions'
        });
      }

      const question = await prisma.practiceQuestion.findUnique({
        where: { id }
      });

      if (!question) {
        return res.status(404).json({
          message: 'Question not found'
        });
      }

      const updatedQuestion = await prisma.practiceQuestion.update({
        where: { id },
        data: {
          status: 'REJECTED'
        },
        include: {
          topic: true,
          suggested: {
            select: { name: true, email: true }
          },
          approved: {
            select: { name: true, email: true }
          }
        }
      });

      res.json({
        message: 'Question rejected successfully',
        question: updatedQuestion
      });
    } catch (error) {
      console.error('Reject question error:', error);
      res.status(500).json({
        message: 'Failed to reject question',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new PracticeQuestionsController();
