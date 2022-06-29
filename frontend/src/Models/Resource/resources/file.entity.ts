/**
 * File model in the database
 * @author Maxime Gazze
 */
export class File {
	/** Id of the resource */
	id: string;

	/** Creation date of the resource */
	creationDate: Date;

	/** Creation date of the resource */
	originalname: string;

	/** Encoding type of the file */
	encoding: string;

	/** Mime type of the file */
	mimetype: string;

	/** Size of the file in bytes */
	size: number;

	/** The folder to which the file has been saved */
	destination: string;

	/** The name of the file within the destination */
	filename: string;

	/** The full path to the uploaded file */
	path: string;
}
