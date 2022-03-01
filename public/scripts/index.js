var res;
function sendToServer(path, object, code){
    const data = object;
    const send_data = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    fetch(path, send_data)
    .then(response => response.json())
    .then(function(json){
        document.querySelector(code).innerHTML = Object.values(json)[0]
        console.log(Object.values(json)[0])
    });
}


document.body.onload = function(){
    sendToServer("/loadposts", undefined, "p")
}