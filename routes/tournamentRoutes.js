const express                 = require('express');
const tournamentRoute         = express.Router();
const passport                = require('passport')
const bcrypt                  = require('bcryptjs')
const User                    = require('../models/user')
const Team                    = require('../models/team')
const Tournament              = require('../models/tournament')

//tournament page
tournamentRoute.get('/tournament', (req, res, next)=>{
  Team.find()
  .then(response =>{
    res.json(response);
  })
  .catch((err)=>{
    res.json({
      message: "error seeing the tournament page",
      err
    })
  })
})

//create tournament

tournamentRoute.get('/tournament/create', (req, res, next)=>{
  Team.find()
  .then(response =>{
    res.json("something");
  })
  .catch((err)=>{
    res.json(err);
  })
})

  // Team.find()
    // .then((allTeams)=>{
      // User.findById(id)
      //   .then((user)=>{
        //   console.log("user id:",id);
        //   console.log("teams", allTeams);
        // })
      // })
    // .catch((err)=>{
      // console.log(err);
    // })
// })

// this post doesnt make sense
tournamentRoute.post('/tournament/create',(req, res, next)=>{
  const tournamentName          = req.body.tournamentName;
  const tournamentDescription   = req.body.tournamentDescription;
  const tournamentAdministrator = req.body.tournamentAdminId;
  if (tournamentName.length < 6) {
      res.status(400).json({ message: 'Your team name should contain 6 or more characters'});
      return;
    } //closed
  Tournament.findOne({ tournamentName }, 'tournamentName', (err, foundTournament) => {
      if(foundTournament) {
        res.status(400).json({ message: 'The team name already exist' });
        return;
      }
    const theTournament = new Tournament({
      tournamentName:           tournamentName,
      tournamentDescription:    tournamentDescription,
      tournamentAdministrator:  tournamentAdministrator,
      winnerCondition:          false,
      });

    theTournament.save((err) => {
      res.json(theTournament)
      if(err) 
      {
        res.status(400).json({ message: 'Something went wrong'})
      }
    })
  })
})

//===============================================>
  
  

//get team list
tournamentRoute.get('/tournament/teamlist', (req, res, next)=>{
  Team.find()
  .then((allTheTeams)=>{
      res.json(allTheTeams);
  })
  .catch((err)=>{
      res.json(err);
  })
});

//edit tournament details
//this needs to be tournament/editTournament/:id in the future
//
tournamentRoute.post('/tournament/editTournament', (req, res, next)=>{
  Tournament.put({
      administrator: req.body._id,
      teams: req.body.teams,
      tournamentType: req.body.tournamentType,
      rules: req.body.rules
  })
  .then((response)=>{
      res.json(response)
  })
  .catch((err)=>{
      res.json({
        message: "Error in editing tournament",
        err
      });
  })
})

//edit team for win/lose
tournamentRoute.put('/tournament/team/edit/:id', (req, res, next)=>{
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    res.status(400).json({  message: "specified Id is not valid" });
    return;
  }
  const updatedTeam = {
    Win: Boolean,
    Lose: Boolean
  }
  Team.findByIdAndUpdate(req.params.id, updatedTeam)
  .then(team => {
    res.json({
      message: "win/lose status updated"
      })
    })
    .catch(error => next(error))
  })

//delete team

tournamentRoute.delete('/tournament/team/delete/:id',(req, res, next)=>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
      res.status(400).json({ 
      message: "Specified id is not valid"
    })
    return;
  }
  Team.remove({_id: req.params.id })
  .then(message => {
    return res.json({
      message: "Team has been removed"
    })
  })
  .catch(error => next(error))
})
module.exports = tournamentRoute;