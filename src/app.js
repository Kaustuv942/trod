const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const { unless } = require("express-unless");
const cron = require('node-cron');
const port = process.env.PORT || 3000


const auth = require('./helpers/jwt.js');
const users = require('./controllers/UserController.js')
const subscriptions = require('./controllers/SubscriptionController.js')
const vacancies = require('./controllers/VacancyController.js')
const admin = require('./controllers/AdminController.js')
const errors = require('./helpers/errorHandler.js')
const logger = require('./logging/logger.js');
const Subscription = require('./models/SubscriptionModel.js');
const masterDataService = require('./service/MasterDataService');
const userDataService = require('./service/UserService');
const adminDataService = require('./service/AdminService');
const superadmin=require('./controllers/SuperAdminController')
const { date } = require('@hapi/joi/lib/template.js');
const Mailer = require('./service/mailer')
const Constants = require('./Constants')

app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(express.json()) // middleware for parsing application/json
app.use(express.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded

// middleware for authenticating token submitted with requests
auth.authenticateToken.unless = unless
app.use(auth.authenticateToken.unless({
    path: [
        { url: '/', methods: ['GET']},
        { url: '/users/login', methods: ['POST']},
        { url: '/users/register', methods: ['POST']},
        { url: '/users/refreshToken', methods: ['POST']},
        { url: '/admin/login', methods: ['POST']}
    ]
}))

app.get('/', (req, res) => {
    res.status(200).json({message: "Hello World!"})
})
app.use('/users', users) // middleware for listening to routes
app.use('/subscriptions', subscriptions) 
app.use('/vacancies', vacancies) 
app.use('/admin', admin)
app.use('/superadmin',superadmin)
app.use(errors.errorHandler); // middleware for error responses

// MongoDB connection, success and error event responses
const uri = process.env.DB_CONNECTION;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, autoIndex: true });
const db = mongoose.connection;
db.on('error', () => logger.log.error('connection error:'));
db.once('open', () => logger.log.info(`Connected to mongo at ${uri}`));

// userDataService.fillUsers();
// userDataService.modLocations();
cron.schedule('0 1 * * * *', async () => {
    logger.log.info('running vacancy finder at every day at 1AM');
    // def()
    // for every teacher -> tell if he will reach a threshold global date or not-> 
    // teacher -> pending (vacancy), -> 
    var masterData = await masterDataService.getMasterData()
    logger.log.trace(masterData);
    var totalAllUsers = await userDataService.getAllUsers()
    var allAdmins = await adminDataService.getAllAdminData()
    for(let j = 0; j < allAdmins.length; j++){
        var countPending = 0;
        const allUsers = totalAllUsers.filter((user) => allAdmins[j].collegeId == user.collegeId)       
        for(let i = 0; i < allUsers.length; i++){
            var dob = allUsers[i].dob;
            logger.log.trace(dob);
            dob.setFullYear(dob.getFullYear() + masterData.RetirementAge);
            logger.log.trace(dob)
            var todayDate = new Date();
            const days = (dob, todayDate) =>{
                let difference = dob.getTime() - todayDate.getTime();
                let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
                return TotalDays;
            }
            var diffDays = days(dob, todayDate);
            logger.log.trace(diffDays +" days to retirement");

            if(diffDays <= masterData.AlertCountDownDay){
                allUsers[i].exit = "pending";
                countPending ++;
            }
            userDataService.updateUser(allUsers[i]);
            console.log(allUsers[i]);
        }
        if(countPending > 0){
            Mailer.sendMail({
                to: allAdmins[j].email,
                subject: Constants.MAIL_INVITE_SUBJECT,
                text: Constants.MAIL_VACANCY_ADMIN_REMINDER_TEXT + countPending
            })
        }

    }        
    // logger.log.trace(allUsers)
    
});
app.listen(port, () => {
    logger.log.info(`Example app listening on port ${port}`)
})