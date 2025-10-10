import React, { SyntheticEvent } from 'react'

interface DeletePortfolioProps {
    onPortfolioDelete: (e: SyntheticEvent) => void;
    portfolioValue: string;
}

const DeletePortfolio = ({ onPortfolioDelete, portfolioValue }: DeletePortfolioProps) => {
  return (
    <form onSubmit={onPortfolioDelete}>
        <input hidden={true} value={portfolioValue}/>
        <button>X</button>
    </form>
  )
}

export default DeletePortfolio
