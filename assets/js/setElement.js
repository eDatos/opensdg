const HEADER = "HEADER";
const FOOTER = "FOOTER";
const DEMO = false // Para pasar rápido de demo a normal. FIXME: BORRAR

function renderElement(elementId, htmlCode) {
    document.getElementById(elementId).innerHTML = htmlCode;
}

function cacheHtmlCode(id, code) {
    sessionStorage.setItem(id, code);
}

// FIXME: BORRAR
function setElementRutineDemo(elementType, elementId, configPath) {
    fetch(configPath)
    .then(res => res.json())
    .then(json => {
        var fetchOptions = {
            method: 'GET',
            //mode: 'cors',
            headers: {
                'Content-Type': 'text/html',
            }
        }
        var element = null;
        switch (elementType) {
            case HEADER:
                element = json.demo.header;
                break;
            case FOOTER:
                element = json.demo.footer;
                break;
        }
        var htmlUrl = json.demo.endpoint + element + "?appName=" + json.metadata.appName;
        fetch(htmlUrl, fetchOptions)
            .then(res => res.text())
            .then(html => {
                cacheHtmlCode(elementId, html);
                document.getElementById(elementId).innerHTML = html;
            })
    })
}

function setElementRutine(elementType, elementId, configPath) {
    fetch(configPath)
    .then(res => res.json())
    .then(json => {
        var type = null
        switch (elementType) {
            case HEADER:
                type = json.metadata.navbarPathKey;
                break;
            case FOOTER:
                type = json.metadata.footerPathKey;
                break;
        }
        var apiUrl = `${json.metadata.endpoint}/properties/${type}.json`;
        fetch(apiUrl)
            .then(res => res.json())
            .then(htmlUrl => {
                var fetchOptions = {
                    method: 'GET',
                    //mode: 'cors',
                    headers: {
                        'Content-Type': 'text/html',
                    }
                }
                var appHtmlUrl = `${htmlUrl.value}?appName=${json.metadata.appName}`
                fetch(appHtmlUrl, fetchOptions)
                    .then(res => res.text())
                    .then(html => {
                        cacheHtmlCode(elementId, html);
                        document.getElementById(elementId).innerHTML = html;
                    });
            });
    });
}

function setElement(elementType, elementId, configPath) {
    var cachedData = sessionStorage.getItem(elementId);
    if (cachedData != null) {
        renderElement(elementId, cachedData);
    } else {
        if (DEMO) {
            setElementRutineDemo(elementType, elementId, configPath);
        } else {
            setElementRutine(elementType, elementId, configPath);
        }
    }
}