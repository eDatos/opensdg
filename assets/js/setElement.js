const HEADER = "HEADER";
const FOOTER = "FOOTER";
const DEMO = false // Para pasar rápido de demo a normal. FIXME: BORRAR

if (DEMO) {
    // Solo para demo local
    function setElement(elementType, elementId, configPath) {
        fetch(configPath)
            .then(res => res.json())
            .then(json => {
                fetchOptions = {
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
                        document.getElementById(elementId).innerHTML = html;

                    })
            })
    }
} else {
    function setElement(elementType, elementId, configPath) {
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
                        fetchOptions = {
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
                                document.getElementById(elementId).innerHTML = html;
                            });
                    });
            });
    }
}