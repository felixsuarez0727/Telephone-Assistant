declare module 'twilio/lib/twiml/VoiceResponse' {
  export type SayLanguage = 
    | 'af-ZA' | 'ar-AE' | 'ar-SA' | 'bg-BG' | 'ca-ES' | 'cs-CZ' 
    | 'da-DK' | 'de-DE' | 'el-GR' | 'en-AU' | 'en-CA' | 'en-GB' 
    | 'en-IN' | 'en-US' | 'es-ES' | 'es-MX' | 'es-US' 
    | string;  

  export type SayVoice = 
    | 'man' | 'woman' | 'alice' 
    | 'Polly.Lupe' | 'Polly.Kevin' | 'Polly.Zeina'
    | string;  

  export type GatherLanguage = 
    | 'af-ZA' | 'ar-AE' | 'ar-SA' | 'bg-BG' | 'ca-ES' | 'cs-CZ' 
    | 'da-DK' | 'de-DE' | 'el-GR' | 'en-AU' | 'en-CA' | 'en-GB' 
    | 'en-IN' | 'en-US' | 'es-ES' | 'es-MX' | 'es-US' 
    | 'zh-CN'
    | string;  
}