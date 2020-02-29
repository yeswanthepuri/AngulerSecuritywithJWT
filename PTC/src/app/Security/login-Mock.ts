import { AppUserAuth } from './app-User-auth';

export const LOGIN_MOCK : AppUserAuth[] =[
    {
        userName: "YKG",
        bearerToken:"YKG@123",
        isAuthenticated: true,
        canAddProduct:true,
        canSaveProduct:true,
        CanAccessCategories: true,
        canAddCategory:  false,
        canAccessProducts:true
    },
    {
        userName: "RGVK",
        bearerToken:"RGVK@123",
        isAuthenticated: true,
        canAddProduct:true,
        canSaveProduct:true,
        CanAccessCategories: true,
        canAddCategory:  false,
        canAccessProducts:true
    }
];