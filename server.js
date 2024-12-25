require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const chalk = require("chalk");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());
app.use(cookieparser());

mongoose.connect(process.env.MONGODB_KEY)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB", err));

//user
const user = require("./router/user/user.route");
const product = require("./router/user/product.route");
const card = require("./router/user/card.route");
const cart = require("./router/user/cart.route");
const order = require("./router/user/order.route");
const userreview = require("./router/user/userrating.route");
const billing = require("./router/user/billing.route");
const contact = require("./router/user/contact.route");
const related_items = require("./router/user/related_items.route");
const account = require("./router/user/account.route");
const wishlist = require("./router/user/wishlist.route");
const notification = require("./router/user/notifications.route");
const discount = require("./router/user/discount.route");

//user
app.use("/user", user);
app.use("/user/product", product);
app.use("/user/card", card);
app.use("/user/cart", cart);
app.use("/user/order", order);
app.use("/user/userreview", userreview);
app.use("/user/billing", billing);
app.use("/user/contact", contact);
app.use("/user/items", related_items);
app.use("/user/account", account);
app.use("/user/wishlist", wishlist);
app.use("/user/notification", notification);
app.use("/user/discount", discount);


//admin
const Admin = require("./router/admin/admin.route");
const report = require("./router/admin/report.route");
const cards = require("./router/admin/card.route");
const orders = require("./router/admin/order.route");
const products = require("./router/admin/product.route");
const users = require("./router/admin/user.route");
const category = require("./router/admin/category.route");
const coupan = require("./router/admin/coupan.route");
const Relateditems = require("./router/admin/related_items.route");

//admin
app.use("/admin", Admin);
app.use("/admin/report", report);
app.use("/admin/card", cards);
app.use("/admin/order", orders);
app.use("/admin/product", products);
app.use("/admin/users", users);
app.use("/admin/category", category);
app.use("/admin/coupan", coupan);
app.use("/admin/relateditems",Relateditems);


app.listen(port, (err) => {
    if (err) {
        console.log(chalk.red(err));
    } else {
        console.log(`Server is running on port ${port}`);
    }
})
