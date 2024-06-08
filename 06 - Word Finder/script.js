const endpoint = 'https://raw.githubusercontent.com/ssvivian/WebstersDictionary/master/dictionary.json';

let words = [];
fetch(endpoint)
  .then(blob => blob.json())
  .then(data => words = data);


function findMatches(wordToMatch, words) {
  return words.filter(dictEntry => {
    const regex = new RegExp(wordToMatch, 'gi');
    return dictEntry.match(regex);
  });
}

function getWordLength() {
  if (wordLength.value == '' || wordLength.value <=0 || wordLength.value > 25) {
    alert('Enter a number 1-25');
  } else {
    return Number(wordLength.value);
  }
}

function findWordLengthMatches(words) {
  const wordLen = getWordLength();
  return words.filter(dictEntry => {
    return dictEntry.word.length == wordLen;
  });
}

function noDups(array) {
  const noDupsArray = [];
  array.forEach(entry => {
    if (!noDupsArray.includes(entry.word)) {
      noDupsArray.push(entry.word);
    } 
  });
  return noDupsArray;
}

function noSpaces(array) {
    return array.filter(entry => {
        return !entry.includes(' ') && !entry.includes(';');
    })
}

function displayMatches() {
    if (!searchInput.value == '') {
      wordLength.addEventListener('change', displayMatches);
    }
    if (!searchInput.value == '') {
    wordLength.addEventListener('keyup', displayMatches);
    }

    const wordLenArray = findWordLengthMatches(words);
    const noDupsArray = noDups(wordLenArray);
    const noSpacesArray = noSpaces(noDupsArray);
    const matchArray = findMatches(searchInput.value, noSpacesArray);

    const html = matchArray.map(dictEntry => {
      const regex = new RegExp(searchInput.value, 'gi');
      const word = dictEntry
        .toLowerCase()
        .replace(regex, `<span class="hl">${searchInput.value}</span>`);
      return `
        <li>
          <span class="name">${word}</span>
        </li>
      `;
    }).join('');
    suggestions.innerHTML = html;
}

const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');
const wordLength = document.querySelector('.length');

searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);

