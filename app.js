// jshint esversion:6

const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const _=require("lodash");
const date=require(__dirname+"/date.js");

const app=express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-Harsh0145:sandeepan2603903@cluster0.dzr38.mongodb.net/listDB", {useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false});

const listSchema={
  name: {
    type: String,
    required: [1, 'Name required']
  }
};

const List=mongoose.model("list", listSchema);

const anySchema= {
  name:{
    type: String,
    required: 1
  },
  items: [listSchema]
};

const Any=mongoose.model("one", anySchema);

const defaultItems= [];

app.listen(process.env.PORT || 3000, ()=> {
  console.log("Server has started successfully");
});

app.post("/delete", (req, res)=> {
    List.findByIdAndDelete(req.body.checkbox, err=> {
      if(!err) res.redirect("/");
    });
});

app.post("/deleteAny", (req, res)=> {
  const val=req.body.checkbox;
  const title=req.body.title;
  Any.findOneAndUpdate({name: title}, {$pull: {items: {_id: val}}}, (err, doc)=> {
    if(!err) res.redirect("/"+title);
  });
});

app.get("/", (req, res)=> {
  List.find((err, list)=> {
    res.render('list', {date: date.getDateEn(), newListItem: list, day: "today"});
  });
});

app.post("/", (req, res)=> {
  let listItem=new List({
    name: req.body.newItem
  });
  listItem.save();
  res.redirect("/");
});

app.get("/about", (req, res)=> {
  res.render('about');
});

app.get("/:any", (req, res)=> {
  const site=_.capitalize(req.params.any);
  Any.findOne({name: site}, (err, doc)=> {
    if(!err) {
      if(!doc) {
        const anyListItem=new Any({
          name: site,
          items: defaultItems
        });
        anyListItem.save();
        res.redirect("/"+site);
      } else {
          res.render('list', {date: doc.name, newListItem: doc.items, day: "notToday"});
      }
    }
  });
});

app.post("/:any", (req, res)=> {
  const site=_.capitalize(req.params.any);
  let item=new Any({
    name: req.body.newItem
  });

  Any.findOneAndUpdate({name: site}, {$push: {items: item}}, (err, doc)=> {
    if(!err) res.redirect("/"+site);
  });
});
