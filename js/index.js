let projects = [

]

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
        ]
    }
});