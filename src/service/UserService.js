const User = require('../models/UserModel')
const Admin=require('../models/AdminModel')
const Profile = require('../models/ProfileModel')
const bcrypt = require('bcryptjs');
const auth = require('../helpers/jwt.js')
const { v4: uuidv4 } = require('uuid');
const logger = require('../logging/logger');



async function login({ email, password }) {
    const user = await User.findOne({email});
    const admin = await Admin.findOne({email});
    var isAdmin;
    var isSuperAdmin;
    if(admin)
    {
        
        if(admin.role=="superadmin")
        {
            isSuperAdmin=true;
            isAdmin=true;
        }
        else
        {
            isAdmin=true;
            isSuperAdmin=false;
        }
        
    }
    else{
        isAdmin=false;
        isSuperAdmin=false;
    }
    console.log(isSuperAdmin)
    
    // synchronously compare user entered password with hashed password
    if(user && bcrypt.compareSync(password, user.password)){
        const token = auth.generateAccessToken(email);
        // call toJSON method applied during model instantiation
        return {...user.toJSON(), token,"isAdmin":isAdmin,"isSuperAdmin":isSuperAdmin}
    }
}

function register(params, res){
    const user = new User(params)
    user.profileId = uuidv4(); 
    user
        .save()
        .then(() => {
            profile = new Profile({profileId : user.profileId});
            profile.save();
            // res.json({success:true});
        } )
        .catch((err) => {
            // res.status(400).json({success:false, msg:err});
        });
}
async function getAllUsers(){
    return await User.find();
}

async function updateUser(user){
    const updatedUser = await User.findOneAndUpdate({email: user.email}, user,{
        new: true
      });
    console.log(updatedUser)
    // logger.log.trace("Updated as the following model: ")
    // logger.log.trace(updatedUser);
    return updatedUser;
}

async function getById(id) {
    const user = await User.findById(id);
    return user.toJSON()
}

async function getUserByProfileId(profileId){
    const user = await User.findOne({profileId:profileId});
    return user;
}
async function getAllTeachers()
{
    const newteachers=await User.find({exit:"none"});
    const teachers=newteachers.filter(checknotadmin)
    function checknotadmin(newteacher)
    {
        return (newteacher.email!="admin@nitdgp.com"&&newteacher.email!="superadmin@aicte.com"&&newteacher.email!="admin@nitk.com")
    }
    return teachers
}
async function getAllTeachersX()
{
    const newteachers=await User.find();
    const teachers=newteachers.filter(checknotadmin)
    function checknotadmin(newteacher)
    {
        return (newteacher.email!="admin@nitdgp.com"&&newteacher.email!="superadmin@aicte.com"&&newteacher.email!="admin@nitk.com")
    }
    return teachers
}

async function getCollegeTeachers(collegeId){ 
    console.log(collegeId)
    const newteachers=await User.find({collegeId:collegeId, exit:{$ne:"exit"}});
    const teachers=newteachers.filter(checknotadmin)
    function checknotadmin(newteacher)
    {
        return (newteacher.email!="admin@nitdgp.com"&&newteacher.email!="superadmin@aicte.com"&&newteacher.email!="admin@nitk.com")
    }
    return teachers; 
}

async function changePassword(){
    const users = await User.find();
    for(let i = 0; i < users.length; i++){
        users[i].password = 'password'
        const salt = bcrypt.genSaltSync(10);
        users[i].password = bcrypt.hashSync(password, salt);
        users[i].save()
    }
}

const collegeName = {1:"National Institute of Technology Durgapur", 2: "National Institute of Technology Surathkal", 3:"Indian Institute of Technology Bombay", 4:"National Institute of Technology, Rourkela", 5:"Indian Institute of Technology (Banaras Hindi University), Varanasi", 6:"Indian Institute of Technology, Kharagpur", 8:"Indian Institute of Technology, Delhi", 9:"Delhi Technological University, Delhi", 10:"National Institute of Technology, Bhopal", 11:"Indian Institute of Technology, Roorkee", 12:"Indian Institute of Technology, Guwahati"}

const positions = ["Professor", "Assisstant Professor", "Associate Professor", "Visiting Lecturer"]

const departments = ["Electrical Engineering", "Computer Science and Engineering", "Metallurgical and Materials Engineering", "Civil Engineering", "Chemical Engineering", "Electronics and Communication Engineering", "Mechanical Engineering", "Aerospace Engineering", "Biotechnology", "Production Engineering", "Instrumentation Engineering", "Food Technology", "Electronics and Instrumentation Engineering", "Electrical and Electronics Engineering", "Automobile Engineering"] 
async function fillUsers(){
    for(let i = 0; i < 20; i++){
        const email = 'abc' + (i).toString() + 'new@gmail.com'
        const salt = bcrypt.genSaltSync(10);
        const password = bcrypt.hashSync("password", salt);
        const user = User({
            "email": email,
            "password": password,
            "dob":'196' + (3 + i%3).toString() +  '-0'+ (i%9 + 1)+'-01',
            "isOpenToWork": true,
            "firstName": 'Ramyanil' + i,
            "lastName": 'Raha',
            "position": positions[i%4],
            "department": departments[i%12],
            "collegeName": collegeName[i%11 + 1],
            "collegeId": (i%11 + 1),
            "phoneNumber": '1231231231',
            "dateJoined": '2012-12-04'             

        })
        register(user);
        console.log(user);
    }
}
const locations = {1:"West Bengal", 2: "Karnataka", 3:"Maharashtra", 4:"Orissa", 5:"Varanasi", 6:"West Bengal", 8:"Delhi", 9:"Delhi", 10:"Madhya Pradesh", 11:"Uttarakhand", 12:"Assam"}
async function modLocations(){
    const allUsers = await User.find();
    for(let i = 0; i <allUsers.length; i++){
        allUsers[i].location = locations[allUsers[i].collegeId];
        updateUser(allUsers[i]);
    }
}

module.exports = {
    login,
    register,
    getById,
    getAllUsers,
    updateUser,
    getUserByProfileId,
    getAllTeachers,
    getCollegeTeachers,
    changePassword,
    fillUsers,
    modLocations,
    getAllTeachersX
};