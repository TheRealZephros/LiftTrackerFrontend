import React, { ChangeEvent, SyntheticEvent } from 'react';
import logo from './logo.svg';
import CardList from './Components/CardList/CardList';
import './App.css';
import Search from './Components/Search/Search';
import { CompanySearch } from './company';
import { searchCompanies } from './api';
import ListPortfolio from './Components/Portfolio/ListPortfolio/ListPortfolio';

function App() {
  const [search, setSearch] = React.useState<string>("");
  const [portfolioValues, setPortfolioValues] = React.useState<string[]>([]);
  const [searchResults, setSearchResults] = React.useState<CompanySearch[]>([]);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
  };
  const onPortfolioCreate = (e: any) => {
    e.preventDefault();
    const exists = portfolioValues.find((value) => value === e.target[0].value);
    if (exists) return;
    // Add to portfolio
    const updatedPortfolio = [...portfolioValues, e.target[0].value];
    setPortfolioValues(updatedPortfolio);
  }

  const onPortfolioDelete = (e: any) => {
    e.preventDefault();
    const removed = portfolioValues.filter((value) => {
      return value !== e.target[0].value
    });
    setPortfolioValues(removed);
  }

  const onSearchSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const result = await searchCompanies(search);
    if (typeof result === 'string') {
        // Handle error message
        setServerError(result);
    } else if (Array.isArray(result.data)) {
        setSearchResults(result.data);
    }
    console.log(result);
  };
  return (
    <div className="App">
      <Search onSearchSubmit={onSearchSubmit} search={search} handleSearchChange={handleSearchChange} />
      <ListPortfolio portfolioValues={portfolioValues} onPortfolioDelete={onPortfolioDelete} />
      <CardList
        searchResults={searchResults}
        onPortfolioCreate={onPortfolioCreate}
      />
    </div>
  );
}

export default App;
