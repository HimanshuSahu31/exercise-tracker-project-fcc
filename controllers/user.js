const mongoose = require('mongoose');
const User = require('../models/user');

function getDate(dateString) {
  return isValidDate(dateString) ? new Date(dateString) : new Date((new Date()).toDateString());
}

function isValidDate(dateString) {
  return dateString != null && dateString != '' && !isNaN(Date.parse(dateString));
}

exports.create_new_user = (req, res) => {
  User.find({ username: req.body.username}, (err, obj) => {
    if(obj.length > 0) {
      return res.send('username already taken');
    }
    const user = new User({
      username: req.body.username
    });
    user.save()
    .then(result => res.json({
      username: result.username,
      _id: result._id
    }));
  });
}

exports.user_get_all = (req, res) => {
  User.find({}, '-logs')
  .exec()
  .then(docs => res.json(docs))
  .catch(err => res.json({ error: err }));
}

exports.user_add_log = (req, res) => {
  User.findById(req.body.userId).exec()
  .then(doc => {
    doc.logs.push({
      description: req.body.description,
      duration: req.body.duration,
      date: getDate(req.body.date)
    });
    doc.save()
    .then(result => res.json({
      username: result.username,
      description: result.logs[result.logs.length-1].description,
      duration: result.logs[result.logs.length-1].duration,
      _id: result._id,
      date: result.logs[result.logs.length-1].date
    }))
    .catch(err => res.send(err.message));
  })
  .catch(err => res.send('unknown _id'));
}

exports.user_get_log = (req, res) => {
  User.findById(req.query.userId)
  .exec()
  .then(doc => {
    if(!doc) {
      return res.send('unknown userId');
    }
    if(req.query.from && isValidDate(req.query.from)) {
      doc.logs = doc.logs.filter(log => log.date >= new Date(req.query.from));
    }
    if(req.query.to  && isValidDate(req.query.to)) {
      doc.logs = doc.logs.filter(log => log.date >= new Date(req.query.to));
    }
    if(req.query.limit && req.query.limit instanceof Number) {
      doc.logs = doc.logs.slice(0, req.query.limit);
    }
    res.json(doc);
  })
  .catch(err => res.send({ error: err }));
}