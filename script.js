let quizData = [];
let currentQuestionIndex = 0;
let score = { correct: 0, wrong: 0 };
let quizQuestions = [];
let incorrectQuestions = [];

// Fetch and load data
fetch('vocab_dataset.json')
    .then(response => response.json())
    .then(data => {
        quizData = data.terms;
        showStartScreen();
    })
    .catch(error => {
        console.error("Error loading data:", error);
        alert("Error loading data. Please refresh the page.");
    });

// Start quiz with selected number of words
function startQuiz(numWords) {
    quizQuestions = [...quizData]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(numWords, quizData.length));

    document.querySelector('.start-screen').style.display = 'none';
    document.querySelector('.quiz-container').style.display = 'flex';

    currentQuestionIndex = 0;
    score = { correct: 0, wrong: 0 };
    incorrectQuestions = [];

    loadQuestion();
}

// Load a question
function loadQuestion() {
    const termElement = document.getElementById('term');
    const optionsContainer = document.getElementById('options');
    const question = quizQuestions[currentQuestionIndex];

    termElement.textContent = question[0];

    // Generate unique options including the correct answer
    const uniqueAnswers = new Set([question[1]]);
    while (uniqueAnswers.size < 4) {
        const randomAnswer = quizData[Math.floor(Math.random() * quizData.length)][1];
        uniqueAnswers.add(randomAnswer);
    }

    // Shuffle options
    const shuffledAnswers = Array.from(uniqueAnswers).sort(() => Math.random() - 0.5);

    // Clear and populate options
    optionsContainer.innerHTML = '';
    shuffledAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.onclick = () => selectAnswer(button, answer === question[1]);
        optionsContainer.appendChild(button);
    });
}

// Handle answer selection
function selectAnswer(button, isCorrect) {
    const buttons = document.querySelectorAll('#options button');
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.style.backgroundColor = btn === button ? (isCorrect ? 'green' : 'red') : '#374151';
    });

    if (isCorrect) {
        score.correct++;
    } else {
        score.wrong++;
        incorrectQuestions.push(quizQuestions[currentQuestionIndex]);
    }

    document.getElementById('correct-score').textContent = score.correct;
    document.getElementById('wrong-score').textContent = score.wrong;

    // Automatically move to the next question after a short delay
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizQuestions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 1000); // Adjust delay time if needed
}

// Show results
function showResults() {
    const termElement = document.getElementById('term');
    const optionsContainer = document.getElementById('options');

    termElement.textContent = `Quiz Complete! Correct: ${score.correct}, Wrong: ${score.wrong}.`;
    optionsContainer.innerHTML = '';

    if (incorrectQuestions.length > 0) {
        const retryButton = document.createElement('button');
        retryButton.textContent = 'Retry Incorrect Questions';
        retryButton.onclick = retryIncorrect;
        optionsContainer.appendChild(retryButton);
    }

    const startPageButton = document.createElement('button');
    startPageButton.textContent = 'Start Page';
    startPageButton.onclick = showStartScreen;
    optionsContainer.appendChild(startPageButton);
}

// Retry incorrect questions
function retryIncorrect() {
    quizQuestions = [...incorrectQuestions];
    incorrectQuestions = [];
    currentQuestionIndex = 0;
    score = { correct: 0, wrong: 0 };

    document.getElementById('correct-score').textContent = score.correct;
    document.getElementById('wrong-score').textContent = score.wrong;
    loadQuestion();
}

// Show start screen
function showStartScreen() {
    document.querySelector('.start-screen').style.display = 'block';
    document.querySelector('.quiz-container').style.display = 'none';
}

// Remove Next Button (Ensure it's not rendered in HTML)
const nextButton = document.getElementById('next-button');
if (nextButton) nextButton.remove();
