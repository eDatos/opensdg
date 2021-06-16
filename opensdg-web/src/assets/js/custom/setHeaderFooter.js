const HEADER = "HEADER";
const FOOTER = "FOOTER";

function renderElement(elementId, htmlCode) {
    document.getElementById(elementId).innerHTML = htmlCode;
}

function cacheHtmlCode(elementId, htmlCode, language='') {
    sessionStorage.setItem(elementId, htmlCode);
    if (language !== '') {
        sessionStorage.setItem(`${elementId}-${language}`, language);
    }
}

function removeCacheHtmlCode(elementId, language='') {
    sessionStorage.removeItem(elementId);
    if (language !== '') {
        sessionStorage.removeItem(`${elementId}-${language}`);
    }
}

function setElementRutine(elementType, elementId, configPath, baseUrl = '', appName = '', language = '') {
    fetch(configPath)
    .then(res => res.json())
    .then(json => {
        var type = null;
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
                    headers: {
                        'Content-Type': 'text/html',
                    }
                }
                let appHtmlUrl = `${htmlUrl.value}`;
                appHtmlUrl += `?appName=${appName}`;
                appHtmlUrl += `&appUrl=${baseUrl}`;
                appHtmlUrl += `&lang=${language}`;
                fetch(appHtmlUrl, fetchOptions)
                    .then(res => res.text())
                    .then(html => {
                        cacheHtmlCode(elementId, html, language);
                        renderElement(elementId, html);
                    });
            });
    });
}

function setElement(elementType, elementId, configPath, baseUrl = '', appName='', language='') {
    var cachedData = sessionStorage.getItem(elementId);
    if (cachedData != null) {
        renderElement(elementId, cachedData);
    } else {
        setElementRutine(elementType, elementId, configPath, baseUrl, appName, language);
    }
}