//jquery
var $ = window.jQuery;
//[0]が錦糸町→渋谷 [1]が渋谷→錦糸町 stationlist[direction][n] = "name",min
var stationList = [[
    ["錦糸町",0],
    ["住吉",2],
    ["清澄白河",5],
    ["水天宮前",8],
    ["三越前",11],
    ["大手町",13],
    ["神保町",16],
    ["九段下",17],
    ["半蔵門",20],
    ["永田町",22],
    ["青山一丁目",25],
    ["表参道",27],
    ["渋谷",29],
],
[
    ["渋谷",0],
    ["表参道",2],
    ["青山一丁目",4],
    ["永田町",7],
    ["半蔵門",9],
    ["九段下",12],
    ["神保町",13],
    ["大手町",16],
    ["三越前",18],
    ["水天宮前",21],
    ["清澄白河",24],
    ["住吉",27],
    ["錦糸町",29],
]
]

var stationview = document.getElementById("curstation");
var curStationID = -1;
var nextStationID = 0;
var direction = 1;
var startTime;
var finishTime;
var timerID;
isMoving = false;
muted = true;
var minute = 60;//デバッグ時は1に
var doorsound = new Audio("SE.mp3")

function departure(direction){
    startTime = new Date();
    //到達すべき駅のListを作成する
    stationID = 0;
    var stationLen = stationList[direction].length
    var diagramArray = [];
    var stationName;
    for (var i=0; i<stationLen; i++){
        var stationName = stationList[direction][i][0];
        stationMinute = stationList[direction][i][1];
        var targetTime = new Date(startTime.getTime()+1*1*1000*minute*stationMinute);
        diagramArray.push([stationName,targetTime])
        console.log(stationName,targetTime)
    }
    finishTime = new Date(startTime.getTime()+1*1000*minute*stationList[direction][stationLen-1][1]);
    //1秒ごとに処理をする
    timerID = setInterval(function(){gatangoton(diagramArray)},1000); 
}

function start(){
    if(isMoving == true){
        abort = confirm("すでに運行中の半蔵門線は失われますが、よろしいですか？")
        if(abort == true){
            if(direction==1){
                finalArrival("錦糸町")
            }else{
                finalArrival("渋谷")
            } 
        }else{
            return
        }
    }
    isMoving = true;
    curStationID = -1;
    nextStationID = 0;
    //checkedなら渋谷→錦糸町
    if(document.getElementById("direction").checked){
        direction = 1
    }else{
        direction = 0
    }
    console.log(direction)
    departure(direction)
}
function gatangoton(diagramArray){
    console.log("がたんごとん")
    var stationLen = diagramArray.length
    var stationName = diagramArray[stationLen-1][0]
    var curTime = new Date();
    if (nextStationID == stationLen){
        nextStationID = 0
    }
    var nextTime = diagramArray[nextStationID][1]
    if (curTime.getTime() >= finishTime.getTime()){
        //タイマーを終える
        finalArrival(stationName)
        clearInterval()
    }else if(curTime >= nextTime) {
        nextStationID += 1;
        curStationID += 1;
        arrival(diagramArray,curStationID);
    }
}
function arrival(diagramArray,arriveStation){
    //30秒間駅にいる状態に
    doorsound.play();
    var nextStationName = diagramArray[arriveStation+1][0]
    var curStationName = diagramArray[arriveStation][0]
    setInfo(curStationName); 
    $("#display").addClass("station bg-secondary");
    $("#display").removeClass("next bg-info");

    setTimeout(() => {
        setInfo("つぎは "+nextStationName);
        $("#display").addClass("next bg-info");
        $("#display").removeClass("station bg-secondary"); 
    
    }, 15000);
    console.log(curStationName+"に到着")
}

function finalArrival(stationName){
    console.log("終点に到着")
    clearInterval(timerID)
    setInfo("終点 "+ stationName + "に到着しました");
    isMoving = false
}

function setInfo(text){
    document.getElementById("display").innerHTML = text;
}

function openDoor(){
    //doorsound.currentTime = 0;
    //doorsound.play();
    console.log("ぷしゅ～")
}