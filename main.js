const textDisplay = document.querySelector('#text-display');
const textInput = document.querySelector('#text-input');
const wpmDisplay = document.querySelector('#wpm-display');
const accuracyDisplay = document.querySelector('#accuracy-display');
const progressBar = document.querySelector('#progress-bar');
const stylesheet = document.querySelector('link');
const themeSwitch = document.querySelector('#switch-theme');

let wordcount;

let testWords = [];
const randomWordsList = ['the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it', 'that', 'for', 'they', 'sometimes', 'with', 'as', 'not', 'on', 'she', 'at', 'by', 'this', 'we', 'you', 'do', 'but', 'from', 'or', 'which', 'one', 'would', 'all', 'will', 'there', 'say', 'who', 'make', 'when', 'can', 'more', 'if', 'no', 'man', 'out', 'other', 'so', 'what', 'time', 'up', 'go', 'about', 'than', 'into', 'could', 'state', 'only', 'new', 'year', 'some', 'take', 'come', 'these', 'know', 'see', 'use', 'get', 'like', 'then', 'first', 'any', 'work', 'now', 'may', 'such', 'give', 'over', 'think', 'most', 'even', 'find', 'day', 'also', 'after', 'way', 'many', 'must', 'look', 'before', 'great', 'back', 'through', 'long', 'where', 'much', 'should', 'well', 'people', 'down', 'own', 'just', 'because', 'good', 'each', 'those', 'feel', 'seem', 'how', 'high', 'too', 'place', 'little', 'world', 'very', 'still', 'nation', 'hand', 'old', 'life', 'tell', 'write', 'become', 'here', 'show', 'house', 'both', 'between', 'need', 'mean', 'call', 'children', 'under', 'last', 'right', 'move', 'thing', 'question', 'school', 'never', 'same', 'another', 'begin', 'while', 'number', 'part', 'turn', 'real', 'leave', 'might', 'want', 'point', 'form', 'off', 'child', 'few', 'small', 'since', 'against', 'ask', 'late', 'home', 'something', 'large', 'person', 'end', 'open', 'public', 'follow', 'during', 'present', 'without', 'again', 'hold', 'govern', 'around', 'possible', 'head', 'consider', 'word', 'mountain', 'problem', 'however', 'lead', 'system', 'set', 'order', 'eye', 'plan', 'run', 'keep', 'face', 'fact', 'going', 'play', 'stand', 'increase', 'early', 'course', 'change', 'help', 'line'];

let wpm = 0;
let accuracy = 0;
let characterCount = 0;
let correctCount = 0;
let currentWord = 0;

let theme = 'light';

let startDate;

setWordCount(10);

function setText() {
    currentWord = 0;
    characterCount = 0;
    correctCount = 0;

    wpm = 0;
    accuracy = 0;
    
    textInput.value = '';
    textInput.className = '';
    progressBar.innerHTML = `0/${wordcount}`;
    progressBar.style.width = '0%';
    
    testWords = [];
    while(testWords.length < wordcount) {
        let word = randomWordsList[Math.floor(Math.random() * randomWordsList.length)];

        // if duplicate
        if(word == testWords[testWords.length - 1]) {
            let previousWord = testWords[testWords.length - 1];
            while(word == previousWord) {
                word = randomWordsList[Math.floor(Math.random() * randomWordsList.length)];
            }
        }
        testWords.push(word);
    }

    showText();
    textInput.disabled = false;
    textInput.focus();
}

function showText() {
    textDisplay.innerHTML = '';
    testWords.forEach(testWord => {
        let word = document.createElement('span');
        word.innerHTML = testWord + ' ';
        textDisplay.appendChild(word);
    });
    textDisplay.firstChild.classList.add('highlight');
}

function setWordCount(count) {
    wordcount = count;
    console.log(`set word count to ${wordcount}`);
    document.querySelectorAll('span').forEach(span => span.style.fontWeight = '400')
    document.querySelector(`#word-count-${count}`).style.fontWeight = '900';

    setText();
}

textInput.addEventListener('keydown', event => {
    if(currentWord < testWords.length) {
        updateTextField();
        if(currentWord == 0 && textInput.value == '') {
            startDate = Date.now();
        }
    }

    function updateTextField() {
        if(event.key.value >= 'a' && event.key.value <= 'z') {
            let input = textInput.value + event.key.value;
            let text = testWords[currentWord].slice(0, input.length);
            if(input !== text) {
                textInput.className = 'incorrect';
            }
        } else if(event.key === ' ') {
            textInput.className = '';
            event.preventDefault();
            if(textInput.value != '') {
                characterCount += textInput.value.length + 1;
                if(currentWord < wordcount) {
                    let correctWord = testWords[currentWord];
                    if(textInput.value === correctWord) {
                        textDisplay.childNodes[currentWord].classList.add('correct');
                        correctCount += correctWord.length + 1;
                    } else {
                        textDisplay.childNodes[currentWord].classList.add('incorrect');
                    }

                    if(currentWord !== wordcount - 1) {
                        textDisplay.childNodes[currentWord].classList.remove('highlight');
                        textDisplay.childNodes[currentWord + 1].classList.add('highlight');
                    } else {
                        testEnd();
                    }
                }
                currentWord++;
                updateProgress();
                textInput.value = '';
            }
        }
    }

    function updateProgress() {
        let progress = Math.round(currentWord / wordcount * 100);

        progressBar.innerHTML = `${currentWord}/${wordcount}`;
        progressBar.style.width = `${progress}%`;
    }

    function testEnd() {
        calculateResults();
        textInput.disabled = true;
    }

    function calculateResults() {
        wpm = Math.round((correctCount / 5) / ((Date.now() - startDate) / 60000));
        accuracy = Math.round(correctCount / characterCount * 100);

        wpmDisplay.innerHTML = `wpm: ${wpm}`;
        accuracyDisplay.innerHTML = `accuracy: ${accuracy}`;
    }
});

function reset() {
    setText();
}

function switchTheme() {
    if(theme == 'light') {
        stylesheet.href = 'dark.css';
        themeSwitch.innerHTML = '🌞';
        theme = 'dark';
    } else {
        stylesheet.href = 'light.css';
        themeSwitch.innerHTML = '🌚';
        theme = 'light';
    }
}