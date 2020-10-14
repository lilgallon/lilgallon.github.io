
let vue = new Vue({
    el: '#app',
    data: {
        /* GENERAL */
        version: "2020.3.1",

        /* SIDEBAR */
        // ...

        /* MIDDLE CONTENT */
        posts: []

        /* RIGHT CONTENT */
        // ...
    },
    methods: {
        /* GENERAL */
        // ...,

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
        // ...

        /* SIDEBAR */
        //...

        /* MIDDLE CONTENT */
        this.updatePosts();

        /* RIGHT CONTENT */
        // ...
    }
});
