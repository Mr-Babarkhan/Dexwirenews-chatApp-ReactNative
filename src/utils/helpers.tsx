//Function to format the timestamp to a readable date and time

export const formatTimestamp = (timestamp: any) => {
    const date = new Date(timestamp.toMillis())
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}

//Function to generate a unique key for message
export const generateKey = () => {
    return Math.random().toString(36).substr(2, 10);
}

//Functions to sort messages by timestamp
export const sortMesssageByTimestamp = (messages:any) => {
    return messages.sort((a:any, b:any) => a.timestamp.toMillis() - b.timestamp.toMillis());
}