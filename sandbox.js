    $.ajax({
        url: "events.json",
        success: function(data) {
            for (i = 0; i < data.length; i++){
                approval.push([new Date(data[i].date), data[i].incident]);
            }
        }
    });
    