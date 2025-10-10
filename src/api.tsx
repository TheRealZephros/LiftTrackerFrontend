import axios from 'axios';
import { CompanySearch } from './company';

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
            console.error('Error message: ', error.message);
            return error.message;
        } else {
            console.error('Unexpected error: ', error);
            return 'An unexpected error occurred';
        }
    }
}
