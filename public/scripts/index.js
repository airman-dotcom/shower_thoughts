let dict = {"r": "report", "u": "user", "s": "share", "l": "like"};
function giveCookie(name, type) {
    let inner = document.getElementById(name).innerHTML;
    let n2 = dict.name[0];
    if (type == "a") {
        console.log(1)
        document.getElementById(name).innerHTML = `${parseInt(inner) + 1}`;
        document.cookie = `${name}=true`;
        document.getElementById(`${n2}${name[name.length - 1]}`).src = `/assets/b_${n2}1.png`;
        return;
    }
    else if (type == "r") {
        document.getElementById(name).innerHTML = `${parseInt(inner) - 1}`
        document.cookie = `${name}=false`;
        document.getElementById(`${n2}${name[name.length - 1]}`).src = `/assets/b_${n2}1.png`;
        return;
    }
}

function create_post(poster, title, body, hearts, shares, report, user_reports, id, x) {
    const data = `
    <div class="container2">
    <div id=${id} class="post">
    <p id="body" style="color:grey;font-size: 1rem;">Posted by ${poster}</p>
            <p id="title">${title}</p>
            <p id="body">${body}</p>
            
        </div>
        <div class="actions">
            <div class="container">
                <div class="row">
                    <div class="col like"><p id="like${id}">${hearts}</p><img id="l${id}" src="/assets/w_like1.png"><p class="align-middle">Like</p></div>
                    <div class="col report"><p id="report${id}">${report}</p><img id="r${id}" src="/assets/w_report1.png"><p class="align-middle">Report</p></div>
                    <div class="col user"><p id="user${id}">${user_reports}</p><img id="u${id}" src="/assets/w_user1.png"><p class="align-middle">Report User</p></div>
                    <div class="col share"><p id="share${id}">${shares}</p><img id="s${id}" src="/assets/w_share1.png"><p class="align-middle">Share</p></div>
                </div>
            </div>
        </div>
        </div>
        <br>
        <br>`;
    if (document.cookie.split(";").length != x) {
        document.cookie = `like${id}=false`;
        document.cookie = `report${id}=false`;
        document.cookie = `user${id}=false`;
        document.cookie = `share${id}=false`;
    }
    let arr = document.cookie.split(";");
    let a = [];
    let b = [];
    let names = [];
    let bools = [];
    arr.forEach(element => {
        a.push(element.split("=")[0].trim())
        b.push(element.split("=")[1].trim())
    })
    a.forEach(element => {
        names.push(element)
    })
    b.forEach(element => {
        bools.push(element === "true")
    })
    a = [];
    
    console.log(bools)
    document.body.insertAdjacentHTML("beforeend", data)
    for (let x = 0; x < bools.length; x++){
        if (bools[x]){
            let name = names[x][0] + names[x][names[x].length - 1];
            if (name[0] != "s"){
                document.getElementById(name).src = `/assets/b_${names[x].slice(0, -1)}1.png`;
            }
            
        }
    }
}

window.onload = function () {
    const send_data = {
        method: "POST",
        Headers: {
            "Content-Type": "application/json"
        }
    };
    fetch("/load_posts", send_data)
        .then(response => response.json())
        .then(function (json) {
            if (Object.values(json)[0]) {
                console.log(Object.values(json)[1])
                let obj = Object.values(json)[1];
                let num = obj.n;
                for (let x = 0; x < num; x++) {
                    if (obj.u[x].toLowerCase() == "anonymous") {
                        let user = "anonymous";
                    };
                    create_post(obj.u[x], obj.t[x], obj.b[x], obj.h[x], obj.s[x], obj.r[x], obj.u_r[x], obj.nums[x], num * 4);
                }
            } else {
                document.querySelector("p").innerHTML = "No posts";
            }
        })
}

document.body.onclick = function (event) {
    if (event.target.tagName == "IMG") {
        if (event.target.src.toString().slice(-5)[0] == "1") {
            let event_name = event.target.src.toString().split("/")[event.target.src.toString().split("/").length - 1].split("1")[0];
            let id = event.target.id[1];
            event_name = event_name.split("_")[1][0]
            let name_tag = event_name + id;
            console.log(name_tag)
            let arr = document.cookie.split(";");
            for (let x = 0; x < arr.length; x++) {
                arr[x] = arr[x].split("=")
            }
            console.log(arr[0][0].trim()[0])
            for (let i = 0; i < arr.length; i++) {
                if (arr[i][1].trim() == "true" && arr[i][0].trim()[0] == id) {
                    giveCookie(name_tag, "r")
                } else if (arr[i][1].trim() == "false" && arr[i][0].trim()[0] == id) {
                    giveCookie(name_tag, "a")
                }
            }

        }
    }
}
