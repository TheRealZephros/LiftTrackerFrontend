import React, { SyntheticEvent }  from 'react'

interface AddPortfolioProps {
    onPortfolioCreate: (e: SyntheticEvent) => void;
    symbol: string;
}

const AddPortfolio: React.FC<AddPortfolioProps> = ({ onPortfolioCreate, symbol }: AddPortfolioProps) => {
  return (
    <form onSubmit={onPortfolioCreate}>
      <input readOnly={true} hidden={true} value={symbol} />
      <button type="submit">Add</button>
    </form>
  )
}

export default AddPortfolio
