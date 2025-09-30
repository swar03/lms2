// src/data/mockData.js
import bgImage from '../assets/cbg.jpg';

export const allCourses = [
  {
    id: 'c2',
    title: 'Cyber Security and Digital Forensics',
    instructor: 'Dr. Evelyn Reed',
    bgImage:'../assets/cbg.jpg',
    description: 'This course bridges the gap between artificial intelligence and cybersecurity, introducing how AI can strengthen cyber defense mechanisms and revolutionize modern security practices.',
    status: 'available',
    modules: [
      {
        id: 'm202',
        title: 'Applying AI in Defense',
        lectures: [
          { id: 'l202a', title: 'Lecture 1: OS Fundamentals', videoUrl: 'https://www.youtube.com/live/QJMzDLTlpn8?si=IKugcMVa0GKy9i9n  ' },
          { id: 'l202b', title: 'Lecture 2: Phishing Detection with ML', videoUrl: 'https://www.youtube.com/embed/vBURS6tAE2w' },
        ],
        assignments: [
          { id: 'a202a', title: 'Assignment:Your assignment involves completing TryHackMe rooms and Hackthebox modules.', description: `Access the "TryHackMe Rooms" section and select the rooms mentioned below:
 https://tryhackme.com/room/linuxfundamentalspart1
 https://tryhackme.com/room/windowsfundamentals2x0x
 https://tryhackme.com/room/windowsfundamentals3xzx
 https://academy.hackthebox.com/course/preview/linux-fundamentals
 https://academy.hackthebox.com/course/preview/windows-fundamentals
 Write Your Final Output In The Box Below
`, 
       },
        ],
        quizzes: [
  {
    id: "q202a",
    title: "Quiz 1: OS Fundamentals",
    questions: [
      {
        id: "q202a_1",
        text: "What is the primary purpose of an Operating System?",
        options: [
          "To provide entertainment software",
          "To manage hardware and software resources",
          "To connect computers to the internet"
        ],
        correctAnswer: 1
      },
      {
        id: "q202a_2",
        text: "Which of the following is NOT an operating system?",
        options: ["Linux", "Windows", "Oracle"],
        correctAnswer: 2
      },
      {
        id: "q202a_3",
        text: "What is the core part of the operating system that directly interacts with hardware?",
        options: ["Shell", "Kernel", "Compiler"],
        correctAnswer: 1
      },
      {
        id: "q202a_4",
        text: "Which type of OS allows multiple users to work on a system simultaneously?",
        options: ["Single-user OS", "Multi-user OS", "Batch OS"],
        correctAnswer: 1
      },
      {
        id: "q202a_5",
        text: "Which OS scheduling algorithm executes the process that arrived first?",
        options: [
          "First Come First Serve (FCFS)",
          "Shortest Job Next (SJN)",
          "Round Robin"
        ],
        correctAnswer: 0
      },
      {
        id: "q202a_6",
        text: "What is virtual memory used for?",
        options: [
          "Increasing CPU speed",
          "Extending RAM using disk storage",
          "Creating backup of files"
        ],
        correctAnswer: 1
      },
      {
        id: "q202a_7",
        text: "Which memory is non-volatile and stores the BIOS?",
        options: ["RAM", "ROM", "Cache"],
        correctAnswer: 1
      },
      {
        id: "q202a_8",
        text: "Which command is used in Linux to list all files in a directory?",
        options: ["ls", "dir", "list"],
        correctAnswer: 0
      },
      {
        id: "q202a_9",
        text: "Which of the following is a type of system call?",
        options: ["Process Control", "I/O Operations", "File Management", "All of the above"],
        correctAnswer: 3
      },
      {
        id: "q202a_10",
        text: "Deadlock occurs when:",
        options: [
          "Multiple processes are running smoothly",
          "Two or more processes wait indefinitely for resources",
          "Processes execute in parallel without issues"
        ],
        correctAnswer: 1
      }
    ]
  }
],
        links: [
          { id: 'r202a', title: 'Join Live Q&A Session', url: 'https://meet.google.com/' },
        ],
      },
    ],
  },
];