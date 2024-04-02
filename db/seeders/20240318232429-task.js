/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const tasks = [
      {
        name: 'Image Gallery Component',
        description: 'Create a React component that allows users to upload multiple images and displays them in a gallery format.',
        hackathon_id: 3,
        max_score: 100,
        type: 'document',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Video Upload and Playback',
        description: 'Build a React component that allows users to upload videos and play them back within the application.',
        hackathon_id: 3,
        max_score: 100,
        type: 'document',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'File Drag and Drop Interface',
        description: 'Design a user-friendly interface where users can drag and drop files from their computer to upload them to a React application.',
        hackathon_id: 3,
        max_score: 100,
        type: 'document',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Innovative Feature Proposal',
        description: 'Provide a detailed proposal for a unique and innovative feature that could enhance the functionality or user experience of a React application. Explain the rationale behind your proposal and how it aligns with the goals of the hackathon.',
        hackathon_id: 3,
        max_score: 100,
        type: 'input',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Graph Traversal Algorithm',
        description: 'Implement an algorithm to traverse a graph and find the shortest path between two nodes. Participants must upload their algorithm implementation and provide test cases to demonstrate its correctness and efficiency.',
        hackathon_id: 4,
        max_score: 200,
        type: 'document',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sorting Algorithm Optimization',
        description: 'Optimize a given sorting algorithm (e.g., bubble sort, merge sort) to achieve better time or space complexity. Participants should upload their optimized implementation and provide a detailed explanation of the optimization techniques used.',
        hackathon_id: 4,
        max_score: 200,
        type: 'document',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Dynamic Programming Challenge',
        description: 'Solve a dynamic programming problem by designing an efficient algorithm to compute the solution. Participants must upload their algorithm implementation along with explanations of the underlying principles and time complexity analysis.',
        hackathon_id: 4,
        max_score: 100,
        type: 'document',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Natural Language Processing (NLP) Project',
        description: 'Develop a natural language processing (NLP) model to analyze sentiment in a given dataset of customer reviews. Participants must preprocess the text data, train a machine learning model, and evaluate its performance in classifying sentiment (positive, negative, neutral). The solution should include data preprocessing steps, model training code, and evaluation metrics to assess the model\'s accuracy and effectiveness.',
        hackathon_id: 5,
        max_score: 750,
        type: 'document',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Philosophical Reflection Essay',
        description: 'Write an essay reflecting on a key philosophical concept explored in the works of Fyodor Dostoevsky. Participants should choose a theme such as morality, free will, or the human condition, and provide a thoughtful analysis supported by references to Dostoevsky\'s literary works. Essays should demonstrate critical thinking, depth of understanding, and original insights into the existential themes present in Dostoevsky\'s philosophy.',
        hackathon_id: 7,
        max_score: 200,
        type: 'document',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
    await queryInterface.bulkInsert('tasks', tasks, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tasks', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('tasks', null, {});
  },
};
