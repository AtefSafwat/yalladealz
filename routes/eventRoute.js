const mongoose = require('mongoose');
const exppress = require('express');
const { Events, validateEvents } = require('../models/event');
const bcrypt = require('bcryptjs');
const router = exppress.Router();
const passport = require('passport')

const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')
// get all events 
router.get('/', adminAuth,async (req, res) => {
    //console.log("clients");
    const events = await Events.find();

    res.send(events);

});
// get up coming events
router.get('/upcoming', adminAuth, async (req, res) => {
    const events = await Events.find({ date: { '$gt': Date.now() } });

    res.send(events);
})

// get all past  events
router.get('/past', adminAuth, async (req, res) => {
    const events = await Events.find({ date: { '$lt': Date.now() } });

    res.send(events);
})
// add new event 
router.post('/addEvent', adminAuth, async (req, res) => {
    const { error } = validateEvents(req.body)
    if (error) return res.status(400).send(error.details[0].message + " joi")

    let newEvent = await Events.findOne({ name: req.body.name })
    //console.log(newEvent.name);

    if (newEvent) return res.status(400).send("the event is exist !!")

    let row = new Events({
        name: req.body.name,
        adress: req.body.adress,
        date: req.body.date
    })
    row.save().then(reslut => {
        res.send(reslut);
    })



})
// update the event
router.put('/:id', adminAuth, async (req, res) => {
    //found the event
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) res.status(404).send('the id is not valid')

    let eventToEdite = await Events.findById(req.params.id)
    if (!eventToEdite) return res.status(400).send("the event is not exist")

    //edit it 
    eventToEdite.set({
        name: req.body.name,
        adress: req.body.adress,
        date: req.body.date

    })
    eventToEdite.save() .then(reslut => {
        res.send(reslut);
    })
})

// add user to event 
router.put('/addUserTo/:id', adminAuth, async (req, res) => {
    //found the event
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) res.status(404).send('the id is not valid')

    let eventToEdite = await Events.findById(req.params.id)
    if (!eventToEdite) return res.status(400).send("the event is not exist")

    //edit it 
    eventToEdite.users.push(req.body.id)
    eventToEdite.save() .then(reslut => {
        res.send(reslut);
    }).catch(err=> console.log(err));
    
})


// get all event of users 
router.get('/eventsof/:userId', async (req, res) => {
    //check if the id is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) res.status(404).send('the id is not valid')

    let users = await Events.find({
        users:req.params.userId
    })
    //check if the user is found or not
    if (!users) return res.status(400).send("the event is not exist")

    res.send(users)
})



/// end

// login

// 
module.exports = router;