const HEADER = "HEADER";
const FOOTER = "FOOTER";

function renderElement(elementId, htmlCode) {
    var element = document.getElementById(elementId);
    element.innerHTML = htmlCode;
    reinsertScripts(element);
}

function reinsertScripts(el) {
    const scriptList = el.getElementsByTagName('script');
    for (const script of scriptList) {
        const scriptCopy = document.createElement('script');
        if (script.innerHTML) {
            scriptCopy.innerHTML = script.innerHTML;
        } else if (script.src) {
            scriptCopy.src = script.src;
        }
        scriptCopy.async = false;
        script.parentNode.replaceChild(scriptCopy, script);
    }
}

function setElementRutine(elementType, elementId, configPath, baseUrl = '', appId = '', appName = '', language = '', internationalizationParamId='') {
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
                appHtmlUrl += `?appId=${appId}`;
                appHtmlUrl += `?appName=${appName}`;
                appHtmlUrl += `&appUrl=${baseUrl}`;
                appHtmlUrl += language ? `&${internationalizationParamId}=${language}` : `&${internationalizationParamId}=${navigator.languages[0].toLowerCase()}`;
                fetch(appHtmlUrl, fetchOptions)
                    .then(res => res.text())
                    .then(html => {
                        renderElement(elementId, html);
                    });
            });
    });
}

function setElement(elementType, elementId, configPath, baseUrl = '', appId = '', appName='', language='', internationalizationParamId='') {
    var cachedData = sessionStorage.getItem(elementId);
    if (cachedData != null) {
        renderElement(elementId, cachedData);
    } else {
        setElementRutine(elementType, elementId, configPath, baseUrl, appId, appName, language, internationalizationParamId);
    }
}
