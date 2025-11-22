import React, { SyntheticEvent } from 'react'

interface DeletePortfolioProps {
    onPortfolioDelete: (e: SyntheticEvent) => void;
    portfolioValue: string;
}

const DeletePortfolio = ({ onPortfolioDelete, portfolioValue }: DeletePortfolioProps) => {
  return (
    <form onSubmit={onPortfolioDelete}>
        <input hidden={true} value={portfolioValue}/>
         <button className="block w-full py-3 text-text1 duration-200 border-2 rounded-lg bg-buttonDelete2 hover:text-buttonDelete2 hover:bg-white border-buttonDelete2">
          X
        </button>
    </form>
  )
}

export default DeletePortfolio
