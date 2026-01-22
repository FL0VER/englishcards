const tg = window.Telegram.WebApp;

// Сообщаем телеграму, что приложение готово
tg.ready();
tg.expand();

const vocabulary = [
    { en: "Cat", ru: "Кошка" },
    { en: "Dog", ru: "Собака" },
    { en: "Apple", ru: "Яблоко" },
    { en: "Sun", ru: "Солнце" },
    { en: "Water", ru: "Вода" },
    { en: "Friend", ru: "Друг" },
    { en: "Book", ru: "Книга" },
    { en: "House", ru: "Дом" },
    { en: "Tree", ru: "Дерево" },
    { en: "Car", ru: "Машина" },
    { en: "Time", ru: "Время" },
    { en: "Money", ru: "Деньги" },
    { en: "Music", ru: "Музыка" },
    { en: "Sky", ru: "Небо" },
    { en: "Happy", ru: "Счастливый" },
    { en: "Red", ru: "Красный" },
    { en: "To run", ru: "Бежать" },
    { en: "To eat", ru: "Есть (кушать)" },
    { en: "Beautiful", ru: "Красивый" },
    { en: "Work", ru: "Работа" }
];

let currentIndex = 0;
let isQuizAnswered = false;

// Безопасная функция вибрации (не ломается в браузере)
function triggerHaptic(type) {
    if (tg.hapticFeedback) {
        tg.hapticFeedback.notificationOccurred(type);
    }
}

// --- НАВИГАЦИЯ ---

function startMode(mode) {
    document.getElementById('main-menu').classList.add('hidden');
    
    // Перемешиваем массив, чтобы вопросы шли не по порядку
    shuffleArray(vocabulary);
    currentIndex = 0;

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
    document.getElementById('main-menu').classList.remove('hidden');
}

// --- КАРТОЧКИ ---

function showCard() {
    const cardElement = document.querySelector('.card');
    cardElement.classList.remove('flipped');
    
    // Ждем пока анимация возврата пройдет
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
    
    // Сбрасываем интерфейс
    document.getElementById('quiz-counter').innerText = `Слово ${currentIndex + 1} из ${vocabulary.length}`;
    document.getElementById('quiz-question').innerText = item.en;
    document.getElementById('quiz-feedback').innerText = "";
    
    // ВАЖНО: Скрываем кнопку "Дальше" в начале вопроса
    const nextBtn = document.getElementById('next-quiz-btn');
    if (nextBtn) nextBtn.classList.add('hidden');
    
    const optionsDiv = document.getElementById('quiz-options');
    optionsDiv.innerHTML = "";

    const options = generateOptions(item);
    
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        // Передаем саму кнопку в функцию, чтобы менять её цвет
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
        triggerHaptic('success');
    } else {
        btnElement.classList.add('wrong');
        document.getElementById('quiz-feedback').innerText = `Ошибка. Правильно: ${correct}`;
        triggerHaptic('error');
        
        // Подсветить правильную кнопку
        const buttons = document.querySelectorAll('#quiz-options button');
        buttons.forEach(btn => {
            if (btn.innerText === correct) btn.classList.add('correct');
        });
    }

    // ВАЖНО: Показываем кнопку "Дальше" после любого ответа
    if (nextBtn) {
        nextBtn.classList.remove('hidden');
    } else {
        console.error("Кнопка 'Дальше' не найдена в HTML!");
    }
}

function nextQuestion() {
    currentIndex = (currentIndex + 1) % vocabulary.length;
    showQuiz();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
