const mongoose = require('mongoose');
const exppress = require('express');
const { Events, validateEvents } = require('../models/event');
const bcrypt = require('bcryptjs');
const router = exppress.Router();
const passport = require('passport')


// get all user in the events  
router.get('/usersOf/:eventId', async (req, res) => {
    //found the event
    if (!mongoose.Types.ObjectId.isValid(req.params.eventId)) res.status(404).send('the id is not valid')

    let users = await Events.findById(req.params.eventId).populate("users").select('users')
    if (!users) return res.status(400).send("the event is not exist")

    res.send(users)
})

// get all event of users  like the other method in the event router 
//but here post to insure users can not know there id or try to get other event 
router.post('/myEvent', async (req, res) => {
    //check if the id is valid
    if (!mongoose.Types.ObjectId.isValid(req.body.userId)) res.status(404).send('the id is not valid')

    let users = await Events.find({
        users: req.body.userId
    })
    //check if the user is found or not
    if (!users) return res.status(400).send("the event is not exist")

    res.send(users)
})

router.delete('/deleteEvent', async (req, res) => {
    //check if the id is valid
    if (!mongoose.Types.ObjectId.isValid(req.body.eventid)) res.status(404).send('the id is not valid')
    if (!mongoose.Types.ObjectId.isValid(req.body.userid)) res.status(404).send('the id is not valid')

    let eventToEdit = await Events.findById(req.body.eventid)
    //check if the user is found or not
    if (!eventToEdit) return res.status(400).send("the event is not exist")
    var userIndex = eventToEdit.users.indexOf(req.body.userid);
    if (userIndex < 0) return res.status(400).send("the user is not exist")
    eventToEdit.users.splice(userIndex, 1);
    eventToEdit.save().then(
        res.send(eventToEdit)
    ).catch("error in delete the user")


})
router.post('/accept', async (req, res) => {
    //check if the id is valid
    if (!mongoose.Types.ObjectId.isValid(req.body.eventid)) res.status(404).send('the id is not valid')
    if (!mongoose.Types.ObjectId.isValid(req.body.userid)) res.status(404).send('the id is not valid')

    let eventToEdit = await Events.findById(req.body.eventid)
    //check if the user is found or not
    if (!eventToEdit) return res.status(400).send("the event is not exist")
    var userIndex = eventToEdit.users.indexOf(req.body.userid);
    if (userIndex < 0) return res.status(400).send("the user is not exist")
    eventToEdit.RSVP[userIndex].status =true;
    eventToEdit.save().then(
        res.send(eventToEdit)
    ).catch("error in accept  the user event")


})


// get up coming events
router.post('/upcoming', async (req, res) => {
    const events = await Events.find({
        date: { '$gt': Date.now() }, users: req.body.userid
    });

    res.send(events);
})

// get all past  events
router.post('/past', async (req, res) => {
   
    const events = await Events.find({ date: { '$lt': Date.now() }, users: req.body.userid });

    res.send(events);
})

module.exports = router;


