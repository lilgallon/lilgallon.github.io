
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
        // ...

        /* SIDEBAR */
        //...

        /* MIDDLE CONTENT */
        // ...

        /* RIGHT CONTENT */
        // ...
    }
});
