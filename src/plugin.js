const Docsify_WebSequenceDiagram = {};

Docsify_WebSequenceDiagram.loadWSD = function () {
  var wsdScript = document.createElement("script");
  wsdScript.id = "wsd_loaded";
  wsdScript.src = "https://www.websequencediagrams.com/service.js";
  window.Docsify.dom.$.head.appendChild(wsdScript);
};

// Docsify_WebSequenceDiagram.WSDDivModified = function () {
//   // this function will run each time the content of the DIV changes
//   if (this.getElementsByTagName("img").length > 0) {
//     console.log("WSD Element Modified" + this.getAttribute("id"));
//   }
// };

Docsify_WebSequenceDiagram.loadWSDCss = function () {
  const styleElem = document.createElement("style");
  window.Docsify.dom.$.head.appendChild(styleElem);

  const cssText = `.loader {
        border: 16px solid #f3f3f3; /* Light grey */
        border-top: 16px solid #3498db; /* Blue */
        border-radius: 50%;
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }`;

  if (styleElem.styleSheet) {
    // This is required for IE8 and below.
    styleElem.styleSheet.cssText = cssText;
  } else {
    styleElem.appendChild(document.createTextNode(cssText));
  }
};

Docsify_WebSequenceDiagram.toBeginWith = 0;
Docsify_WebSequenceDiagram.divIds = [];

let plugin = (hook, vm) => {
  hook.afterEach(function (html, next) {
    // We load the HTML inside a DOM node to allow for manipulation
    var htmlElement = document.createElement("div");
    htmlElement.innerHTML = html;

    htmlElement
      .querySelectorAll("pre[data-lang=websequencediagrams]")
      .forEach((element) => {
        var divId = `WebSequenceDiagram_${Docsify_WebSequenceDiagram.toBeginWith++}`;
        // Fetches the diagram text
        var realDiagram = element.querySelector(
          "code[class=lang-websequencediagrams]"
        );

        // Creates a structure as mentioned in websequencediagrams api
        // here: https://www.websequencediagrams.com/embedding.html
        var preTag = document.createElement("pre");
        var replacement = document.createElement("div");
        replacement.setAttribute("wsd_style", "modern-blue");
        replacement.setAttribute("id", divId);
        replacement.classList.add("wsd");

        var loader = document.createElement("div");
        loader.classList.add('loader');

        preTag.innerHTML = realDiagram.textContent;
        replacement.appendChild(preTag);
        replacement.appendChild(loader);

        preTag.hidden = true;

        Docsify_WebSequenceDiagram.divIds.push(divId);
        // Replace the code with the diagram generation expectation
        element.parentNode.replaceChild(replacement, element);
      });

    // Do the magic!
    next(htmlElement.innerHTML);

    // In case of WSD already present in the space, it needs to be recalled
    setTimeout(function wsd_present_diagrams() {
      if (window.document.querySelector("#wsd_loaded")) {
        var myConcern = document.querySelector("#wsd_loaded");
        myConcern.parentNode.removeChild(myConcern);
        Docsify_WebSequenceDiagram.loadWSD();
      } else setTimeout(wsd_present_diagrams, 100); // else re-schedule
    }, 1000);
  });

  hook.ready(function () {
    // Lets the websequence do the magic
    window.Docsify.dom.documentReady(function () {
      Docsify_WebSequenceDiagram.loadWSD();
      Docsify_WebSequenceDiagram.loadWSDCss();

    //   for (id of Docsify_WebSequenceDiagram.divIds) {
    //     var elem = document.getElementById(id);
    //     if (window.addEventListener) {
    //       // Normal browsers
    //       elem.addEventListener("DOMSubtreeModified", WSDDivModified, false);
    //     } else if (window.attachEvent) {
    //       // IE
    //       elem.attachEvent("DOMSubtreeModified", WSDDivModified);
    //     }
    //   }
    });
  });
};

export default plugin;
