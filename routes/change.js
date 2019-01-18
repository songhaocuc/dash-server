var express = require('express');
var router = express.Router();
var db = require('../model/db');

router.get('/:id', (req, res)=>{
    db.findVideoById(req.params.id, (err, doc)=>{
        res.render('change', {
            label: doc.type,
            id: doc.id,
            name: doc.name,
            bitrateList:doc.bitrateList,
            description:doc.description || "",
            resolutionList: doc.resolutionList || ""
        });
    });
});

router.post('/', (req, res)=>{
    db.updateVideoById(req.body.id,{
        name: req.body.name,
        description: req.body.description,
        bitrateList: req.body.bitrateList,
        resolutionList: req.body.resolutionList
    }, (err, doc)=>{
       if(err){
           console.log(err);
       }
        res.send('1');
       console.log(doc)
    });
});


module.exports = router;
