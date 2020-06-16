
let vue = new Vue({
    el: '#app',
    data: {
        /* GENERAL */
        version: "2020.2.0",

        /* SIDEBAR */
        // ...


        /* MIDDLE CONTENT */
        // ...

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
        }

        /* SIDEBAR */
        //...

        /* MIDDLE CONTENT */
        // ...

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
        // ...

        /* RIGHT CONTENT */
        // ...
    }
});
