import React from 'react';

type Props = {
  progress: number,
};

const ProgressBar = ({ progress }: Props) => {
  return (
    <>
      <label htmlFor="uploadProgress">{progress}</label>
      <progress id="uploadProgress" max="100" value={progress} />
    </>
  );
};

export default ProgressBar;
