let timeInterval;
let currentQuestionIndex = 0;
let longestStreak = 0;

/**
 * Array to hold questions and answers.
 */
let myQuestions = [];

//before game ----------------------------------------------------------------------------------------------

/**
 * Loads array of questions and answers from API and format the elements of the each question for the game.
 * @param {string} questionLink - url to fetch questions from API
 */
const loadQuestions = async (questionLink) => {
    //clear myQuestions array for next game
    myQuestions = [];
    //fetch questions from API
    const response = await fetch(questionLink);
    const data = await response.json();
    //assign questions to myQuestions
    myQuestions = data.results.map(item => {
        //assign points based on difficulty
        let pts = 2;
        if(item.difficulty === 'medium') {
            pts = 3;
        } else if(item.difficulty === 'hard') {
            pts = 4;
        }
        return {
            question: item.question,
            //randomize order of answer options
            answers: [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5),
            correctAnswer: item.correct_answer,
            difficulty: item.difficulty,
            points: pts
        };
    });
};

/**
 * Gets questions from API based on desired category and starts the game when the start button is clicked.
 * @param {MouseEvent} event - click event on a category button
 */
const pickCategory = event => {
    let gameScreen = document.getElementById('gameScreen');
    let endScreen = document.getElementById('endScreen');
    let categories = document.getElementById('categories');
    //only show the starting screen and hide all other screens
    gameScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    categories.classList.remove('hidden');
    startButton.classList.add('hidden');
    let category = event.target.textContent;
    //load set of questions from selected category
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
    //hide category buttons after once is selected
    categories.classList.add('hidden');
    let selectedCategory = document.getElementById('selectedCategory');
    //show the selected category above the start button
    selectedCategory.textContent = 'Category: ' + category;
    selectedCategory.classList.remove('hidden');
    //show start button to start the game
    startButton.classList.remove('hidden');
    Array.from(endScreen.children).forEach(child => {
        //hide all elements on the end screen
        child.classList.add('hidden');
    });
    //show the change category button to change the category for the next game
    categoriesButton.classList.remove('hidden');
    endScreen.classList.remove('hidden');
};

/**
 * Starts game by showing the questions and answers and hiding all other screens and starting the timer.
 * @param {MouseEvent} event - click event on the start button
 */
const startGame = event => {
    //timer counts down every second
    timeInterval = setInterval(changeTime, 1000);
    let startScreen = document.getElementById('startScreen');
    let gameScreen = document.getElementById('gameScreen');
    let endScreen = document.getElementById('endScreen');
    //only show the game screen and hide all other screens
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    endScreen.classList.add('hidden');
    Array.from(endScreen.children).forEach(child => {
        //unhide all elements on the end screen
        child.classList.remove('hidden');
    });
    //randomize order of questions
    myQuestions.sort(() => Math.random() - 0.5);
    //show question and answers
    askQuestions();
}

//during game ----------------------------------------------------------------------------------------------

/**
 * Prints questions and answers in random order.
 */
const askQuestions = () => {
    printQuestion();
    printAnswers();
}

/**
 * Prints the question and the points for a correct answer.
 */
const printQuestion = () => {
    let questionText = document.querySelector('#question h3');
    let questionPoints = document.querySelector('#question h4');
    //print the question
    questionText.innerHTML = myQuestions[currentQuestionIndex].question;
    //print the points for the current question
    questionPoints.textContent = `( ${myQuestions[currentQuestionIndex].points} points )`;
};

/**
 * Prints the answer options for the current question.
 */
const printAnswers = () => {
    let answerButtons = document.querySelectorAll('.answer');
    //print each answer option in a button
    answerButtons.forEach((button, index) => {
        button.innerHTML = myQuestions[currentQuestionIndex].answers[index];
    });
};

/**
 * Checks if the selected answer is correct and updates all other game elements accordingly.
 * @param {MouseEvent} event - click event on an answer button
 */
