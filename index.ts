import handleDoPost from "./doPost";

function doGet(e: GoogleAppsScript.Events.DoGet){
  
}

function doPost(e: GoogleAppsScript.Events.DoPost){
  handleDoPost(e)
}