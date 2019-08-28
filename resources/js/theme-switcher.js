/**********************************************************/
/* Here goes all the code that is common to all the pages */
/**********************************************************/

// executes when HTML-Document is loaded and DOM is ready
document.addEventListener("DOMContentLoaded", function (event) {
    // By default, the switcher is off and the theme is "original"
    let theme_switcher = document.getElementById("theme-switcher");
    theme_switcher.addEventListener('change', function(){
        if(this.checked) {
            // light theme
        } else {
            // original theme
        }
    })
});