module.exports = (req, res, next) => {
    res.locals.usuario = req.session?.usuario || null;

    if (!req.session.usuario) {

        return res.redirect("/login");

    }

    next();

}