const checkAnswer = event => {
    let selected = event.target.textContent;
    let currentStreak = document.getElementById('streak').textContent;
    let streakValue = Number(currentStreak.substring(8));
    if(selected === myQuestions[currentQuestionIndex].correctAnswer) {
        //flash green on border of screen for .75 seconds
        document.body.classList.add('flash-correct');
        setTimeout(() => {
            document.body.classList.remove('flash-correct');
        }, 750);
        let currentScore = document.getElementById('score').textContent;
        let scoreValue = Number(currentScore.substring(7));
        //add points for the current question to the score
        scoreValue += myQuestions[currentQuestionIndex].points;
        document.getElementById('score').textContent = `Score: ${scoreValue}`;
        //add 1 to the current streak
        streakValue += 1;
        //if a new highest streak is achieved update longestStreak
        if(streakValue > longestStreak) {
            longestStreak = streakValue;
        }
    } else {
        //flash red on border of screen for .75 seconds
        document.body.classList.add('flash-wrong');
        setTimeout(() => {
            document.body.classList.remove('flash-wrong');
        }, 750);
        //end current streak
        streakValue = 0;
    }
    document.getElementById('streak').textContent = `Streak: ${streakValue}`;
    //move to next question in myQuestions array
    currentQuestionIndex += 1;
    //if all questions have been asked end the game
    if(currentQuestionIndex < myQuestions.length) {
        askQuestions();
    } else {
        finishGame();
    }
};

/**
 * Changes the time left and color of the time based on amount of time left.
 */
const changeTime = () => {
    let time = document.getElementById('time');
    let timeValue = Number(time.textContent.substring(6));
    //if there is time left substract 1 from the time
    if(timeValue > 1) {
        timeValue -= 1;
        time.textContent = `Time: ${timeValue}`;
        //update the color of the times based on how much time is left
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
        //if there is no time left end the game
        finishGame();
    }
};

//after game ----------------------------------------------------------------------------------------------

/**
 * Ends the game by showing the end screen and hiding all other screens and updating all game elements for the next game.
 */
const finishGame = () => {
    clearInterval(timeInterval);
    //reset time for next game
    let time = document.getElementById('time');
    time.textContent = 'Time: 30';
    time.style.color = '#12B600';
    let gameScreen = document.getElementById('gameScreen');
    let endScreen = document.getElementById('endScreen');
    //only show the end screen and hide game screen
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    let finalScore = document.getElementById('finalScore');
    let finalScoreValue = document.getElementById('score').textContent.substring(7);
    //print the final score of the game
    finalScore.textContent = `Final Score: ${finalScoreValue}`;
    let highScore = document.getElementById('highScore');
    let highScoreValue = Number(highScore.textContent.substring(12));
    //if new high score is achieved update the high score
    if(Number(finalScoreValue) > highScoreValue) {
        highScore.textContent = `High Score: ${finalScoreValue}`;
    }
    //reset to beginning of myQuestions array for next game
    currentQuestionIndex = 0;
    //print the longest streak achieved in the game and reset longestStreak for next game
    document.getElementById('longestStreak').textContent = 'Longest Streak: ' + longestStreak;
    longestStreak = 0;
    //reset score and streak for next game
    document.getElementById('streak').textContent = 'Streak: 0';
    document.getElementById('score').textContent = 'Score: 0';
};

//event listeners ----------------------------------------------------------------------------------------------

let categories = document.querySelectorAll('.category');
//if a category is selected load the questions for that category
categories.forEach(button => {
    button.addEventListener('click', pickCategory);
});

let startButton = document.getElementById('startButton');
//if start button is clicked start the game
startButton.addEventListener('click', startGame);

let buttons = document.querySelectorAll('.answer');
//add event listener to each answer button to check if the selected answer is correct
buttons.forEach(button => {
    button.addEventListener('click', checkAnswer);
});

let restartButton = document.getElementById('restartButton');
//if restart button is clicked start a new game
restartButton.addEventListener('click', startGame);

let categoriesButton = document.getElementById('changeCategoryButton');
//if change category button is clicked show the category screen 
categoriesButton.addEventListener('click', function() {
    //hide end screen and show starting screen and category options
    let endScreen = document.getElementById('endScreen');
    let startScreen = document.getElementById('startScreen');
    let categories = document.getElementById('categories');
    let selectedCategory = document.getElementById('selectedCategory');
    endScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    categories.classList.remove('hidden');
    startButton.classList.add('hidden');
    selectedCategory.classList.add('hidden');
});