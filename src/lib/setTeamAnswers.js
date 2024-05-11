const { TeamAnswer } = require('../../db/models')

const setTeamAnswers = async ({ userAnswersJSON, taskId, userId, score, teamId,pages }) => {
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
    let pagesCount
    if (pages !== undefined && pages !== null) {
      pagesCount = pages
    } else {
      // pagesCount = teamAnswers.pages
      pagesCount = null
    }
    if (teamAnswers) {
      const result = await teamAnswers.update({
        answer: userAnswersJSON,
        score: scoreCount,
        pages: pagesCount
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
      pages: pagesCount
    })
    return result
  } catch (error) {
    return error
  }
}

export default setTeamAnswers
