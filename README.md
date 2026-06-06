# 🌍 Trifecta 2.0 | Gamified Environmental Learning

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

**Live Demo:** [trifecta2-0.vercel.app](https://trifecta2-0.vercel.app)

## 📌 Project Overview & SIH Problem Statement
Trifecta 2.0 was developed as a solution for the **Smart India Hackathon (SIH)**. 

**The Problem:** Many students struggle to grasp vital concepts about the environment, leading to a general lack of awareness regarding our ecosystem, its components, and its overall importance.

**Our Solution:** We built a platform designed to *gamify the learning approach*. By transforming educational content into an interactive, level-based web application, Trifecta 2.0 encourages users to learn about the environment by playing games. Built over the course of a week, this project bridges the gap between crucial ecological education and engaging digital entertainment.

## ✨ Key Features & Core Values
* **Hierarchical Learning Progression:** The platform utilizes a structured learning path. Advanced stages remain locked until previous levels are successfully cleared, ensuring users grasp foundational concepts before moving forward.
* **Eco-Points Reward System:** Every game won or level cleared allots users "Eco-points" (calculated dynamically via JavaScript). This incentivizes continuous learning and urges users to improve their scores.
* **Interactive Modules:** Rather than reading static text, users engage with interactive games (like drag-and-drop ecosystem building) and quizzes to test their knowledge.
* **Comprehensive Dashboard:** A centralized hub where users can track their progress, view available topics, and monitor their Eco-points and global leaderboard rankings.
* **Secure Access:** Basic user and admin authentication to keep learning progress secure and personalized.

## 🏗️ Architecture & Tech Stack
The application follows a client-side architecture with a cloud-based backend for real-time state management and authentication.

* **Frontend:** Built entirely with **Vanilla JavaScript, HTML5, and CSS3** to ensure lightweight, fast performance without the overhead of heavy frameworks.
* **Backend:** **Firebase** is utilized for secure User/Admin authentication and real-time database management (storing user profiles, level progression, and Eco-points).
* **Deployment:** Hosted seamlessly via **Vercel**.

## 📂 Project Structure
The repository is modularly organized, with distinct HTML, CSS, and JS files handling specific platform features:

| Module | Core Files | Functionality |
| :--- | :--- | :--- |
| **Landing & Interface** | `index.html`, `Interface.*`, `about.*` | Main entry points, shared UI components, and project information. |
| **Authentication** | `login.*`, `adminLogin.*` | Firebase-powered secure login portals for students and administrators. |
| **Dashboard & Tracking** | `profile.*`, `leaderboard.*` | User progression tracking, Eco-point displays, and competitive rankings. |
| **Progression System** | `levels.*`, `quiz.*` | The hierarchical lock/unlock logic and knowledge-testing quizzes. |
| **Gamified Learning** | `Game1.*`, `Game2.*` | Interactive learning modules (e.g., drag-and-drop mechanics in Game 2). |

## 👨‍💻 My Role: Anant Sharma
As a core Thinker and Developer on this project, my contributions focused heavily on ideation, user experience, and frontend execution:
* **Ideation & Strategy:** Conceptualized the interactive mechanics for several of the games, ensuring they aligned with the educational goals of the environmental problem statement.
* **UI/UX & Frontend Development:** Took charge of the visual interface, heavily contributing to the frontend development phase to ensure the web app was responsive, intuitive, and engaging.
* **Debugging & Optimization:** Identified and resolved critical UI glitches and frontend bugs, ensuring a smooth, uninterrupted learning experience for the end user. 
* **Personal Growth:** This project served as a major stepping stone in mastering frontend architecture, DOM manipulation, and resolving complex visual bugs in a Vanilla JS environment.

## 👥 The Team
This project was successfully built and delivered by our dedicated hackathon team:
* **[Anant Sharma](https://github.com/CaptainAnant)** - Ideation, UI/UX, Frontend Developer
* **[Vipul J](https://github.com/VipulJ18)** - Developer / Contributor
* **[Harshit Singh](https://github.com/0harshitsingh1)** - Developer / Contributor

---
*Built to make learning about our planet as engaging as saving it.* 🌱
