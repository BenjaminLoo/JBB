/*

Name: Teo Kai Jie
Class: DIT/2B/21
Date: 16/5/20
Admission Number: 1936799
Filename: script.js

*/

// Variable Declarations
var currentFontSize = 10; // The current font size for the webpage
var resultList = []; // The array that will store all the data inside
var pagList = [1]; // The array to store the current pagination values
// These options contain the necessary options that will be used in in the 'url' variable
var filterOptions = {
    currentPage:1,
    resultsNo:$("#noOfEntries").val(),
    companyId:$("#companyInput").val(),
    minAudience:0,
    maxAudience:500000,
    minCost:0,
    maxCost:100000,
}
//Simplifying it by extracting them
var {currentPage,resultsNo,companyId,minAudience,maxAudience,minCost,maxCost} = filterOptions;

const DEBUGDATA = false;
let host = "http://localhost:3000";
if (DEBUGDATA) {
    host = "http://localhost:3000"
} else {
    host = "http://jibaboom-optimisticdevelopers.herokuapp.com"
}

// Global Values

//Computation Option
var computationOption = "basic";
//Advance Cost Parameters
var advanceCostParams = `&minCost=${minCost}&maxCost=${maxCost}`;
// Global Url Variable
let url = `${host}/${computationOption}/data?companyId=${companyId}${advanceCostParams}&minCount=${minAudience}&maxCount=${maxAudience}&pageNum=${currentPage}&pageSize=${resultsNo}`;

// The function to update the global url variable
function updateUrl() {
    url = `${host}/${computationOption}/data?companyId=${companyId}${advanceCostParams}&minCount=${minAudience}&maxCount=${maxAudience}&pageNum=${currentPage}&pageSize=${resultsNo}`;
    if (computationOption=="basic") {
        advanceCostParams = ``;
    } else if (computationOption=="advance") {
        advanceCostParams = `&minCost=${minCost}&maxCost=${maxCost}`;
    }
    console.log("URL:",url);
}

function updateComputation() {
    if ($("#computationOptionData").parent().hasClass("off")) {
        computationOption = "advance";
        advanceCostParams = `&minCost=${minCost}&maxCost=${maxCost}`;
        $("div#costSliderGroup").css({"display":"block"});
    } else {
        computationOption = "basic";
        advanceCostParams = ``;
        $("div#costSliderGroup").css({"display":"none"});
    }
}

$(document).ready(function(){
    updateComputation();
    // $("input,select").change(function(){
    //     updateUrl();
    // });
    $("#computationOptionData").change(function(){
        updateComputation();
        updateUrl();
    })
    // Initializing the 'Audience Count Range' slider
    $("#audienceCountSlider").slider({
        range:true,
        min:minAudience,
        max:maxAudience,
        values:[minAudience,maxAudience],
        slide:function(event,ui){
            $("#audienceCountRange").text(ui.values[0]+" - "+ui.values[1]);
        }
    });
    
    // Text to render the min and max values for the 'Audience Count Range' slider
    $("#audienceCountRange").text($("#audienceCountSlider").slider("values",0) + " - " + $("#audienceCountSlider").slider("values",1));

    // Initializing the 'Cost Range' slider
    $("#costSlider").slider({
        range:true,
        min:minCost,
        max:maxCost,
        values:[minCost,maxCost],
        slide:function(event,ui){
            $("#costRange").text(ui.values[0]+" - "+ui.values[1]);
        }
    });
    // Text to render the min and max values for the 'Cost Range' slider
    $("#costRange").text($("#costSlider").slider("values",0) + " - " + $("#costSlider").slider("values",1));
    // Initializing the click event for the 'Update Results' button
    $("#updateResults").click(function(e){
        e.preventDefault();
        // Filters the results based on the current values selected.
        filterResults($("#companyInput").val(),$("#audienceCountSlider").slider("values",0),$("#audienceCountSlider").slider("values",1),$("#costSlider").slider("values",0),$("#costSlider").slider("values",1));
    });
    // The button to increase page size
    $("#increaseFontSize").click(function(){
        // Function to increase page size
        updateTextSize(1);
    });
    // The button to decrease page size
    $("#decreaseFontSize").click(function(){
        // Function to decreasse page size
        updateTextSize(-1);
    });
    // For loop to initialize the current pagination list
    for (let i of pagList) {
        var insertHTML = `
        <li data-value="${i}" class="page-item pageNumber">
            <a class="page-link">${i}</a>
        </li>
        `;
        $(insertHTML).insertBefore($("li#nextBtn"));
    }
    // Updates the current pagination
    updatePagination();
    // When any of the pagination buttons are clicked
    $(".pagination").click(function(){
        updatePagination();
    });
    // When the user clicks a pagination number e.g. 1, 2, 5, 6, etc.
    $("li.pageNumber").click(function(){
        currentPage = $(this).data("value");
        // updatePagination();
        updateTable(url);
    });
    // When the user clicks the 'Prev' pagination button when it's not disabled
    $("#prevBtn:not(disabled)").click(function(){
        if (currentPage>1) {
            currentPage-=1;
            updatePagination();
            updateUrl();
            updateTable(url);
        }
    });
    // When the user clicks the 'Next' pagination button when it's also not disabled
    $("#nextBtn:not(disabled)").click(function(){
        if (currentPage<pagList[pagList.length-1]) {
            currentPage+=1;
            updatePagination();
            updateUrl();
            updateTable(url);
        }
    });
    updateTable(url);
    // When the user changes the number of entries selection input, located at 'Show ____ entries'
    $("#noOfEntries").change(function(){
        currentPage = 1;
        console.log($("#noOfEntries").val());
        resultsNo = $(this).val();
        updateUrl();
        updateTable(url);
    });
    updateOptionIds();
});
// Function to change the pagination size
function changePaginationSize(size) {
    // Resets the page numbers
    $("li.pageNumber").each(function(i,value){
        $(this).remove();
    });
    // Resets the pagination array
    pagList = [];
    // For loop to push the current numbers into the array
    for (let i = 1;i<=size;i++) {
        pagList.push(i);
    }
    // To append the numbers in the pagination
    for (let i of pagList) {
        var insertHTML = `
        <li data-value="${i}" class="page-item pageNumber">
            <a class="page-link">${i}</a>
        </li>
        `;
        $(insertHTML).insertBefore($("li#nextBtn"));
    }
    updatePagination();
}

