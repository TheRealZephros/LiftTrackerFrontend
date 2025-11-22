import React, { ChangeEvent, JSX, SyntheticEvent } from 'react'

type SearchProps = {
    handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit: (e: SyntheticEvent) => void;
    search: string | undefined;
}

const Search: React.FC<SearchProps> = ({search, handleSearchChange, onSearchSubmit}: SearchProps) : JSX.Element => {
    return (
    <section className="relative bg-bg1">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <form
          className="form relative flex flex-col w-full p-5 space-y-4 bg-button1 hover:bg-button2 rounded-lg md:flex-row md:space-y-0 md:space-x-3"
          onSubmit={onSearchSubmit}
        >
          <input
            className="bg-bg2 flex-1 p-3 border-2 border-bg4 rounded-lg placeholder-text3 focus:outline-none text-text1"
            id="search-input"
            placeholder="Search companies"
            value={search}
            onChange={handleSearchChange}
          ></input>
        </form>
      </div>
    </section>
  )
}

export default Search
