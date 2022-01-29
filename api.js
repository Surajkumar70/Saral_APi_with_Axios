const axios = require('axios');
const fs = require('fs')
const readline = (require('readline-sync'));
axios.get("http://saral.navgurukul.org/api/courses").then(function(response) {
    var con = (response.data.availableCourses);

    let list = [];
    let dope = 0;
    for (var i of con) {
        dope++
        console.log(dope, ":" + i.name)
        list.push(i.id)
    }
    let user = (require('readline-sync')).questionInt('Choose the course: ');
    var course_id = list[user - 1];
    axios.get("http://saral.navgurukul.org/api/courses/" + course_id + "/exercises").then(function(response) {
        let path = (response.data.data);

        var d = {};
        let count = 0;
        let slug_list = [];
        let child_slug_list = [];
        for (i of path) {
            count++
            console.log(count, ":" + i.name)
            d[count] = i.slug

            let code = 0;
            for (v of i.childExercises) {
                slug_list.push(v.slug)
                console.log("  ", count + '.' + code, v.name)
                d[count + '.' + code] = v.slug
                code++
            }
            child_slug_list.push(i.slug)
        }

        let sool = (require('readline-sync')).questionInt('Enter for parenet slug: ');
        for (let i in d) {
            if (i == sool) {
                axios.get("http://saral.navgurukul.org/api/courses/" + course_id + "/exercise/getBySlug?slug=" + d[i]).then(function(data) {
                    var con = (data.data.content);
                    let slugdata = JSON.parse(con)
                    const jsonData = JSON.stringify(JSON.parse(slugdata[0].split("\\").join("")));
                    fs.writeFileSync("slugdata.json", jsonData, (err) => {
                        console.log("done");
                    })

                });
            }
        }
    });

});