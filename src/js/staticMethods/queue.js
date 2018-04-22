// private global state for the queue feature
let currentSteps = []

/*
 * Global function for chaining pleasantAlert popups
 */
export const queue = function (steps) {
  const pleasant = this
  currentSteps = steps
  const resetQueue = () => {
    currentSteps = []
    document.body.removeAttribute('data-padn-queue-step')
  }
  let queueResult = []
  return new Promise((resolve, reject) => {
    (function step (i, callback) {
      if (i < currentSteps.length) {
        document.body.setAttribute('data-padn-queue-step', i)

        pleasant(currentSteps[i]).then((result) => {
          if (typeof result.value !== 'undefined') {
            queueResult.push(result.value)
            step(i + 1, callback)
          } else {
            resetQueue()
            resolve({dismiss: result.dismiss})
          }
        })
      } else {
        resetQueue()
        resolve({value: queueResult})
      }
    })(0)
  })
}

/*
 * Global function for getting the index of current popup in queue
 */
export const getQueueStep = () => document.body.getAttribute('data-padn-queue-step')

/*
 * Global function for inserting a popup to the queue
 */
export const insertQueueStep = (step, index) => {
  if (index && index < currentSteps.length) {
    return currentSteps.splice(index, 0, step)
  }
  return currentSteps.push(step)
}

/*
 * Global function for deleting a popup from the queue
 */
export const deleteQueueStep = (index) => {
  if (typeof currentSteps[index] !== 'undefined') {
    currentSteps.splice(index, 1)
  }
}
