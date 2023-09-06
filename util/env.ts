export interface ScriptEnv {
  LINE_CHANNEL_ACCESS_TOKEN: string
  [key: string]: string
}

function getScriptEnv (): ScriptEnv {
  const env = PropertiesService.getScriptProperties().getProperties()
  if (!env.LINE_CHANNEL_ACCESS_TOKEN) {
    throw TypeError('env LINE_CHANNEL_ACCESS_TOKEN is not setted. Please set on script editer')
  }

  return env as ScriptEnv
}

export default getScriptEnv
