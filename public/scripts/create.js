document.body.onclick = function(event){
    if (event.target.tagName == "INPUT"){
        if (event.target.value == "no"){
            document.querySelector("div").style.display = "block";
        }
    }
}

document.getElementById("submit").onclick = function(){
    if (document.getElementById("email").value != null || document.getElementById("email").value != undefined || document.getElementById("email").value != ""){
        if (document.getElementById("psw").value != null || document.getElementById("psw").value != undefined || document.getElementById("psw").value != ""){
            document.getElementById("email2").style.display = "block";
            document.getElementById("email3").innerHTML = document.getElementById("email").value;
            document.getElementById("email3").href = `mailto:${document.getElementById("email3")}`;
            const data = {
                email: document.getElementById("email").value,
                password: document.getElementById("psw").value
            };
          alert(JSON.stringify(data))
            const send_data = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(data)
            };
            fetch("/send_email", send_data)
        } else {
            alert("Please Enter a Password Value")
        }
    } else {
        alert("Please Enter a Email Value")
    }
}

document.getElementById("post").onclick = function(){
    console.log(document.querySelector("input"))
}