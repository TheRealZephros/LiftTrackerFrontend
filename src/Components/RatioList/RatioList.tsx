
type RatioListProps = {
    config: any;
    data: any;
};



const RatioList = ({ config, data }: RatioListProps) => {
    const renderedRows = config.map((row:any) => {
        return (
            <li className='py-3 ms:-4' key={row.label}>
                <div className='flex items-center space-x-4'>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-grey-900 truncate">
                            {row.label}
                        </p>
                        <p className="text-sm text-grey-500 truncate">
                            {row.subTitle && row.subTitle}
                        </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-grey-500">
                        {row.render(data)}
                    </div>
                </div>
            </li>
        )
    });
  return (
    <div className='bg-gray-800 shadow rounded-lg ml-4 mt-4 mb-4 p-4 sm:p-6 xl:p-8 h-full'>
      <ul className='divide-y divide-grey-200'>{renderedRows}</ul>
    </div>
  )
}

export default RatioList
