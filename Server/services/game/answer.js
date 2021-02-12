const levenshtein = require("js-levenshtein");
const normalize = require("normalize-diacritics");

const checkAnswer = async (node, challenge, answer) => {
  let answerCheck = {
    activator: {
      node: node.id,
    }
  };
  if (answer.type == "question") {
    const distance = await normalizeAndDistance(
      challenge.answer,
      answer.answer
    );
    if (distance < 2) {
      answerCheck.activator.condition = "correct_answer";
    } else {
      answerCheck.activator.condition = "wrong_answer";
    }
    console.log("answerCheck", answerCheck);
  }
  else if (answer.type == 'multiple') {
    let correct = true;
    challenge.options.forEach((option, idx) => {
      if (answer.answer[idx].checked != option.correct) {
        correct = false;
      }
    });
    if(correct) {
      answerCheck.activator.condition = "correct_answer";
    }
    else {
      answerCheck.activator.condition = "wrong_answer";
    }
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
