const HEADER = "HEADER";
const FOOTER = "FOOTER";

function renderElement(elementId, htmlCode) {
    document.getElementById(elementId).innerHTML = htmlCode;
}

function cacheHtmlCode(elementId, htmlCode) {
    sessionStorage.setItem(elementId, htmlCode);
}

function setElementRutine(elementType, elementId, configPath, baseUrl = '') {
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
                        html = html.replace('<a href>', `<a href="${baseUrl}">`);
                        cacheHtmlCode(elementId, html);
                        renderElement(elementId, html);
                    });
            });
    });
}

function setElement(elementType, elementId, configPath, baseUrl = '') {
    var cachedData = sessionStorage.getItem(elementId);
    if (cachedData != null) {
        renderElement(elementId, cachedData);
    } else {
        setElementRutine(elementType, elementId, configPath, baseUrl);
    }
}