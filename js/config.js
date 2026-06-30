const CONFIG = {

    // Wird automatisch erkannt
    BASE: (() => {

        const path = window.location.pathname;

        // GitHub Pages
        if (path.startsWith("/weltPokal/")) {
            return "/weltPokal/";
        }

        // Live Server
        return "/";

    })()

};