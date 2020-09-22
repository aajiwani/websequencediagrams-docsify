const loadWSD = function () {
    var wsdScript = document.createElement("script");
    wsdScript.id = "wsd_loaded";
    wsdScript.src = "https://www.websequencediagrams.com/service.js";
    window.Docsify.dom.$.head.appendChild(wsdScript);
};

let plugin = (hook, vm) => {
    hook.afterEach(function (html, next) {
        // We load the HTML inside a DOM node to allow for manipulation
        var htmlElement = document.createElement('div');
        htmlElement.innerHTML = html;

        htmlElement.querySelectorAll('pre[data-lang=websequencediagrams]').forEach((element) => {
            // Fetches the diagram text
            var realDiagram = element.querySelector('code[class=lang-websequencediagrams]');

            // Creates a structure as mentioned in websequencediagrams api
            // here: https://www.websequencediagrams.com/embedding.html
            var preTag = document.createElement('pre');
            var replacement = document.createElement('div');
            replacement.setAttribute('wsd_style', "modern-blue");
            replacement.classList.add('wsd');

            preTag.innerHTML = realDiagram.textContent;
            replacement.appendChild(preTag);

            // Replace the code with the diagram generation expectation
            element.parentNode.replaceChild(replacement, element);
        });

        // Do the magic!
        next(htmlElement.innerHTML);

        // In case of WSD already present in the space, it needs to be recalled
        setTimeout(function wsd_present_diagrams() {
            if (window.document.querySelector('#wsd_loaded')) {
                var myConcern = document.querySelector('#wsd_loaded');
                myConcern.parentNode.removeChild(myConcern);
                loadWSD();
            } else setTimeout(wsd_present_diagrams, 100); // else re-schedule
        }, 1000);
    });

    hook.ready(function () {
        // Lets the websequence do the magic
        window.Docsify.dom.documentReady(function () {
            loadWSD();
        });
    });
};

export default plugin;