import * as React from 'react';

export interface ILoaderProps {
}

export default class Loader extends React.Component<ILoaderProps> {
  public render() {
    return (
      <div>
        <p>I am a loader</p>
      </div>
    );
  }
}
