// Validation middleware for common validations
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }
    
    next();
  };
};

// Common validation schemas
const schemas = {
  practiceGoal: {
    weeklyTarget: (value) => {
      if (typeof value !== 'number' || value < 1 || value > 100) {
        throw new Error('weeklyTarget must be a number between 1 and 100');
      }
      return true;
    },
    minDifficulty: (value) => {
      if (!['EASY', 'MEDIUM', 'HARD'].includes(value)) {
        throw new Error('minDifficulty must be EASY, MEDIUM, or HARD');
      }
      return true;
    }
  },
  
  mentorNote: {
    userId: (value) => {
      if (typeof value !== 'string' || value.trim().length === 0) {
        throw new Error('userId is required and must be a non-empty string');
      }
      return true;
    },
    content: (value) => {
      if (typeof value !== 'string' || value.trim().length === 0) {
        throw new Error('content is required and must be a non-empty string');
      }
      if (value.length > 1000) {
        throw new Error('content must be less than 1000 characters');
      }
      return true;
    }
  }
};

// Simple validation function for practice goals
const validatePracticeGoal = (req, res, next) => {
  try {
    const { weeklyTarget, minDifficulty } = req.body;
    
    // Validate weeklyTarget
    if (weeklyTarget === undefined || weeklyTarget === null) {
      return res.status(400).json({
        message: 'weeklyTarget is required'
      });
    }
    
    if (typeof weeklyTarget !== 'number' || weeklyTarget < 1 || weeklyTarget > 100) {
      return res.status(400).json({
        message: 'weeklyTarget must be a number between 1 and 100'
      });
    }
    
    // Validate minDifficulty
    if (minDifficulty === undefined || minDifficulty === null) {
      return res.status(400).json({
        message: 'minDifficulty is required'
      });
    }
    
    if (!['EASY', 'MEDIUM', 'HARD'].includes(minDifficulty)) {
      return res.status(400).json({
        message: 'minDifficulty must be EASY, MEDIUM, or HARD'
      });
    }
    
    next();
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

// Simple validation function for mentor notes
const validateMentorNote = (req, res, next) => {
  try {
    const { userId, content } = req.body;
    
    // Validate userId
    if (userId === undefined || userId === null) {
      return res.status(400).json({
        message: 'userId is required'
      });
    }
    
    if (typeof userId !== 'string' || userId.trim().length === 0) {
      return res.status(400).json({
        message: 'userId must be a non-empty string'
      });
    }
    
    // Validate content
    if (content === undefined || content === null) {
      return res.status(400).json({
        message: 'content is required'
      });
    }
    
    if (typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({
        message: 'content must be a non-empty string'
      });
    }
    
    if (content.length > 1000) {
      return res.status(400).json({
        message: 'content must be less than 1000 characters'
      });
    }
    
    next();
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

module.exports = {
  validateBody,
  schemas,
  validatePracticeGoal,
  validateMentorNote
};
