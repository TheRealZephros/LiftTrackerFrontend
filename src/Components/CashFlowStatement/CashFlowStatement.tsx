import React from 'react'
import { CompanyCashFlow } from '../../company';
import { formatLargeMonetaryNumber } from '../../Helpers/NumberFormatting';
import RatioList from '../RatioList/RatioList';
import { useOutletContext } from 'react-router-dom';
import { getCashFlowStatement } from '../../api';
import Table from '../Table/Table';
import Spinner from '../Spinner/Spinner';

interface CashFlowStatementProps {}

const config = [
  {
    label: "Date",
    render: (company: CompanyCashFlow) => company.date,
  },
  {
    label: "Operating Cashflow",
    render: (company: CompanyCashFlow) =>
      formatLargeMonetaryNumber(company.operatingCashFlow),
  },
  {
    label: "Investing Cashflow",
    render: (company: CompanyCashFlow) =>
      formatLargeMonetaryNumber(company.netCashUsedForInvestingActivites),
  },
  {
    label: "Financing Cashflow",
    render: (company: CompanyCashFlow) =>
      formatLargeMonetaryNumber(
        company.netCashUsedProvidedByFinancingActivities
      ),
  },
  {
    label: "Cash At End of Period",
    render: (company: CompanyCashFlow) =>
      formatLargeMonetaryNumber(company.cashAtEndOfPeriod),
  },
  {
    label: "CapEX",
    render: (company: CompanyCashFlow) =>
      formatLargeMonetaryNumber(company.capitalExpenditure),
  },
  {
    label: "Issuance Of Stock",
    render: (company: CompanyCashFlow) =>
      formatLargeMonetaryNumber(company.commonStockIssued),
  },
  {
    label: "Free Cash Flow",
    render: (company: CompanyCashFlow) =>
      formatLargeMonetaryNumber(company.freeCashFlow),
  },
];

const CashFlowStatement = (props: CashFlowStatementProps) => {
    const ticker = useOutletContext<string>();
    const [cashFlowStatement, setCashFlowStatement] = React.useState<CompanyCashFlow>();
    React.useEffect(() => {
        const getData = async () => {
            const value = await getCashFlowStatement(ticker!);
            setCashFlowStatement(value!.data);
        }
        getData();
    }, []);
  return (
    <div>
      {cashFlowStatement ? (
        <Table data={cashFlowStatement} config={config} />
      ) : (
        <><Spinner /></>
      )}
    </div>
  )
}

export default CashFlowStatement
