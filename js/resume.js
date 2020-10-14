
let vue = new Vue({
    el: '#app',
    data: {
        /* GENERAL */
        version: "2020.3.1",

        /* SIDEBAR */
        // ...


        /* MIDDLE CONTENT */
        terms: [
            {
                name: "Fall",
                courses: [
                    {
                        title: "CSE115A: Introduction to Software Engineering",
                        description: "Emphasizes the characteristics of well-engineered software systems. Topics include requirements analysis and specification, design, programming, verification and validation, maintenance, and project management. Practical and research methods are studied. Imparts an understanding of the steps used to effectively develop computer software."
                    },
                    {
                        title: "CSE140: Introduction to Artificial Intelligence",
                        description: "Introduction to the contemporary concepts and techniques of artificial intelligence, including any or all of: machine perception and inference, machine learning, optimization problems, computational methods and models of search, game playing and theorem proving. Emphasis may be on any formal method of perceiving, learning, reasoning, and problem solving which proves to be effective. This includes both symbolic and neural network approaches to artificial intelligence. Issues discussed include symbolic versus nonsymbolic methods, local versus global methods, hierarchical organization and control, and brain modeling versus engineering approaches. Lisp or Prolog may be introduced. Involves one major project or regular programming assignments."
                    },
                    {
                        title: "CSE185E: Technical writing for Computer Engineers",
                        description: "Writing by engineers and computer scientists, not to general audiences, but to engineers, engineering managers, and technical writers. Exercises include job application and resume, in-code documentation, algorithm description, naive-user documentation, library puzzle, survey article, proposal, progress report, formal technical report, and oral presentation."
                    }
                ]
            },
            {
                name: "Winter",
                courses: [
                    {
                        title: "CSE115B: Software Design project I",
                        description: "Students in teams specify, design, construct, test, and document a complete software system in a specialized application domain. Class time is spent in technical discussions and ongoing design reviews. A formal presentation and demonstration of each project is required. An organizational meeting will be held during the preceding quarter. Projects may be drawn from industry and campus research groups."
                    },
                    {
                        title: "CSE160: Introduction to Computer Graphics",
                        description: "Introduces techniques of modeling, transformation, and rendering for computer-generated imagery. Topics: 2D/3D primitives, projections, matrix composition, and shading algorithms. Programming assignments and major project required. Students cannot receive credit for both this course and course 260 in quarters when they are offered concurrently."
                    },
                    {
                        title: "CSE160L: Introduction to Computer Graphics Lab",
                        description: "Complements course CSE160, gaining additional competence with a number of important software development tools, graphics libraries, and graphical user interfaces. Topics include OpenGL, WebGL, rubberbanding, picking, sliders, buttons, dialog, event handling, double buffering, lighting, shading, materials, and textures."
                    }
                ]
            },
            {
                name: "Spring",
                courses: [
                    {
                        title: "CSE115C: Software Design project II",
                        description: "Continuation of course CSE115B. Students work in teams to develop, test, document, and deploy a substantial software project. Teams give a formal presentation and demonstration of each project."
                    },
                    {
                        title: "CSE183: Web Applications",
                        description: "The World-Wde Web is one of the main mechanisms by which computer applications are delivered to users. This course introduces the design of Web applications. Students learn the main technologies involved, and build web applications as part of homework assignments and group class projects."
                    },
                    {
                        title: "CSE142: Introduction to Machine Learning",
                        description: "Introduction to machine learning algorithms and their applications. Topics include classification learning, density estimation and Bayesian learning regression, and online learning. Provides introduction to standard learning methods such as neural networks, decision trees, boosting, and nearest neighbor techniques."
                    }
                ]
            }
        ]

        /* RIGHT CONTENT */
        // ...
    },
    methods: {
        /* GENERAL */
        // ...

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
