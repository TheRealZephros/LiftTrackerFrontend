import axios from 'axios';
import { CompanyIncomeStatement, CompanyKeyMetrics, CompanyProfile, CompanySearch } from './company';

interface SearchResult{
    data: CompanySearch[];
}

export const searchCompanies = async (query: string) => {
    try {
        const data = await axios.get<SearchResult>(
            `https://financialmodelingprep.com/stable/search-name?query=${query}&apikey=${process.env.REACT_APP_API_KEY}`);
        return data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error message from API: ', error.message);
            return error.message;
        } else {
            console.error('Unexpected error: ', error);
            return 'An unexpected API error occurred';
        }
    }
}

export const getCompanyProfile = async (query: string) => {
    try {
        const data = await axios.get<CompanyProfile>(`https://financialmodelingprep.com/stable/profile?symbol=${query}&apikey=${process.env.REACT_APP_API_KEY}`);
        return data;
    } catch (error: any) {
        console.error('Error message from API: ', error.message);
        return error.message;
    }

}

export const getKeyMetrics = async (query: string) => {
    try {
        const data = await axios.get<CompanyKeyMetrics[]>(`https://financialmodelingprep.com/stable/key-metrics?symbol=${query}&apikey=${process.env.REACT_APP_API_KEY}`);
        return data;
    } catch (error: any) {
        console.error('Error message from API: ', error.message);
        return error.message;
    }
}

export const getIncomeStatement = async (query: string) => {
    try {
        const data = await axios.get<CompanyIncomeStatement[]>(`https://financialmodelingprep.com/stable/income-statement?symbol=${query}&limit=5&apikey=${process.env.REACT_APP_API_KEY}`);
        return data;
    } catch (error: any) {
        console.error('Error message from API: ', error.message);
        return error.message;
    }
}

export const getBalanceSheet = async (query: string) => {
    try {
        const data = await axios.get(`https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${query}&limit=5&apikey=${process.env.REACT_APP_API_KEY}`);
        return data;
    } catch (error: any) {
        console.error('Error message from API: ', error.message);
        return error.message;
    }
}

export const getCashFlowStatement = async (query: string) => {
    try {
        const data = await axios.get(`https://financialmodelingprep.com/stable/cash-flow-statement?symbol=${query}&limit=5&apikey=${process.env.REACT_APP_API_KEY}`);
        return data;
    } catch (error: any) {
        console.error('Error message from API: ', error.message);
        return error.message;
    }
}
