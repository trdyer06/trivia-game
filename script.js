let timeInterval;
let currentQuestionIndex = 0;

const questions = [ {
    question: 'Who painted the Mona Lisa?',
    answers: [
        'Leonardo Da Vinci',
        'Michelangelo',
        'Raphael',
        'Donatello'
    ],
    correctAnswer: 'Leonardo Da Vinci',
    points: 2
}, {
    question: 'Which chemical element, number 11 in the Periodic table, has the symbol Na?',
    answers: [
        'Sodium',
        'Nickel',
        'Neon',
        'Nobelium'
    ],
    correctAnswer: 'Sodium',
    points: 2
}, {
    question: 'Gouda cheese is from which European country?',
    answers: [
        'Switzerland',
        'Belgium',
        'Netherlands',
        'Denmark'
    ],
    correctAnswer: 'Netherlands',
    points: 3
}, {
    question: 'Xanthophobia is the fear of what color?',
    answers: [
        'Blue',
        'Yellow',
        'Green',
        'Red'
    ],
    correctAnswer: 'Yellow',
    points: 4
}, {
    question: 'Who is the origin of the quote "What doesn\'t kill you makes you stronger"?',
    answers: [
        'Taylor Swift',
        'Aristotle',
        'John Cena',
        'Freidrich Nietzsche'
    ],
    correctAnswer: 'Freidrich Nietzsche',
    points: 3
}];

let buttons = document.querySelectorAll('.answer');

const printQuestion = () => {
    let questionText = document.querySelector('#question h3');
    let questionPoints = document.querySelector('#question h4');
    questionText.textContent = questions[currentQuestionIndex].question;
    questionPoints.textContent = `(${questions[currentQuestionIndex].points} points)`;
};

const printAnswers = () => {
    let answerButtons = document.querySelectorAll('.answer');
    answerButtons.forEach((button, index) => {
        button.textContent = questions[currentQuestionIndex].answers[index];
    });
    buttons.forEach(button => {
        button.addEventListener('click', checkAnswer);
    });
};

const checkAnswer = event => {
    let selected = event.target.textContent;
    if(selected === questions[currentQuestionIndex].correctAnswer) {
        let currentScore = document.getElementById('score').textContent;
        let scoreValue = Number(currentScore.substring(7));
        scoreValue += questions[currentQuestionIndex].points;
        document.getElementById('score').textContent = `Score: ${scoreValue}`;
    }
    currentQuestionIndex += 1;
    if(currentQuestionIndex < questions.length) {
        askQuestions();
    } else {
        finishGame();
    }
};

const changeTime = () => {
    let time = document.getElementById('time').textContent;
    let timeValue = Number(time.substring(6));
    if(timeValue > 1) {
        timeValue -= 1;
        document.getElementById('time').textContent = `Time: ${timeValue}`;
    } else {
        finishGame();
    }
};

const startGame = event => {
    timeInterval = setInterval(changeTime, 1000);
    let startScreen = document.getElementById('startScreen');
    let gameScreen = document.getElementById('gameScreen');
    let endScreen = document.getElementById('endScreen');
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    endScreen.classList.add('hidden');
    askQuestions();
}

const askQuestions = () => {
    printQuestion();
    printAnswers();
}

const finishGame = () => {
    clearInterval(timeInterval);
    document.getElementById('time').textContent = 'Time: 5';
    let gameScreen = document.getElementById('gameScreen');
    let endScreen = document.getElementById('endScreen');
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    let finalScore = document.getElementById('finalScore');
    let finalScoreValue = document.getElementById('score').textContent.substring(7);
    finalScore.textContent = `Final Score: ${finalScoreValue}`;
    let highScore = document.getElementById('highScore');
    let highScoreValue = Number(highScore.textContent.substring(12));
    currentQuestionIndex = 0;
    if(Number(finalScoreValue) > highScoreValue) {
        highScore.textContent = `High Score: ${finalScoreValue}`;
    }
    document.getElementById('score').textContent = 'Score: 0';
    let restartButton = document.getElementById('restartButton');
    restartButton.addEventListener('click', startGame);
};

let startButton = document.getElementById('startButton');
startButton.addEventListener('click', startGame);