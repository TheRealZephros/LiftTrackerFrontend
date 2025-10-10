import React, { ChangeEvent, JSX, SyntheticEvent } from 'react'

type SearchProps = {
    handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit: (e: SyntheticEvent) => void;
    search: string | undefined;
}

const Search: React.FC<SearchProps> = ({search, handleSearchChange, onSearchSubmit}: SearchProps) : JSX.Element => {
    return (
    <>
      <form onSubmit={onSearchSubmit}>
        <input value={search} onChange={handleSearchChange} />
      </form>
    </>
  )
}

export default Search
