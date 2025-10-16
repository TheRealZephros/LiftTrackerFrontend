import React from 'react'
import Table from '../../Components/Table/Table'
import RatioList from '../../Components/RatioList/RatioList'
import { formatLargeNonMonetaryNumber } from '../../Helpers/NumberFormatting'
import { testIncomeStatementData } from '../../Components/Table/testData'

type DesignGuideProps = {}

const tableConfig = [
  {
      label: "Market Cap",
      render: (company: any) =>
        formatLargeNonMonetaryNumber(company.marketCapTTM),
      subTitle: "Total value of all a company's shares of stock",
    }
]

const DesignGuide = (props: DesignGuideProps) => {
  return (
    <div>
      <h1>Design Page</h1>
      <h2>This is the design page. this is where the design elements will be showcased.</h2>
      <RatioList data={testIncomeStatementData} config={tableConfig} />
      <Table data={testIncomeStatementData} config={tableConfig} />
    </div>
  )
}

export default DesignGuide;
