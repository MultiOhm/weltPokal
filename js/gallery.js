document.addEventListener("DOMContentLoaded", () => {

    let selectedCountry = "all";
    let selectedYear = "all";
    let selectedType = "all";

    // -----------------------
    // Länder
    // -----------------------

    document.querySelectorAll(".flag-btn").forEach(button => {

        button.addEventListener("click", () => {

            document.querySelectorAll(".flag-btn")
                .forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

            selectedCountry = button.dataset.country;

            filterCards();

        });

    });

    // -----------------------
    // Turniere
    // -----------------------

    document.querySelectorAll(".year-btn").forEach(button => {

        button.addEventListener("click", () => {

            document.querySelectorAll(".year-btn")
                .forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

            selectedYear = button.dataset.year;

            filterCards();

        });

    });

    // -----------------------
    // Trikottyp
    // -----------------------

    document.querySelectorAll(".type-btn").forEach(button => {

        button.addEventListener("click", () => {

            document.querySelectorAll(".type-btn")
                .forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

            selectedType = button.dataset.type;

            filterCards();

        });

    });

    // -----------------------
    // Filterfunktion
    // -----------------------

    function filterCards() {

        const cards = document.querySelectorAll(".kit");

        let visible = 0;

        cards.forEach(card => {
            

            let show = true;

            if (
                selectedCountry !== "all" &&
                card.dataset.country !== selectedCountry
            ) {
                show = false;
            }

            if (
                selectedYear !== "all" &&
                card.dataset.year !== selectedYear
            ) {
                show = false;
            }

            if (
                selectedType !== "all" &&
                card.dataset.type !== selectedType
            ) {
                show = false;
            }

            if (show) {
                
                card.hidden = false;
                visible++;

            } else {

                card.hidden = true;

            }

        });

        updateCounter(visible);

    }

    // -----------------------
    // Zähler
    // -----------------------

    function updateCounter(count) {

        const counter = document.getElementById("result-count");

        if (!counter) return;

        if (count === 1) {

            counter.textContent = "1 Trikot gefunden";

        } else {

            counter.textContent = count + " Trikots gefunden";

        }

    }

    // -----------------------
    // Initial
    // -----------------------

    filterCards();

});





const preview = {

    header : document.getElementById("previewHeader"),
    body : document.getElementById("previewBody"),

    flag : document.getElementById("previewFlag"),

    country : document.getElementById("previewCountry"),

    render : document.getElementById("previewRender"),

    type : document.getElementById("previewType"),

    tournament : document.getElementById("previewTournament"),

    host : document.getElementById("previewHost")

};

gallery.addEventListener("mouseover", e => {

    const card = e.target.closest(".kit-card");

    if(!card) return;

    preview.flag.src =
        CONFIG.BASE + "flags/" + card.dataset.country + ".png";

    preview.country.textContent = card.dataset.team;

    preview.type.textContent = card.dataset.type.toUpperCase();

    preview.render.src = CONFIG.BASE + "renders/" + card.dataset.render;

    preview.tournament.textContent = card.dataset.tournament;

    preview.header.style.setProperty(
        "--accent",
        getComputedStyle(card).getPropertyValue("--accent")
    );

    preview.header.style.setProperty(
        "--accentfont",
        getComputedStyle(card).getPropertyValue("--accentfont")
    );
    preview.body.style.setProperty(
        "--accentfont",
        getComputedStyle(card).getPropertyValue("--accentfont")
    );

});

