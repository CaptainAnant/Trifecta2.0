let score = 0;
const totalQuestions = 6;
// Tracks unique questions attempted (Q1, Q2, Q3, Q4, Q5, Q6) to prevent multiple scoring
let attemptedQuestions = new Set();
const scoreElement = document.getElementById('score');
const modal = document.getElementById('completion-modal');
const finalScoreElement = document.getElementById('final-score');
const options = document.querySelectorAll('.option');
const showScoreBtn = document.getElementById('show-score-btn');

// --- INITIALIZATION ---
// CRUCIAL: Ensures the modal starts hidden on page load.
document.addEventListener('DOMContentLoaded', () => {
    // The 'hidden' class should be in the HTML, but this confirms it.
    modal.classList.add('hidden');
    updateScoreDisplay();
});

function updateScoreDisplay() {
    // Updates the running score display in the header
    scoreElement.textContent = `${score} / ${totalQuestions}`;
}

// --- QUIZ ANSWER HANDLER ---
function handleAnswer(event) {
    const selectedButton = event.target;
    const isCorrect = selectedButton.dataset.correct === 'true';
    const questionId = selectedButton.dataset.q;
   
    // Determine the unique key for tracking (Q5a/Q5b map to Q5)
    const uniqueQuestionKey = questionId.startsWith('q5') ? 'q5' : questionId;

    // SCORING LOGIC: Only award a point if this unique question hasn't been scored yet
    if (!attemptedQuestions.has(uniqueQuestionKey)) {
        if (isCorrect) {
            score++;
            attemptedQuestions.add(uniqueQuestionKey);
        } else {
             // Mark non-Q5 questions as attempted even if wrong to maintain the max score of 6.
             if (!questionId.startsWith('q5')) {
                 attemptedQuestions.add(uniqueQuestionKey);
             }
        }
    }

    // 1. Give visual feedback (Correct/Incorrect highlighting)
    if (isCorrect) {
        selectedButton.classList.add('correct-answer');
    } else {
        selectedButton.classList.add('incorrect-answer');
        // Find and highlight the correct answer in the same group
        const optionContainer = selectedButton.closest('.options-container');
        const correctButton = optionContainer.querySelector(`button[data-q="${questionId}"][data-correct="true"]`);
        if (correctButton) {
             correctButton.classList.add('correct-answer');
        }
    }

    // 2. Disable all options in the current specific group (e.g., all q1 options, or all q5a options)
    const allOptionsInGroup = document.querySelectorAll(`button[data-q="${questionId}"]`);
    allOptionsInGroup.forEach(btn => {
        btn.disabled = true;
    });

    // 3. Show Reasoning
    const module = selectedButton.closest('.question-module');
    const reasoningBox = module.querySelector('.reasoning-box');
    if (reasoningBox) {
        reasoningBox.classList.remove('hidden');
    }

    updateScoreDisplay();
}

// --- MISSION DEBRIEF HANDLER (Triggered by button click ONLY) ---
function showFinalStatus() {
    // 1. Calculate the final score by checking all 6 modules
    let modulesScored = 0;
    const moduleKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];
   
    moduleKeys.forEach(key => {
        const module = document.getElementById(key);
        // Check if a correct button was selected within this module
        if (module && module.querySelector('.correct-answer')) {
            modulesScored++;
        }
    });

    // 2. Update the modal content
    finalScoreElement.textContent = modulesScored;
   
    const message = document.getElementById('modal-message');
    if (modulesScored === totalQuestions) {
        document.getElementById('modal-title').textContent = "MISSION SUCCESS! 🏆";
        message.textContent = "You are a top-tier Climate Crusader! You've completed Level 2.";
    } else {
        document.getElementById('modal-title').textContent = "Mission Debrief! 📋";
        message.textContent = `You scored ${modulesScored}/${totalQuestions}. Review the reasoning for any questions and prepare for your next assignment.`;
    }
   
    // 3. SHOW THE MODAL (This is the action tied to the button click)
    modal.classList.remove('hidden');
}


// --- EVENT LISTENERS ---
options.forEach(button => {
    button.addEventListener('click', handleAnswer);
});

// Ensures the debrief shows ONLY when the user clicks the status button.
showScoreBtn.addEventListener('click', showFinalStatus);
