const { TeamAnswer } = require('../../db/models')

const setTeamAnswers = async ({ userAnswersJSON, taskId, userId, score, teamId }) => {
  try {
    const teamAnswers = await TeamAnswer.findOne({
      where: { taskId, teamId },
    })
    let scoreCount
    if (score !== undefined && score !== null && score >= 0) {
      scoreCount = score
    } else {
      scoreCount = null
    }
    if (teamAnswers) {
      const result = await teamAnswers.update({
        answer: userAnswersJSON,
        score: scoreCount,
      })
      return result
    }
    // TODO: у меня уже это второй креэйт, в котором указываю поля не из модели, а из таблицы
    // разобраться почему не работают поля модели
    const result = await TeamAnswer.create({
      user_id: userId,
      task_id: taskId,
      answer: userAnswersJSON,
      score: scoreCount,
      teamId,
    })
    return result
  } catch (error) {
    return error
  }
}

export default setTeamAnswers
