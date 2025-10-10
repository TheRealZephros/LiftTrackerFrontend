import React, { JSX, SyntheticEvent } from 'react'
import Card from '../Card/Card'
import { CompanySearch } from '../../company'
import { v4 as uuidv4 } from 'uuid';

interface CardListProps {
    searchResults: CompanySearch[];
    onPortfolioCreate: (e: SyntheticEvent) => void;
}

const CardList: React.FC<CardListProps> = ({ searchResults, onPortfolioCreate }: CardListProps) : JSX.Element => {
  return <>
    {searchResults.length > 0 ? searchResults.map((result) => (
      <Card id={result.symbol} key={uuidv4()} searchResult={result} onPortfolioCreate={onPortfolioCreate} />
    )) : <h2>No results found</h2>}
  </>
}
export default CardList
