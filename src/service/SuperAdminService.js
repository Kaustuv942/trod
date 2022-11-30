const { Console } = require('winston/lib/winston/transports');
const College = require('../models/CollegeModel')
const adminService = require('../service/AdminService')
const userServices = require('../service/UserService')

async function getDashboardByColleges(days) {

    const teachers = await adminService.getretiringteachersbydaysx(days);


    const groupBy = (x, f) => x.reduce((a, b) => ((a[f(b)] ||= []).push(b), a), {});


    var newteachers = groupBy(teachers, v => v.collegeName);
    var temp = []
   
    for (let key in newteachers) {
        let totcurvacancies = 0
        let totpendingvacancies = 0
        var mbj = { "collegeName": newteachers[key][0].collegeName, "collegeId": newteachers[key][0].collegeId };
        const groupBy = (x, f) => x.reduce((a, b) => ((a[f(b)] ||= []).push(b), a), {});

        var depteachers = groupBy(newteachers[key], v => v.department);
        var tmp = [];
        for (let k in depteachers) {
            var depteachs = depteachers[k];
            var curvacancies = depteachs.length;
            totcurvacancies+=curvacancies;
            let depname = depteachers[k][0].department;

            var pendvac = [];
            for (let i = 0; i < depteachs.length; i++) {
                if (depteachs[i].exit == "pending") {
                    pendvac.push(depteachs[i]);
                }
            }
            var pendingVacanciesCount = pendvac.length;
            totpendingvacancies+=pendingVacanciesCount;
            var obj = { "department": depname, "currentVacCount": curvacancies, "pendingVacancies": pendvac,"pendingVacCount":pendingVacanciesCount }
            tmp.push(obj);

        }

        mbj.vacancies = tmp;
        mbj.totpendingvacancies=totpendingvacancies;
        mbj.totcurvacancies=totcurvacancies;
        temp.push(mbj)

    }
    console.log(temp)

        return temp

    }
    async function getDashboardByLocations(days) {
    
        const teachers = await adminService.getretiringteachersbydaysx(days);
      
        const colleges=College.find();
        for(let i=0;i<teachers.length;i++)
        {
            for(let j=0;j<colleges.length;j++)
            {
                if(teachers[i].collegeName===colleges[j].name)
                {
                        
                    teachers[i].location=colleges[j].location;
                }
            }
        }
        console.log(teachers)

        const groupBy = (x, f) => x.reduce((a, b) => ((a[f(b)] ||= []).push(b), a), {});


        var newteachers = groupBy(teachers, v => v.location);
        var temp = []
        let totcurvacancies = 0
        let totpendingvacancies = 0
        for (let key in newteachers) {
            var mbj = { "location": newteachers[key][0].location};
            const groupBy = (x, f) => x.reduce((a, b) => ((a[f(b)] ||= []).push(b), a), {});

            var depteachers = groupBy(newteachers[key], v => v.collegeName);
            var tmp = [];
            for (let k in depteachers) {
                var depteachs = depteachers[k];
                var curvacancies = depteachs.length;
                totcurvacancies+=curvacancies;

                let clgname = depteachers[k][0].collegeName;

                var pendvac = [];
                for (let i = 0; i < depteachs.length; i++) {
                    if (depteachs[i].exit == "pending") {
                        pendvac.push(depteachs[i]);
                    }
                }
                var pendingVacanciesCount = pendvac.length;
                totpendingvacancies+=pendingVacanciesCount;
                var obj = { "college":clgname, "currentVacCount": curvacancies, "pendingVacancies": pendvac,"pendingVacCount":pendingVacanciesCount }
                tmp.push(obj);

            }
            mbj.vacancies = tmp;
            mbj.totpendingvacancies=totpendingvacancies;
            mbj.totcurvacancies=totcurvacancies;
            temp.push(mbj)

        }
        return temp;
    }

    async function getDashboardByCollegeAndDepartment(days, collegeId, department) {
        const newteachs = await adminService.getretiringteachersbydaysx(days);
        const teachers = newteachs.filter(check)
        function check(teacher) {
            return teacher.collegeId == collegeId && teacher.department == department;
        }
        console.log(teachers)

        const groupBy = (x, f) => x.reduce((a, b) => ((a[f(b)] ||= []).push(b), a), {});


        var newteachers = groupBy(teachers, v => v.collegeName);
        var temp = []
        let totcurvacancies = 0
        let totpendingvacancies = 0
        for (let key in newteachers) {
            var mbj = { "collegeName": newteachers[key][0].collegeName, "collegeId": newteachers[key][0].collegeId };
            const groupBy = (x, f) => x.reduce((a, b) => ((a[f(b)] ||= []).push(b), a), {});

            var depteachers = groupBy(newteachers[key], v => v.department);
            var tmp = [];
            for (let k in depteachers) {
                var depteachs = depteachers[k];
                var curvacancies = depteachs.length;

                let depname = depteachers[k][0].department;

                var pendvac = [];
                for (let i = 0; i < depteachs.length; i++) {
                    if (depteachs[i].exit == "pending") {
                        pendvac.push(depteachs[i]);
                    }
                }
                var pendingVacanciesCount = pendvac.length;
                var obj = { "department": depname, "currentVacCount": curvacancies, "pendingVacancies": pendvac,"pendingVacCount":pendingVacanciesCount }
                tmp.push(obj);

            }
            mbj.vacancies = tmp;
            temp.push(mbj)

        }
        return temp;
    }

    module.exports = {
        getDashboardByColleges,
        getDashboardByCollegeAndDepartment,
        getDashboardByLocations
    };