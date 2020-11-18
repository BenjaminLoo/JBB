/*

Name: Teo Kai Jie
Class: DIT/2B/21
Date: 16/5/20
Admission Number: 1936799
Filename: indexHeaderCanvas.js

File used for the header canvas animation

*/
var canvas = document.getElementById("particleCanvas");
var ctx = canvas.getContext("2d");
var header = document.querySelector("header");
canvas.width = window.innerWidth;
canvas.height = header.clientHeight;

function delay(amount) {
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve();
        },amount);
    });
}

var particles = [];
// Letter Particles
function Particle(x,y,vx,vy,size,rot,vRot,color,content) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.rot = rot;
    this.vRot = vRot;
    this.color = color;
    this.content = content;

    this.show = () => {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.font = this.size+"px Arial";
        ctx.translate(this.x,this.y);
        ctx.rotate(this.rot);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.content,0,0);
        ctx.restore();
    }
    this.update = () => {
        this.x+=this.vx;
        this.y+=this.vy;
        this.vx/=1.01;
        this.vy/=1.01;
        this.rot+=this.vRot;
    }
}
var headerText = "JiBaBOOM!";
async function logoIntro(interval) {
    var output = "";
    for (let i in headerText) {
        await delay(interval);
        output+=headerText[i];
        $("h1#logo-name").text(output);
        if (headerText[i]=="O") {
            populateParticles(30,header.clientWidth/(2-i*0.02),header.clientHeight/(2.1));
        }
    }
}
async function populateParticles(amount,x,y) {
    for (let i = 0;i<amount;i++) {
        particles.push(new Particle(x,y,Math.random()*5-2.5,Math.random()*5-2.5,32,1,Math.random()*0.2-0.1,"white","O"));
    }
}
function updateFrame() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (let i in particles) {
        particles[i].show();
        particles[i].update();
        if (Math.abs(particles[i].vx)<0.1&&Math.abs(particles[i].vy)<0.1) {
            particles.splice(i,1);
        }
    }
}
setInterval(updateFrame,10);

$(document).ready(function(){
    logoIntro(100);
    $(window).resize(function(){
        canvas.width = window.innerWidth;
        canvas.height = header.clientHeight;
    })
});