const infoCanvas = document.getElementById("infoCanvas1");
const infoCtx = infoCanvas.getContext("2d");

const devCanvas = document.getElementById("infoCanvas2");
const devCtx = devCanvas.getContext("2d");


function infoLoop(){
    drawInfo();
    drawDev();
}

setInterval(infoLoop,1000/60)

function drawInfo(){
    infoCtx.fillStyle = "black"
    infoCtx.fillRect (25,25, 350,550);
    infoCtx.fillStyle = "#00FF00";
    infoCtx.font = "14px gameFont"
    infoCtx.fillText(`- Press ENTER to Start`,40,75)
    infoCtx.fillText(`- Arrow Key to Move`,40,100)
    infoCtx.fillText(`- SPACE key to Shoot`,40,125)
    infoCtx.fillStyle = "red";
    infoCtx.fillText(`* Kill or Avoid Enemy`,40,95+60)
    infoCtx.fillText(`* Three Lives`,40,120+60)
    infoCtx.fillText(`* Limited Ammo`,40,145+60)
    infoCtx.fillText(`* Collect Ammo`,40,170+60)
    infoCtx.fillText(`* So Use Ammo Wisely`,40,195+60)
    infoCtx.fillText(`* Enemies Do not Follow`,40,220+60)
    infoCtx.fillText(`  Traffic Rules`,40,245+60)
    infoCtx.fillText(`* Watch Out Health Bar`,40,270+60)
    infoCtx.fillText(`* Aim For HighScore`,40,295+60)
    infoCtx.fillStyle = "#fff";
    infoCtx.fillText(`  Best of Luck!!!`,40,400)
    infoCtx.fillStyle = "#00FF00";
    infoCtx.fillText(`  GAME OVER ???`,40,450)
    infoCtx.fillText(`  Press ENTER`,95,475)
}

function drawDev(){
    devCtx.fillStyle = "black"
    devCtx.fillRect (25,25, 350,550);
    devCtx.fillStyle = "#0f0";
    devCtx.font = "14px gameFont"
    devCtx.fillText(`DEVELOPED BY:`,115,275)
    devCtx.fillText(`PRAFUL SHRESTHA`,100,300)
}