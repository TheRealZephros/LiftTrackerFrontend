import React, { SyntheticEvent } from 'react'
import CardPortfolio from '../CardPortfolio/CardPortfolio';

interface ListPortfolioProps {
  portfolioValues: string[];
  onPortfolioDelete: (e: SyntheticEvent) => void;
}

const ListPortfolio = ({ portfolioValues, onPortfolioDelete }: ListPortfolioProps) => {
  return (
    <>
    <h3>Portfolio</h3>
    <ul>
      {portfolioValues &&
        portfolioValues.map((portfolioValue) => {
          return <CardPortfolio portfolioValue={portfolioValue} onPortfolioDelete={onPortfolioDelete} />
        })
      }
    </ul>
    </>
  )
}

export default ListPortfolio
