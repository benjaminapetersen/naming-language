function createElem(tag, cls) {
    var elem = $(document.createElement(tag));
    if (cls) {
        elem.addClass(cls);
    }
    return elem;
}

function testControl(id, lang) {
    lang = lang || makeBasicLanguage();
    var container = $("#" + id);

    var controls = createElem("div", "controlset").appendTo(container);
    var div = createElem("div", "control").appendTo(controls);
    
    var button = createElem("button").appendTo(div)
        .text("Generate examples");
    var p = createElem("p").appendTo(
            createElem("div", "output").appendTo(container));
    function gen() {
        var words = []
        for (var i = 0; i < 10; i++) {
            words.push(makeWord(lang));
        }
        p.text(join(words, ' / '));
    }
    button.on("click", gen);
    gen();
}

function picker(labelText, names, callback) {
    var div = createElem("div", "control");
    var label = createElem("label")
        .text(labelText + ' ')
        .appendTo(div);
    var select = createElem("select").appendTo(label);
    for (var i = 0; i < names.length; i++) {
        var opt = createElem("option").appendTo(select)
            .text(names[i])
            .attr("value", i);
    }
    createElem("option").appendTo(select)
        .text("Random")
        .attr("value", "random");
    function respond(e) {
        if (e.target.value == "random") {
            callback(randrange(names.length));
        } else {
            callback(e.target.value);
        }
    }
    select.on("click", respond);
    select.on("change", respond);
    return div;
}

function consPicker(id, lang) {
    lang = lang || makeBasicLanguage();
    var div = createElem("div", "controlset").appendTo("#" + id);
    div.append(picker("Consonant set",
                consets.map(function (x) {return x.name}),
                function (i) {
                    lang.phonemes.C = consets[i].C;
                }));
    testControl(id, lang);
}

function ptPicker(id, lang) {
    lang = lang || makeBasicLanguage();
    var div = createElem("div", "controlset").appendTo("#" + id);
    picker("Syllable structure",
            syllstructs,
            function (i) {
                lang.structure = syllstructs[i];
            }).appendTo(div);
    picker("Sibilants",
            ssets.map(function (x) {return x.name}),
            function (i) {
                lang.phonemes.S = ssets[i].S;
            }).appendTo(div);
    picker("Liquids",
            lsets.map(function (x) {return x.name}),
            function (i) {
                lang.phonemes.L = lsets[i].L;
            }).appendTo(div);
    picker("Finals",
            fsets.map(function (x) {return x.name}),
            function (i) {
                lang.phonemes.F = fsets[i].F;
            }).appendTo(div);
    consPicker(id, lang);
}

function resPicker(id, lang) {
    lang = lang || makeBasicLanguage();
    var div = createElem("div", "controlset").appendTo("#" + id);
    picker("Restrictions",
            ressets.map(function (x) {return x.name}),
            function (i) {
                lang.restricts = ressets[i].res;
            }).appendTo(div);
    ptPicker(id, lang);
}

function corthPicker(id, lang) {
    lang = lang || makeOrthoLanguage();
    var div = createElem("div", "controlset").appendTo("#" + id);
    picker("Consonant orthography",
            corthsets.map(function (x) {return x.name}),
            function (i) {
                lang.cortho = corthsets[i].orth;
            }).appendTo(div);
    resPicker(id, lang);
}

function vorthPicker(id, lang) {
    lang = lang || makeOrthoLanguage();
    var div = createElem("div", "controlset").appendTo("#" + id);
    picker("Vowel orthography",
            vorthsets.map(function (x) {return x.name}),
            function (i) {
                lang.vortho = vorthsets[i].orth;
            }).appendTo(div);
    picker("Vowel set",
            vowsets.map(function (x) {return x.name}),
            function (i) {
                lang.phonemes.V = vowsets[i].V;
            }).appendTo(div);
    corthPicker(id, lang);
}

