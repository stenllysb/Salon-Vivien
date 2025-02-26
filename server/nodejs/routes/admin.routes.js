/**
 * routes for login
 */

module.exports = app => {
    const sessions = require('express-session');
    const crypto = require('crypto');
    const adminConfig = require('../config/admin.config');
    let session;

    app.use(sessions({
        secret: '2S8T9A-9RB6H3-D5N3WH',
        name: 'salonVivien',
        resave: false,
        saveUninitialized: false,
        cookie: {expires: 60*60*1000}
    }));

    app.get("/admin/login", (req, res) => {
        session = req.session;
        if (session.uniqueId)
            res.redirect("/admin");
        else
            res.sendFile("/public/admin/login.html", {root: "./"});
    });

    app.post("/admin/login", (req, res) => {
        session = req.session;
        const username = crypto.createHmac('sha256', adminConfig.SECRET).update(req.body.username).digest('hex');
        const password = crypto.createHmac('sha256', adminConfig.SECRET).update(req.body.password).digest('hex');
        if (username === adminConfig.USER && password === adminConfig.PASSWORD) {
            session.uniqueId = req.body.username;
            res.redirect("/admin");
        } else {
            res.status(401).send({message: "Bad username or password."})
        }
    });

    app.get("/admin", (req, res) => {
        session = req.session;
        if (session.uniqueId)
            res.sendFile("/public/admin/admin.html", {root: "./"});
        else
            res.redirect("/admin/login");
    });

    app.get("/admin/logout", (req, res) => {
        req.session.destroy();
        res.redirect("/admin/login");
    })
};