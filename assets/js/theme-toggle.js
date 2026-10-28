(function() {
    // 1. Determine initial theme (default to dark if not set, since the user likes the dark theme for now)
    const savedTheme = localStorage.getItem('theme');
    let theme = 'dark'; // default theme is dark as preferred by the user

    if (savedTheme) {
        theme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        theme = 'light';
    }

    // Apply theme to html element immediately (prevents flashing)
    document.documentElement.setAttribute('data-theme', theme);

    // Helper to update every toggle's icon and label
    function updateToggleIcons(activeTheme) {
        const goingToLight = activeTheme === 'dark';
        document.querySelectorAll('.theme-toggle-icon').forEach(icon => {
            icon.className = 'theme-toggle-icon icon solid '
                + (goingToLight ? 'fa-sun' : 'fa-moon');
        });
        // The mobile entry is a labelled link, so it says what the tap will do.
        document.querySelectorAll('.theme-toggle-label').forEach(label => {
            label.textContent = goingToLight ? 'Light mode' : 'Dark mode';
        });
    }

    function applyTheme(newTheme) {
        document.documentElement.setAttribute('data-theme', newTheme);
        try {
            localStorage.setItem('theme', newTheme);
        } catch (e) {
            // Private browsing / blocked storage: the toggle still works for
            // this page view, it just will not be remembered.
        }
        updateToggleIcons(newTheme);
    }

    // 2. One delegated listener covers every toggle, including the mobile one
    //    that is injected below after main.js has built the panel. It listens
    //    in the capture phase: util.js's panel() calls stopPropagation() on
    //    every click inside #navPanel, so a bubbling listener on document never
    //    saw taps on the mobile entry.
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.theme-toggle-btn, .theme-toggle-link');
        if (!btn) return;
        e.preventDefault();
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        applyTheme(current === 'dark' ? 'light' : 'dark');
    }, true);

    // 3. Add the toggle to the mobile slide-out menu.
    //    main.js builds #navPanel from $('#nav').navList(), and navList() only
    //    collects <a> elements -- so the desktop toggle, being a <button>, was
    //    silently dropped and the theme could not be switched on any screen
    //    below 840px (where main.css hides #header entirely).
    //    panel()'s hideOnClick handler returns early for href="#", so this entry
    //    toggles without navigating or closing the menu.
    function addMobileToggle() {
        const nav = document.querySelector('#navPanel nav');
        if (!nav || nav.querySelector('.theme-toggle-link')) return;
        const a = document.createElement('a');
        a.className = 'link depth-0 theme-toggle-link';
        a.href = '#';
        a.setAttribute('role', 'button');
        a.setAttribute('aria-label', 'Toggle colour theme');
        a.innerHTML = '<span class="indent-0"></span>'
            + '<span class="theme-toggle-icon icon solid fa-moon"></span>'
            + '<span class="theme-toggle-label">Dark mode</span>';
        nav.appendChild(a);
        updateToggleIcons(document.documentElement.getAttribute('data-theme') || 'dark');
    }

    document.addEventListener('DOMContentLoaded', () => {
        updateToggleIcons(theme);
        addMobileToggle();
        // main.js runs from a <script> at the end of <body>, so #navPanel
        // normally exists by now; retry once in case ordering ever changes.
        if (!document.querySelector('#navPanel .theme-toggle-link')) {
            window.setTimeout(addMobileToggle, 200);
        }
    });
})();
