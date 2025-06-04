
export interface OptionsInterface {
    schema?: string;
    tableName?: string;
}


export interface User {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    hashedPassword: string;
}
