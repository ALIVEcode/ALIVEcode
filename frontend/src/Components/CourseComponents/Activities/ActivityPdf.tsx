import { useState, useEffect } from 'react';
import { ActivityPdf as ActivityPdfModel } from '../../../Models/Course/activities/activity_pdf.entity';
/* import { Document, Page } from 'react-pdf'; */
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import api from '../../../Models/api';

/**
 * Shows an activity of type Pdf
 * @returns The activity of type Pdf
 *
 * @author Maxime Gazzé
 */
const ActivityPdf = ({ activity }: { activity: ActivityPdfModel }) => {
	const [numPages, setNumPages] = useState<number>(0);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pdfSrc, setPdfSrc] = useState('');

	useEffect(() => {
		const getSrc = async (
			setSource: React.Dispatch<React.SetStateAction<string>>,
		) => {
			const url = await api.db.courses.getResourceFileInActivity(
				activity.courseElement.course.id.toString(),
				activity.id.toString(),
			);
			setSource(url);
		};
		getSrc(setPdfSrc);
	}, [activity]);

	const onDocumentLoadSuccess = ({ numPages }: any) => {
		setNumPages(numPages);
	};

	const gotoPrev = () => {
		const index = pageNumber - 1;
		if (index < 1) return;
		setPageNumber(index);
	};

	const gotoNext = () => {
		const index = pageNumber + 1;
		if (numPages < index) return;
		setPageNumber(index);
	};

	return (
		<div className="w-full desktop:px-16">
			<Document
				className="w-full  flex justify-center"
				file={pdfSrc}
				onLoadSuccess={onDocumentLoadSuccess}
			>
				<Page className="inline-block relative" pageNumber={pageNumber}>
					<div
						className="absolute left-0 top-0 z-1 h-full w-[50%]"
						onClick={gotoPrev}
					></div>
					<div
						className="absolute right-0 top-0 z-1 h-full w-[50%]"
						onClick={gotoNext}
					></div>
				</Page>
			</Document>
			<p className="mt-2 w-full text-center">
				Page {pageNumber} of {numPages}
			</p>
		</div>
	);
};

export default ActivityPdf;
