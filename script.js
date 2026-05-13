let timeInterval;
let currentQuestionIndex = 0;

let myQuestions = [];

//before game ----------------------------------------------------------------------------------------------

const loadQuestions = async (questionLink) => {
    const response = await fetch(questionLink);
    const data = await response.json();
    myQuestions = data.results.map(item => {
        let pts = 2;
        if(item.difficulty === 'medium') {
            pts = 3;
        } else if(item.difficulty === 'hard') {
            pts = 4;
        }
        return {
            question: item.question,
            answers: [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5),
            correctAnswer: item.correct_answer,
            difficulty: item.difficulty,
            points: pts
        };
    });
    askQuestions();
};

const pickCategory = event => {
    let gameScreen = document.getElementById('gameScreen');
    let endScreen = document.getElementById('endScreen');
    let categories = document.getElementById('categories');
    gameScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    categories.classList.remove('hidden');
    let category = event.target.textContent;
    if(category === 'General Knowledge') {
        loadQuestions('https://opentdb.com/api.php?amount=50&category=9&type=multiple');
    } else if(category === 'Sports') {
        loadQuestions('https://opentdb.com/api.php?amount=50&category=21&type=multiple');
    } else if(category === 'Animals') {
        loadQuestions('https://opentdb.com/api.php?amount=50&category=27&type=multiple');
    } else if(category === 'History') {
        loadQuestions('https://opentdb.com/api.php?amount=50&category=23&type=multiple');
    } else if(category === 'Geography') {
        loadQuestions('https://opentdb.com/api.php?amount=50&category=22&type=multiple');
    }
    let startButton = document.getElementById('startButton');
    startButton.classList.remove('hidden');
    startButton.addEventListener('click', startGame);
};

const startGame = event => {
    timeInterval = setInterval(changeTime, 1000);
    let startScreen = document.getElementById('startScreen');
    let gameScreen = document.getElementById('gameScreen');
    let endScreen = document.getElementById('endScreen');
    let categories = document.getElementById('categories');
    let startButton = document.getElementById('startButton');
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    endScreen.classList.add('hidden');
    categories.classList.add('hidden');
    startButton.classList.add('hidden');
    let buttons = document.querySelectorAll('.answer');
    buttons.forEach(button => {
        button.addEventListener('click', checkAnswer);
    });
    askQuestions();
}

//during game ----------------------------------------------------------------------------------------------

const askQuestions = () => {
    myQuestions.sort(() => Math.random() - 0.5);
    printQuestion();
    printAnswers();
}

const printQuestion = () => {
    let questionText = document.querySelector('#question h3');
    let questionPoints = document.querySelector('#question h4');
    questionText.innerHTML = myQuestions[currentQuestionIndex].question;
    questionPoints.textContent = `( ${myQuestions[currentQuestionIndex].points} points )`;
};

const printAnswers = () => {
    let answerButtons = document.querySelectorAll('.answer');
    answerButtons.forEach((button, index) => {
        button.innerHTML = myQuestions[currentQuestionIndex].answers[index];
    });
};

const checkAnswer = event => {
    let selected = event.target.textContent;
    if(selected === myQuestions[currentQuestionIndex].correctAnswer) {
        document.body.classList.add('flash-correct');
        setTimeout(() => {
            document.body.classList.remove('flash-correct');
        }, 750);
        let currentScore = document.getElementById('score').textContent;
        let scoreValue = Number(currentScore.substring(7));
        scoreValue += myQuestions[currentQuestionIndex].points;
        document.getElementById('score').textContent = `Score: ${scoreValue}`;
    } else {
        document.body.classList.add('flash-wrong');
        setTimeout(() => {
            document.body.classList.remove('flash-wrong');
        }, 750);
    }
    currentQuestionIndex += 1;
    if(currentQuestionIndex < myQuestions.length) {
        askQuestions();
    } else {
        finishGame();
    }
};

const correctMessage = correct => {
    if(correct === true) {
        let message = document.getElementById('correct');
        message.classList.remove('hidden');
        setTimeout(() => {
            message.classList.add('hidden');
        }, 1000);
    } else {
        let message = document.getElementById('wrong');
        message.classList.remove('hidden');
        setTimeout(() => {
            message.classList.add('hidden');
        }, 1000);
    }
};

const changeTime = () => {
    let time = document.getElementById('time');
    let timeValue = Number(time.textContent.substring(6));
    if(timeValue > 1) {
        timeValue -= 1;
        time.textContent = `Time: ${timeValue}`;
        if(timeValue >= 24) {
            time.style.color = '#12B600';
        } else if(timeValue >= 18) {
            time.style.color = '#84e32b';
        } else if(timeValue >= 12) {
            time.style.color = '#FFFF00';
        } else if(timeValue >= 6) {
            time.style.color = '#ffa200';
        } else {
            time.style.color = '#FF0000';
        }
    } else {
        finishGame();
    }
};

//after game ----------------------------------------------------------------------------------------------

const finishGame = () => {
    clearInterval(timeInterval);
    document.getElementById('time').textContent = 'Time: 30';
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
    let categoriesButton = document.getElementById('changeCategoryButton');
    categoriesButton.addEventListener('click', function() {
        let endScreen = document.getElementById('endScreen');
        endScreen.classList.add('hidden');
        let startScreen = document.getElementById('startScreen');
        startScreen.classList.remove('hidden');
        let categories = document.getElementById('categories');
        categories.classList.remove('hidden');
        categories.addEventListener('click', pickCategory);
    });
};

//run game ----------------------------------------------------------------------------------------------

let categories = document.querySelectorAll('.category');
categories.forEach(button => {
    button.addEventListener('click', pickCategory);
});