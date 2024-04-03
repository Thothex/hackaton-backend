/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hackathons = [
      {
        name: 'Hackathon "Best Review"',
        type: 'team',
        description: 'Scientific digest! Participants will have the opportunity to act as real scientists',
        start: new Date('2023-03-01'),
        category_id: 2,
        audience: '14-18 years, school',
        rules: `Each team will be assigned a scientific article or paper to review within the given timeframe. Participants are required to analyze the content of the assigned article and provide a comprehensive review highlighting its strengths, weaknesses, and potential areas for improvement. Reviews must be submitted in written form and include references to relevant literature or research to support their arguments. Plagiarism is strictly prohibited. All submissions must be original work created by the participating team. The deadline for submission is [deadline date and time]. Judges will evaluate submissions based on criteria such as clarity of analysis, depth of understanding, and coherence of presentation. Winners will be announced during the awards ceremony and awarded prizes accordingly. Teams are encouraged to collaborate, share insights, and engage in constructive discussions throughout the review process. Have fun and embrace the opportunity to engage with scientific literature in a collaborative and intellectually stimulating environment!`,
        prize: '1000',
        private: false,
        end: new Date('2023-03-02'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Rapid Dash through Articles and Journals',
        type: 'person',
        description: '"Rapid Dash through Articles and Journals" offers participants a thrilling opportunity to dive headfirst into the realm of academic exploration. With a tight deadline of 24 hours, participants will embark on a high-speed journey through scientific articles and journals, crafting their very first scholarly piece. From dissecting complex theories to synthesizing groundbreaking research, this hackathon challenges participants to push their intellectual boundaries and emerge as fledgling scholars in the span of a single day. Join us for an exhilarating race against the clock, where creativity, curiosity, and academic prowess collide to shape the future of scientific discourse.',
        category_id: 1,
        audience: '14-18 years, school',
        rules: 'Participants in "Rapid Dash through Articles and Journals" must craft their very first scientific article within a tight 24-hour deadline. Creativity, accuracy, and adherence to academic standards are key. Collaboration is encouraged, but each submission must be individual. Winners will be selected based on the quality and originality of their work. The hackathon begins at the designated start time and ends precisely 24 hours later.',
        prize: '200',
        private: false,
        start: new Date('2023-03-03'),
        end: new Date('2023-03-04'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "React Challenge: The Fundamental Hackathon",
        type: 'team',
        description:'"React Challenge: The Fundamental Hackathon" is an exciting event aimed at bringing together developers of all skill levels to explore the versatility and power of React. Participants will have the opportunity to delve into the basics of React development, honing their skills through a series of engaging challenges and projects. Whether you\'re a seasoned developer looking to refresh your fundamentals or a beginner eager to jumpstart your React journey, this hackathon offers a supportive environment for learning and collaboration. Join us for a weekend of creativity, innovation, and camaraderie as we celebrate the foundation of React development together.',
        category_id: 3,
        audience: 'no limit, all',
        rules: 'Participants will engage in various React development challenges and projects. Each team selects a project to implement using React. Code must adhere to best practices and readability standards. Collaboration among team members is encouraged, but each team\'s solution must be unique. Teams have the hackathon duration to complete and submit their project. Projects will be judged on functionality, efficiency, and creativity. Winners will be chosen based on the quality and innovation of their projects. Participants are urged to interact with mentors and peers to enrich their learning experience. Let\'s embrace the challenge, elevate our React skills, and celebrate innovation together!',
        prize: '400',
        private: false,
        start: new Date(2024, 3, 5),
        end: new Date(new Date(2024, 3, 5).getTime() + 24 * 60 * 60 * 1000 * 7),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Algorithm Adventure: The Coding Challenge',
        type: 'team',
        description: '"Algorithm Adventure: The Coding Challenge" invites participants on an exhilarating journey through the world of algorithms. With a month-long duration, participants will immerse themselves in a series of coding challenges designed to sharpen their algorithmic problem-solving skills. Whether you\'re a seasoned coder looking to test your mettle or a beginner eager to embark on your algorithmic quest, this challenge offers a supportive environment for growth and exploration. Join us for a month of coding excitement, where ingenuity, perseverance, and camaraderie converge to tackle the most formidable algorithmic puzzles!',
        category_id: 4,
        audience: 'no limit, all',
        rules: 'Participants in "Algorithm Adventure: The Coding Challenge" will receive a new coding challenge every week for a month. Challenges will cover various algorithmic concepts and difficulty levels. Participants must submit their solutions by the specified deadline. Solutions will be evaluated based on correctness, efficiency, and adherence to coding standards. The participant with the highest cumulative score at the end of the challenge will be declared the winner. Collaboration is not permitted; each participant must solve the challenges individually. Let the coding adventure begin!',
        prize: '500',
        private: false,
        start: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
        end: new Date(new Date().getTime() + 60 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Data Dive: The Data Science Challenge',
        type: 'team',
        description: '"Data Dive: The Data Science Challenge" immerses participants into the depths of data science, offering an intensive week-long exploration of data analysis and machine learning. Participants will engage in a series of real-world data challenges, ranging from predictive modeling to data visualization, designed to enhance their analytical skills and foster innovative problem-solving. Whether you\'re an experienced data scientist or a novice eager to dive into the world of data, this challenge provides an enriching environment for learning and collaboration. Dive in with us for a week of data-driven discovery, where creativity, insight, and teamwork converge to unlock the potential of data!',
        category_id: 5,
        audience: 'no limit, all',
        rules: 'Participants in "Data Dive: The Data Science Challenge" will receive a new data challenge every day for a week. Challenges will cover various aspects of data analysis and machine learning. Participants must submit their solutions by the specified deadline each day. Solutions will be evaluated based on accuracy, creativity, and effectiveness. The team with the highest cumulative score at the end of the challenge will be declared the winner. Collaboration within teams is encouraged; each team must collectively solve the challenges presented. Let the data dive begin!',
        prize: '750',
        private: false,
        start: new Date(),
        end: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Artistic Odyssey: The Creative Journey',
        type: 'person',
        description: '"Artistic Odyssey: The Creative Journey" was a captivating exploration of artistic expression that unfolded three months ago. During this inspiring event, artists from diverse backgrounds embarked on a transformative journey to push the boundaries of their creativity. Through a series of weekly challenges and projects, participants delved into various artistic mediums, embracing themes of imagination, emotion, and cultural significance. Although the challenge has concluded, the echoes of creative discovery linger on, igniting a passion for art and fostering a vibrant community of artistic expression.',
        category_id: 6,
        audience: 'All ages, artists and creatives',
        rules: 'During "Artistic Odyssey: The Creative Journey," participants engaged in weekly artistic challenges designed to spark creativity and innovation. Challenges encompassed a wide range of artistic mediums and themes, allowing participants to explore and experiment with their artistic vision. Participants were encouraged to share their creations on social media platforms using designated hashtags to connect with fellow artists and inspire others. At the culmination of the challenge, participants work was celebrated in a virtual exhibition, showcasing their artistic achievements and celebrating the diverse tapestry of creative expression.',
        prize: '100',
        private: false,
        start: new Date(new Date().getTime() - 3 * 30 * 24 * 60 * 60 * 1000),
        end: new Date(new Date().getTime() - 2 * 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Dostoevsky\'s Philosophy: Exploring Existentialism',
        type: 'person',
        description: '"Dostoevsky\'s Philosophy: Exploring Existentialism" offers participants a unique opportunity to delve into the profound philosophical themes present in the works of Fyodor Dostoevsky. As we journey through the depths of existentialist thought, inspired by Dostoevsky\'s literary masterpieces, participants will engage in a month-long exploration of existential questions on morality, free will, and the human condition. Whether you\'re captivated by the existential angst of Raskolnikov or intrigued by the moral dilemmas of Ivan Karamazov, this odyssey promises to be a transformative experience, challenging participants to confront the complexities of existence and meaning in the modern world.',
        category_id: 7,
        audience: 'All ages, lovers of literature and philosophy',
        rules: 'During hackathon participants will embark on a journey of self-discovery and philosophical inquiry. Weekly discussions and readings will center around key philosophical concepts found in Dostoevsky\'s works, inviting participants to reflect on their own beliefs and perspectives. Participants are encouraged to share their insights and interpretations in a collaborative online forum, fostering a community of intellectual exchange and dialogue. At the culmination of the odyssey, participants will have the opportunity to create their own philosophical reflections inspired by Dostoevsky\'s themes. Join us on this existential journey as we navigate the labyrinth of Dostoevskian thought and uncover the deeper truths of the human soul.',
        prize: '200',
        private: false,
        start: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
        end: new Date(new Date().getTime() + 60 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

    ]
    await queryInterface.bulkInsert('hackathons', hackathons, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('hackathons', null, {})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
}
