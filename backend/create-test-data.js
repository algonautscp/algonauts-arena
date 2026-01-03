require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestData() {
  try {
    console.log('Creating test data...');

    // Get admin user or create one
    let admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!admin) {
      admin = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@algonauts.com',
          password: 'password123',
          role: 'ADMIN'
        }
      });
      console.log('Created admin user');
    }

    // Create topics
    const arraysTopic = await prisma.practiceTopic.upsert({
      where: { name: 'Arrays' },
      update: {},
      create: {
        name: 'Arrays',
        description: 'Array manipulation, sorting, and searching algorithms',
        createdById: admin.id
      }
    });

    const stringsTopic = await prisma.practiceTopic.upsert({
      where: { name: 'Strings' },
      update: {},
      create: {
        name: 'Strings',
        description: 'String processing and pattern matching',
        createdById: admin.id
      }
    });

    const dpTopic = await prisma.practiceTopic.upsert({
      where: { name: 'Dynamic Programming' },
      update: {},
      create: {
        name: 'Dynamic Programming',
        description: 'DP techniques, memoization, and optimization',
        createdById: admin.id
      }
    });

    console.log('Created topics');

    // Create some questions
    await prisma.practiceQuestion.upsert({
      where: { url: 'https://leetcode.com/problems/two-sum/' },
      update: {},
      create: {
        topicId: arraysTopic.id,
        name: 'Two Sum',
        url: 'https://leetcode.com/problems/two-sum/',
        platform: 'LeetCode',
        difficulty: 'Easy',
        status: 'APPROVED',
        approvedBy: admin.id
      }
    });

    await prisma.practiceQuestion.upsert({
      where: { url: 'https://leetcode.com/problems/maximum-subarray/' },
      update: {},
      create: {
        topicId: arraysTopic.id,
        name: 'Maximum Subarray',
        url: 'https://leetcode.com/problems/maximum-subarray/',
        platform: 'LeetCode',
        difficulty: 'Medium',
        status: 'APPROVED',
        approvedBy: admin.id
      }
    });

    await prisma.practiceQuestion.upsert({
      where: { url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      update: {},
      create: {
        topicId: stringsTopic.id,
        name: 'Longest Substring Without Repeating Characters',
        url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        platform: 'LeetCode',
        difficulty: 'Medium',
        status: 'APPROVED',
        approvedBy: admin.id
      }
    });

    await prisma.practiceQuestion.upsert({
      where: { url: 'https://leetcode.com/problems/climbing-stairs/' },
      update: {},
      create: {
        topicId: dpTopic.id,
        name: 'Climbing Stairs',
        url: 'https://leetcode.com/problems/climbing-stairs/',
        platform: 'LeetCode',
        difficulty: 'Easy',
        status: 'APPROVED',
        approvedBy: admin.id
      }
    });

    console.log('Test data created successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();
