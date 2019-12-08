
let vue = new Vue({
    el: '#app',
    data: {
        /* GENERAL */
        version: "2019.1.1",

        /* SIDEBAR */
        // ...

        /* MIDDLE CONTENT */
        mrepos : [
            {
                name: "Bettercolors",
                image: "/resources/images/showcase/showcase_bettercolors.png",
                university: false,
                released: true,
                indev: true
            },
            {
                name: "particles.js",
                image: "/resources/images/showcase/showcase_particles.png",
                university: false,
                released: true,
                indev: false
            },
            {
                name: "javafx-nero-engine",
                image: "/resources/images/showcase/showcase_nero_engine.png",
                university: false,
                released: false,
                indev: true
            },
            {
                name: "music-genre-finder",
                image: "/resources/images/showcase/showcase_music_genre_finder.png",
                university: false,
                released: false,
                indev: true
            },
            {
                name: "Cascade",
                image: "/resources/images/showcase/showcase_cascade.png",
                university: true,
                released: true,
                indev: false
            },
            {
                name: "Fractals_explorer",
                image: "/resources/images/showcase/showcase_fractals.png",
                university: true,
                released: true,
                indev: false
            },
            {
                name: "opengl-nero-engine",
                image: "/resources/images/showcase/showcase_nero_engine.png",
                university: false,
                released: false,
                indev: false
            }
        ],

        mrepos_details: [],
        nrepos_details: []

        /* RIGHT CONTENT */
        // ...
    },
    methods: {
        /* GENERAL */
        // ...

        /* SIDEBAR */
        //...

        /* MIDDLE CONTENT */
        updateRepos() {
            axios.get("https://api.github.com/users/N3ROO/repos")
            .then((response) => {
                for(let repo of response.data) {
                    let result = this.isMainRepo(repo.name);
                    let is_main_repo = result[0];
                    let repo_details = result[1];

                    let creationDate = new Date(repo.updated_at);
                    let currentDate = new Date();
                    let diff = Math.abs(currentDate.getTime() - creationDate.getTime());
                    let days = Math.ceil(diff / (1000 * 3600 * 24)) + 1;

                    if(is_main_repo) {
                        this.mrepos_details.push({
                            api: repo,
                            last_update: days,
                            details: repo_details
                        })
                    } else {
                        this.nrepos_details.push({
                            api: repo,
                            last_update: days
                        })
                    }
                }
            });
        },
        isMainRepo(repo_name) {
            let found = false;
            let index = 0;

            let result = {};

            while(!found && index < this.mrepos.length) {
                repo = this.mrepos[index];
                if(repo.name === repo_name) {
                    found = true;
                    result = repo;
                } else {
                    index ++;
                }
            }

            return found ? [true, result] : [false, result];
        }

        /* RIGHT CONTENT */
        // ...
    },
    mounted() {
        /* GENERAL */
        // ...

        /* SIDEBAR */
        //...

        /* MIDDLE CONTENT */
        this.updateRepos();

        /* RIGHT CONTENT */
        // ...
    }
});
