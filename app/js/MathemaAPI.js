class MathemaAPI {
    static AddPuzzle() { return "/mathemaAPI/addPuzzle"; }
    static GetPuzzleIndex() { return "/mathemaAPI/getPuzzleIndex"; }
    static GetPuzzleByName() { return "/mathemaAPI/getPuzzleByName"; }
    static AddScramble() { return "/mathemaAPI/addScramble"; }
    static DuplicatePuzzle() { return "/mathemaAPI/duplicate"; }
    static RemovePuzzle() { return "/mathemaAPI/remove"; }

    static post(url, data, callback, context = null) {
        var xhttp = new XMLHttpRequest();
        xhttp.open('POST', url, true);
        //Send the proper header information along with the request
        xhttp.setRequestHeader('Content-type', 'application/json');
        xhttp.onreadystatechange = function () { //Call a function when the state changes.
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                if (context) {
                    callback(xhttp.responseText, context);
                } else {
                    callback(xhttp.responseText);
                }
                
            }
        };
        xhttp.send(data);
    }

    static get(file, callback, context = null) {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    var allText = rawFile.responseText;
                    if (context) {
                        callback(allText, context);   
                    } else {
                        callback(allText);
                    }
                }
            }
        };
        rawFile.send(null);
    }

    static getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[key] = value;
        });
        return vars;
    }

    static getRawUrlParam(parameter, defaultValue) {
        var urlparameter = defaultValue;
        if (window.location.href.indexOf(parameter) > -1) {
            urlparameter = this.getUrlVars()[parameter];
        }
        return urlparameter;
    }
    
    static getUrlParameter(parameter, defaultValue) {
        return decodeURI(this.getRawUrlParam(parameter, defaultValue));
    }
}