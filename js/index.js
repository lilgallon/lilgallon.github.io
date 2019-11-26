
let vue = new Vue({
    el: '#app',
    data: {
        version: "2019.1.0b",
        projects: [
            {name: "project1", icon: "fas fa-user"},
            {name: "project2", icon: "fas fa-user-graduate"}
        ],
        posts: [
            {name: "Post1", icon: "fas fa-newspaper"},
            {name: "Post2", icon: "fas fa-newspaper"}
        ],
        activitiesGH: [],
        activitiesGHcount: 0,
        activitiesSO: []
    },
    methods: {
        updateRecentGithubActivity(increment) {
            this.activitiesGHcount += increment
            axios.get("https://api.github.com/users/N3ROO/events/public")
            .then((response) => {
                this.activitiesGH = [];
                for(let i = 0; i < this.activitiesGHcount; i ++) {
                    let d = response.data[i];

                    if (d === undefined) break;

                    let activity = {
                        repo_url: d.repo.url.replace("api.github.com/repos/", "github.com/"),
                        repo_name: d.repo.name,
                        type: d.type.replace("Event", ""),
                        date: new Date(d.created_at).toLocaleString()
                    }

                    this.activitiesGH.push(activity);
                }
            });
        },
        updateRecentStackOverflowActivity(){
            axios.get("https://api.stackexchange.com/2.2/users/8811838/answers?order=desc&sort=activity&site=stackoverflow")
            .then((response) => {
                this.activitiesSO = [];
                for(let i = 0; i < 12; i++) {
                    let d = response.data.items[i];

                    if (d === undefined) break;

                    let activity = {
                        score: d.score,
                        date: new Date(d.creation_date*1000).toLocaleDateString("en-US"),
                        url: "https://stackoverflow.com/questions/" + d.question_id
                    }

                    this.activitiesSO.push(activity)
                }
            })
        }
    },
    mounted() {
        this.updateRecentGithubActivity(5);
        this.updateRecentStackOverflowActivity();
    }
});
