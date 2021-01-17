const levenshtein = require('js-levenshtein');
const normalize = require('normalize-diacritics');


const checkAnswer = async (challenge, answer) => {
    const distance = await normalizeAndDistance(challenge.answer, answer.answer);
    if(distance<2) {
        return 'correct_answer';
    }
    else {
        return 'wrong_answer';
    }
}

const answerService = {
    checkAnswer
};

const normalizeAndDistance = async (answer, userAnswer) => {
    let normalizedAnswer = await normalize.normalize(answer.toLowerCase());
    let normalizedUserAnswer = await normalize.normalize(userAnswer.toLowerCase());
    var distance = levenshtein(normalizedAnswer, normalizedUserAnswer);
    return distance;
}

module.exports = answerService;
