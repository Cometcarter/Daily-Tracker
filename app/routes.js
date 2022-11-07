module.exports = function (app, passport, db) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('trackerdata').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user: req.user,
        trackerdata: result.filter(rec=> !rec.completed)
        //show everything that's NOT completed
      })
    })
  });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout(() => {
      console.log('User logged out')
    });
    res.redirect('/');
  });


  app.get('/completedtask', isLoggedIn, function (req, res) {
    db.collection('trackerdata').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('log.ejs', {
        user: req.user,
        trackerdata: result.filter(rec=> rec.completed)
        //show everything that's completed
      })
    })
  });


  // message board routes ===============================================================
  //===============================================================================
  app.post('/tracklist', (req, res) => {
    console.log(req.body)
    db.collection('trackerdata').save({
      task: req.body.task,
      priority: req.body.priority,
      completed: false
      // thumbUp: 0, thumbDown: 0
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/profile')
    })
  })

  app.post('/completedtask', (req, res) => {
    console.log(req.body)
    //^ query = body (one for link , one for form)
      db.collection('trackerdata')
        .findOneAndUpdate({
          task: req.body.task,
          priority: req.body.priority,
          completed: false 
        }, {
          $set: {
            completed: true
          }
        }, {
          //this sorts the result V
          sort: { _id: -1 },
          upsert: true
        }, (err, result) => {
          if (err) return console.log(err)
          console.log(result)
          res.redirect('/completedtask')
        })
    })
 

  app.delete('/tracklist', (req, res) => {
    db.collection('trackerdata').findOneAndDelete({
      task: req.body.task,
      priority: req.body.priority,
    }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })
  //============================================================================
  // ===========================================================================


  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}

  // app.get('/datenight', async (req, res) => {
  //   // const groceryResult = await fetch(`https://jsonplaceholder.typicode.com/todos/`)
  //   // //later on put grocery api here
  //   // let groceryJson = await groceryResult.json()

  //   const movieResult = await fetch(`http://www.omdbapi.com/?i=${movieName}&apikey=b5aa41c0`)
  //   //later on put grocery api here
  //   let drinkJson = await movieResult.json()

  //   //slice returns new array , splice mutates it
  //   console.log(groceryJson.length);

  //   groceryJson = groceryJson.slice(0, 10)
  //   drinkJson = drinkJson.drinks.slice(0, 3)
  //   console.log(groceryJson.length);
  //   //const result = await db.collection('cart').find().toArray() 
  //   //can use this logic structure later to loop through grocery items and try to find them in the cart, then do stuff based on that
  //   res.render('inventory.ejs', { inventory: groceryJson, drink: drinkJson })
  // })

 // // thumbup ==============================
  // app.put('/thumbup', (req, res) => {
  //   db.collection('messages')
  //     .findOneAndUpdate({
  //       name: req.body.name,
  //       msg: req.body.msg
  //     }, {
  //       $set: {
  //         thumbUp: req.body.thumbUp + 1
  //       }

  //     }, {
  //       sort: { _id: -1 },
  //       upsert: true
  //     }, (err, result) => {
  //       if (err) return console.log(err)
  //       console.log(result)
  //       res.send(result)
  //     })
  // })
  // // thumbdown ==============================
  // app.put('/thumbdown', (req, res) => {
  //   db.collection('messages')
  //     .findOneAndUpdate({
  //       name: req.body.name,
  //       msg: req.body.msg
  //     }, {
  //       $set: {
  //         thumbUp: req.body.thumbUp - 1
  //       }

  //     }, {
  //       sort: { _id: -1 },
  //       upsert: true
  //     }, (err, result) => {
  //       if (err) return res.send(err)
  //       res.send(result)
  //     })
  // })