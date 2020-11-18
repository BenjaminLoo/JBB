/*

Name: Teo Kai Jie
Class: DIT/FT/2B/21
Date: 12/8/20
Admission Number: 1936799
Filename: resultViewer.js

*/ 

// Result Viewer:
google.charts.load("current",{packages:["corechart","bar"]});
google.charts.setOnLoadCallback(drawBarChart);
var optionIds = ["",""];

//Debug result
const DEBUGRESULT = false;
let resultHost = "http://localhost:3000";
if (DEBUGRESULT) {
    resultHost = "http://localhost:3000"
} else {
    resultHost = "http://jibaboom-optimisticdevelopers.herokuapp.com"
}

//Global resultUrl
let computationOptionResult = "basic";
let resultUrl = ``;


function updateResultUrl() {
    var optionIdArray = getOptionIds();
    // var optionIds = "";
    var budget = $("#budget").val();
    // var paramValues = `optionIds=OPTIONIDS&budget=${}`;
    resultUrl = `${resultHost}/${computationOptionResult}/result?optionIds=${optionIdArray.toString()}&budget=${budget}`;
}

function updateOptionIds() {
    $("#optionIds").empty();
    for (let i in optionIds) {
        var insertHTML = `
        <div id="optionId-${parseInt(i+1)}" class="row optionId">
            <div class="col-9">
                <input placeholder="Enter option id" value="${optionIds[i]}" class="form-control optionIdInput" type="text">
            </div>
            <div class="col-3">
                <input onclick="removeOptionId(${(parseInt(i)+1)})" value="Delete" class="form-control btn btn-danger" type="button">
            </div>
        </div>
        `;
        $("#optionIds").append(insertHTML);
    }
    $(".optionId").each(function(i,elem){
        optionIds[i] = $(this).val();
        // $(elem).change(updateOptionIds());
    });
}
function addOptionId() {
    optionIds.push("");
    var insertHTML = `
        <div id="optionId-${optionIds.length}" class="row optionId">
            <div class="col-9">
                <input placeholder="Enter option id" value="" class="form-control optionIdInput" type="text">
            </div>
            <div class="col-3">
                <input onclick="removeOptionId(${(optionIds.length)})" value="Delete" class="form-control btn btn-danger" type="button">
            </div>
        </div>
        `;
        $("#optionIds").append(insertHTML);
    optionIds = getOptionIds()
    // updateOptionIds();
}
function removeOptionId(id) {
    $(`div#optionId-${id}`).remove();
    optionIds.splice(id-1,1);
    optionIds = getOptionIds()
}
//This function will return an array
function getOptionIds() {
    var outputArr = [];
    $("input.optionIdInput").each(function(i,elem) {
        outputArr.push($(this).val());
    });
    return outputArr;
}
//THe computation of the result
function computeResult() {
    var optionIdArray = getOptionIds();
    var budget = $("#budget").val();
    updateResultUrl();
    console.log(resultUrl);
    $.get(resultUrl)
    .done(function(data){
        console.log("Data",data);
        data.result = checkMissingOptionIds(data.result);
        drawBarChart(data.result);
        drawAreaChart(data.result);
        updateResultTable(data.result);
    })
    .fail(function(err){
        console.error(err);
    })
}
// Updating the results table
function updateResultTable(data) {
    $("tbody#resultTable").empty();
    if (data.length>0) {
        var insertHTML = "";
        for (let i = 0;i<data.length;i++) {
            insertHTML+="<tr>";
            //Another fun way of iterating through the keys
            var keys = getJSONKeys(data[i]);
            for (let j = 0;j<keys.length;j++) {
                insertHTML+=`<td>${data[i][keys[j]]}</td>`
            }
            insertHTML+="</tr>";
        }
    }
    console.log(insertHTML);
    $("tbody#resultTable").append(insertHTML);
}
// Gets the whole list of keys from a json object
function getJSONKeys(json) {
    var keys = [];
    for (let i in json) {
        keys.push(i);
    }
    console.log(keys);
    return keys;
}

//Function to to fill in option ids with the value of 0

