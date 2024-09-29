const express = require("express");
const route = express.Router();
const path = require("path");
const db = require("../model/dbConfig");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

route.get("/", (req, res) => {
  res.render("admin_dashboard", { username: req.session.current_user });
});

route.get("/add_product", async (req, res) => {
  // res.render('add_product',{username: req.session.current_user});

  var data = await db.collection("category").find({}).toArray();
  console.log("Data is : " + data);
  if (data != null) {
    res.render("add_product", {
      categoryList: data,
      username: req.session.current_user,
    });
  }
});

route.post("/add_product", (req, res) => {
  var img_file = req.files.product_image;
  let fileName = new Date().getTime() + img_file.name;

  console.log("File Name is : " + fileName);
  let filePath = path.join(__dirname, "../public/product_images", fileName);
  console.log("Path is : " + filePath);

  img_file.mv(filePath, (err) => {
    if (!err) {
      let data = req.body;

      //create Image or File Key
      data.image_file = fileName;
      db.collection("product").insertOne(data, (err) => {
        err ? res.end("Error") : res.redirect("/admin/add_product");
      });
    }
  });
});

route.get("/add_category", (req, res) => {
  res.render("add_category", { username: req.session.current_user });
});

route.post("/add_category", (req, res) => {
  console.log(req.body.cat_name);
  let cat_id = new Date().getTime();
  let name = req.body.cat_name;
  let catgeoryData = { category_id: "" + cat_id, cat_name: name };
  db.collection("category").insertOne(catgeoryData, (err) => {
    err ? res.end("Error") : res.redirect("/admin/add_category");
  });
});

route.get("/view_product", async (req, res) => {
  var data = await db.collection("product").find().toArray();
  console.log("Product Data is " + data);
  if (data != null) {
    res.render("view_product", {
      productList: data,
      username: req.session.current_user,
    });
  }
});

route.get("/delete_product/:id", async (request, response) => {
  let pid = request.params.id;
  await db
    .collection("product")
    .deleteOne({ _id: new ObjectId(pid) }, (err) => {
      if (err) {
        console.log("Data Not Deleted...");
      } else {
        console.log("Record Delete : ");
        response.redirect("/admin/view_product");
      }
    });
});

route.get("/view_category", async (req, res) => {
  // res.render('view_category',{username: req.session.current_user});
  var data = await db.collection("category").find().toArray();
  console.log("Category Data is " + data);
  if (data != null) {
    res.render("view_category", {
      productList: data,
      username: req.session.current_user,
    });
  }
});

route.get("/edit_product/:id", async (request, response) => {
  console.log("ID IS : " + request.params.id);
  let data = await db
    .collection("product")
    .findOne({ _id: new ObjectId(request.params.id) });
  let category = await db.collection("category").find().toArray();
  response.render("edit_product_details", {
    username: request.session.current_user,
    product: data,
    category: category,
  });
});

module.exports = route;
