
document.body.onclick = function(event){
    if (event.target.tagName == "INPUT"){
        if (event.target.value == "no"){
            document.querySelector("div").style.display = "block";
        }
        else if(event.target.value == "yes"){
            document.querySelector("div").style.display = "none";
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
          document.cookie = `title=${document.getElementById("title").value}`;
          document.cookie = `body=${document.getElementById("body").value}`;
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
    if (document.getElementById("title").value != "" || document.getElementById("title").value != undefined || document.getElementById("title").value != null){
        if (document.getElementById("body").value != "" || document.getElementById("body").value != undefined || document.getElementById("body").value != null){
            let arr = document.cookie.split(";")
            let email;
            let data;
            for (let x = 0; x < arr.length; x++){
                arr[x] = arr[x].trim().split("=")
            };
            for (let y = 0; y < arr.length; y++){
                if (arr[y][0] == "email"){
                    email = arr[y][1];
                }
            }
            if (document.getElementById("yes").checked){
                data = {
                    title: document.getElementById("title").value,
                    body: document.getElementById("body").value,
                    user: "anonymous"
                }
            }
            else if (document.getElementById("no").checked) {
                data = {
                    title: document.getElementById("title").value,
                    body: document.getElementById("body").value,
                    user: email
                }
            } else {
                alert("You need to select to be anonymous or not.")
            }
            const send_data = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            };
            fetch("/create_post", send_data)
            .then(response => response.json())
            .then(function(json){
                if (Object.values(json)[0]){
                    alert("Thought Created");
                    window.location.href = "/"
                }
            })
        } else {
            alert("You must enter a post body")
        }   
    } else {
        alert("You must enter a post title")
    }
}

document.body.onload = function(){
    if (window.location.pathname != "/create"){
        document.cookie = "logg=true";
        window.location.href = "/create"
    } else {
        if (document.cookie != ""){
            let arr = document.cookie.split(";");
            for (let x = 0; x < arr.length; x++){
                arr[x] = arr[x].trim().split("=");
            }
            for (let y = 0; y < arr.length; y++){
                if (arr[y][0] == "title"){
                    document.getElementById("title").value = arr[y][1]
                }
                if (arr[y][0] == "body"){
                    document.getElementById("body").value = arr[y][1]
                }
                if (arr[y][0] == "logg" && arr[y][1] == "true"){
                    document.getElementById("no").checked = true;
                    document.querySelector("div").innerHTML = "<h4>You have already signed in.</h4>";
                    document.querySelector("div").style.color = "blue";
                }
            }
        }
    }
    if (document.getElementById("no").checked){
        document.querySelector("div").style.display = "block";
    } else {
        document.querySelector("div").style.display = "none";
    }
}