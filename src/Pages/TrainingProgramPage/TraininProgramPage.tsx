import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { ProgramDayModel, TrainingProgramModel } from '../../Models/TrainingProgram';
import Sidebar from '../../Components/Sidebar/Sidebar';
import TrainingProgram from '../../Components/TrainingProgram/TrainingProgram';
import Tile from '../../Components/Tile/Tile';
import Spinner from '../../Components/Spinner/Spinner';
import { wrapIcon } from '../../Components/IconWrapper/IconWrapper'
import { FaHome } from 'react-icons/fa';
import { getTrainingProgramById } from '../../Services/TrainingProgramService';

const HomeIcon = wrapIcon(FaHome);

interface TrainingProgramPageProps {}

const TrainingProgramPage = (props: TrainingProgramPageProps) => {
  let { programId } = useParams();
  const [daysList, setDaysList] = useState<{ path: string; label: string; icon?: React.FC }[] | null>(null);
  const [program, setProgram] = useState<TrainingProgramModel | null>(null);
  const [programDayList, setProgramDayList] = useState<ProgramDayModel[] | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const data = await getTrainingProgramById(programId!);

        // Check if data exists and has days
        if (data) {
          const programData = Array.isArray(data) ? data[0] : data;
          setProgram(programData);
          setProgramDayList(programData.days);

          const dayElements = programData.days.map((day) => ({
            path: day.id.toString(),
            label: day.name,
            icon: HomeIcon
          }));
          setDaysList(dayElements);
        }
      } catch (error) {
        console.error('Error fetching program:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [programId]);

  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {program ? (
        <div className="w-full relative flex ct-docs-disable-sidebar-content overflow-x-hidden">
          <Sidebar elements={daysList} />
          <TrainingProgram programId={programId!}>
            <Tile title="Program Name" subTitle={program.name} />
            <p className="bg-gray-800 shadow rounded text-medium font-medium text-white p-3 mt-1 m-4 min-w-[100%]">
              {program.description}
            </p>
          </TrainingProgram>
        </div>
      ) : (
        <div>
          <Spinner />
        </div>
      )}
    </>
  );
};

export default TrainingProgramPage;
