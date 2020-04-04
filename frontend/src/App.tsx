import React from "react";

interface IProps {}

interface IState {
    url: string;
    picture: string;
    showLink: boolean;
    givenName: string;
    fullName: string;
    email: string;
}

class App extends React.Component<IProps, IState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            url: "",
            picture: "",
            givenName: "",
            fullName: "",
            email: "",
            showLink: true,
        };
        this.getClientId = this.getClientId.bind(this);
    }
    componentDidMount() {
        const urlParams = new URLSearchParams(window.location.search);
        if (
            urlParams.get("id")
        ) {
            console.log("dont show link");
            this.setState({
                picture: urlParams.get("picture") as string,
                givenName: urlParams.get("name") as string,
                fullName: urlParams.get("name") as string,
                email: urlParams.get("email") as string,
                showLink: false,
            });
        } else {
            console.log("show link");

            this.setState({
                showLink: true,
            });
        }

        this.getClientId();
    }
    async getClientId() {
        const redirectUri = "http://localhost:3000/stock-jarvis-oauth-callback";
        const scope = "profile email openid";
        const responseType = "code";
        const response = await fetch("http://localhost:3000/client-id");
        const json = await response.json();
        this.setState({
            url: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${json.clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&access_type=offline&include_granted_scopes=true`,
        });
    }
    render() {
        const { url, picture, showLink, givenName, fullName, email } = this.state;
        return (
            <>
                {showLink && (
                    <a href={url} id="link">
                        Login with Google
                    </a>
                )}
                {!showLink && (
                    <div id="user-info-wrapper">
                        <img alt="Profile" width="50" src={picture} />
                        <p>Hi, {givenName}</p>
                        <p>Full name: {fullName}</p>
                        <p>Email: {email}</p>
                    </div>
                )}
            </>
        );
    }
}

export default App;
