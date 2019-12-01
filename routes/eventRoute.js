const mongoose = require('mongoose');
const exppress = require('express');
const { Events, validateEvents } = require('../models/event');
const bcrypt = require('bcryptjs');
const router = exppress.Router();
const passport = require('passport')


// get all events 
router.get('/', async (req, res) => {
    //console.log("clients");
    const events = await Events.find();

    res.send(events);

});
// get up coming events
router.get('/upcoming', async (req, res) => {
    const events = await Events.find({ date: { '$gt': Date.now() } });

    res.send(events);
})

// get all past  events
router.get('/past', async (req, res) => {
    const events = await Events.find({ date: { '$lt': Date.now() } });

    res.send(events);
})
// add new event 
router.post('/addEvent', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.put('/addUser/:id', async (req, res) => {
    //found the event
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) res.status(404).send('the id is not valid')

    let eventToEdite = await Events.findById(req.params.id)
    if (!eventToEdite) return res.status(400).send("the event is not exist")

    //edit it 
    eventToEdite.users.push(req.body.id)
    eventToEdite.save() .then(reslut => {
        res.send(reslut);
    })
})




/// end

// login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
        (req, res, next)
})
// 
module.exports = router;