import { v4 as uuidv4 } from "uuid";

const createLog = async (level, message, service = "express") => {
    const log = {
        id: uuidv4(),
        service,
        level,
        message,
        timestamp: Date.now(),
    };
    return log;
}

export default createLog;