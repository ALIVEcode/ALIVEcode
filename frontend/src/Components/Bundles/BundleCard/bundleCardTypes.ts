import { Bundle } from '../../../Models/Course/bundles/bundle.entity';

/**
 * Props of the bundle card
 */
export type BundleCardProps = {
	bundle: Bundle;
	onSelect?: (bundle: Bundle) => void;
};
