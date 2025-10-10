import React, { SyntheticEvent } from 'react'
import DeletePortfolio from '../DeletePortfolio/DeletePortfolio';

interface CardPortfolioProps {
    portfolioValue: string;
    onPortfolioDelete: (e: SyntheticEvent) => void;
}

const CardPortfolio = ({ portfolioValue, onPortfolioDelete }: CardPortfolioProps) => {
  return (
    <>
    <h4>{portfolioValue}</h4>
    <DeletePortfolio onPortfolioDelete={onPortfolioDelete} portfolioValue={portfolioValue} />
    </>
  )
}

export default CardPortfolio
