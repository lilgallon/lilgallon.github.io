
let vue = new Vue({
    el: '#app',
    data: {
        /* GENERAL */
        version: "2020.2.0",

        /* SIDEBAR */
        // ...

        /* MIDDLE CONTENT */
        posts: []

        /* RIGHT CONTENT */
        // ...
    },
    methods: {
        /* GENERAL */
        setTheme(theme) {
            this.theme = theme;
            localStorage.setItem('theme', this.theme);
            document.getElementById('theme').href = '/style/' + this.theme + '.css';
        },

        toggleTheme() {
            if (this.theme === 'dark') this.setTheme('light');
            else this.setTheme('dark');
        },

        /* SIDEBAR */
        //...

        /* MIDDLE CONTENT */
        updatePosts() {
            fetch("/data/posts.json")
            .then(async (response) => {
                let json = await response.json();
                this.posts = json.posts;
            });
        }

        /* RIGHT CONTENT */
        // ...
    },
    mounted() {
        /* GENERAL */
        if (localStorage.getItem('theme') === 'dark') {
            this.setTheme('dark');
        } else {
            this.setTheme('light');
        }

        /* SIDEBAR */
        //...

        /* MIDDLE CONTENT */
        this.updatePosts();

        /* RIGHT CONTENT */
        // ...
    }
});
