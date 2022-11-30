const Vacancy = require('../models/VacancyModel');
const Subscription = require('../models/SubscriptionModel');
const User = require('../models/UserModel')
const { v4: uuidv4 } = require('uuid');

async function createVacancy(params){

    var{position,department,college,email,collegeId, location, minimumQualification, minimumExperience, compensation}=params;
    const exvacancies= await Vacancy.find({position,department,college,minimumQualification, minimumExperience, compensation});
    
    // console.log(exvacancies.length)
    const teacher = await User.findOneAndUpdate({email}, {
        exit:"exit"
    })
    console.log(exvacancies)
    if(exvacancies.length==0)
    {
        const vacancy = new Vacancy(params);
        vacancy.vacancyId = uuidv4();
        vacancy.emailProfReplaced = email;
        vacancy.collegeId = collegeId;
        vacancy.location = location;
        vacancy.minimumQualification = minimumQualification;
        vacancy.minimumExperience = minimumExperience;
        vacancy.compensation = compensation;
        vacancy.status = "open";
        vacancy.dateCreated = Date.now();
        console.log(vacancy)
        vacancy
            .save()
    }
    else{
        const exvacancyId=exvacancies[0].vacancyId;
        const vacancy=await Vacancy.findOneAndUpdate({"vacancyId":exvacancyId},{$inc : {'numberOfVacancies' : 1}});
        console.log(vacancy)
    }
  
}

async function createTeacher(teacher){
    //TODO: send random password to the teacher
    const User = teacher
}

async function closeVacancyById(vacancyId)
{
  const vacancy = await Vacancy.findOne({vacancyId: vacancyId});
  vacancy.status = "filled";
  await Vacancy.findOneAndUpdate({vacancyId:vacancyId}, vacancy)
  return (vacancy);
}

async function getAll()
{
    const vacancies = await Vacancy.find();
    return vacancies;
}

async function getOngoingVacancies(collegeId){
    // gets all the vacancy posting for this specific college
    const vacancies = await Vacancy.find({collegeId, status:"open"})
    return vacancies;
}

async function getCompletedVacancies(collegeId){
    const vacancies = await Vacancy.find({collegeId, status:"completed"})
    return vacancies;
}

async function deleteVacancyById(vacancyId){
    const vacancy = await Vacancy.deleteOne({vacancyId: vacancyId});
    return (vacancy);
}
async function getById(user)
{
  
    const profile=await User.find({email:user.data});
    const profileId=profile[0].profileId
    const subscriptions=await Subscription.find({profileId});
    const vacancies = await Vacancy.find();
    let st = new Set();
    for(let i=0;i< subscriptions.length;i++)
    {
        for(let j=0;j<vacancies.length;j++)
        {
            if(vacancies[j].department==subscriptions[i].department && (subscriptions[i].colleges.includes(vacancies[j].college)))
                {
                    st.add(vacancies[j])
                }
        }                                       
    }
    return Array.from(st);
    
}

async function getVacancyById(vacancyId){
    const vacancy = await Vacancy.findOne({vacancyId: vacancyId});
    return vacancy;
}

async function markCompleted(vacancyId){
    const vacancy = await Vacancy.findOneAndUpdate({vacancyId}, {
        status:"completed"
    })
    return vacancy;
}

module.exports = {
   getAll,
   getById,
   createVacancy,
   closeVacancyById,
   deleteVacancyById,
   getVacancyById,
   getCompletedVacancies,
   getOngoingVacancies,
   markCompleted
  };