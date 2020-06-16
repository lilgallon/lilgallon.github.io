
let vue = new Vue({
    el: '#app',
    data: {
        /* GENERAL */
        version: "2020.2.0",

        /* SIDEBAR */
        specialProjects: [
            {
                name: "EzAPIs (organization)",
                description: "Github organization containing a compilation of useful and minimalist python APIs. Composed of ez-web-scraping: 🔐 A minimalist way to retrieve data from websites that require login & ez-progress-bar: 💤 A minimalist way to display a progress bar while running code.",
                language: "Python"
            }
        ],
        projects: [],
        projectsSearched: [],

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
        setTheme(theme) {
            this.theme = theme;
            localStorage.setItem('theme', this.theme);
            document.getElementById('theme').href = '/style/' + this.theme + '.css';
        },

        toggleTheme() {
            if (this.theme === 'dark') this.setTheme('light');
            else this.setTheme('dark');
        },
        moveAndFocusProject(delay=0) {

            setTimeout(function() {
                let focusedProjects = document.getElementsByClassName("focus");
                if (focusedProjects.length > 0) {
                    let focusedProject = focusedProjects[0];
                    focusedProject.classList.remove("focus");
                }

                // Move page to enchor
                let enchor = window.location.hash.substr(1);
                enchor = enchor.replace("%20", "_");
                let project_dom = document.getElementById(enchor);

                if (project_dom !== null) {
                    let project_y = project_dom.getBoundingClientRect().top + window.pageYOffset - 50;
                    window.scrollTo({top: project_y, behavior: 'smooth'});

                    // Change backgroundof focused project
                    project_dom.parentElement.classList.add("focus");
                }
            }, delay);
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

        /* MIDDLE CONTENT */
        updateRepos() {
            fetch("/data/repos.json")
            .then(async (response) => {
                let repos = await response.json();
                for(let repo of repos) {
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
        window.addEventListener('load', () => {
            this.moveAndFocusProject();
        });

        if (localStorage.getItem('theme') === 'dark') {
            this.setTheme('dark');
        } else {
            this.setTheme('light');
        }

        /* SIDEBAR */
        this.updateProjects();

        /* MIDDLE CONTENT */
        this.updateRepos();

        /* RIGHT CONTENT */
        // ...
    }
});
