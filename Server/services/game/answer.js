const levenshtein = require("js-levenshtein");
const normalize = require("normalize-diacritics");
const GameElement = require("../../models/neuronegm/gameElement");
const User = require("../../models/auth/user");
const pointService = require("../../services/neuronegm/point");
const actionService = require("../../services/neuronegm/action");

const checkAnswer = async (node, challenge, answer) => {
  let answerCheck = {
    activator: {
      node: node.id,
    },
  };

  // GM constants and variables
  const user = await User.findOne({ _id: answer.user });
  let points = 0;
  const pointElement = await GameElement.findOne({ key: "exp_1" });
  const answerAction = await GameElement.findOne({
    key: "responder_pregunta_1",
  });

  if (answer.type == "question") {
    const distance = await normalizeAndDistance(
      challenge.answer,
      answer.answer
    );
    if (distance < 2) {
      answerCheck.activator.condition = "correct_answer";
      points += 100;
    } else {
      answerCheck.activator.condition = "wrong_answer";
      points += 10;
    }
  } else if (answer.type == "multiple") {
    let correct = true;
    challenge.options.forEach((option, idx) => {
      if (answer.answer[idx].checked != option.correct) {
        correct = false;
      }
    });
    if (correct) {
      answerCheck.activator.condition = "correct_answer";
      points += 100;
    } else {
      answerCheck.activator.condition = "wrong_answer";
      points += 10;
    }
  } else if (answer.type == "bookmark") {
    if (challenge.document == answer.document) {
      answerCheck.activator.condition = "correct_answer";
      points += 100;
    } else {
      answerCheck.activator.condition = "wrong_answer";
      points += 10;
    }
  }

  // GM actions
  if (user && user.gm_code && pointElement) {
    let post = {
      point_code: pointElement.gm_code,
      date: answer.createdAt,
      amount: points,
    };
    pointService.givePoints(post, user.gm_code, (err, data) => {
      if (err) {
        console.log(err);
      }
    });
  }
  if (user && user.gm_code && answerAction) {
    let post = { action_code: answerAction.gm_code, date: answer.createdAt };
    actionService.postPlayerAction(post, user.gm_code, (err, data) => {
      if (err) {
        console.log(err);
      }
    });
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
