
let vue = new Vue({
    el: '#app',
    data: {
        projects: [
            {name: "project1", icon: "fas fa-user"},
            {name: "project2", icon: "fas fa-user-graduate"}
        ],
        posts: [
            {name: "Post1", icon: "fas fa-newspaper"},
            {name: "Post2", icon: "fas fa-newspaper"}
        ],
        activities: [],
        activitiesC: 0
    },
    methods: {
        updateRecentActivity(increment) {
            this.activitiesC += increment
            axios.get("https://api.github.com/users/N3ROO/events/public")
            .then((response) => {
                this.activities = [];
                for(let i = 0; i < this.activitiesC; i ++) {
                    let d = response.data[i];

                    let activity = {
                        repo_url: d.repo.url,
                        repo_name: d.repo.name,
                        type: d.type.replace("Event", ""),
                        date: new Date(d.created_at).toLocaleString()
                    }

                    this.activities.push(activity);
                }
            });
        }
    },
    mounted() {
        this.updateRecentActivity(5)
    }
});