function updatePagination() {
    // This is to show which page the user is on
    $("li.pageNumber").each(function(i,value){
        if ($(value).data("value")==currentPage) {
            // $(value).addClass("active");
            toggleActive(value,"active");
        } else {
            // $(value).removeClass("active");
            toggleActive(value,"inactive")
        }
    });
    if (currentPage==pagList[0]) {
        //$("#prevBtn").addClass("disabled");
        toggleDisabled("#prevBtn","disabled");
    } else {
        //$("#prevBtn").removeClass("disabled");
        toggleDisabled("#prevBtn","enabled");
    }
    if (currentPage==pagList[pagList.length-1]) {
        // $("#nextBtn").addClass("disabled");
        toggleDisabled("#nextBtn","disabled");
    } else {
        // $("#nextBtn").removeClass("disabled");
        toggleDisabled("#nextBtn","enabled");
    }
}

//Function to toggle enable or disable - using classes

function toggleDisabled(elem,enabled) {
    if (enabled == "disabled") {
        $(elem).addClass("disabled")
    } else if (enabled == "enabled") {
        $(elem).removeClass("disabled");
    }
}

//Function to toggle the active class

function toggleActive(elem,active) {
    if (active == "active") {
        $(elem).addClass("active");
    } else if (active == "inactive") {
        $(elem).removeClass("active");
    }
}

//Fake data function for testing purposes (Only used for demo purposes)
function genFakeData(numbers) {
    var arr = [];
    for (let i = 0;i<numbers;i++) {
        arr.push({
            optionId:Math.floor(Math.random()*30+1000000000),
            companyId:Math.floor(Math.random()*20+1000000000),
            audienceCount:Math.floor(Math.random()*1000000),
            cost:Math.floor(Math.random()*500),
        });
    }
    return arr;
}
// Function to filter results
function filterResults(compId,audienceMin,audienceMax,costMin,costMax) {
    companyId = compId;
    maxAudience = audienceMax;
    minAudience = audienceMin;
    maxCost = costMax;
    minCost = costMin;
    updateUrl();
    console.log(url);
    updateTable(url);
}
// Function to update table
function updateTable(url) {
    $("#loadingOverlay").slideDown(500);
    $.get(url)
    .done((data)=>{
        $("#loadingOverlay").slideUp(500);
        console.log("Done!");
        resultList = data;
        console.log(resultList);

        resultsNo = $("#noOfEntries").val();
        var paginationNumber = resultList.count[0].count/resultsNo;
        changePaginationSize(Math.ceil(paginationNumber));
        updateData();
        $("#prevBtn:not(disabled)").click(function(){
            if (currentPage>1) {
                currentPage-=1;
                updatePagination();
                updateUrl();
                updateTable(url);
            }
        });
        $("#nextBtn:not(disabled)").click(function(){
            if (currentPage<pagList[pagList.length-1]) {
                currentPage+=1;
                updatePagination();
                updateUrl();
                updateTable(url);
            }
        });
        $("li.pageNumber").click(function(){
            currentPage = $(this).data("value");
            console.log('Clicked!');
            updatePagination();
            updateUrl();
            updateTable(url);
        });
        $("#totalEntriesNo").text("Total Entries: "+resultList.count[0].count);
    })
    .fail((err)=>{
        console.error("Error!");
        console.error(err);
    });
}
// Function to update the data that is listed on the table
function updateData() {
    $("tbody#dataTable").empty();
    // console.log("Result List:",resultList.result[0].optionid);
    for (let i in resultList.result) {
        // console.log(resultList.result[i]);
        var insertHTML = `
        <tr>
            <td>${resultList.result[i].optionid}</td>
            <td>${resultList.result[i].companyid}</td>
            <td>${resultList.result[i].audiencecount}</td>
            <td>${resultList.result[i].cost}</td>
        </tr>
        `;
        $("tbody#dataTable").append(insertHTML);
    }
    if (resultList.result.length<1) {
        var insertHTML = `
        <tr>
            <td style="text-align:center;" colspan="4">No Results Found - Click on the 'Update Results' button to update</td>
        </tr>
        `;
        $("tbody#dataTable").append(insertHTML);
    }
}
function updateTextSize(step) {
    if ((currentFontSize>6 && step<0)||(currentFontSize<15 && step>0)) {
        currentFontSize+=step;
    }
    console.log(currentFontSize);
    $("body,input").each(function(i,value){
        if ((currentFontSize>6 && step<0)||(currentFontSize<15 && step>0)) {
            $(this).css({"font-size":parseInt($(this).css("font-size"))+step+"px"});
        }
    });
}
