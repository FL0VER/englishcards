const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// БАЗА СЛОВ
const vocabulary = [
    { en: "Cat", ru: "Кошка" }, { en: "Dog", ru: "Собака" },
    { en: "Apple", ru: "Яблоко" }, { en: "Sun", ru: "Солнце" },
    { en: "Water", ru: "Вода" }, { en: "Friend", ru: "Друг" },
    { en: "Book", ru: "Книга" }, { en: "House", ru: "Дом" },
    { en: "Tree", ru: "Дерево" }, { en: "Car", ru: "Машина" },
    { en: "Time", ru: "Время" }, { en: "Money", ru: "Деньги" },
    { en: "Music", ru: "Музыка" }, { en: "Sky", ru: "Небо" },
    { en: "Happy", ru: "Счастливый" }, { en: "Red", ru: "Красный" },
    { en: "To run", ru: "Бежать" }, { en: "To eat", ru: "Есть (кушать)" },
    { en: "Beautiful", ru: "Красивый" }, { en: "Work", ru: "Работа" }
];

let currentIndex = 0;
let isQuizAnswered = false;
let score = 0;

// Функция вибрации (безопасная)
function triggerHaptic(type) {
    if (tg.hapticFeedback) {
        tg.hapticFeedback.notificationOccurred(type);
    }
}

// --- НАВИГАЦИЯ ---
function startMode(mode) {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('results-section').classList.add('hidden');
    
    shuffleArray(vocabulary);
    currentIndex = 0;
    score = 0;

    if (mode === 'cards') {
        document.getElementById('cards-section').classList.remove('hidden');
        showCard();
    } else {
        document.getElementById('quiz-section').classList.remove('hidden');
        showQuiz();
    }
}

function goBack() {
    document.getElementById('cards-section').classList.add('hidden');
    document.getElementById('quiz-section').classList.add('hidden');
    document.getElementById('results-section').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
}

// --- КАРТОЧКИ ---
function showCard() {
    const cardElement = document.querySelector('.card');
    cardElement.classList.remove('flipped');
    setTimeout(() => {
        document.getElementById('word-front').innerText = vocabulary[currentIndex].en;
        document.getElementById('word-back').innerText = vocabulary[currentIndex].ru;
    }, 200);
}

function flipCard() {
    document.querySelector('.card').classList.toggle('flipped');
}

function nextCard() {
    currentIndex = (currentIndex + 1) % vocabulary.length;
    showCard();
}

function prevCard() {
    currentIndex = (currentIndex - 1 + vocabulary.length) % vocabulary.length;
    showCard();
}

// --- ВИКТОРИНА ---
function showQuiz() {
    isQuizAnswered = false;
    const item = vocabulary[currentIndex];
    
    document.getElementById('quiz-counter').innerText = `Вопрос ${currentIndex + 1} из ${vocabulary.length}`;
    document.getElementById('quiz-question').innerText = item.en;
    document.getElementById('quiz-feedback').innerText = "";
    
    // Скрываем кнопку "Дальше" перед новым вопросом
    const nextBtn = document.getElementById('next-quiz-btn');
    if (nextBtn) nextBtn.classList.add('hidden');
    
    const optionsDiv = document.getElementById('quiz-options');
    optionsDiv.innerHTML = "";

    const options = generateOptions(item);
    
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = function() { checkAnswer(opt, item.ru, this); };
        optionsDiv.appendChild(btn);
    });
}

function generateOptions(correctItem) {
    let opts = [correctItem.ru];
    while (opts.length < 3) {
        let randomWord = vocabulary[Math.floor(Math.random() * vocabulary.length)].ru;
        if (!opts.includes(randomWord)) {
            opts.push(randomWord);
        }
    }
    return shuffleArray(opts);
}

function checkAnswer(selected, correct, btnElement) {
    if (isQuizAnswered) return;
    isQuizAnswered = true;

    const nextBtn = document.getElementById('next-quiz-btn');

    if (selected === correct) {
        btnElement.classList.add('correct');
        document.getElementById('quiz-feedback').innerText = "Верно! 🎉";
        score++;
        triggerHaptic('success');
    } else {
        btnElement.classList.add('wrong');
        document.getElementById('quiz-feedback').innerText = `Ошибка. Правильно: ${correct}`;
        triggerHaptic('error');
        
        // Показать правильный ответ
        document.querySelectorAll('#quiz-options button').forEach(btn => {
            if (btn.innerText === correct) btn.classList.add('correct');
        });
    }

    // Показываем кнопку "Дальше"
    if (nextBtn) nextBtn.classList.remove('hidden');
}

function nextQuestion() {
    if (currentIndex < vocabulary.length - 1) {
        currentIndex++;
        showQuiz();
    } else {
        showResults();
    }
}

// --- РЕЗУЛЬТАТЫ ---
function showResults() {
    document.getElementById('quiz-section').classList.add('hidden');
    document.getElementById('results-section').classList.remove('hidden');
    
    document.getElementById('final-score').innerText = `${score} / ${vocabulary.length}`;
    
    const msg = document.getElementById('result-message');
    const percentage = (score / vocabulary.length) * 100;
    
    if (percentage === 100) msg.innerText = "Идеально! Вы мастер! 🏆";
    else if (percentage >= 70) msg.innerText = "Отличный результат! 😎";
    else if (percentage >= 40) msg.innerText = "Неплохо, но можно лучше. 🙂";
    else msg.innerText = "Попробуйте еще раз! 📚";
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
