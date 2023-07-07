var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = { customCssUrl: '/swagger-ui.css'};

const routes = require('./src/routes');
const authDocProduction = require('./src/middlewares/authDoc');

var app = express();
require('dotenv').config();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


if (process.env.NODE_ENV !== 'test'){
    const swaggerFile = require('./swagger/swagger_output.json');
    app.get('/', (req, res) => {/* #swagger.ignore = true */ res.redirect('/doc'); });
    app.use('/doc', authDocProduction, swaggerUi.serve, swaggerUi.setup(swaggerFile, swaggerOptions));
}

routes(app);

if (process.env.NODE_ENV !== 'test'){
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Servidor esta rodando na porta ${PORT}`));
}

module.exports = app;
