export function transform_date(time){
    let miliseconds = new Date() - new Date(time.replace(/-/g,'/').replace('T', ' ')) 
    let seconds = miliseconds / 1000;
    let years = Math.floor(seconds / 31536000)
    seconds = seconds % 31536000
    let months = Math.floor(seconds / 2628000)
    seconds = seconds % 2628000;
    let days = Math.floor(seconds/86400)
    seconds = seconds % 86400;
    let hours = Math.floor(seconds/3600)
    seconds = seconds % 3600
    let minutes = Math.floor(seconds/60)

    let string = ""
    if(years > 0){
        string = `${years} ${(years == 1) ? "year" : "years"}`
    }
    if(months > 0){
        string += `, ${months} ${(months == 1) ? "month" : "months"}`
    }
    if(days>0){
        string += `, ${days} ${(days == 1) ? "day" : "days"}`
    }
    if(hours > 0){
        string += `, ${hours} ${(hours == 1) ? "hour" : "hours"}`
    }
    if(minutes > 0){
        string += `, ${minutes} ${(minutes == 1) ? "minute" : "minutes"}`
    }
    if(string.charAt(0) == ','){
        string = string.slice(1)
    }
    return string;
    
}