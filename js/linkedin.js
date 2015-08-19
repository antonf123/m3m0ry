var onLinkedInLoad = function() {
    IN.Event.on(IN, "auth", onLinkedInAuth);
    $('#trigger-overlay').trigger('click');
}

var onLinkedInAuth = function() {
    IN.API.Profile("me")
        .fields("id", "firstName", "lastName", "pictureUrl")
        .result(displayProfiles);
    IN.API.Connections("me")
        .fields("id", "firstName", "lastName", "pictureUrl")
        .result(removeFacelessProfiles)
        .error(displayConnectionsErrors);
}

var displayProfiles = function(profiles) {
    member = profiles.values[0];
    //$("#player-name").html(member.firstName.toLowerCase() + " " + member.lastName.toLowerCase());
    $("#player-pic").html("<img src='"+member.pictureUrl+"'/>");
    $("#player-pic").tooltipster("content", "hello, "+member.firstName.toLowerCase()+".");
    _gaq.push(['_trackEvent', 'Logged in']);
    $("#flash-message").hide();
    setTimeout(function() {
        $("#flash-message").html("hello, " + member.firstName.toLowerCase() + ".").fadeIn(1500);
        setTimeout(function() {
            $("#action-message").html("<a href='#' id='start-newbie-game'>it\'s go time\!</a>").hide().fadeIn(1500);
        }, 1500);
    }, 1500);
}

var displayConnectionsErrors = function(error) {}

var removeFacelessProfiles = function(connections) {
    var members = connections.values;
    var membersWithFaces = members.filter(function(val) {
        return (typeof val.pictureUrl != "undefined");
    });

    window.m3m0ryMembers = membersWithFaces;
    //console.log(membersWithFaces);
}
