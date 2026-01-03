require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedPracticeData() {
  try {
    console.log('Seeding practice data...');

    // Get admin user
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!adminUser) {
      console.log('No admin user found. Please create an admin user first.');
      return;
    }

    // Create topics
    const topics = await Promise.all([
      prisma.practiceTopic.upsert({
        where: { name: 'Arrays' },
        update: {},
        create: {
          name: 'Arrays',
          description: 'Array manipulation, sorting, searching, and related algorithms',
          createdById: adminUser.id
        }
      }),
      prisma.practiceTopic.upsert({
        where: { name: 'Strings' },
        update: {},
        create: {
          name: 'Strings',
          description: 'String processing, pattern matching, and string algorithms',
          createdById: adminUser.id
        }
      }),
      prisma.practiceTopic.upsert({
        where: { name: 'Dynamic Programming' },
        update: {},
        create: {
          name: 'Dynamic Programming',
          description: 'DP techniques, memoization, tabulation, and optimization',
          createdById: adminUser.id
        }
      }),
      prisma.practiceTopic.upsert({
        where: { name: 'Graphs' },
        update: {},
        create: {
          name: 'Graphs',
          description: 'Graph traversal, shortest paths, minimum spanning trees, and graph algorithms',
          createdById: adminUser.id
        }
      }),
      prisma.practiceTopic.upsert({
        where: { name: 'Trees' },
        update: {},
        create: {
          name: 'Trees',
          description: 'Binary trees, BST, traversal techniques, and tree-based algorithms',
          createdById: adminUser.id
        }
      })
    ]);

    console.log('Created topics:', topics.map(t => t.name));

    // Create sample questions
    const sampleQuestions = [
      {
        topicId: topics[0].id, // Arrays
        name: 'Two Sum',
        url: 'https://leetcode.com/problems/two-sum/',
        platform: 'LeetCode',
        difficulty: 'Easy'
      },
      {
        topicId: topics[0].id, // Arrays
        name: 'Maximum Subarray',
        url: 'https://leetcode.com/problems/maximum-subarray/',
        platform: 'LeetCode',
        difficulty: 'Medium'
      },
      {
        topicId: topics[1].id, // Strings
        name: 'Longest Substring Without Repeating Characters',
        url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        platform: 'LeetCode',
        difficulty: 'Medium'
      },
      {
        topicId: topics[1].id, // Strings
        name: 'Valid Parentheses',
        url: 'https://leetcode.com/problems/valid-parentheses/',
        platform: 'LeetCode',
        difficulty: 'Easy'
      },
      {
        topicId: topics[2].id, // DP
        name: 'Climbing Stairs',
        url: 'https://leetcode.com/problems/climbing-stairs/',
        platform: 'LeetCode',
        difficulty: 'Easy'
      },
      {
        topicId: topics[2].id, // DP
        name: 'Coin Change',
        url: 'https://leetcode.com/problems/coin-change/',
        platform: 'LeetCode',
        difficulty: 'Medium'
      },
      {
        topicId: topics[3].id, // Graphs
        name: 'Number of Islands',
        url: 'https://leetcode.com/problems/number-of-islands/',
        platform: 'LeetCode',
        difficulty: 'Medium'
      },
      {
        topicId: topics[3].id, // Graphs
        name: 'BFS and DFS in Graph',
        url: 'https://www.geeksforgeeks.org/bfs-vs-dfs/',
        platform: 'GeeksforGeeks',
        difficulty: 'Easy'
      },
      {
        topicId: topics[4].id, // Trees
        name: 'Maximum Depth of Binary Tree',
        url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
        platform: 'LeetCode',
        difficulty: 'Easy'
      },
      {
        topicId: topics[4].id, // Trees
        name: 'Validate Binary Search Tree',
        url: 'https://leetcode.com/problems/validate-binary-search-tree/',
        platform: 'LeetCode',
        difficulty: 'Medium'
      }
    ];

    const questions = await Promise.all(
      sampleQuestions.map(async (q) => {
        return await prisma.practiceQuestion.upsert({
          where: { url: q.url },
          update: {},
          create: {
            ...q,
            status: 'APPROVED',
            approvedBy: adminUser.id
          }
        });
      })
    );

    console.log('Created questions:', questions.length);

    console.log('Practice data seeded successfully!');
  } catch (error) {
    console.error('Error seeding practice data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedPracticeData();
