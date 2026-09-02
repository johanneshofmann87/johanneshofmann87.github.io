/*
    Marks the current page in both navigations.

    Done in script rather than by hand-editing a class into each page's markup
    because util.js rebuilds the mobile slide-out menu from #nav and copies only
    `href` and `target` -- a class on the source <li> never reaches #navPanel.
    Deriving it from the URL also means the indicator keeps working if a page is
    renamed, and it handles a directory-style URL (".../" with no filename),
    which is how the site will be served from GitHub Pages.

    Progressive enhancement: with JS off there is simply no indicator.
*/
(function() {
    function currentFile() {
        var last = window.location.pathname.split('/').pop();
        return last === '' ? 'index.html' : last;
    }

    function markActiveNav() {
        var here = currentFile();
        var links = document.querySelectorAll('#nav a[href], #navPanel a[href]');
        Array.prototype.forEach.call(links, function(a) {
            var href = (a.getAttribute('href') || '').split('#')[0].split('/').pop();
            if (!href || href !== here) return;
            a.classList.add('is-current');
            a.setAttribute('aria-current', 'page');
            // The desktop nav styles the <li>, so flag the parent too.
            if (a.parentElement && a.parentElement.tagName === 'LI') {
                a.parentElement.classList.add('is-current');
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        markActiveNav();
        // #navPanel is built by main.js from a <script> at the end of <body>, so
        // it normally exists by now; retry once in case that ordering changes.
        if (!document.querySelector('#navPanel a.is-current')) {
            window.setTimeout(markActiveNav, 200);
        }
    });
})();
