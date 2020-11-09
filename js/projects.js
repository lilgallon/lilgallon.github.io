
let vue = new Vue({
    el: '#app',
    data: {
        /* GENERAL */
        version: "2020.4.0",
        days: 30,
        totalStars: 0,
        totalWatchers: 0,
        totalForks: 0,
        totalIssues: 0,
        userData: {},

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
            },
            {
                name: "AimAssistanceMod",
                image: "https://github.com/N3ROO/AimAssistanceMod/raw/MC_1.16.3/.github/images/aimassistancemod.png",
                university: false,
                released: true,
                indev: false
            },
            {
                name: "QuickSearchMod",
                image: "https://github.com/N3ROO/QuickSearchMod/raw/MC_1.16.3/.github/resources/quicksearch.png",
                university: false,
                released: true,
                indev: false
            },
            {
                name: "HorseStatsMod",
                image: "https://github.com/N3ROO/HorseStatsMod/raw/MC_1.16.3/.github/resources/horsestatsmod.png",
                university: false,
                released: true,
                indev: false
            },
            {
                name: "AnvilTooltipMod",
                image: "https://github.com/N3ROO/AnvilTooltipMod/raw/MC_1.16.3/.github/resources/anviltooltipmod.png",
                university: false,
                released: true,
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
        // ...,
        moveAndFocusProject(delay=0) {

            setTimeout(() => {
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
                else if (enchor != "")
                {
                    let msg = '<strong>The project ' + enchor + ' is not on this page</strong>';

                    let project = null;
                    for (let repos of [this.nrepos_details, this.mrepos_details])
                        for (let repo of repos)
                            if (repo.api.name === enchor) {project = repo; break; }

                    if (project != null)
                    {
                        msg += ' <a target="_blank" href="' + project.api.html_url + '" class="text-black" style="text-decoration:underline">Click here</a> to go to the project\'s page'
                    }
                    else
                    {
                        msg += ' The project does not exist, did you write the url by yourself?'
                    }

                    document.querySelector("#project-alert").style.display = 'block';
                    document.querySelector("#project-alert-message").innerHTML = msg;

                    console.log("The project " + enchor + " has not been updated recently");
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

                    this.totalStars += repo.stars;
                    this.totalForks += repo.forks;
                    this.totalWatchers += repo.watchers;
                    this.totalIssues += repo.open_issues.length;

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

                this.moveAndFocusProject();
            });

            fetch("/data/user.json")
            .then(async (response) =>
            {
                this.userData = await response.json();
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
        this.updateProjects();

        /* MIDDLE CONTENT */
        this.updateRepos();

        /* RIGHT CONTENT */
        // ...
    }
});
