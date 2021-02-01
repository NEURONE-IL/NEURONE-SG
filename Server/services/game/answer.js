const levenshtein = require("js-levenshtein");
const normalize = require("normalize-diacritics");

const checkAnswer = async (node, challenge, answer) => {
  let answerCheck = {
    node: node.id,
  };
  if (answer.type == "question") {
    const distance = await normalizeAndDistance(
      challenge.answer,
      answer.answer
    );
    if (distance < 2) {
      answerCheck.condition = "correct_answer";
    } else {
      answerCheck.condition = "wrong_answer";
    }
    console.log("answerCheck", answerCheck);
  }
  return answerCheck;
};

const answerService = {
  checkAnswer,
};

const normalizeAndDistance = async (answer, userAnswer) => {
  let normalizedAnswer = await normalize.normalize(answer.toLowerCase());
  let normalizedUserAnswer = await normalize.normalize(
    userAnswer.toLowerCase()
  );
  var distance = levenshtein(normalizedAnswer, normalizedUserAnswer);
  return distance;
};

module.exports = answerService;
