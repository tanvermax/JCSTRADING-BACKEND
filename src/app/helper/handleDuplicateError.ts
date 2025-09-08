import { TGenericErrorResponse } from "../intreface/error.types";




// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleDuplicateError = (err: any): TGenericErrorResponse=>{
    const matchedArray = err.match(/"([^"]*)"/);
    return{
         statusCode:400,
         message:`${matchedArray[1]} already exit`,
    }
}