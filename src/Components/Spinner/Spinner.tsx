import React from 'react'
import { ClipLoader } from 'react-spinners';
import "./Spinner.css"

interface SpinnerProps {
    isLoading?: boolean;
}

const Spinner = ({ isLoading = true }: SpinnerProps) => {
  return (
    <>
       <div id='loading-spinner'>
            <ClipLoader
            color='#36d7b7'
            loading={isLoading}
            size={35}
            aria-label="Loading Spinner"
            data-testid="loader" />
       </div>
    </>
  )
}

export default Spinner
