import mongoose from "mongoose"
import { TErrorSources, TGenericErrorResponse } from "../intreface/error.types"

export const handleValidationerror = (err: mongoose.Error.ValidationError): TGenericErrorResponse => {
    const errorSources: TErrorSources[] = [];
    const errors = Object.values(err.errors);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors.forEach((errorObject: any) => {
        errorSources.push({
            path: errorObject.path,
            message: errorObject.message
        })
    })
    return {
        statusCode: 400,
        message: "Validation error",
        errorSources: errorSources
    }
}