function syllPicker(id, lang) {
    lang = lang || makeOrthoLanguage();
    var div = createElem("div", "controlset").appendTo("#" + id);
    var labels = [];
    for (var i = 0; i < 8; i++) {
        var minsyll = Math.floor(i/4) + 1;
        var maxsyll = minsyll + (i % 4);
        if (minsyll == maxsyll) {
            labels.push(minsyll);
        } else {
            labels.push(minsyll + "-" + maxsyll);
        }
    }
    picker("Syllables per word",
        labels,
        function (i) {
            lang.minsyll = Math.floor(i/4) + 1;
            lang.maxsyll = lang.minsyll + (i % 4);
            console.log(i, lang);
        }).appendTo(div);
    vorthPicker(id, lang);
}

function morphDemo(id) {
    var lang = makeRandomLanguage();
    lang.nowordpool = true;
    var div = createElem("div", "controlset").appendTo("#" + id);
    var newlang = createElem("button")
        .text("New language")
        .appendTo(
                createElem("div", "control")
                    .appendTo(div));
    var more = createElem("button")
        .text("Generate more")
        .appendTo(
                createElem("div", "control")
                    .appendTo(div));
    var output = createElem("div", "output")
        .appendTo(div);
    var citywords = [];
    var landwords = [];
    var cityexamples = null;
    var citymorphemes = null;
    var landexamples = null;
    var landmorphemes = null;
    var morphemes = null;
    
    function clear() {
        output.empty();
        morphemes = createElem("p").appendTo(output);
        citymorphemes = createElem("p").appendTo(output);
        landmorphemes = createElem("p").appendTo(output);
        createElem("hr").appendTo(output);
        cityexamples = createElem("p").appendTo(output);
        landexamples = createElem("p").appendTo(output);
        citywords = [];
        landwords = [];
    }
    function generate() {
        for (var i = 0; i < 5; i++) {
            citywords.push(makeWord(lang, "city"));
            landwords.push(makeWord(lang, "land"));
        }
        morphemes.html("<strong>Generic morphemes:</strong> " + join(lang.morphemes[''], ' / '));
        citymorphemes.html("<strong>'City' morphemes:</strong> " + join(lang.morphemes.city, ' / '));
        landmorphemes.html("<strong>'Land' morphemes:</strong> " + join(lang.morphemes.land, ' / '));
        cityexamples.html("<strong>'City' words:</strong> " + join(citywords, ' / '));
        landexamples.html("<strong>'Land' words:</strong> " + join(landwords, ' / '));
    }
    newlang.on("click", function () {
        lang = makeRandomLanguage();
        clear();
        generate();
    });
    more.on("click", generate);
    clear();
    generate();
}

function finalDemo(id) {
    var lang = makeRandomLanguage();
    var div = createElem("div", "controlset").appendTo("#" + id);
    var newlang = createElem("button")
        .text("New language")
        .appendTo(
                createElem("div", "control")
                    .appendTo(div));
    var more = createElem("button")
        .text("Generate more")
        .appendTo(
                createElem("div", "control")
                    .appendTo(div));
    var output = createElem("div", "output")
        .appendTo(div);
    var citywords = [];
    var landwords = [];
    var cityexamples = null;
    var citymorphemes = null;
    var landexamples = null;
    var landmorphemes = null;
    var morphemes = null;
    
    function clear() {
        output.empty();
        morphemes = createElem("p").appendTo(output);
        citymorphemes = createElem("p").appendTo(output);
        landmorphemes = createElem("p").appendTo(output);
        createElem("hr").appendTo(output);
        cityexamples = createElem("p").appendTo(output);
        landexamples = createElem("p").appendTo(output);
        citywords = [];
        landwords = [];
    }
    function generate() {
        for (var i = 0; i < 5; i++) {
            citywords.push(makeName(lang, "city"));
            landwords.push(makeName(lang, "land"));
        }
        morphemes.html("<strong>Generic morphemes:</strong> " + join(lang.morphemes[''], ' / '));
        citymorphemes.html("<strong>'City' morphemes:</strong> " + join(lang.morphemes.city, ' / '));
        landmorphemes.html("<strong>'Land' morphemes:</strong> " + join(lang.morphemes.land, ' / '));
        cityexamples.html("<strong>City names:</strong> " + join(citywords, ' / '));
        landexamples.html("<strong>Region names:</strong> " + join(landwords, ' / '));
    }
    newlang.on("click", function () {
        lang = makeRandomLanguage();
        clear();
        generate();
    });
    more.on("click", generate);
    clear();
    generate();
}