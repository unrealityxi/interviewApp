"use strict";

const express = require("express");

const FIELDS = ["css3", "javascript", "html5"];

let config   = {
  categories: FIELDS
}


module.exports = function(app, db){
  // Render homepage
  app.get("/", function(req,res){
    
    console.log("Accessing homepage");
    config.title = "Interview Questions";
    config.field = "";
    return res.render("index.ejs", config);
  }); 
  
  
  // About page route
  
  app.get("/about", function(req, res){
    
    config.title = "About";
    config.field = "";
    res.render("about.ejs", config);
  })
  
  // Contact routing
  
  app.get("/contact", function(req, res){
    
    config.title = "Contact";
    config.field = "";
    res.render("contact.ejs", config)
    
  });
  
  // Get random question from database
  
  app.get("/questions/:field", function(req, res, next){
    
    // Determine the queried field
    let field = req.params.field;
    if (!FIELDS.includes(field)) {
      console.log(field);
        return res.send("Error: invalid field");
        };
    
    // Get a random document from database
    db.collection(field).aggregate({$sample: {size: 1}}, function(err, doc){
      

      
      console.log("Field is being selected");
       
      
      if (err) {return console.log(err)};
      if (!doc){ return next("Error: invalid path")}
      
      // Get document by mongo id,
      // Document ids are simultaneously questions URLS
      return res.redirect(`/questions/${field}/${doc[0]._id}`);
    });
    
  });
  
  // Renders random or urled question 
  
  FIELDS.forEach(function(field){
    
    app.get( `/questions/${field}/:_id`, function(req, res, next){
      
      
      // get the questions slug url
      let _id = req.params._id;
      
      // search for that url in respective collection
      
      db.collection(field).findOne({"_id": _id}, function(err, doc){
        
        if (err){
          console.log(err);
          return res.status(500).send("Internal server error");
        }
        if (!doc){
          var err = new Error();
          err.status = 404;
          err.message = "Error: document not found";
          return next(err);
        }
        
        console.log("Concrete question here!");
        
        config.doc = doc;
        config.title = field;
        config.field = field;
        
        
        
        return res.render("question", config);
      });
    });
  });
  
  
  
  app.get('*', function(req, res, next) {
    var err = new Error();
    err.status = 404;
    next(err);
  });
 
  // handling 404 errors
  app.use(function(err, req, res, next) {
    if(err.status !== 404) {
      return next(err);
    }
 
  return res.send(err.message || '** no unicorns here **');
  });
  
  app.use(function(err, req, res, next){
    
    console.error(err);
    
    return res.send(err);
    
  });
  
  
  
};
