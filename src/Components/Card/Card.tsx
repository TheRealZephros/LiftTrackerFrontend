import React, { JSX, SyntheticEvent } from 'react'
import './Card.css'
import { CompanySearch } from '../../company';
import AddPortfolio from '../Portfolio/AddPortfolio/AddPortfolio';

interface CardProps {
  id: string;
  searchResult: CompanySearch;
  onPortfolioCreate: (e: SyntheticEvent) => void;
}

const Card: React.FC<CardProps> = ({ id, searchResult, onPortfolioCreate }: CardProps) : JSX.Element => {
  return (
    <div className='card'>
        <img alt="company logo" />
        <div className="details">
            <h2>
              {searchResult.name} ({searchResult.symbol})
            </h2>
            <p>{searchResult.currency}</p>
        </div>
        <p className="info">
          {searchResult.exchangeShortName} - {searchResult.stockExchange}
        </p>
        <AddPortfolio
          onPortfolioCreate={onPortfolioCreate}
          symbol={searchResult.symbol} />
    </div>
  )
}

export default Card
