import * as React from 'react';

export interface ILoginProps {
    url: string;
}

export default class Login extends React.Component<ILoginProps> {
  public render() {
      const { url } = this.props;
    return (
        <>
        <h1>Welcome to Stock Jarvis!</h1>
        <h2>Please log in to continue:</h2>
        <a href={url}>
            Login with Google
        </a>
    </>
    );
  }
}
