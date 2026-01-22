const tg = window.Telegram.WebApp;
tg.expand(); // Развернуть на весь экран

// База данных слов (в реальности загружалась бы с сервера)
const vocabulary = [
    { en: "Cat", ru: "Кошка", options: ["Собака", "Кошка", "Мышь"] },
    { en: "Dog", ru: "Собака", options: ["Слон", "Собака", "Волк"] },
    { en: "Apple", ru: "Яблоко", options: ["Груша", "Яблоко", "Апельсин"] },
    { en: "Car", ru: "Машина", options: ["Самолет", "Машина", "Велосипед"] }
];

let currentIndex = 0;

function startMode(mode) {
    document.querySelector('.menu').classList.add('hidden');
    if (mode === 'cards') {
        document.getElementById('cards-section').classList.remove('hidden');
        showCard();
    } else {
        document.getElementById('quiz-section').classList.remove('hidden');
        showQuiz();
    }
}

// --- Логика Карточек ---
function showCard() {
    const cardElement = document.querySelector('.card');
    cardElement.classList.remove('flipped'); // Сброс переворота
    
    // Небольшая задержка, чтобы анимация сброса прошла красиво
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

// --- Логика Викторины ---
function showQuiz() {
    const item = vocabulary[currentIndex];
    document.getElementById('quiz-question').innerText = `Как переводится "${item.en}"?`;
    document.getElementById('quiz-feedback').innerText = "";
    
    const optionsDiv = document.getElementById('quiz-options');
    optionsDiv.innerHTML = ""; // Очистка

    // Перемешиваем варианты (для примера просто берем из объекта)
    item.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt, item.ru, btn);
        optionsDiv.appendChild(btn);
    });
}

function checkAnswer(selected, correct, btnElement) {
    if (selected === correct) {
        btnElement.classList.add('correct');
        document.getElementById('quiz-feedback').innerText = "Верно! 🎉";
        tg.hapticFeedback.notificationOccurred('success'); // Вибрация
        
        // Переход к следующему вопросу через секунду
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % vocabulary.length;
            showQuiz();
        }, 1000);
    } else {
        btnElement.classList.add('wrong');
        document.getElementById('quiz-feedback').innerText = "Неверно, попробуй еще раз.";
        tg.hapticFeedback.notificationOccurred('error'); // Вибрация ошибки
    }
}