window.teams = {};
window.teamsReady = fetch(CONFIG.BASE + "data/teams.csv")
    .then(r => r.text())
    .then(csv => {
        console.log(CONFIG.BASE+"data/teams.csv"
        );
        
        const rows = csv.trim().split("\n");
        rows.shift();

        rows.forEach(row => {

            const [country, code, flag, primary, secondary, text] = row.split(",");

            window.teams[country] = {
                country,
                code,
                flag,
                primary,
                secondary,
                text
            };
        });

    fetch(CONFIG.BASE + "data/kits.json")
.then(r => r.json())
.then(files => {

    files.sort((a, b) => {

        function parse(file){

            const name = file.replace(".png","");

            return {

                code: name.substring(0,3),

                type: name.substring(3,name.length-2),

                year: parseInt(name.slice(-2))

            };

        }

        function getTypeOrder(type){

            if(type === "h") return 0;
            if(type === "a") return 1;
            if(type === "t") return 2;

            // g1, g2, g3 ...
            const keeper = type.match(/^g(\d+)$/);

            if(keeper){
                return 3 + parseInt(keeper[1]);
            }

            // aktuelles gk
            if(type === "gk") return 3;

            return 999;

        }

        const A = parse(a);
        const B = parse(b);

        if(A.code !== B.code){

            return A.code.localeCompare(B.code);

        }

        if(A.year !== B.year){

            return A.year - B.year;

        }

        return getTypeOrder(A.type) - getTypeOrder(B.type);

    });
    files.forEach(file => {

        const match = file.match(
            /^([A-Za-z]{3})(g\d+|gk|h|a|t)(\d{2})\.png$/
        );
        if (!match) return;

        const [
            ,
            code,
            type,
            year
        ] = match;

        flag = "";
        countryname = "";
        kittypen = "";
        
        for (t in window.teams)
        {
            
            
            if (teams[t].code == match[1].toUpperCase())
            {
                countryname = t;
                flag = teams[t].flag;
            }
        }
       
        const country = code;


        let kitType;

        switch(type) {
            case "h":
                kitType = "Home";
                break;

            case "a":
                kitType = "Away";
                break;

            case "t":
                kitType = "Third";
                break;

            case "g1": case "g2": case "g3":
                kitType = "Goalkeeper";
                break;
        }


        const slide = document.createElement("div");
        const uid = "kit_" + file.replace(".png","");
        slide.className = "kit";

        slide.setAttribute('data-year','20'+year)
        slide.setAttribute('data-country',flag)
        slide.innerHTML = `<svg
    class="kit-card-new"
   viewBox="0 0 120.065 167.82001"
   version="1.1"
   id="svg1"
   inkscape:version="1.4 (86a8ad7, 2024-10-11)"
   sodipodi:docname="Card.svg"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:xlink="http://www.w3.org/1999/xlink"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <sodipodi:namedview
     id="namedview1"
     pagecolor="#ffffff"
     bordercolor="#999999"
     borderopacity="1"
     inkscape:showpageshadow="2"
     inkscape:pageopacity="0"
     inkscape:pagecheckerboard="0"
     inkscape:deskcolor="#d1d1d1"
     inkscape:document-units="mm"
     inkscape:zoom="0.55157343"
     inkscape:cx="157.73059"
     inkscape:cy="258.35182"
     inkscape:window-width="1920"
     inkscape:window-height="1017"
     inkscape:window-x="-8"
     inkscape:window-y="-8"
     inkscape:window-maximized="1"
     inkscape:current-layer="layer1" />
  <defs
     id="defs1">
    <linearGradient
       inkscape:collect="always"
       xlink:href="#linearGradient2-${file}"
       id="linearGradient3"
       x1="754.30566"
       y1="115.77715"
       x2="754.30566"
       y2="630.34229"
       gradientUnits="userSpaceOnUse"
       gradientTransform="translate(0.05021133,-1.2465316)" />
    <linearGradient
       id="linearGradient2-${file}"
       inkscape:collect="always">
      <stop
         style="stop-color:#3c3c3c;stop-opacity:1;"
         offset="0"
         id="stop2" />
      <stop
         style="stop-color:#000000;stop-opacity:1"
         offset="1"
         id="stop3" />
    </linearGradient>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath3">
      <rect
         style="mix-blend-mode:darken;fill:url(#linearGradient3);fill-opacity:1;stroke-width:0.928098;stroke-linejoin:bevel"
         id="rect4"
         width="441.81671"
         height="624.23041"
         x="547.21625"
         y="57.619278"
         rx="16.322828"
         ry="16.322828" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath5">
      <path
         style="fill:#c1272d;fill-opacity:1;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
         d="m 542.29111,103.33423 h 145.28231 c 18.6187,0 25.48892,-24.895536 39.91443,-48.526326 L 546.32052,54.076988 Z"
         id="path6"
         sodipodi:nodetypes="ccccc"
         clip-path="url(#clipPath3)" />
    </clipPath>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath6">
      <rect
         style="mix-blend-mode:darken;fill:url(#linearGradient3);fill-opacity:1;stroke-width:0.928098;stroke-linejoin:bevel"
         id="rect5"
         width="441.81671"
         height="624.23041"
         x="547.21625"
         y="57.619278"
         rx="16.322828"
         ry="16.322828" />
    </clipPath>
    <filter
       inkscape:collect="always"
       style="color-interpolation-filters:sRGB"
       id="filter5"
       x="-0.16003125"
       y="-0.23992971"
       width="1.3200625"
       height="1.4798594">
      <feGaussianBlur
         inkscape:collect="always"
         stdDeviation="3.2904454"
         id="feGaussianBlur5" />
    </filter>
    <filter
       inkscape:collect="always"
       style="color-interpolation-filters:sRGB"
       id="filter7"
       x="-0.083624066"
       y="-0.07680819"
       width="1.1672481"
       height="1.1536164">
      <feGaussianBlur
         inkscape:collect="always"
         stdDeviation="14.491402"
         id="feGaussianBlur7" />
    </filter>
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath8">
      <rect
         style="opacity:0.5;mix-blend-mode:luminosity;fill:url(#linearGradient3);fill-opacity:1;stroke-width:0.928098;stroke-linejoin:bevel"
         id="rect9"
         width="441.81671"
         height="624.23041"
         x="547.21625"
         y="57.619278"
         rx="16.322828"
         ry="16.322828" />
    </clipPath>
    <linearGradient
       inkscape:collect="always"
       xlink:href="#linearGradient2-${file}"
       id="linearGradient1-${file}"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(0.26458333,0,0,0.26458333,-143.18731,-14.327383)"
       x1="754.30566"
       y1="115.77715"
       x2="754.30566"
       y2="630.34229" />
    <clipPath
       clipPathUnits="userSpaceOnUse"
       id="clipPath7-${file}">
      <rect
         style="opacity:0.5;mix-blend-mode:luminosity;fill:url(#linearGradient8);fill-opacity:1;stroke:#000000;stroke-width:0.245559;stroke-linejoin:bevel"
         id="rect8"
         width="116.89734"
         height="165.16096"
         x="24.539167"
         y="1.2475309"
         rx="4.3187485"
         ry="4.3187485" />
    </clipPath>
    <linearGradient
       inkscape:collect="always"
       xlink:href="#linearGradient2-${file}"
       id="linearGradient8"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(0.26458333,0,0,0.26458333,-120.23185,-14.327383)"
       x1="754.30566"
       y1="115.77715"
       x2="754.30566"
       y2="630.34229" />
  </defs>
  <g
     inkscape:label="Ebene 1"
     inkscape:groupmode="layer"
     id="layer21"
     class="card-layer21">
    <rect
       style="fill:${teams[countryname].primary};fill-opacity:1;stroke-width:0.255234;stroke-linejoin:bevel"
       id="rect1"
       width="120.06476"
       height="167.82013"
       x="0"
       y="0"
       rx="4.4702497"
       ry="4.5076222" />
    <rect
       style="opacity:0.5;fill:url(#linearGradient1-${file});fill-opacity:1;stroke:#000000;stroke-width:0.245559;stroke-linejoin:bevel"
       id="rect2"
       width="116.89734"
       height="165.16096"
       x="1.5837097"
       y="1.2475309"
       rx="4.3187485"
       ry="4.3187485" />
    <path
       style="fill:${teams[countryname].primary};fill-opacity:1;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:0.5"
       d="m 542.29111,103.33423 h 145.28231 c 18.6187,0 25.48892,-24.895536 39.91443,-48.526326 L 546.32052,54.076988 Z"
       id="path3"
       sodipodi:nodetypes="ccccc"
       clip-path="url(#clipPath3)"
       transform="matrix(0.26458333,0,0,0.26458333,-143.20059,-13.997572)" />
    <g
       id="g5"
       clip-path="url(#clipPath5)"
       transform="matrix(0.26458333,0,0,0.26458333,-143.20059,-13.997572)">
      <rect
         style="fill:#000000;fill-opacity:1;stroke-linejoin:bevel;filter:url(#filter5)"
         id="rect10"
         width="49.347042"
         height="32.914093"
         x="550.2641"
         y="64.269707"
         rx="0"
         ry="0" />
      <image
         width="49.347042"
         height="32.914093"
         preserveAspectRatio="none"
         xlink:href="flags/${flag}.png"
         id="image1-7"
         x="550.2641"
         y="64.269707" />
    </g>
    <text
       xml:space="preserve"
       style="font-weight:bold;font-size:5.18893px;line-height:125%;font-family:Cinzel;-inkscape-font-specification:'Cinzel Bold';text-align:center;text-decoration-color:#000000;letter-spacing:0px;word-spacing:0px;text-anchor:middle;fill:#eaeaea;fill-opacity:1;stroke:none;stroke-width:0.129724px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;-inkscape-stroke:none;stop-color:#000000"
       x="28.816681"
       y="9.5206709"
       id="text6"><tspan
         sodipodi:role="line"
         id="tspan6"
         x="28.816681"
         y="9.5206709"
         style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-family:'Madimi One';-inkscape-font-specification:'Madimi One Bold';fill:${teams[countryname].text};fill-opacity:1;stroke:none;stroke-width:0.129724px">${countryname}</tspan></text>
    <g
       id="g6"
       clip-path="url(#clipPath7-${file})"
       transform="translate(-22.955462)">
      <path
         style="fill:#000000;filter:url(#filter7)"
         d="m 751.26113,616.80797 c -5.75138,-0.21741 -14.17706,-0.97122 -22.02809,-1.97077 -3.97538,-0.50612 -3.83447,-0.4862 -9.38799,-1.32726 -2.15986,-0.3271 -6.64571,-0.94674 -9.96857,-1.37697 -6.41477,-0.83057 -14.1051,-2.07585 -15.85908,-2.56804 -3.162,-0.8873 -11.35508,-3.38536 -19.27048,-5.87553 -16.26325,-5.11639 -22.02173,-9.32968 -27.36932,-20.02521 -1.63784,-3.27576 -1.83419,-4.58988 -1.23987,-8.29808 0.82444,-5.144 1.34278,-8.61909 1.97293,-13.22706 0.59643,-4.36135 1.03259,-6.92473 2.10734,-12.38518 0.31066,-1.57836 0.62603,-3.20958 0.70082,-3.62494 0.0748,-0.41535 0.68058,-3.13405 1.34619,-6.04155 0.6656,-2.9075 1.35603,-6.16994 1.5343,-7.24986 0.54558,-3.30518 1.52711,-9.6108 2.13947,-13.74454 0.54235,-3.66119 1.19092,-7.94097 2.72374,-17.97362 0.34269,-2.24293 0.9561,-6.32098 1.36315,-9.06233 0.40704,-2.74136 0.94635,-6.34363 1.19845,-8.00506 0.64983,-4.28259 0.69772,-4.7127 1.04585,-9.39321 0.304,-4.08717 0.45141,-6.83114 0.78552,-14.62197 0.0891,-2.07678 0.22677,-4.38768 0.30602,-5.13532 0.20001,-1.88686 0.38097,-4.41274 0.59513,-8.30714 0.1005,-1.82757 0.26056,-4.07049 0.35568,-4.98428 0.2857,-2.74467 0.017,-38.3627 -0.29329,-38.88105 -0.0784,-0.13091 -0.22978,-1.86923 -0.33648,-3.86294 -0.10671,-1.99372 -0.25412,-4.57648 -0.32758,-5.73948 -0.0735,-1.163 -0.20761,-3.54186 -0.2981,-5.28636 -0.0905,-1.7445 -0.22674,-4.19133 -0.30278,-5.4374 -0.076,-1.24607 -0.21119,-3.55696 -0.30035,-5.13532 -0.54743,-9.69078 -1.07194,-18.17956 -1.20391,-19.48401 -0.084,-0.83071 -0.22524,-2.46193 -0.31377,-3.62493 -0.0885,-1.163 -0.22198,-2.79422 -0.29655,-3.62493 -0.0746,-0.83072 -0.21488,-2.39397 -0.31181,-3.4739 -0.75124,-8.36979 -1.78476,-15.79148 -3.02442,-21.71829 -1.20666,-5.76902 -4.65268,-18.21435 -5.00878,-18.08924 -0.52832,0.18562 -5.94327,5.71129 -8.51933,8.69353 -1.5069,1.7445 -2.81589,3.23978 -2.90887,3.32285 -0.093,0.0831 -0.54004,0.64903 -0.99347,1.25769 -0.45344,0.60865 -0.9964,1.29251 -1.2066,1.51969 -0.21019,0.22717 -1.12103,1.22447 -2.02408,2.21621 -0.90306,0.99174 -7.16915,7.395 -13.92464,14.22947 -11.09466,11.22435 -12.39689,12.44559 -13.46294,12.6257 -1.37161,0.23173 -7.11953,-1.13667 -9.85375,-2.34588 -2.19358,-0.9701 -8.7017,-5.42579 -12.04437,-8.246 -2.56085,-2.16059 -11.55895,-10.9366 -13.44531,-13.11344 -6.92983,-7.99702 -9.44248,-11.63792 -10.53364,-15.26359 -0.48077,-1.59745 -0.41314,-1.81933 1.0524,-3.45257 1.09765,-1.22324 5.15458,-6.27897 6.32062,-7.87671 0.59205,-0.81126 1.88145,-2.59933 2.86534,-3.97349 0.98389,-1.37417 2.76555,-3.7219 3.95925,-5.21719 1.1937,-1.49528 3.485,-4.48585 5.09177,-6.64571 3.01732,-4.05595 5.43792,-7.1744 6.22748,-8.02284 5.17031,-5.55585 14.48039,-18.15344 18.40469,-24.90362 1.06248,-1.82757 3.10926,-5.09001 4.5484,-7.24987 1.43914,-2.15985 3.38588,-5.08246 4.32608,-6.49467 2.35097,-3.53122 10.21484,-14.45063 11.23328,-15.59802 0.16749,-0.18871 1.3913,-1.68399 2.71956,-3.32286 2.93065,-3.61596 8.6927,-9.53759 10.81568,-11.11521 5.13077,-3.81277 15.53886,-10.14024 16.67972,-10.14024 0.10105,0 0.88896,-0.32378 1.75092,-0.71952 0.86196,-0.39573 2.58672,-1.10605 3.83279,-1.57848 1.24607,-0.47243 4.78038,-2.13929 7.85402,-3.70412 3.07364,-1.56483 10.58577,-5.3437 16.69362,-8.39749 6.10785,-3.05378 12.1342,-6.16071 13.3919,-6.90428 1.25769,-0.74357 2.36379,-1.35194 2.458,-1.35194 0.0942,0 3.32455,-2.09948 7.17853,-4.66551 6.93424,-4.6169 9.57979,-6.08784 11.63116,-6.46699 1.42637,-0.26364 11.33715,-0.24788 16.01011,0.0254 3.93122,0.22995 7.59849,0.40652 17.52051,0.84361 3.23978,0.14272 12.48336,0.20274 20.54128,0.13338 14.06665,-0.12109 17.60982,-0.22427 24.92141,-0.72575 1.82757,-0.12535 4.89211,-0.21488 6.81009,-0.19896 3.9114,0.0325 4.3942,0.20191 8.7928,3.0862 10.08147,6.61071 20.12116,12.12218 34.08769,18.71307 3.40526,1.60696 8.91063,4.30367 12.23415,5.9927 5.74967,2.922 12.65201,6.2207 13.01645,6.2207 0.37804,0 7.72121,3.66951 10.49216,5.24312 3.06393,1.73999 7.17845,4.82874 10.30837,7.73844 2.87926,2.67668 6.89582,6.73611 7.78829,7.87141 4.31619,5.49058 7.10699,9.09361 7.48356,9.66158 0.24921,0.37588 0.93777,1.31022 1.53012,2.07631 0.59235,0.76609 1.94089,2.68427 2.99675,4.26262 1.05586,1.57836 2.65757,3.872 3.55934,5.09699 0.90178,1.22499 2.36661,3.46792 3.25518,4.98428 3.55116,6.06013 8.51137,13.9938 9.65301,15.43962 0.66457,0.84165 1.6828,2.20652 2.26274,3.03305 1.08854,1.5514 5.62509,7.26705 6.82717,8.60162 0.37413,0.41536 1.66323,1.91064 2.86468,3.32286 1.20146,1.41221 2.90788,3.38327 3.79205,4.38012 5.73729,6.46848 13.23431,16.04619 20.81281,26.58911 6.05293,8.42062 7.18352,9.98416 8.29585,11.47268 0.83996,1.12404 0.87853,1.2874 0.5531,2.34222 -0.32889,1.06602 -2.38755,3.2884 -4.96583,5.36076 -0.51676,0.41536 -2.14741,1.86449 -3.62368,3.2203 -3.05286,2.80376 -5.72401,5.05874 -9.60403,8.10769 -1.47996,1.16296 -4.33459,3.47001 -6.34363,5.12678 -4.43812,3.65994 -3.97289,3.28752 -5.61631,4.49588 -11.8544,8.71623 -17.17776,12.44888 -18.64359,13.0726 -2.35556,1.0023 -2.06157,1.27865 -14.18193,-13.33092 -2.48103,-2.99057 -5.31838,-6.45692 -6.30522,-7.70299 -0.98684,-1.24607 -2.40743,-2.95703 -3.15687,-3.80214 -0.74944,-0.84511 -2.58603,-3.0669 -4.08132,-4.93731 -6.13348,-7.67223 -6.63446,-8.24214 -12.23414,-13.91762 -3.52415,-3.57186 -5.64749,-5.43267 -7.06243,-6.18927 -1.37182,-0.73354 -2.46081,-0.23531 -3.18661,1.45791 -0.3105,0.72438 -1.59921,6.94523 -2.8638,13.82411 -1.26458,6.87888 -2.71097,14.41014 -3.21419,16.73614 -2.03578,9.40978 -3.29483,15.88739 -3.72839,19.18193 -0.66365,5.04292 -0.73273,5.67234 -1.2433,11.32792 -0.25498,2.82442 -0.52538,5.67906 -0.60088,6.34363 -0.25768,2.26812 -0.72885,6.94431 -0.91311,9.06233 -0.10118,1.163 -0.23887,2.65828 -0.30598,3.32285 -0.0671,0.66458 -0.33026,3.58718 -0.58477,6.49467 -0.25451,2.9075 -0.52521,5.96604 -0.60155,6.79675 -0.7595,8.2639 -0.9749,12.13566 -1.03354,18.57778 -0.0453,4.97324 0.4947,18.09869 1.01283,24.61933 0.40718,5.12435 0.5178,6.40728 0.6121,7.09883 0.0566,0.41536 0.19547,2.11454 0.30851,3.77597 0.11304,1.66143 0.2465,3.08875 0.29657,3.17182 0.0501,0.0831 0.17341,2.7338 0.2741,5.89051 0.10069,3.15671 0.24826,7.03086 0.32795,8.60922 0.0797,1.57835 0.22437,4.84079 0.32153,7.24986 0.37463,9.28971 1.21574,16.61569 3.19073,27.79115 0.33766,1.91064 0.74626,4.27957 0.90799,5.26429 0.16173,0.98471 0.34132,1.86829 0.39909,1.9635 0.0578,0.0952 0.19519,1.05669 0.3054,2.13662 0.11021,1.07993 0.25599,2.16741 0.32396,2.41662 0.068,0.24921 0.47344,3.17182 0.90105,6.49467 0.42761,3.32285 0.83064,6.38139 0.89562,6.79675 0.065,0.41536 0.2014,1.50283 0.30316,2.41662 0.16615,1.49203 0.5146,3.61852 0.86622,5.28636 1.18883,5.63891 1.82436,10.25332 2.47549,17.97362 0.0911,1.07993 0.22039,2.16741 0.28734,2.41662 0.067,0.24922 0.20438,1.06483 0.30539,1.81247 0.2896,2.14366 0.70039,4.88843 0.90419,6.04155 0.044,0.24922 0.17986,1.20076 0.3018,2.11455 0.12195,0.91378 0.27601,1.9333 0.34237,2.26558 0.65591,3.28472 1.16471,7.36135 1.1499,9.21337 -0.017,2.13186 -0.0873,2.36365 -1.19085,3.92701 -3.98377,5.64385 -7.50071,8.38878 -16.46257,12.84886 -9.92788,4.94083 -20.10373,7.95 -32.64059,9.65237 -3.23088,0.43872 -6.28213,0.85758 -6.78055,0.93081 -4.36673,0.64152 -20.26054,2.8375 -21.44752,2.9633 -4.83501,0.51245 -42.02754,0.85779 -51.95736,0.48243 z"
         id="path7"
         transform="matrix(0.26458333,0,0,0.26458333,-120.24513,-13.997572)" />
      <image
         width="159.84944"
         height="159.84944"
         preserveAspectRatio="none"
         xlink:href="renders/${file}"
         id="image1-1"
         x="0"
         y="10.292254" />
    </g>
    <rect
       style="opacity:0.5;fill:#000000;fill-opacity:1;stroke:none;stroke-linejoin:bevel"
       id="rect7"
       width="588.41846"
       height="137.27161"
       x="465.00244"
       y="557.35583"
       rx="16.322828"
       ry="16.322828"
       clip-path="url(#clipPath8)"
       transform="matrix(0.26458333,0,0,0.26458333,-143.20059,-13.997572)" />
    <text
       xml:space="preserve"
       style="font-weight:bold;font-size:9.3952px;line-height:125%;font-family:Cinzel;-inkscape-font-specification:'Cinzel Bold';text-align:center;text-decoration-color:#000000;letter-spacing:0px;word-spacing:0px;text-anchor:middle;fill:#000000;stroke:#000000;stroke-width:0.234881px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;-inkscape-stroke:none;stop-color:#000000"
       x="28.59111"
       y="145.67229"
       id="text9"><tspan
         sodipodi:role="line"
         id="tspan9"
         x="28.59111"
         y="145.67229"
         style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-family:'Madimi One';-inkscape-font-specification:'Madimi One Bold';fill:#ffffff;stroke:none;stroke-width:0.234881px">${kitType}</tspan></text>
    <text
       xml:space="preserve"
       style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:7.31097px;line-height:125%;font-family:'Madimi One';-inkscape-font-specification:'Madimi One Bold';text-align:center;text-decoration-color:#000000;letter-spacing:0px;word-spacing:0px;text-anchor:middle;fill:#eaeaea;fill-opacity:1;stroke:none;stroke-width:0.182775px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;-inkscape-stroke:none;stop-color:#000000"
       x="19.109352"
       y="20.8764"
       id="text10"><tspan
         sodipodi:role="line"
         id="tspan10"
         x="19.109352"
         y="20.8764"
         style="stroke-width:0.182775px">20${year}</tspan></text>
  </g>
</svg>
`;
        swip = document.getElementById("gallery");

        if (year != "20" && kitType != "Goalkeeper")
        {
            swip.appendChild(slide);
        }
        slide.addEventListener("click", () => {

            const active = document.querySelector(".kit.active");

            if(active === slide){
                slide.classList.remove("active");
                return;
            }

            active?.classList.remove("active");

            slide.classList.add("active");

        });

    });

});    



    });