function checkMissingOptionIds(arr) {
    var optionIdsResult = [];
    for (let i = 0;i<arr.length;i++) {
        optionIdsResult.push(arr[i].optionId.toString())
    }
    var remaining = optionIds.filter(index=>!optionIdsResult.includes(index));
    console.log("Remaining: ",remaining);
    for (let i in remaining) {
        arr.push(
            {
                "optionId":remaining[i],
                "amount":0,
                "audienceReached":0
            }
        )
    }
    return arr;
}
 // THe main function to draw the barchart.
function drawBarChart(resultJson) {
    var arrAmount = []; //The array to push into the data table
    var arrAudienceReached = []; //The array to push into the data table
    resultJson = checkMissingOptionIds(resultJson);
    resultJson.forEach(function(result){
        // var optionid = result.optionid;
        console.log("Result: ",result);
        arrAmount.push([result.optionId.toString(),result.amount]);
        arrAudienceReached.push([result.optionId.toString(),result.audienceReached]);
    });
    var amountData = google.visualization.arrayToDataTable(
        [
            ["Option Id","Amount"],
            ...arrAmount
        ]
    );
    var audienceReachedData = google.visualization.arrayToDataTable(
        [
            ["Option Id","Audience Reached"],
            // ["4318",2394],
            // ["4318",2394],
            // ["4318",2394]
            ...arrAudienceReached
        ]
    );
    var amountView = new google.visualization.DataView(amountData);
    amountView.setColumns([0,
        1,{ calc: "stringify",
          sourceColumn: 1,
          type: "string",
          role: "annotation" }]);
    var audienceView = new google.visualization.DataView(audienceReachedData);
    audienceView.setColumns([0,
        1,{ calc: "stringify",
          sourceColumn: 1,
          type: "string",
          role: "annotation" }]);
    var options = {
        title:"Amount Per Option Id",
        chartArea:{width:"60%",height:100},
        colors:["#0b5dd9","#e6156f"],
        bars:'horizontal',
    };
    var options1 = {
        title:"Audience Reached Per Option Id",
        chartArea:{width:"60%",height:100},
        colors:["#e6156f"],
        bars:'horizontal',
    };
    var amountChart = new google.visualization.BarChart(document.getElementById("graph_div_amount"));
    var audienceReachedChart = new google.visualization.BarChart(document.getElementById("graph_div_audienceReached"));
    if (resultJson.length!=0) {
        amountChart.draw(amountView,options);
        audienceReachedChart.draw(audienceView,options1);
        $(window).resize(function(){
            amountChart.draw(amountView,options);
            audienceReachedChart.draw(audienceView,options1);
        });
    } else {
        $("#graph_div #resultMsg").text("Sorry, we dont have any entries");
    }
}
function drawAreaChart(resultJson) {
    var valuesAmount = []; //The array to push into the data table
    resultJson.forEach(function(result){
        var optionId = result.optionId;
        valuesAmount.push([optionId.toString(),result.amount,result.audienceReached]);
    });
    var amountData = google.visualization.arrayToDataTable(
        [
            ["Option Id","Amount","Audience Reached"],
            ...valuesAmount
        ]
    );
    var options = {
        title:"Area Chart Results Per Option Id",
        chartArea:{width:"60%",height:100},
        colors:["#0b5dd9","#e6156f"],
        // bars:'horizontal',
    };
    var areaChart = new google.visualization.AreaChart(document.getElementById("graph_div_areachart"));
    // var audienceReachedChart = new google.visualization.BarChart(document.getElementById("graph_div_audienceReached"));
    if (resultJson.length!=0) {
        areaChart.draw(amountData,options);
        // audienceReachedChart.draw(audienceView,options1);
        $(window).resize(function(){
            areaChart.draw(amountData,options);
        });
    } else {
        $("#graph_div #resultMsg").text("Sorry, we dont have any entries");
    }
}
function updateComputationResult() {
    if ($("#computationOptionResult").parent().hasClass("off")) {
        computationOptionResult = "advance";
    } else {
        computationOptionResult = "basic";
    }
}
$(document).ready(function(){
    $("#computationOptionResult").change(function(){
        updateComputationResult();
    });
    $("#resultForm").submit(function(){
        event.preventDefault();
        optionIds = getOptionIds();
        if (!optionIds.includes("")) {
            computeResult();
        }
    });
    $("input.optionIdInput").change(function(){
        optionIds = getOptionIds();
    });
});