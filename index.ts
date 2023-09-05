import handleDoPost from './doPost'

function doGet (e: GoogleAppsScript.Events.DoGet): void {

}

function doPost (e: GoogleAppsScript.Events.DoPost): void {
  handleDoPost(e)
}

declare let global: any

global.doPost = doPost
global.doGet = doGet
