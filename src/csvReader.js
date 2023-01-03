const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const { unless } = require("express-unless");
const cron = require('node-cron');
const port = process.env.PORT || 3001
const axios = require('axios');



const auth = require('./helpers/jwt.js');const errors = require('./helpers/errorHandler.js')
const logger = require('./logging/logger.js');
const Properties = require('./models/PropertiesModel')

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


app.use(errors.errorHandler); // middleware for error responses

// MongoDB connection, success and error event responses
const uri = process.env.DB_CONNECTION;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, autoIndex: true });
const db = mongoose.connection;
db.on('error', () => logger.log.error('connection error:'));
db.once('open', () => logger.log.info(`Connected to mongo at ${uri}`));

const fs = require('fs')
const path = require('path')
const fastCsv = require('fast-csv')
const data = []
const readCSV = async (csvFilePath) => {
  const readData = fs.createReadStream(csvFilePath)
  var rowNo = 0;
  readData
    .pipe(fastCsv.parse())
    .on('data', (row) => {
      if(rowNo > 0)
        data.push(row)
        console.log('transformerId:', row[0])
        console.log('timeStamp:', row[1])
        console.log('topOilTemperatureC:', row[2])
        console.log('bottomOilTemperatureC:', row[3])
        console.log('phaseCurR:', row[4])
        console.log('phaseCurY:', row[5])
        console.log('phaseCurB:', row[6])
        console.log('phaseVolR:', row[7])
        console.log('phaseVolY:', row[8])
        console.log('phaseVolB:', row[9])
        console.log('neutralCur:', row[10])
        console.log('EarthToNeutralVol:', row[11])
        console.log('humidity:', row[12])
        console.log('powerFactor:', row[13])

      console.log('\n')
      rowNo++;
    })
    .on('end', async (rowCount) => {
      console.log(`${rowCount} rows parsed!`)
        //  console.log(data)
        for(var i in data){
          // console.log(data[i])
          // const properties = new Properties(data[i])
          const properties = new Properties()
          properties.transformerId = data[i][0]
          properties.timeStamp = data[i][1]
          properties.topOilTemperatureC = data[i][2]
          properties.bottomOilTemperatureC = data[i][3]
          properties.phaseCurR = data[i][4]
          properties.phaseCurY = data[i][5]
          properties.phaseCurB = data[i][6]
          properties.phaseVolR = data[i][7]
          properties.phaseVolY = data[i][8]
          properties.phaseVolB = data[i][9]
          properties.neutralCur = data[i][10]
          properties.earthToNeutralVol = data[i][11]
          properties.humidity = data[i][12]
          properties.powerFactor = data[i][13]
          console.log(properties)
          let payload = properties;

          let res = await axios.post('http://localhost:3000/transformer_data/properties/add', payload);

          console.log(res.data);

        }
      })
    .on('error', (e) => console.error(e))
}
const pathCsv = path.resolve(__dirname, 'tData.csv')
//Uploading data:
try{
    readCSV(pathCsv)
    
}
catch(err){
    console.log(err);
}

app.listen(port, () => {
    logger.log.info(`Example app listening on port ${port}`)
})