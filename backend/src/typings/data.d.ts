

export interface LoginUser {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    isHost: boolean
}

export interface PaginationValues{
    limit?: number,
    offset?: number
}

export interface WhereValues{
    lat?: any,
    lng?: any,
    price?: any
}
