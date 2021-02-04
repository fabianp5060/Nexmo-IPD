const router = require('express').Router({mergeParams:true});
const NexmoController = require('./controller/NexmoController')
const IpdController = require('./controller/IpdController')

router.route('/webhooks/answer').get(NexmoController.onAnswer)
router.route('/webhooks/event').post(NexmoController.onEvent)
router.route('/playSpeechInput.mp3').get(NexmoController.playSpeechInput)
router.route('/wavfileTranfer').get(IpdController.wavfileTranfer)

module.exports = {
    router
}