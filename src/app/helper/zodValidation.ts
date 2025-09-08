/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from "../intreface/error.types";

export const Zodvalidation= (err:any):TGenericErrorResponse=>{
    const errorSource:TErrorSources[]=[];
    err.issues.forEach((issue:any)=>{
        errorSource.push({
            path:issue.path[issue.path.length-1],
            message:issue.message
        })
    })
    return{
        statusCode:400,
        message:"ZOd-Error",
        errorSources:errorSource
    }
}