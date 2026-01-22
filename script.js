const tg = window.Telegram.WebApp;
tg.expand();

// РАСШИРЕННАЯ БАЗА СЛОВ (20 слов)
// Добавляйте сюда новые слова в формате { en: "Word", ru: "Перевод" }
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
let isQuizAnswered = false; // Блокировка повторных нажатий в викторине

// --- НАВИГАЦИЯ ---

function startMode(mode) {
    document.getElementById('main-menu').classList.add('hidden');
    
    // Перемешиваем слова при каждом запуске, чтобы было интереснее
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
    // Скрываем игровые экраны
    document.getElementById('cards-section').classList.add('hidden');
    document.getElementById('quiz-section').classList.add('hidden');
    // Показываем меню
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
    // Логика перехода назад, с учетом зацикливания
    currentIndex = (currentIndex - 1 + vocabulary.length) % vocabulary.length;
    showCard();
}

// --- ВИКТОРИНА ---

function showQuiz() {
    isQuizAnswered = false;
    const item = vocabulary[currentIndex];
    
    document.getElementById('quiz-counter').innerText = `Слово ${currentIndex + 1} из ${vocabulary.length}`;
    document.getElementById('quiz-question').innerText = item.en;
    document.getElementById('quiz-feedback').innerText = "";
    document.getElementById('next-quiz-btn').classList.add('hidden');
    
    const optionsDiv = document.getElementById('quiz-options');
    optionsDiv.innerHTML = "";

    // Генерация вариантов ответов
    const options = generateOptions(item);
    
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt, item.ru, btn);
        optionsDiv.appendChild(btn);
    });
}

function generateOptions(correctItem) {
    // Берем правильный ответ
    let opts = [correctItem.ru];
    
    // Добавляем 2 случайных неправильных
    while (opts.length < 3) {
        let randomWord = vocabulary[Math.floor(Math.random() * vocabulary.length)].ru;
        if (!opts.includes(randomWord)) {
            opts.push(randomWord);
        }
    }
    // Перемешиваем варианты
    return shuffleArray(opts);
}

function checkAnswer(selected, correct, btnElement) {
    if (isQuizAnswered) return; // Запрет на повторный клик
    isQuizAnswered = true;

    if (selected === correct) {
        btnElement.classList.add('correct');
        document.getElementById('quiz-feedback').innerText = "Верно! 🎉";
        tg.hapticFeedback.notificationOccurred('success');
        document.getElementById('next-quiz-btn').classList.remove('hidden'); // Показать кнопку "Дальше"
    } else {
        btnElement.classList.add('wrong');
        document.getElementById('quiz-feedback').innerText = `Ошибка. Правильно: ${correct}`;
        tg.hapticFeedback.notificationOccurred('error');
        
        // Подсветить правильный ответ
        const buttons = document.querySelectorAll('#quiz-options button');
        buttons.forEach(btn => {
            if (btn.innerText === correct) btn.classList.add('correct');
        });
        
        document.getElementById('next-quiz-btn').classList.remove('hidden');
    }
}

function nextQuestion() {
    currentIndex = (currentIndex + 1) % vocabulary.length;
    showQuiz();
}

// Вспомогательная функция перемешивания массива (Алгоритм Фишера-Йетса)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
