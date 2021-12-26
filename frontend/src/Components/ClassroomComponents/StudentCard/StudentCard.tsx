import { StudentCardProps } from './studentCardTypes';

/**
 * Component that display all the information of a student of a class
 * (name)
 * 
 * @param {Student} student student object
 * 
 * @author MoSk3
 */
const StudentCard = ({ student }: StudentCardProps) => {
	return (
		<div className="w-100 student-card" style={{ marginBottom: '10px' }}>
			<h4>{student.name}</h4>
		</div>
	);
};

export default StudentCard;