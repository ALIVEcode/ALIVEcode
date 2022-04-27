import { Bundle } from '../../../Models/Course/bundles/bundle.entity';

export type BundleCardProps = {
	bundle: Bundle;
	onSelect?: (bundle: Bundle) => void;
};
