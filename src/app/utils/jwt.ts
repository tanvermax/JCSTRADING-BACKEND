import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";


export const generateTOken = (Payload: JwtPayload, secret: string, expiresIn: string) => {
    const token = jwt.sign(Payload, secret, {
        expiresIn
    } as SignOptions)

    return token
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const verifyToken = (token: string, secret: string)=>{

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const verifiedtoken = jwt.verify(token, secret)

    return verifiedtoken
}