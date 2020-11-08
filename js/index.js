
let vue = new Vue({
    el: '#app',
    data: {
        /* GENERAL */
        version: "2020.4.0",

        /* SIDEBAR */
        specialProjects: [
            {
                name: "EzAPIs (organization)",
                description: "Github organization containing a compilation of useful and minimalist python APIs. Composed of ez-web-scraping: 🔐 A minimalist way to retrieve data from websites that require login & ez-progress-bar: 💤 A minimalist way to display a progress bar while running code.",
                language: "Python"
            }
        ],
        projects: [],
        posts: [],
        projectsSearched: [],
        postsSearched: [],

        /* MIDDLE CONTENT */
        activitiesGH: [],
        activitiesGHcount: 0,
        reqSucceededSO: true,
        activitiesSO: [],
        activitiesSOcount: 0

        /* RIGHT CONTENT */
        // ...
    },
    methods: {
        /* GENERAL */
        union(a1, a2) {
            let a = [];

            for (let obj of a1) {
                a.push(obj);
            }

            for (let obj of a2) {
                a.push(obj);
            }

            return a;
        },

        /* SIDEBAR */
        updateProjects() {
            fetch("/data/repos.json")
            .then(async (response) => {
                let repos = await response.json();
                this.projects = repos;
                this.projectsSearched = repos;
            });
        },
        updateBlogPosts() {
            fetch("/data/posts.json")
            .then(async (response) => {
                let json = await response.json();
                this.posts = json.posts;
                this.postsSearched = json.posts;
            });
        },
        onProjectsSearch(event) {
            let search = event.target.value;

            let projects = this.union(this.projects, this.specialProjects);
            let newProjects = [];
            for (let project of projects) {
                let data = project.name + " " +
                           project.description  + " "
                           project.language;
                if (data.toLowerCase().includes(search.toLowerCase())) {
                    newProjects.push(project);
                }
            }
            this.projectsSearched = newProjects;
        },
        onPostsSearch(event) {
            // Search by date, author, title, content
            let search = event.target.value;
            let newPosts = []
            for (let post of this.posts) {
                let data = post.date + " " +
                           post.author + " " +
                           post.title;
                for (let paragraph of post.paragraphs) {
                    data += " " + paragraph;
                }

                if (data.toLowerCase().includes(search.toLowerCase())) {
                    newPosts.push(post);
                }
            }
            this.postsSearched = newPosts;
        },

        /* MIDDLE CONTENT */
        updateRecentStackOverflowActivity(increment) {
            this.activitiesSOcount += increment;
            axios.get("https://api.stackexchange.com/2.2/users/8811838/answers?order=desc&sort=activity&site=stackoverflow")
            .then((response) => {
                this.activitiesSO = [];
                for(let i = 0; i < this.activitiesSOcount; i++) {
                    let d = response.data.items[i];

                    if (d === undefined) break;

                    let activity = {
                        score: d.score,
                        date: new Date(d.creation_date*1000).toLocaleDateString("en-US"),
                        url: "https://stackoverflow.com/questions/" + d.question_id
                    }

                    this.activitiesSO.push(activity)
                }
            }).catch((error) => {
                console.warn("[StackExchange]: Too munch requests for that IP");
                console.warn("[StackExchange]: Stack Overflow data won't be shown");
                this.reqSucceededSO = false;
            });
        }

        /* RIGHT CONTENT */
        // ...
    },
    mounted() {
        /* GENERAL */
        // ...

        /* SIDEBAR */
        this.updateProjects();
        this.updateBlogPosts();

        /* MIDDLE CONTENT */
        this.updateRecentStackOverflowActivity(5);

        /* RIGHT CONTENT */
        // ...
    }
});
